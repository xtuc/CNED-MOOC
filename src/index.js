/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

$.fn.reduce = [].reduce // https://bugs.jquery.com/ticket/1886

import Title from "./Components/Title.js"
import Menu from "./Components/Menu.js"
import Content from "./Components/Content.js"
import LessonContent from "./Components/Lesson/LessonContent.js"
import LessonHeader from "./Components/Lesson/LessonHeader.js"
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

    Menu.replace(new Menu(data)) // Menu has loaded, replace it

    /**
     * Menu select item from current URL
     */
    // menu.selectByURL(window.location.origin + window.location.pathname)
  })

  let navBar = $("<div />")
                    .addClass("my-sb")
                    .append(new Menu(false).generate())
                    .append(MenuFooterDemo)

  content.append(navBar)

  /**
   * Content
   */
  const lessonHeader = (oldContent.title)
                              ? new LessonHeader(oldContent.title)
                              : false

  const lesson = new LessonContent(lessonHeader, oldContent.content) // Re-add old content
  content.append(new Content(lesson).generate())

  element.append(content)

  // Stop loading
  stopLoaderAndReplace(page, element)
}

$(() => $("#moocwikiv").each(moocwikiv))
