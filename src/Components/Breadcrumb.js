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
    this.reducer = this.reducer.bind(this)

    const folders = $(`.${MENU_CLASS}>.${MENU_LEVEL1}`)

    console.log(items)

    Menu.reduceLevel2Items(folders, (acc, el) => {
      el.map(function() { // Can't use => because of jQuery contexts
        const x = $(this)

        console.log("matches", x.find(".nav-item-header a").get(0) === items[1].get(0))
      })
    }, [])

    this.delimiter = "&gt;"
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

    const link = (isInstanceOfjQuery(el))
                          ? "<a href=\""+ this.getLink(el) +"\">" + el.text() + "</a>"
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
