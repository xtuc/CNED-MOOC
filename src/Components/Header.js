const HEADER_CLASS = "my-main-content-header"

import Picto from "./Picto.js"
import Message from "../Components/Message"
import { getConfig, removeConfig, slug, getIcon, ALT_TEXT, truncate } from "../utils.js"
import { getIEVersion, getIfLessThan } from "../utils.js"
import { log, createHeaderGenerationFailed, complainIconNotFound } from "../messages.js"

const TITLE_MAX_LENGTH = 50 /* characters */

export default class Header {

  static replace(header) {
    $("." + HEADER_CLASS).html(header.generate(false))
  }

  static replaceTitle(title) {
      $("." + HEADER_CLASS + " .my-title-wrap h2").html(
          truncate(TITLE_MAX_LENGTH)(title)
      )
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
    const IEVersion = getIEVersion()

    return $("<div />")
                  .addClass("my-title-wrap " + getIfLessThan(10)("ie__my-title-wrap", IEVersion))
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

    const IEVersion = getIEVersion()

    return $("<div />")
                .addClass("my-feature-item " + widthClass + " bibloc mutate " + getIfLessThan(10)("ieFlexbox", IEVersion))
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

      const pictoIcon = Picto.getText(icon)

      if (!pictoIcon) {
        complainIconNotFound(icon)
      }

      acc.push(new Picto(getIcon(icon), pictoIcon, text))
    }

    return acc
  }

  /**
   * Generate jQuery elements
   */
  generate(addClass = true) {
    try {

      var title

      // Placeholder
      var row = "<div style=\"display:block;width:835px;height:160px;\">" + ALT_TEXT + "</div>"

      if (this._data !== false) {
        const pictos = $(this._data).children().reduce(this.reducer, [])

        title = this.generateTitle()
        row = this.generateRow().addClass("mutate")

        row.append(this.generatePictos(pictos))
      }

      return $("<div />")
                    .addClass((addClass) ? HEADER_CLASS : null)
                    .append(title)
                    .append(row)
    } catch (e) {
      Message.replace(new Message(createHeaderGenerationFailed(e.message)))

      log(e.message)
      console.log(e.stack)

      // Placeholder
      return $("<div />").addClass((addClass) ? HEADER_CLASS : null)
    }
  }
}
