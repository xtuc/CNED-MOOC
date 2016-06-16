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
    const tagName = el.tagName

    if (el.id === "moocwikiv") // Ignore
      return acc

    if (tagName === "H2") {
      acc.title = $(el).find(".mw-headline").text()
      el.remove() // Remove node
    } else
      acc.content.push(el)

    return acc
  }, { content: [], title: null })

  startLoader(page) // Start loader

  new Bootstrap().generate(element, content, oldContent)

  stopLoaderAndReplace(page, element) // Stop loading
}

$(() => $("#moocwikiv").each(moocwikiv))
