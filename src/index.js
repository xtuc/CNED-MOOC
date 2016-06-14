/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

import Title from "./Components/Title.js"
import Menu from "./Components/Menu.js"
import Content from "./Components/Content.js"
import Breadcrumb from "./Components/Breadcrumb.js"
import { MenuFooterDemo } from "./Components/MenuFooter.js"
import { request, CONTENT_ID } from "./utils.js"

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function() {
  const page = $(this)
  const element = $("<div></div>")
  const content = $("<div></div>").addClass("my-layout clear")

  /**
   * Clean traling file imports in p
   */
  page.parent().find("p").html("")

  page.html("") // Clear content
  startLoader(page) // Start loader

  /**
   * Title
   */
  element.append(new Title("Piloter l'accessibilité").generate())

  /**
   * Breadcrumb
   */
  element.append(new Breadcrumb([
    "Piloter l'accessibilité",
    "Initier une démarche d'accessibilité",
    "Activités d'apprentissage"
  ]).generate())

  /**
   * Menu
   */
  request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", data => {
    data = $(data)
                .find(CONTENT_ID)
                .children()
                .get() // get DOM element

    let menu = new Menu(data)

    let navBar = $("<div />")
                        .addClass("my-sb")
                        .append(menu.generate())
                        .append(MenuFooterDemo)

    content.append(navBar)

    /**
     * Content
     */
    content.append(new Content("content there").generate())

    element.append(content)

    // Stop loading
    stopLoaderAndReplace(page, element)
  })
}

$(() => $("#moocwikiv").each(moocwikiv))
