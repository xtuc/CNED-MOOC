const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
const removeExternalMark = links => $(links).find("a").toggleClass("external")

const iconMarkupMap = {
  video: "bases",
  texte: "activity",
  quizz: "evaluation"
}

class Menu {
  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
  }

  getLastElement = array => array[array.length - 1]
  isLesson = $n => $n.hasClass("lesson")
  isFolder = $n => $n.hasClass("folder")

  applyAccordeon(element) {
    element.find("a, .expandable").click(() => {
      element.toggleClass("closed")
      element.toggleClass("open")
    })
  }

  /**
   * Generate items for level 1 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel1(item, lastItem) {
    const levelClass = "folder"

    wrapToClass("nav-item nav-item-header")(item.find("a"))

    // To folder with initial closed
    wrapToClass(`${levelClass} closed`)(item.find(".nav-item"))

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item.find("." + levelClass))

    // Add expandable icon
    item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find("." + levelClass))

    return item.children() // Remove trailing mw-headline container
  }

  /**
   * Generate items for level 2 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel2(item, lastItem) {
    const levelClass = "lesson"

    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass(`${levelClass} closed`)(item.find(".nav-item")) // To lesson with initial closed

    $("<div />").addClass("nav-item-content").appendTo(item.find("." + levelClass)) // Append the lesson elements container

    // Add expandable icon
    item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find("." + levelClass))

    if (this.isFolder(lastItem)) {
      item.children().appendTo(lastItem.find(".nav-item-content"))

      return item
    }

    return item.children() // Remove trailing mw-headline container
  }

  /**
   * Generate items for level 3 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel3(item, lastItem) {
    wrapToClass("nav-item nav-item-lesson")(item.find("a"))

    lastItem = lastItem.parent().parent().find(".lesson") // lastItem is nested

    if (this.isLesson(lastItem)) {
      item.children().appendTo(lastItem.find(".nav-item-content"))

      return item
    }

    return item.children() // Remove trailing mw-headline container
  }

  /**
   * Apply configuration
   * Currently lesson is hard-coded
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  applyConfiguration(item, lastItem) {
    const config = item.children().text().trim().replace("é", "e") // String

    lastItem = lastItem.parent().parent().find(".lesson") // lastItem is nested

    if (this.isLesson(lastItem)) {

      console.log(config)
      console.log(iconMarkupMap[config])

      // Translate using dict icon markup
      if (iconMarkupMap[config]) {
        lastItem.find(".nav-item-lesson").addClass(iconMarkupMap[config])
      }
    }

    // return false because we will directly mutate existing objects (jQuery)
    return false;
  }

  reducer(acc, element) {
    const p = n => $(n).find(".mw-headline").wrapInner("<a href=\"#\"></a>")

    const $e = p(element)
    const lastItem = this.getLastElement(acc)

    var state = false

    if (element.tagName === "H1")
      state = this.generateLevel1($e, lastItem)
    else if (element.tagName === "H2")
      state = this.generateLevel2($e, lastItem)
    else if (element.tagName === "H3")
      state = this.generateLevel3($e, lastItem)
    else if (element.tagName === "UL")
      state = this.applyConfiguration($(element), lastItem)

    console.debug("parse response", element.innerHTML)

    if(state)
      acc.push(state)

    return acc
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

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

  console.clear() // for debug purpose
}

$(() => $("#moocwikiv").each(moocwikiv))
