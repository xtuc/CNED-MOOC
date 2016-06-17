import Title from "./Components/Title.js"
import Menu from "./Components/Menu.js"
import Content from "./Components/Content.js"
import LessonContent from "./Components/Lesson/LessonContent.js"
import LessonHeader from "./Components/Lesson/LessonHeader.js"
import Breadcrumb from "./Components/Breadcrumb.js"
import Header from "./Components/Header.js"
import MenuFooter from "./Components/MenuFooter.js"
import {
  request,
  CONTENT_ID,
  ALT_TEXT,
  getConfig,
  removeConfig,
  iconMarkupMap,
  isExternalWikiLink
} from "./utils.js"

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
         * Footer
         */
        let menuFooter = data.reduce((acc, el) => {

            if (el.tagName === "H5") {
              el = $(el).find(".mw-headline")
              const a = el.find("a")
              const config = getConfig(el.text())
              const icon = (config && config[1])
              ? config[1]
              : null
              const label = removeConfig(a.text())

              return acc.addInfo(a.attr("href"), label, iconMarkupMap[icon])
            }

            return acc
        }, new MenuFooter())

        MenuFooter.replace(menuFooter)

        /**
         * Menu select item from current URL
         */
        let titles = menu.selectByURL(window.location.origin + window.location.pathname)

        if (titles) {

          Breadcrumb.update(new Breadcrumb([
            titles[1].text(),
            titles[2].text(),
            titles[3].text()
          ]))

          Title.update(titles[1].text())
          Header.replaceTitle(titles[2].text())
          LessonHeader.replaceTitle(titles[3].text())

          const lessonURL = titles[2].attr("data-src")

          if (lessonURL && isExternalWikiLink(lessonURL)) {
            Content.generateHeaderByURL(lessonURL, () => {
              LessonHeader.replaceTitle(titles[3].text()) // Re-apply new title
            })
          }

        }

      })

    }

    /**
     * Content
     */
    generateContent(element, content, oldContent) {

      const lessonHeader = new LessonHeader(ALT_TEXT)

      const lesson = new LessonContent(lessonHeader, oldContent) // Re-add old content
      const generatedContent = new Content(lesson)

      content.append(generatedContent.generate())

      element.append(content)
    }

    generateNavBar(content) {
      let navBar = $("<div />")
                            .addClass("my-sb")
                            .append(new Menu(false).generate())
                            .append(new MenuFooter().generate())

      content.append(navBar)
    }

    /**
     * Title
     */
    generateTitle(element) {
      element.append(new Title(ALT_TEXT).generate())
    }

    /**
     * Breadcrumb
     */
    generateBreadCrumb(element) {
       element.append(new Breadcrumb([ ALT_TEXT, ALT_TEXT, ALT_TEXT ]).generate())
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
