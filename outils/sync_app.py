# ==============================================================================
# 🎒 CampuShare — Mise à jour automatique avant chaque envoi
# Fichier : outils/sync_app.py
# ------------------------------------------------------------------------------
# Lancé tout seul par `./collab.sh save` (Mac) et `collab.ps1 save` (Windows).
# Personne n'a besoin d'y penser :
#   1. Vérifie la syntaxe (parenthèses, accolades, crochets) → bloque l'envoi si KO
#   2. Ajoute les nouveaux fichiers JS à la liste SOURCES de public/js/loader.js
#      (et retire ceux qui ont été supprimés)
#   3. Recopie cette liste dans APP_SHELL de public/sw.js (mode hors ligne)
#   4. Met à jour CACHE_VERSION (sw.js) et le ?v= de loader.js (index.html)
#      dès qu'un fichier de l'app change
# Lancement manuel possible : python3 outils/sync_app.py
# ==============================================================================

import glob
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
LOADER = os.path.join(PUBLIC, 'js', 'loader.js')
SW = os.path.join(PUBLIC, 'sw.js')
INDEX = os.path.join(PUBLIC, 'index.html')

# Commentaires affichés à côté des fichiers connus dans loader.js
LABELS = {
    'js/views/ExploreView.js': 'Chantier A (Alban)',
    'js/views/ItemsView.js': 'Chantier B (Mathys)',
    'js/views/BookingsView.js': 'Chantier C (Locations 7j/7)',
    'js/views/ProfileView.js': 'Chantier D (Compte & Confiance)',
    'js/app.js': 'Orchestrateur (toujours en dernier)',
}


def read(path):
    with open(path, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def write_if_changed(path, old, new):
    if old != new:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(new)
        return True
    return False


def short_hash(data):
    return hashlib.sha1(data).hexdigest()[:8]


def rel(path):
    return os.path.relpath(path, PUBLIC).replace(os.sep, '/')


# 1. VÉRIFICATION DE SYNTAXE --------------------------------------------------
js_files = sorted(glob.glob(os.path.join(PUBLIC, 'js', '**', '*.js'), recursive=True))
errors = []
for fp in js_files + [SW]:
    code = read(fp)
    diffs = [code.count(a) - code.count(b) for a, b in ('()', '{}', '[]')]
    if any(diffs):
        errors.append('%s  ( ()=%+d  {}=%+d  []=%+d )' % (rel(fp), diffs[0], diffs[1], diffs[2]))
if errors:
    print('❌ Envoi bloqué : parenthèses / accolades / crochets déséquilibrés dans :')
    for e in errors:
        print('   - ' + e)
    sys.exit(1)

# 2. LISTE SOURCES DE loader.js -----------------------------------------------
loader = read(LOADER)
m = re.search(r'(const SOURCES = \[)(.*?)(\n\s*\];)', loader, re.S)
if not m:
    print('❌ Liste SOURCES introuvable dans public/js/loader.js')
    sys.exit(1)
existing = re.findall(r"'([^']+)'", m.group(2))
on_disk = [rel(f) for f in js_files if rel(f) != 'js/loader.js']

sources = [p for p in existing if p in on_disk]
removed = [p for p in existing if p not in on_disk]
added = sorted(p for p in on_disk if p not in existing)
for p in added:
    if p.startswith('js/data/'):
        # Données : juste après les autres fichiers de données
        data_idx = [i for i, s in enumerate(sources) if s.startswith('js/data/')]
        sources.insert(data_idx[-1] + 1 if data_idx else 0, p)
    elif 'js/app.js' in sources:
        sources.insert(sources.index('js/app.js'), p)
    else:
        sources.append(p)
if 'js/app.js' in sources:
    sources.remove('js/app.js')
    sources.append('js/app.js')

indent = '    '
lines = []
for i, p in enumerate(sources):
    entry = "'%s'%s" % (p, ',' if i < len(sources) - 1 else '')
    label = LABELS.get(p)
    lines.append(indent + (entry.ljust(31) + '// ' + label if label else entry))
loader_new = loader[:m.start(2)] + '\n' + '\n'.join(lines) + loader[m.start(3):]
write_if_changed(LOADER, loader, loader_new)

# 3. ?v= DE loader.js DANS index.html ------------------------------------------
loader_v = short_hash(loader_new.encode('utf-8'))
index = read(INDEX)
index_new = re.sub(r'js/loader\.js\?v=[\w-]+', 'js/loader.js?v=' + loader_v, index)
write_if_changed(INDEX, index, index_new)

# 4. APP_SHELL + CACHE_VERSION DE sw.js ---------------------------------------
version = re.search(r"const VERSION = '([^']+)'", loader_new).group(1)
shell = ["'./'", "'./index.html'", "'./manifest.json'", "'./js/loader.js?v=%s'" % loader_v]
shell += ["'./%s?v=%s'" % (p, version) for p in sources]
sw = read(SW)
sw_new = re.sub(r'(const APP_SHELL = \[).*?(\n\];)',
                lambda mm: mm.group(1) + '\n' + ',\n'.join('  ' + s for s in shell) + mm.group(2),
                sw, flags=re.S)
# Empreinte de tous les fichiers de l'app (sauf sw.js) : change dès qu'un fichier change
app_files = sorted(f for f in glob.glob(os.path.join(PUBLIC, '**', '*'), recursive=True)
                   if os.path.isfile(f) and f != SW)
digest = hashlib.sha1()
for f in app_files:
    digest.update(rel(f).encode('utf-8'))
    with open(f, 'rb') as fh:
        digest.update(fh.read())
cache_version = 'campushare-' + digest.hexdigest()[:8]
sw_new = re.sub(r"const CACHE_VERSION = '[^']*';", "const CACHE_VERSION = '%s';" % cache_version, sw_new)
sw_changed = write_if_changed(SW, sw, sw_new)

# RÉSUMÉ ----------------------------------------------------------------------
print('✅ Syntaxe OK (%d fichiers JS)' % len(js_files))
for p in added:
    print('➕ Nouveau fichier ajouté au chargement : ' + p)
for p in removed:
    print('➖ Fichier supprimé retiré du chargement : ' + p)
if sw_changed:
    print('🔄 Version hors ligne mise à jour : ' + cache_version)
