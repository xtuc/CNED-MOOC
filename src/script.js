const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => nodes => $(nodes).wrap(`<div class="${CSSClass}"></div>`)
const removeExternalMark = links => $(links).find("a").toggleClass("external")

const renderMenu = rawData => {
    const menu = $(rawData).find(CONTENT_ID)

    removeExternalMark(menu) // Remove external icon in links

    const level3 = menu.find(MENU_LEVEL_3_CLASS)

    /**
     * Level 1
     */
    const level1 = menu.find(MENU_LEVEL_1_CLASS)
    wrapToClass("nav-item nav-item-header")(level1.find("a"))
    wrapToClass("folder closed")(level1.find(".nav-item")) // To folder with initial closed

    /**
     * Level 2
     */
    const level2 = menu.find(MENU_LEVEL_2_CLASS)
    wrapToClass("nav-item nav-item-header")(level2.find("a"))
    wrapToClass("lesson closed")(level2.find(".nav-item")) // To lesson with initial closed

    // Wrap all level 1 item into folders
    level1.find(".nav-item").addClass("folder closed")

    return $("<div></div>").addClass("my-sb-nav").html(menu)
}

const CONTENT_ID = "#mw-content-text"
const MENU_LEVEL_1_CLASS = ".menu-level-1"
const MENU_LEVEL_2_CLASS = ".menu-level-2"
const MENU_LEVEL_3_CLASS = ".menu-level-3"

/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

const log = function() {
    console.log(this)
}

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function(i) {
    const element = $(this)

    /**
     * Clean traling file imports in p
     */
    element.parent().find("p").html("")

    element.html("") // Clear content
    element.addClass("my-sb")

    request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationA", (data, status) => {
        element.append(renderMenu(data))
    })
}

$(() => $("#moocwikiv").each(moocwikiv))
