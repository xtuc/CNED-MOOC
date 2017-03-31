CNED-MOOC
===

[![Greenkeeper badge](https://badges.greenkeeper.io/xtuc/CNED-MOOC.svg?token=d9186821589a186fec995819c7e480dca025322f789e5cc6e8e2ebf953b893c2)](https://greenkeeper.io/)

```
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
```

> MediaWiki embarque un analyseur JavaScript. Le mot clé "default" n'est pas supporté. Je corrige le script aprés compilation (voir Makefile).

## Windows

Les Makefile ne sont pas utilisables comme tel sous Windows. Les commandes suivantes fonctionnent avec Cygwin (https://www.cygwin.com).

## Ressources externes

* Police d'écriture : https://fonts.googleapis.com/css?family=Open+Sans:400,700
* Sprite (script.scss ligne 367) : https://upload.wikimedia.org/wikipedia/commons/1/18/V1_-_20160706.png

## Installation

Node.js (https://nodejs.org/en/download/) et NPM (inclus dans Node.js)

```shell
npm install
```

## Utilisation

Les sources sont dans le dossier src.

* script.scss : css
* index.js : point d'entrée du script (contenant l'appel du template)
* Bootstrap.js : chargement des composants du template
* utils.js : fonctions internes utilitaires
* messages.js : gestion des erreurs, contient les avertissements

### JavaScript

Les sources sont divisées en composant (dossier components). Il doit être compilé pour pouvoir l'utiliser sur un navigateur.

Compilation :
```shell
make build
```

Ensuite copier/coller le contenu du fichier dist/script.js dans le fichier JavaScript Gadget Wikiversité.

### CSS

Le CSS utilise SASS. Il doit être compilé pour pouvoir fonctionner sur le Web.

Compilation :
```shell
make buildcss
```

Ensuite copier/coller le contenu du fichier dist/script.css dans le fichier CSS du Gadget Wikiversité.
