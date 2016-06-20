/**
 * Display warning message
 *
 * @param m String
 * @return void
 */
export const log = (...m) => console.warn(...m)

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
