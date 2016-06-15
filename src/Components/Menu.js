// import {
//     removeExternalMark,
//     slug,
//     request,
//     getConfig,
//     removeConfig,
//     iconMarkupMap,
//     CONTENT_ID,
//     removeToc
// } from "../utils"

 import { removeExternalMark, slug, getConfig, removeConfig, iconMarkupMap } from "../utils"

// import Content from "./Content"
// import LessonContent from "./Lesson/LessonContent.js"
// import LessonHeader from "./Lesson/LessonHeader.js"

const MENU_CLASS = "my-sb-nav"

export default class Menu {

  /**
   * Select item in menu from given URL
   */
  selectByURL(url) {
    const element = this._links[url]

    console.log(element)
    console.log(url)

    if (!element)
      return false

    return true

    // return $("." + MENU_CLASS).find(".folder").children().reduce((acc, folder) => {
    //   const content = $(folder).find(".nav-item-content").children()

    //   content.map(x => {
    //     const a = $(x)

    //     console.log(a)
    //   })

    //   return acc
    // }, false)
  }

  constructor(menu) {
    this.menu = menu

    this._links = [] // Using to cache links assigned to el

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
    this.foldAccordeon = this.foldAccordeon.bind(this) // Otherwise reduce will override context
    // this.handleClick = this.handleClick.bind(this)
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
    const $itemHeader = element.find(".nav-item-header").first()

    // Add expandable icon
    $itemHeader
        .append("<div class=\"expandable sprite\"> <div class=\"btn-closed\">Déployer</div> <div class=\"btn-open\">Refermer</div> </div>")

    $itemHeader.find("a, .expandable").click(() => {
      element.toggleClass("closed")
      element.toggleClass("open")
    })

    return element
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
    const href = $(item).attr("href")

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

    this._links[href] = item // Add to cache

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

  // handleClick(e) {
  //   const URL = $(e.target).attr("href")

  //   if (URL.indexOf("wiki") == -1) // Not a real page, ignore
  //     return e.preventDefault()

  //   request(URL, data => {
  //     window.history.pushState({}, "title there", URL)

  //     data = $(data).find(CONTENT_ID)
  //     removeToc(data)

  //     const lesson = new LessonContent(new LessonHeader("header here"), data)

  //     Content.update($("body"), lesson.generate())
  //   })

  //   e.preventDefault()
  // }

  foldAccordeon(acc, el) {
    const { level2, level3 } = acc

    if (this.isFolder(el)) {

      if (level2.length == 0) // No childs
        return acc

      const $content = el.find(".nav-item-content")

      level2
            .reverse()
            .map(x => x.clone()) // won't work without cloning
            .map(x => this.applyAccordeon(x)) // apply accordeon to cloned elements
            .map(x => $content.append(x))

      level2.map(x => x.hide()) // Hide all FIXME: remove dom

      this.applyAccordeon(el)

      acc.level2 = []
    }

    if (this.isLesson(el)) {
      level2.push(el)

      if (level3.length == 0) // No childs
        return acc

      const $content = el.find(".nav-item-content")

      level3
            .reverse()
            .map(x => x.clone()) // won't work without cloning
            .map(x => $content.append(x))

      level3.map(x => x.hide()) // Hide all FIXME: remove dom

      acc.level3 = []
    }

    if (this.isLevel3(el))
      level3.push(el)

    return acc
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

    generated.reverse()

    // Depth-first, fold all trailing accordeons
    generated.reduce(this.foldAccordeon, { level2: [], level3: [] })

    generated.reverse()

    // generated.map(e => e.find("a").click(this.handleClick)) // turbo-links way

    return $("<div></div>").addClass(MENU_CLASS).html(generated)
  }
}
