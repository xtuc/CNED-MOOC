import Title from "./Components/Title.js"
import Menu from "./Components/Menu.js"
import Content from "./Components/Content.js"
import LessonContent from "./Components/Lesson/LessonContent.js"
import LessonHeader from "./Components/Lesson/LessonHeader.js"
import Breadcrumb from "./Components/Breadcrumb.js"
import { MenuFooterDemo } from "./Components/MenuFooter.js"
import { request, CONTENT_ID } from "./utils.js"

export default class Bootstrap {

    /**
     * Menu
     */
    generateMenu() {

      request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", data => {
        data = $(data)
                    .find(CONTENT_ID)
                    .children()
                    .get() // get DOM element

        let menu = new Menu(data)

        Menu.replace(menu) // Menu has loaded, replace it

        /**
         * Menu select item from current URL
         */
        let titles = menu.selectByURL(window.location.origin + window.location.pathname)
        console.log(titles)
      })
    }

    /**
     * Content
     */
    generateContent(element, content, oldContent) {

      const lessonHeader = (oldContent.title)
                                  ? new LessonHeader(oldContent.title)
                                  : false

      const lesson = new LessonContent(lessonHeader, oldContent.content) // Re-add old content
      const generatedContent = new Content(lesson)

      generatedContent.generateHeaderByURL("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9")

      content.append(generatedContent.generate())

      element.append(content)
    }

    generateNavBar(content) {

      let navBar = $("<div />")
                            .addClass("my-sb")
                            .append(new Menu(false).generate())
                            .append(MenuFooterDemo)

      content.append(navBar)
    }

    /**
     * Title
     */
    generateTitle(element) {
      element.append(new Title("title 1").generate())
    }

    /**
     * Breadcrumb
     */
    generateBreadCrumb(element) {

       element.append(new Breadcrumb([
            "title 1",
            "title 2",
            "title 3"
      ]).generate())
    }

    /**
     * Bootstrap
     *
     * @param element Element hidden content, revealed after loading
     * @param content New content
     * @param oldContent Content found on the current page
     * @return void
     */
    generate(element, content, oldContent) {
      this.generateTitle(element)
      this.generateBreadCrumb(element)
      this.generateMenu()
      this.generateNavBar(content)
      this.generateContent(element, content, oldContent)
    }
}
