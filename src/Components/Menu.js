import {
    removeExternalMark,
    slug,
    request,
    getConfig,
    removeConfig,
    iconMarkupMap,
    CONTENT_ID,
    removeToc
} from "../utils"
import Content from "./Content"

export default class Menu {

  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
    this.foldLevel2Accordeon = this.foldLevel2Accordeon.bind(this) // Otherwise reduce will override context
    this.foldLevel1Accordeon = this.foldLevel1Accordeon.bind(this) // Otherwise reduce will override context
    this.handleClick = this.handleClick.bind(this)
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
    element
        .find(".nav-item")
        .append("<div class=\"expandable sprite\"> <div class=\"btn-closed\">Déployer</div> <div class=\"btn-open\">Refermer</div> </div>")

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

  foldLevel2Accordeon(acc, element) {

    // Level 2
    if (this.isLesson(element)) {
      this.applyAccordeon(element)

      let $content = element.find(".nav-item-content")

      acc
        .reverse()
        .map(e => e.clone().appendTo($content))

      acc.map(e => e.hide()) // FIXME: should remove there but wont work

      acc = []
    }

    // Level 3
    if (this.isLevel3(element))
      acc.push(element)

    return acc
  }

  foldLevel1Accordeon(acc, element) {

    // Level 1
    if (this.isFolder(element)) {
      this.applyAccordeon(element)

      let $content = element.find(".nav-item-content")

      acc
        .reverse()
        .map(e => e.appendTo($content))

      acc.map(e => e.hide()) // FIXME: should remove there but wont work

      acc = []
    }

    // Level 2
    if (this.isLesson(element))
      acc.push(element)

    return acc
  }

  handleClick(e) {
    const URL = $(e.target).attr("href")

    if (URL.indexOf("wiki") == -1) // Not a real page, ignore
      return e.preventDefault()

    request(URL, data => {
      window.history.pushState({}, "title there", URL)

      data = $(data).find(CONTENT_ID)
      removeToc(data)

      Content.update($("body"), data)
    })

    e.preventDefault()
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

    generated.reverse()

    // // Depth-first, fold all trailing accordeons
    // generated.reduce(this.foldLevel2Accordeon, [])
    // generated.reduce(this.foldLevel1Accordeon, [])

    generated.reverse()

    generated.map(e => e.find("a").click(this.handleClick))

    return $("<div></div>").addClass("my-sb-nav").html(generated)
  }
}
