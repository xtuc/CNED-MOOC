const HEADER_CLASS = "my-main-content-header"

import Picto from "./Picto.js"
import { getConfig, removeConfig, slug, getIcon, ALT_TEXT } from "../utils.js"

export default class Header {

  static replace(header) {
    $("." + HEADER_CLASS).html(header.generate(false))
  }

  static replaceTitle(title) {
    $("." + HEADER_CLASS + " .my-title-wrap h2").html(title)
  }

  static delete() {
    $("." + HEADER_CLASS).empty()
    $("." + HEADER_CLASS).remove()
  }

  /**
   * Constructor
   *
   * @param data String HTML
   */
  constructor(data) {
    this._data = data

    this.reducer = this.reducer.bind(this)
  }

  generateTitle() {
    const title = $("<h2 />")

    return $("<div />")
                  .addClass("my-title-wrap")
                  .html(title)
  }

  /**
   * Generate picto into header
   *
   * @param picto Picto
   * @return jQuery
   */
  generatePicto(picto, widthClass) {
    if (!picto)
      return

    return $("<div />")
                .addClass("my-feature-item " + widthClass + " bibloc mutate")
                .html(picto.generate())
  }

  /**
   * Generate with class (w-[0-9]{1,2})
   *
   * @param number Integer number of picto
   * @return string
   */
  getWidthClass(number) {
    return "w-" + Math.round(100 / number)
  }

  /**
   * Generate row
   *
   * @return jQuery
   */
  generateRow() {
     return $("<div />").addClass("row")
  }

  /**
   * Generate pictos
   *
   * @param list List[Picto]
   * @return jQuery
   */
  generatePictos(list) {
    const row = this.generateRow()
    const widthClass = this.getWidthClass(list.length)

    list
        .map(p => this.generatePicto(p, widthClass))
        .map(x => row.append(x))

    return $("<div />")
                  .addClass("mutate-md")
                  .css("text-align", "center")
                  .html(row)
  }

  /**
   * Reducer
   *
   * @param acc Array[$]
   * @param $el jQuery
   */
  reducer(acc, el) {

    if (el.tagName === "H1" || el.tagName === "H2" || el.tagName === "H3") {

      const config = getConfig(el.innerText)
      const icon = slug(config ? config[1] : "")
      const text = removeConfig($(el).find(".mw-headline").text())

      acc.push(new Picto(getIcon(icon), Picto.getText(icon), text))
    }

    return acc
  }

  /**
   * Generate jQuery elements
   */
  generate(addClass = true) {
    var title

    // Placeholder
    var row = "<div style=\"display:block;width:835px;height:160px;\">" + ALT_TEXT + "</div>"

    if (this._data) {

      const pictos = this._data.reduce(this.reducer, [])

      title = this.generateTitle()
      row = this.generateRow().addClass("mutate")

      row.append(this.generatePictos(pictos))
    }

    return $("<div />")
                  .addClass((addClass) ? HEADER_CLASS : null)
                  .append(title)
                  .append(row)
  }
}
