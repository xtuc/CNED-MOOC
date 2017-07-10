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

function createSeeHelpPage(url) {
  const link = `<a href="${url}" target="_blank">${url}</a>`

  return "Vous pouvez consulter la page : " + link + " pour plus d'information"
}

function createMenuUrlNotFound(url) {

  return `
    Erreur : URL du menu introuvable ${url ? "(" + url + ")": ""}.
    ${createSeeHelpPage("https://fr.wikiversity.org/wiki/Mod%C3%A8le_MOOC_administration#Erreur_:_URL_du_menu_introuvable")}
  `
}

export function createUrlNotFoundInMenu(url) {

  return `
    Erreur : cette page est introuvable dans le menu ${url ? "(" + url + ")": ""}.
    ${createSeeHelpPage("https://fr.wikiversity.org/wiki/Mod%C3%A8le_MOOC_administration#Erreur_:_cette_page_est_introuvable_dans_le_menu")}
  `
}

export function createHeaderGenerationFailed(error) {
  return `
    Erreur : l'en-tête n'a pas pu être chargé ${error ? "(" + error + ")" : ""}.
    ${createSeeHelpPage("https://fr.wikiversity.org/wiki/Mod%C3%A8le_MOOC_administration#Erreur_:_l.27en-t.C3.AAte_n.27a_pas_pu_.C3.AAtre_charg.C3.A9")}
  `
}

function createIconNotFound(name) {
  return `
    Erreur : icône introuvable ${name ? "(" + name + ")" : ""}.
    ${createSeeHelpPage("https://fr.wikiversity.org/wiki/Mod%C3%A8le_MOOC_administration#Erreur_:_ic.C3.B4ne_introuvable")}
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
    vous pouvez consulter <a target="_blank" href="https://fr.wikiversity.org/wiki/Wikiversit%C3%A9:La_salle_caf%C3%A9">Wikiversité:La salle café</a> pour plus d'information
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
