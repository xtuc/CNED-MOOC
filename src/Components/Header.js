const HEADER_CLASS = "my-main-content-header"

import Picto from "./Picto.js"
import { getConfig, removeConfig, slug, iconMarkupMap } from "../utils.js"

export default class Header {

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
    const title = $("<h2 />").text("foo")

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
    const lastItem = acc.items[acc.items.length - 1]

    if (el.tagName === "H1") {
      acc.items.push(el) // store it for next iteration
    }

    if (el.tagName === "P" && lastItem && lastItem.tagName === "H1") {

      const config = getConfig(lastItem.innerText)
      const icon = slug(config ? config[1] : "")
      const title = removeConfig($(lastItem).find(".mw-headline").text())
      const text = el.innerHTML

      acc.pictos.push(new Picto(iconMarkupMap[icon], title, text))

      acc.items = [] // Reset acc
    }

    return acc
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    const pictos = this._data.get().reduce(this.reducer, { items: [], pictos: [] }).pictos

    const title = this.generateTitle()
    const row = this.generateRow().addClass("mutate")

    row.append(this.generateLeft(pictos[0], pictos[1]))
    row.append(this.generateRight(pictos[2], pictos[3]))

    return $("<div />")
                  .addClass(HEADER_CLASS)
                  .append(title)
                  .append(row)
  }
}
