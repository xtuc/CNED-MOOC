import {
    removeExternalMark,
    slug,
    getConfig,
    removeConfig,
    iconMarkupMap
} from "../utils"

export default class Menu {

  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
    this.foldAccordeon = this.foldAccordeon.bind(this) // Otherwise reduce will override context
  }

  getLastElement(array) {
    return array[array.length - 1]
  }

  isLesson($n) {
    return $n.hasClass("lesson")
  }

  isFolder($n) {
    return $n.hasClass("folder")
  }

  isLevel3($n) {
    return $n.hasClass("level3")
  }

  /**
   * Normalize Mediawiki generated mw-* classes by removing them
   */
  normalizeItem($n) {
    return $n.get(0).innerHTML
  }

  /**
   * Remove link target and title
   */
  normalizeLink(e) {
    return $(e).attr("href", `#${slug($(e).text())}`).attr("title", "").get()
  }

  applyAccordeon(element) {
    // Add expandable icon
    element.find(".nav-item").append("<div class=\"expandable sprite\"> <div class=\"btn-closed\">Déployer</div> <div class=\"btn-open\">Refermer</div> </div>")

    // console.log("apply", element.find(".nav-item-content").children().length)
    // console.log("apply", element.find(".nav-item-content").find("div").length)

    element.find(".nav-item-header").find("a, .expandable").click(() => {
      element.toggleClass("closed")
      element.toggleClass("open")
    })
  }

  /**
   * Generate items for level 1 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   */
  generateLevel1(item) {
    item = this.normalizeItem(item)
    const levelClass = "folder"

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To folder with initial closed
    item = $("<div />").addClass(`${levelClass} closed`).wrapInner(item)

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item)

    this.applyAccordeon(item)

    return item
  }

  /**
   * Generate items for level 2 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   */
  generateLevel2(item) {
    item = this.normalizeItem(item)
    const levelClass = "lesson"

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To lesson with initial closed
    item = $("<div />").addClass(`${levelClass} closed`).wrapInner(item)

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item)

    this.applyAccordeon(item)

    return item
  }

  /**
   * Generate items for level 3 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   */
  generateLevel3(item) {
    item = this.normalizeItem(item)
    const levelClass = "level3"

    /**
     * Check for configuration xxx (y)
     */
    const regexRes = getConfig(item)

    item = removeConfig(item)

    item = $("<div />").addClass("nav-item nav-item-lesson " + levelClass).wrapInner(item)

    if (regexRes && regexRes[1]) {
      const value = iconMarkupMap[slug(regexRes[1])]

      if(value) item.addClass(value) // Apply configuration
    }

    return item
  }

  reducer(acc, element) {
    const p = n => $(n).find(".mw-headline")

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

    } catch(e) {
      throw e
    }

    if(state)
      acc.push(state)

    return acc
  }

  foldAccordeon(acc, element) {

    // Level 2
    if (this.isLesson(element)) {
      // console.log(acc[0].get(0))

      acc.map(e => e.appendTo(element.find(".nav-item-content")))

      acc = []
    }

    // Level 3
    if (this.isLevel3(element)) {
      acc.push(element)
    }

    return acc
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

    // Depth-first, fold all trailing accordeons
    generated.slice().reverse().reduce(this.foldAccordeon, [])

    return $("<div></div>").addClass("my-sb-nav").html(generated)
  }
}
