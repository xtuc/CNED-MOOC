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
  generatePicto(picto) {
    return $("<div />")
                .addClass("my-feature-item w-50 bibloc mutate")
                .html(picto.generate())
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
   * Generate left side
   *
   * @param picto1 Picto
   * @param picto2 Picto
   * @return jQuery
   */
  generateLeft(picto1, picto2) {
    const row = this.generateRow()

    row.append(this.generatePicto(picto1))
    row.append(this.generatePicto(picto2))

    return $("<div />").addClass("w-50 mutate-md").html(row)
  }

  /**
   * Generate right side
   *
   * @param picto3 Picto
   * @param picto4 Picto
   * @return jQuery
   */
  generateRight(picto3, picto4) {
    const row = this.generateRow()

    row.append(this.generatePicto(picto3))
    row.append(this.generatePicto(picto4))

    return $("<div />").addClass("w-50 mutate-md").html(row)
  }

  /**
   * Reducer
   *
   * @param acc Array[$]
   * @param $el jQuery
   */
  reducer(acc, el) {

    if (el.tagName === "H1" || el.tagName === "H2") {

      const config = getConfig(el.innerText)
      const icon = slug(config ? config[1] : "")
      const text = removeConfig($(el).find(".mw-headline").text())

      const id = acc.length + 1

      acc.push(new Picto(getIcon(icon), Picto.getText(id), text))
    }

    return acc
  }

  /**
   * Generate jQuery elements
   */
  generate(addClass = true) {
    var title, row = ALT_TEXT

    if (this._data) {

      const pictos = this._data.reduce(this.reducer, [])

      title = this.generateTitle()
      row = this.generateRow().addClass("mutate")

      row.append(this.generateLeft(pictos[0], pictos[1]))
      row.append(this.generateRight(pictos[2], pictos[3]))
    }

    return $("<div />")
                  .addClass((addClass) ? HEADER_CLASS : null)
                  .append(title)
                  .append(row)
  }
}
