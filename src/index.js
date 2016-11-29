/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

$.fn.reduce = [].reduce // https://bugs.jquery.com/ticket/1886

import "./Polyfill/IE.js"

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

import Bootstrap from "./Bootstrap.js"
import { log, debug, MENU_URL_NOT_FOUND, PRINTING } from "./messages.js"
import { isPrinting } from "./utils.js"

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function() {

  // Disable template in print mode
  if (isPrinting) {
    log(PRINTING)
    return false
  }

  const page = $(this)
  const element = $("<div></div>")
  const content = $("<div></div>").addClass("my-layout clear")

  page.css("display", "block")

  const pageContentChildren = page.parent().children()

  const oldContent = pageContentChildren.reduce((acc, el) => {
    if (el.id === "moocwikiv") // Ignore
      return acc

    acc.content.push(el)

    return acc
  }, { content: [], title: null })

  /**
   * Get config
   */
  const config = page.children().reduce((acc, el) => {
    const $e = $(el).find(".mw-headline")

    console.debug("config loop", el)

    if (el.tagName === "H1")
      acc.title = $e.text()

    if (el.tagName === "H3")
      acc.menuURL = $e.find("a").attr("href")

    if (el.tagName === "DIV" || el.tagName === "P") {
      let img = $(el).find("img")

      if (img)
        acc.image = img.get(0)
    }

    return acc
  }, { menuURL: false, title: false, image: false })

  debug("Template config", config)

  // Menu url is mandatory since
  if (!config.menuURL)
    return log(MENU_URL_NOT_FOUND)

  // Forces the menu to display in desktop format
  // Should better force in mobile view...
  config.menuURL = config.menuURL + "?useformat=desktop"

  startLoader(page) // Start loader

  new Bootstrap().generate(config, element, content, oldContent.content)

  stopLoaderAndReplace(page, element) // Stop loading
}

$(() => $("#moocwikiv").each(moocwikiv))
