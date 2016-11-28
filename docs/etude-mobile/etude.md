---
title: Modèle MOOC Wikiversité
author: Sven SAULEAU (XTUC)
date: Novembre 2016
toc: yes
include-before:
  - Amélioration de l'expérience utilisateur sous mobile.
lang: fr
---

# Introduction

Le template est chargé via un gadget. Il est composé de deux fichiers : Gadget-MOOC.css et Gadget-MOOC.js.

Le gadget est activé par défaut pour tous les utilisateurs de la Wikiversité (il est chargé dans `MediaWiki:Common.js`.
Un code HTML permet de l'inclure dans une page, il est optionnel et au choix du contributeur.

Le gadget require jQuery.

Le menu du template est chargé dynamiquement en JavaScript.

La version actuelle de MediaWiki sur la Wikiversité est : `1.12`.

# Etat

## Version mobile

![la lune](http://img00.deviantart.net/e463/i/2007/036/5/f/valentine_candle_jpg_file_by_13blackstock.jpg "Voyage to the moon")

> Image

Les fichiers CSS et JavaScript destiné au modèle MOOC ne sont pas chargés.

## Version desktop

> Image

# Etude des solutions évoquées

## Modifier la manière d'inclusion des scripts

Supposition éronnée.

__Solution abondonnée__

## Contribution au projet open-source MediaWiki

Supposition éronnée.

Bien entendu MediaWiki supporte les devices mobiles.

__Solution abondonnée__

## Gadget spécial mobile

### Cible

Par défaut un gadget est configuré pour être affiché sous desktop.

| Name      | Parameters    | Description  | Since |
|-----------|---------------|--------------|-------|
| `targets` | `desktop` (default), `mobile` or `desktop,mobile` | Set the RL target(s) for the gadget. | ?

Source : https://www.mediawiki.org/wiki/Extension:Gadgets

> Gadget spécial mobile
  Il semblerait possible d'ajouter une cible (mobile ou desktop) dans la configuration d'un Gadget
  Adaptation du template pour mobile
  Intégrer le menu MOOC dans le menu affiché sous mobile (hamburger à droite).

### Fichiers common mobile

Il existe un équivalent de Common.css et Common.js destiné au mobile ; respectivement Mobile.css et Mobile.js.

Ces fichiers ne sont actuellement pas utilisé par la Wikiversité.

Source: https://fr.wikiversity.org/w/index.php?title=MediaWiki:Mobile.css
et https://fr.wikiversity.org/w/index.php?title=MediaWiki:Mobile.js.

## Extension serveur

L'idée est de créer un « gadget serveur ». De ce fait nous avons la possiblité d'injecter du contenu directement dans la page.
Le menu ne sera plus inclus au chargement de la page.

Le problème du chargement de script ne sera plus car les scripts pourront être, au même titre que le contenu, injecter dans la page.

En revanche, c'est un développement important et l'extension affectera la rapidité chargement des pages. Sans oublié le risque d'erreur serveur qui bloquera la génération de la page. Ce n'est d'après moi pas dans l'intéret de la Wikiversité.

__Solution abondonnée__

## Inclure le gadget à la main

Pour des raisons de sécurity MediaWiki refuse l'inclusion de script dans une page avec la balise `<script>`.

__Solution abondonnée__

## Restreintre au personne desktop

Dans ce cas un message pourrait etre affiché pour notifier l'utilisateur.

C'est une possibilité mais à l'encontre meme de cette étude de faisabilité.

Nous ne pouvons pas empecher la redirection vers la version mobile d'une personne sur mobile.

__Solution abondonnée__

## Inclusion du MOOC dans commonJS et commonCSS

Actuellement déjà en place.

La gadget `Gadget-MOOC` est chargé dans le fichier `MediaWiki:Common.js`.

Source :

```javascript
// MOOC selon https://fr.wikiversity.org/wiki/Projet:Wikiversit%C3%A9/Autoriser_la_cr%C3%A9ation_de_pages_gadget-MOOC#Toucher_.C3.A0_MediaWiki:Common.js
importStylesheetURI("//fr.wikiversity.org/w/index.php?title=MediaWiki:Gadget-MOOC.css\u0026action=raw\u0026ctype=text/css");
mw.loader.load("//fr.wikiversity.org/w/index.php?title=MediaWiki:Gadget-MOOC.js\u0026action=raw\u0026ctype=text/javascript");
```

Le JavaScript est inclus avec la fonction `mw.loader.load`.

Dans l'URL des fichiers, l'option `raw` permet d'accèder directement au contenu brut et l'option `ctype` permet d'indiquer le type de fichier au navigateur. Si le type ne correspond pas au contenu du fichier, le navigateur refusera de l'executer.

## Resource load

Le fichier CSS est actuellement inclus avec la fonction `importStylesheetURI`. A noter que cette fonction ainsi que `importScript` sont dépréciées (source : https://phabricator.wikimedia.org/T95964).

`mw.loader.load` permet aussi d'inclure des fichier CSS. Il sera inject dans une balise `link` au moment du chargement de la page.

Le loader ne semble pas restreindre le chargement de scripts en fonction du device de l'utilisateur.

# Mobile-friendly MediaWiki

> Note good web practice states that you should have good fallbacks for non-JavaScript users.

Dans notre cas le modèle MOOC require du JavaScript pour afficher le menu. Un utilisateur sans JavaScript ne pourra pas naviguer dans une formation.

> There is a good reason why that we decided to turn ResourceLoader modules off by default. "We want you to think about mobile."

> Using `targets` you can decide to give a completely different experience to your mobile site users.

> We don't load common scripts or MediaWiki:Common.js/css as these were designed without mobile in mind.

## Decide if you should

MediaWiki accorde beaucoup d'importance au mobile. Voici les questions que nous somme amenés à ce poser :

* Will people on mobile really use your module?
Oui (TODO)

* It is useful to slow down the mobile experience by providing this module?
Oui (TODO)

* IS there some other library already enabled for mobile that does this thing already?
Non

## Tests

D'après les recommendations de la section mobile de WikiMedia.

Au minimum, nous devez tester sur les navigateurs suivants:
* iPhone
* Android 2.x
* Android 4.x
* Opera Mini v7+
* Blackberry v6+

Source: https://www.mediawiki.org/wiki/ResourceLoader/Writing_a_MobileFrontend_friendly_ResourceLoader_module


# Adapation mobile

## Menu

Intégrer le menu MOOC dans le menu affiché sous mobile (hamburger à droite)

# Conclusion

Il y'a certaine barrière mise en place par MediaWiki pour garantir une bonne expérience sous mobile.

Cepandant il semble possible d'inclure nos scripts sous mobile.

Nous pouvons utiliser le meme gadget pour les deux plateformes ou séparer en deux gadget distent.
