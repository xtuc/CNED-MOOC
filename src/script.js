const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
const removeExternalMark = links => $(links).find("a").toggleClass("external")

class Menu {
  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
  }

  getLastElement = array => array[array.length - 1]
  isLesson = $n => $n.hasClass("lesson")
  isFolder = $n => $n.hasClass("folder")

  applyAccordeon(element, subElement, toggleClass) {

    element.click(() => {
      element.toggleClass(toggleClass)
      console.log(element)
    })
  }

  /**
   * Generate items for level 1 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel1(item, lastItem) {
    console.log("generateLevel1", item.html())

    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass("folder closed")(item.find(".nav-item")) // To folder with initial closed

    $("<div />").addClass("nav-item-content").appendTo(item.find(".folder")) // Append the lesson elements container

    // Add expandable icon
    item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find(".folder"), null, "closed")

    return item.children() // Remove trailing mw-headline container
  }

  /**
   * Generate items for level 2 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel2(item, lastItem) {
    console.log("generateLevel2", item.html())

    console.log("lastitem", lastItem.html(), "from", item.children())


    wrapToClass("nav-item nav-item-header")(item.find("a"))
    wrapToClass("lesson closed")(item.find(".nav-item")) // To lesson with initial closed

    // Add expandable icon
    // item.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    this.applyAccordeon(item.find(".lesson"), null, "closed")

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
    // wrapToClass("nav-item-content")(item.find(".nav-item"))

    if (this.isLesson(lastItem)) {
      console.log("FOUND LESSON", lastItem)

      return lastItem.append(item) // Insert into lesson
    }

    return item.children() // Remove trailing mw-headline container
  }

  reducer(acc, element) {
    const p = n => $(n).find(".mw-headline").wrapInner("<a href=\"#\"></a>")

    const $e = p(element)
    const $lastItem = this.getLastElement(acc)

    if (element.tagName == "H1")
        acc.push(this.generateLevel1($e, $lastItem))
    else if (element.tagName == "H2")
        acc.push(this.generateLevel2($e, $lastItem))
    else if (element.tagName == "H3")
        acc.push(this.generateLevel3($e, $lastItem))

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
