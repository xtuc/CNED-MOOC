import {
  removeExternalMark,
  slug,
  getConfig,
  removeConfig,
  getIcon,
  ALT_TEXT,
  APPEND_CONTENT_LINKS,
  ITEM_OPEN_BTN,
  ITEM_CLOSE_BTN,
  ariaAttributes,
  generateExpandableBtn,
  ariaControls
} from "../utils"

export const MENU_CLASS = "my-sb-nav"

export const MENU_LEVEL1 = "folder"
const MENU_LEVEL2 = "lesson"
const MENU_LEVEL3 = "level3"

export default class Menu {

  /**
   * Get URL
   *
   * @param $item jQuery
   * @return String url (or false if not found)
   */
  static getURLFromItem($item) {
    const a = $item.find("a")

    if (a)
      return a.attr("href")

    return false
  }

  /**
   * Fold folders
   *
   * @param folders List[jQuery]
   * @param f (List[jQuery], jQuery) => List[jQuery]
   * @param initialValue
   * @return void
   */
  static reduceLevel2Items(folders, f, initialValue = []) {
    return folders.reduce((acc, e) => {
      const res = $(e).find("." + MENU_LEVEL2)

      return f(acc, res)
    }, initialValue)
  }

  /**
   * Fold level3 items
   *
   * @param folders List[jQuery]
   * @param f (List[jQuery], jQuery) => List[jQuery]
   * @param initialValue
   * @return void
   */
  static reduceLevel3Items(folders, f, initialValue = []) {
    const lessons = Menu.reduceLevel2Items(folders, (acc, e) => {

      if (e.length > 0)
        acc = [...acc, ...e]

      return acc
    }, [])

    const items = lessons.reduce((acc, e) => {
      const res = $(e).find("." + MENU_LEVEL3)

      if (res.length > 0)
        acc = [...acc, ...res]

      return acc
    }, [])

    return items.reduce(f, initialValue)
  }

  /**
   * Replace an existing menu
   *
   * @param menu Menu
   * @return void
   */
  static replace(menu) {
    $("." + MENU_CLASS).html(menu.generate())
  }

  constructor(menu, url) {
    this.menu = menu
    this._url = url

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

    /**
     * Find url
     */
    const item = Menu.reduceLevel3Items(folders, (acc, e) => {
                              e = $(e)
                              var url = Menu.getURLFromItem(e) // Get URL

                              if (url.indexOf("#") !== -1)
                                url = url.substr(0, url.indexOf("#"))

                              if (url === p)
                                acc.push(e)

                              return acc
                            }, [])

    return this.setItemActif(item.pop())
  }

  /**
   * Find the first level3 item
   */
  findFirstLevel3Item() {
    const folders = $(`.${MENU_CLASS}>.${MENU_LEVEL1}`)

    return Menu.reduceLevel3Items(folders, (acc, e) => {
      if (acc) // Already found
        return acc

      return $(e)
    }, false)
  }

  /**
   * Add active flag
   *
   * @param $item jQuery
   * @return Object titles
   */
  setItemActif($item) {
    const CLASS = "active"

    if (!$item)
      return false

    $item.addClass(CLASS)

    const lesson = $item.parent().parent() // Get parent lesson
    const folder = lesson.parent().parent() // Get parent folder

    this.toggleOpen(lesson) // Open lesson
    this.toggleOpen(folder) // Open folder

    return {
      1: folder.find(".nav-item-header>a").first(),
      2: lesson.find(".nav-item-header>a").first(),
      3: $item.find("a").first()
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
   * Capitalize item
   */
  normalizeItem($n) {
    return $n.get(0).innerHTML
  }

  /**
   * Remove link target and title
   */
  normalizeLink(e) {
    const oldLink = $(e).attr("href")

    return $(e)
              .attr("data-src", oldLink) // Should use .data()
              .attr("href", `#${slug($(e).text())}`)
              .attr("title", "")
              .get()
  }

  applyAccordeon(element, level = 1, index = 1) {
    const $itemHeader = element.find(".nav-item-header").first()

    // Add expandable icon
    $itemHeader.append(
      generateExpandableBtn(
        ITEM_OPEN_BTN,
        ITEM_CLOSE_BTN,
        ariaAttributes(ariaControls(level, index), false)
      )
    )

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
  toggleOpen(e) {
    const $expandable = e.find(".expandable").first() // Also returns childs
    const $hideable = e.find(".nav-item-content")

    const expanded = $expandable.attr("aria-expanded")
    const hidden = $hideable.attr("aria-hidden")

    $expandable.attr("aria-expanded", (expanded == "true") ? false : true)
    $hideable.attr("aria-hidden", (hidden == "false") ? true : false)

    e.toggleClass("closed")
    e.toggleClass("open")
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
     *
     * Handle raw title (whitout links)
     */
    if ($(item).get(0) && $(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    } else {
      item = "<a href=\"#\">"+ item +"</a>" // We need an A
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
      const value = getIcon(slug(regexRes[1]))

      if(value) item.addClass(value) // Apply configuration
    }

    $(item).find("a").attr("href", (i, href) => {
      return href + APPEND_CONTENT_LINKS
    })

    return item
  }

  reducer(acc, element) {
    if (!element)
        return acc

    const p = n => $(n).find(".mw-headline")

    const $e = p(element)
    const lastItem = this.getLastElement(acc)

    var state = false

    try {
      if (element.tagName === "H1")
        state = this.generateLevel1($e, lastItem)
      else if (element.tagName === "H2")
        state = this.generateLevel2($e, lastItem)
      else if (element.tagName === "H3")
        state = this.generateLevel3($e, lastItem)

    } catch(e) {
      console.error("Menu", e)
    }

    if(state)
      acc.push(state)

    return acc
  }

  foldAccordeon(acc, el, index) {
    const { level2, level3 } = acc
    const $content = el.find(".nav-item-content")

    if (this.isFolder(el)) {

      if (level2.length == 0) // No childs
        return acc

      $content.attr("aria-hidden", true)
      $content.attr("id", ariaControls(1, index))

      level2
            .reverse()
            .map(x => x.clone()) // won't work without cloning
            .map((x, k2) => {
              x = this.applyAccordeon(x, 2, index + "" + k2)
              $(x).find(".nav-item-content").attr("id", ariaControls(2, index + "" + k2))

              return x
            }) // apply accordeon to cloned elements
            .map(x => $content.append(x))

      this.cleanup(level2)

      this.applyAccordeon(el, 1, index)

      acc.level2 = []
    }

    if (this.isLesson(el)) {
      level2.push(el)

      if (level3.length == 0) // No childs
        return acc

      $content.attr("aria-hidden", true)

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
    const alt = $("<div></div>")
                      .css("width", "300px")
                      .css("height", "800px")
                      .text(ALT_TEXT)

    if (!this.menu)
      return $("<div></div>")
                      .addClass(MENU_CLASS)
                      .html(alt)

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
