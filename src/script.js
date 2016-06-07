const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => nodes => $(nodes).wrap(`<div class="${CSSClass}"></div>`)
const removeExternalMark = links => $(links).find("a").toggleClass("external")

class Menu {
    constructor(data) {
        this.data = data
    }

    generateLevel1(menu) {
        const level1 = menu.find(MENU_LEVEL_1)
        wrapToClass("nav-item nav-item-header")(level1.find("a"))
        wrapToClass("folder closed")(level1.find(".nav-item")) // To folder with initial closed

        // Wrap all level 1 item into folders
        level1.find(".nav-item").addClass("folder closed")

        // Add expandable icon
        level1.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')
    }

    generateLevel2(menu) {
        const level2 = menu.find(MENU_LEVEL_2)
        wrapToClass("nav-item nav-item-header")(level2.find("a"))
        wrapToClass("lesson closed")(level2.find(".nav-item")) // To lesson with initial closed
    }

    generateLevel3(menu) {
        const level3 = menu.find(MENU_LEVEL_3)
        wrapToClass("nav-item nav-item-lesson")(level3.find("a"))
    }

    generate() {
        const menu = $(this.data).find(CONTENT_ID)

        removeExternalMark(menu) // Remove external icon in links

        this.generateLevel1(menu)
        this.generateLevel2(menu)
        this.generateLevel3(menu)

        return $("<div></div>").addClass("my-sb-nav").html(menu)
    }
}

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

const CONTENT_ID = "#mw-content-text"
const MENU_LEVEL_1 = ".menu-level-1"
const MENU_LEVEL_2 = ".menu-level-2"
const MENU_LEVEL_3 = ".menu-level-3"

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
    const page = $(this)
    const element = $("<div></div>")

    /**
     * Clean traling file imports in p
     */
    page.parent().find("p").html("")

    page.html("") // Clear content
    startLoader(page) // Start loader

    page.addClass("my-sb")

    request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationA", (data, status) => {
        let menu = new Menu(data)
        element.append(menu.generate())

        stopLoaderAndReplace(page, element)
    })

    request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", (data, status) => {
        let menu = $(data).find(CONTENT_ID)

        let level1 = menu.find("h1").find(".mw-headline")
        let level2 = menu.find("h2").find(".mw-headline")
        let level3 = menu.find("h3").find(".mw-headline")

        element.append([ level1, level2, level3 ])
    })
}

$(() => $("#moocwikiv").each(moocwikiv))
