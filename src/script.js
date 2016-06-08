const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
const removeExternalMark = links => $(links).find("a").toggleClass("external")

class Menu {
  constructor(menu) {
    this.menu = menu
  }

  applyAccordeon(element, subElement, toggleClass) {
    console.log("arc", element.html())

    element.click(() => {
      element.toggleClass(toggleClass)
      console.log(element)
    })
  }

  generateLevel1(item) {
    console.log("generateLevel1", item.html())

    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass("folder closed")(item.find(".nav-item")) // To folder with initial closed

    // Add expandable icon
    item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find(".folder"), null, "closed")

    return item.children() // Remove trailing mw-headline container
  }

  generateLevel2(item) {
    console.log("generateLevel2", item.html())

    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass("lesson closed")(item.find(".nav-item")) // To lesson with initial closed

    // Add expandable icon
    item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find(".lesson"), null, "closed")

    return item.children() // Remove trailing mw-headline container
  }

  generateLevel3(item) {
    wrapToClass("nav-item nav-item-lesson")(item.find("a"))

    return item.children() // Remove trailing mw-headline container
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const p = n => $(n).find(".mw-headline").wrapInner("<a href=\"#\"></a>")

    const generated = this.menu.reduce((acc, e) => {

      if (e.tagName == "H1")
          acc.push(this.generateLevel1(p(e)))
      else if (e.tagName == "H2")
          acc.push(this.generateLevel2(p(e)))
      else if (e.tagName == "H3")
          acc.push(this.generateLevel3(p(e)))

      return acc
    }, [])

    return $("<div></div>").addClass("my-sb-nav").html(generated)
  }
}

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

const CONTENT_ID = "#mw-content-text"

const MENU_LEVEL_1 = "h1"
const MENU_LEVEL_2 = "h2"
const MENU_LEVEL_3 = "h3"

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

  request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", (data, status) => {
    data = $(data).find(CONTENT_ID).children().get() // get DOM element

    let menu = new Menu(data)

    element.append(menu.generate())
    stopLoaderAndReplace(page, element)
  })
}

$(() => $("#moocwikiv").each(moocwikiv))