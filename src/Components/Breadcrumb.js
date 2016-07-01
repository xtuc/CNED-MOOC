const BREADCRUMB_CLASS = "my-breadcrumb"

import { isInstanceOfjQuery } from "../utils.js"
import Menu, { MENU_LEVEL1, MENU_CLASS } from "./Menu.js"

export default class Breadcrumb {

  /**
   * Hot update
   * @param e Breadcrumb
   */
  static update(e) {
    $("." + BREADCRUMB_CLASS).html(e.generate(false))
  }

  /**
   * Constructor
   *
   * @param items Array[jQuery|String]
   */
  constructor(items) {
    this._items = items
    this._links = []
    this.reducer = this.reducer.bind(this)
    this.delimiter = "&gt;"

    const folders = $(`.${MENU_CLASS}>.${MENU_LEVEL1}`)

    this._links[0] = this.findFirstLevel1Item(folders, items[0])
    this._links[1] = this.findFirstLevel2Item(folders, items[1])
  }

  /**
   * Find the link of the first level1 item
   *
   * @param folders List[jQuery]
   * @param item jQuery
   * @return String|false link or false
   */
  findFirstLevel1Item(folders, item) {
    const self = this

    return folders.reduce((acc, el) => {
      const a = $(el).find(".nav-item-header a").get(0)

      // test if it matches
      if (a == item.get(0)) {
        const firstlesson = $(el).find(".nav-item-content").children().first()
        const firstItem = firstlesson.find(".nav-item-content").children().first()

        if (!acc)
          acc = self.getLink(firstItem.find("a"))
      }

      return acc
    }, false)
  }

  /**
   * Find the link of the first level2 item
   *
   * @param folders List[jQuery]
   * @param item jQuery
   * @return String|false link or false
   */
  findFirstLevel2Item(folders, item) {
    const self = this

    return Menu.reduceLevel2Items(folders, (acc, el) => {

      el.map(function() { // Can't use => because of jQuery contexts
        const x = $(this)
        const a = x.find(".nav-item-header a").get(0)

        // test if it matches
        if (a == item.get(0)) {
          const matchingItem = $(x).find(".nav-item-content").children().first()

          if (!acc)
            acc = self.getLink(matchingItem.find("a"))

        }
      })

      return acc
    }, false)
  }

  /**
   * Return link given $item
   *
   * @param $item jQuery element
   * @return String url
   */
  getLink($item) {
    return ($item.attr("data-src"))
                  ? $item.attr("data-src")
                  : $item.attr("href")
  }

  reducer(acc, el, i) {
    const isLast = i == this._items.length - 1
    const delimiter = (!isLast)
                            ? " " + this.delimiter + " "
                            : ""

    const preparedLink = (this._links[i]) ? this._links[i] : "#"
    const link = (isInstanceOfjQuery(el))
                          ? "<a href=\""+ preparedLink +"\">" + el.text() + "</a>"
                          : el

    const text = (isLast)
                      ? "<strong>" + link + "</strong>"
                      : link

    acc.push(text + delimiter)

    return acc
  }

  /**
   * Generates jQuery elements
   */
  generate(useClass = true) {
    const content = this._items.reduce(this.reducer, [])
    const div = $("<div />").html(content)

    if (useClass)
      div.addClass(BREADCRUMB_CLASS)

    return div
  }
}
