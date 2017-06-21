import boxen from "boxen"

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

export const MENU_URL_NOT_FOUND = "Vous devez indiquer le menu"
export const NAV_LINKS_NOT_FOUND = "Lien précédent ou suivant introuvable"
export const URL_NOT_FOUND_IN_MENU = "Page introuvable dans le menu"
export const RELATED_ITEMS_NOT_FOUND = "Items liés au niveau 2 introuvable"
export const ICON_NOT_FOUND = id => `Icône ${id} introuvable`
export const PRINTING = "Mode impression"
export const MENU_HAS_NOT_BEEN_GENERATED = "Le menu n'a pas pu être généré"
