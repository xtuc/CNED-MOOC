import boxen from "boxen"

import Message from "./Components/Message"
import { fallback } from "./fallback"

const prefix = "moocwikiv : "

/**
 * Display warning message
 *
 * @param m String
 * @return void
 */
export const log = (...m) =>
  console.log(boxen(prefix + m.join(","), { padding: 1 }))

/**
 * Used to dev purpose
 *
 * @param m String
 * @return void
 */
export const debug = (...m) => console.debug(...m)

function createMenuUrlNotFound(url) {

  return `
    Erreur : URL du menu introuvable ${url ? "(" + url + ")": ""}
  `
}

export function createUrlNotFoundInMenu(url) {

  return `
    Erreur : cette page est introuvable dans le menu ${url ? "(" + url + ")": ""}
  `
}

export function createHeaderGenerationFailed(error) {
  return `
    Erreur : l'en-tête n'a pas pu être chargé ${error ? "(" + error + ")" : ""}
  `
}

function createIconNotFound(name) {
  return `
    Erreur : icône introuvable ${name ? "(" + name + ")" : ""}
  `
}

/**
 * Message d'erreur affiché en mode dégradé du model
 *
 * @param {String} error
 */
function createFallback(error) {
  return `
    Erreur : le modèle n'a pas pu être généré ${error ? "(" + error + ")" : ""},
    vous pouvez consulter <a href="https://fr.wikiversity.org/wiki/Wikiversit%C3%A9:La_salle_caf%C3%A9">Wikiversité:La salle café</a> pour plus d'information
  `
}

export const NAV_LINKS_NOT_FOUND = "Lien précédent ou suivant introuvable"
export const RELATED_ITEMS_NOT_FOUND = "Items liés au niveau 2 introuvable"
export const PRINTING = "Mode impression"
export const MENU_HAS_NOT_BEEN_GENERATED = "Le menu n'a pas pu être généré"

export function complainUrlNotFoundInMenuError(url) {
  const msg = createUrlNotFoundInMenu(url)

  log(msg)
  Message.replace(new Message(msg))

  fallback()
}

export function complainMenuUrlNotFound(url) {
  const msg = createMenuUrlNotFound(url)

  log(msg)
  Message.replace(new Message(msg))

  fallback()
}

export function complainIconNotFound(name) {
  const msg = createIconNotFound(name)

  log(msg)
  Message.replace(new Message(msg))
}

export function complainFallback(error) {
  const msg = createFallback(error)

  log(msg)
  Message.replace(new Message(msg))
}
