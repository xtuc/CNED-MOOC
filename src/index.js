/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

$.fn.reduce = [].reduce // https://bugs.jquery.com/ticket/1886

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

import Bootstrap from "./Bootstrap.js"

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function() {
  const page = $(this)
  const element = $("<div></div>")
  const content = $("<div></div>").addClass("my-layout clear")

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

    return acc
  }, { menuURL: false, title: false })

  startLoader(page) // Start loader

  new Bootstrap().generate(config, element, content, oldContent.content)

  stopLoaderAndReplace(page, element) // Stop loading
}

$(() => $("#moocwikiv").each(moocwikiv))
