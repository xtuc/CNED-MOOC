/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

import Menu from "./Components/Menu.js"
import { request, CONTENT_ID } from "./utils.js"

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

const log = function() {
  console.log(this)
}

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function(i) {
  const page = $(this)
  const element = $("<div></div>")

  /**
   * Clean traling file imports in p
   */
  page.parent().find("p").html("")

  page.html("") // Clear content
  startLoader(page) // Start loader

  page.addClass("my-sb")

  request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", (data, status) => {
    data = $(data)
                .find(CONTENT_ID)
                .children()
                .get() // get DOM element

    let menu = new Menu(data)

    element.append(menu.generate())
    stopLoaderAndReplace(page, element)
  })

  console.clear() // for debug purpose
}

$(() => $("#moocwikiv").each(moocwikiv))
