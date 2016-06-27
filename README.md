CNED-MOOC
===

CNED MOOC template
Copyright © 2016 Sven SAULEAU (Xtuc) <sven.sauleau@xtuc.fr>

This library is free software; you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this library; if not, see <http://www.gnu.org/licenses/>.

* MediaWiki embarque un analyseur JavaScript. Le mot clé "default" n'est pas supporté. Je corrige le script aprés compilation (voir Makefile).

## Windows

Les Makefile ne sont pas utilisable comme tel sous Windows. Les commandes suivantes fonctionnent avec Cygwin (https://www.cygwin.com).

## Installation

Node.js (https://nodejs.org/en/download/) et NPM (inclus dans Node.js)

```shell
npm install
```

## Utilisation

Les sources sont dans le dossier src.

* script.scss : css
* index.js : point d'entré du script (contenant l'appel du template)
* Bootstrap.js : chargement des composants du template
* utils.js : fonctions internes utilitaires
* messages.js : gestion des erreurs, contient les avertissements

### JavaScript

Les sources sont divisées en composant (dossier components). Il doit etre compilé pour etre utilisé sur un navigateur.

Compilation :
```shell
make build
```

Copier/coller le contenu du fichier dist/script.js dans le fichier JavaScript Gadget Wikiversité.

### CSS

Le CSS utilise SASS. Il doit etre compilé pour pouvoir fonctionner sur le Web.

Compilation :
```shell
make buildcss
```

Copier/coller le contenu du fichier dist/script.css dans le fichier CSS du Gadget Wikiversité.
