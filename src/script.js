const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
const wrapInnerToClass = CSSClass => node => node.wrapInner(`<div class="${CSSClass}"></div>`)
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

  /**
   * Normalize Mediawiki generated mw-* classes by removing them
   * FIXME this is a dirty hack
   */
  // normalizeItem = $n => $($($n.get(0).innerHTML)[0])
  normalizeItem = $n => $n.get(0).innerHTML

  applyAccordeon(element) {
    // Add expandable icon
    element.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    // console.log(element)

    // console.log("apply", element.find(".nav-item-content").find(".nav-item").length)

    element.find(".nav-item-header").find("a, .expandable").click(() => {
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
    item = this.normalizeItem(item)
    const levelClass = "folder"

    console.log(item instanceof jQuery)

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // wrapToClass("nav-item nav-item-header")(item)

    // To folder with initial closed
    wrapToClass(`${levelClass} closed`)(item)

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item.find("." + levelClass))

    this.applyAccordeon(item.find("." + levelClass))

    return item
  }

  /**
   * Generate items for level 2 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel2(item, lastItem) {
    item = this.normalizeItem(item)
    const levelClass = "lesson"

    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass(`${levelClass} closed`)(item.find(".nav-item")) // To lesson with initial closed

    $("<div />").addClass("nav-item-content").appendTo(item.find("." + levelClass)) // Append the lesson elements container

    this.applyAccordeon(item.find("." + levelClass))

    if (this.isFolder(lastItem)) {
      item.appendTo(lastItem.find(".nav-item-content"))

      return item
    }

    return item
  }

  /**
   * Generate items for level 3 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel3(item, lastItem) {
    item = this.normalizeItem(item)

    wrapToClass("nav-item nav-item-lesson")(item.find("a"))

    lastItem = lastItem.parent().parent().find(".lesson") // lastItem is nested

    if (this.isLesson(lastItem)) {
      item.appendTo(lastItem.find(".nav-item-content"))

      return item
    }

    return item
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

      // console.log(config)
      // console.log(iconMarkupMap[config])

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

    // for debuging purposes
    try {

      if (element.tagName === "H1")
        state = this.generateLevel1($e, lastItem)
      else if (element.tagName === "H2")
        state = this.generateLevel2($e, lastItem)
      else if (element.tagName === "H3")
        state = this.generateLevel3($e, lastItem)
      else if (element.tagName === "UL")
        state = this.applyConfiguration($(element), lastItem)

    } catch(e) {
      console.error(e)
    }

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
    data = $(data)
                .find(CONTENT_ID)
                .children()
                .get() // get DOM element

    let menu = new Menu(data)

    element.append(menu.generate())
    stopLoaderAndReplace(page, element)
  })

  console.clear() // for debug purpose
}

$(() => $("#moocwikiv").each(moocwikiv))
