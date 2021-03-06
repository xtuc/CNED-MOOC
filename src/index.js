/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

$.fn.reduce = [].reduce // https://bugs.jquery.com/ticket/1886

import "./Polyfill/IE.js"

import Message from "./Components/Message.js"

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

import Bootstrap from "./Bootstrap.js"
import { log, debug, complainFallback, complainMenuUrlNotFound, PRINTING } from "./messages.js"
import { isPrinting } from "./utils.js"
import { fallback } from "./fallback"

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function() {
  const page = $(this)

  // Generate error message placeholder
  page.parent().prepend(new Message("").generate())

  // Disable template in print mode
  if (isPrinting) {
    log(PRINTING)
    return false
  }

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

  // Forces the menu to display in desktop format
  // Should better force in mobile view...
  config.menuURL = config.menuURL + "?useformat=desktop"

  startLoader(page) // Start loader

  new Bootstrap().generate(config, element, content, oldContent.content)

  stopLoaderAndReplace(page, element) // Stop loading

  // Menu url is mandatory
  if (!config.menuURL) {
    return complainMenuUrlNotFound()
  }
}

$(() => {
  try {
    $("#moocwikiv").each(moocwikiv)
  } catch (e) {
    complainFallback(e.message)
    console.log(e.stack)

    fallback()
  }
})
