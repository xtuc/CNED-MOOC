import { removeExternalMark, slug, getConfig, removeConfig, iconMarkupMap, ALT_TEXT } from "../utils"

const MENU_CLASS = "my-sb-nav"

const MENU_LEVEL1 = "folder"
const MENU_LEVEL2 = "lesson"
const MENU_LEVEL3 = "level3"

export default class Menu {

  /**
   * Replace an existing menu
   *
   * @param menu Menu
   * @return void
   */
  static replace(menu) {
    $("." + MENU_CLASS).html(menu.generate())
  }

  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
    this.foldAccordeon = this.foldAccordeon.bind(this) // Otherwise reduce will override context
    this.setItemActif = this.setItemActif.bind(this)
  }

  /**
   * Select item in menu from given URL
   *
   * Not very efficient, we could prepare items/url list
   */
  selectByURL(p) {

    /**
     * Find level3 menu item
     */
    const folders = $(`.${MENU_CLASS}>.${MENU_LEVEL1}`)
    const lessons = folders.reduce((acc, e) => {
      const res = $(e).find("." + MENU_LEVEL2)

      if (res.length > 0)
        acc = [...acc, ...res]

      return acc
    }, [])

    const items = lessons.reduce((acc, e) => {
      const res = $(e).find("." + MENU_LEVEL3)

      if (res.length > 0)
        acc = [...acc, ...res]

      return acc
    }, [])

    /**
     * Find url
     */
    const item = items
                    .map(x => $(x)) // To jQuery
                    .reduce((acc, e) => {
                      const url = this.getURLFromItem(e) // Get URL

                      if (url === p)
                        acc.push(e)

                      return acc
                    }, [])

    return this.setItemActif(item.pop())
  }

  /**
   * Get URL
   *
   * @param $item jQuery
   * @return String url (or false if not found)
   */
  getURLFromItem($item) {
    const a = $item.find("a")

    if (a)
      return a.attr("href")

    return false
  }

  /**
   * Add active flag
   *
   * @param $item jQuery
   * @return Object titles
   */
  setItemActif($item) {
    const CLASS = "active"

    $item.addClass(CLASS)

    const lesson = $item.parent().parent() // Get parent lesson
    const folder = lesson.parent().parent() // Get parent folder

    this.toggleOpen(lesson) // Open lesson
    this.toggleOpen(folder) // Open folder

    return {
      1: folder.find(".nav-item-header>a").first().text(),
      2: lesson.find(".nav-item-header>a").first().text(),
      3: $item.find("a").first().text()
    }
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
      this.toggleOpen(element)
    })

    return element
  }

  /**
   * Toggle open/closed
   *
   * @param element jQuery
   * @return void
   */
  toggleOpen(element) {
    element.toggleClass("closed")
    element.toggleClass("open")
  }

  /**
   * Generate items for level 1 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   */
  generateLevel1(item) {
    item = this.normalizeItem(item)

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To folder with initial closed
    item = $("<div />").addClass(`${MENU_LEVEL1} closed`).wrapInner(item)

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

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To lesson with initial closed
    item = $("<div />").addClass(`${MENU_LEVEL2} closed`).wrapInner(item)

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

    /**
     * Check for configuration xxx (y)
     */
    const regexRes = getConfig(item)

    item = removeConfig(item)

    item = $("<div />").addClass("nav-item nav-item-lesson " + MENU_LEVEL3).wrapInner(item)

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

      this.cleanup(level2)

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

      this.cleanup(level3)

      acc.level3 = []
    }

    if (this.isLevel3(el))
      level3.push(el)

    return acc
  }

  /**
   * Remove DOM elements
   *
   * @param array Array[jQuery]
   * @return void
   */
  cleanup(array) {
    array.map(x => x.empty())
    array.map(x => x.remove())
  }

  /**
   * Generates jQuery elements
   * @return jQuery
   */
  generate() {

    if (!this.menu)
      return $("<div></div>").addClass(MENU_CLASS).html(ALT_TEXT)

    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

    generated.reverse()

    // Depth-first, fold all trailing accordeons
    generated.reduce(this.foldAccordeon, { level2: [], level3: [] })

    generated.reverse()

    return generated
  }
}
