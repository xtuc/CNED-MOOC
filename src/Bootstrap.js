import Title from "./Components/Title.js"
import Menu from "./Components/Menu.js"
import Content from "./Components/Content.js"
import LessonContent from "./Components/Lesson/LessonContent.js"
import LessonHeader from "./Components/Lesson/LessonHeader.js"
import Breadcrumb from "./Components/Breadcrumb.js"
import Header from "./Components/Header.js"
import MenuFooter from "./Components/MenuFooter.js"
import LessonFooter from "./Components/Lesson/LessonFooter.js"
import FirstHeading from "./Components/FirstHeading.js"
import {getPage, getPageNameFromUrl} from "./api"
import { log, NAV_LINKS_NOT_FOUND, URL_NOT_FOUND_IN_MENU, RELATED_ITEMS_NOT_FOUND } from "./messages.js"

const BACKLINK_CLASS = "mooc-wikiv-precedent"
const FORWARD_CLASS = "mooc-wikiv-suivant"

import {
  slug,
  ALT_TEXT,
  getConfig,
  removeConfig,
  getIcon
} from "./utils.js"

export default class Bootstrap {

    fixGadgetsIncompatibility($element) {

      /**
       * Fix LiveRC
       *
       * Adds a "clear" class on the generated content
       * which has a height property set to 0
       *
       * Since we don't know when LiveRC is going to load, better safe than sorry.
       */
      const doFix = () => $element.find(".clear").attr("style", "height: auto !important;")
      setTimeout(doFix, 50)
      setTimeout(doFix, 100)
    }

    /**
     * FirstHeading
     *
     * Already present on the page
     */
    generateFirstHeading(title, img) {
      const imageBox = img
                          ? `<span style="margin-right: 30px;">${img.outerHTML}</span>`
                          : null

      return new FirstHeading([imageBox, title])
    }

    /**
     * Menu
     */
    generateMenu(url) {
      const pageName = getPageNameFromUrl(url)

      getPage(pageName, (data) => {

        // get DOM element
        data = $(data.text["*"]).children().get()

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

              return acc.addInfo(a.attr("href"), label, getIcon(slug(icon)))
            }

            return acc
        }, new MenuFooter())

        MenuFooter.replace(menuFooter)

        /**
         * Menu select item from current URL
         */
        let titles = menu.selectByURL(window.location.pathname)

        /**
         * Check if the blocks (under menu) matches
         */
        let titles2 = menuFooter.getByURL(window.location.pathname)

        if (titles) {

          Breadcrumb.update(new Breadcrumb([ titles[1], titles[2], titles[3] ]))

          Title.update(titles[1].text())
          Header.replaceTitle(titles[2].text())
          LessonHeader.replaceTitle(titles[3].text())

          const lessonURL = titles[2].attr("data-src")

          if (lessonURL) {
            Content.generateHeaderByURL(lessonURL, data => {

              if (!data || data.length === 0)
                Header.delete()

              Header.replace(new Header(data)) // Header has loaded, replace it

              Header.replaceTitle(titles[2].text()) // Re-apply new title
              LessonHeader.replaceTitle(titles[3].text()) // Re-apply new title
            })
          } else {
            Header.delete()
            log(RELATED_ITEMS_NOT_FOUND)
          }

        } else if(titles2) {
          Breadcrumb.delete()
          Header.delete()
          Title.delete()

          LessonHeader.replaceTitle(titles2[3].text()) // Re-apply new title
        } else {
          log(URL_NOT_FOUND_IN_MENU)
        }

        // Once content is loaded re-apply location hash
        if (window.location.hash !== "")
          window.location.href = window.location.href
      })

    }

    /**
     * Content
     */
    generateContent(element, content, oldContent) {
      const lessonHeader = new LessonHeader(ALT_TEXT)

      const backLink = $(oldContent).find("." + BACKLINK_CLASS)
      const forwardLink = $(oldContent).find("." + FORWARD_CLASS)

      if (backLink.length === 0 || forwardLink.length === 0)
        log(NAV_LINKS_NOT_FOUND)

      const lessonFooter = new LessonFooter(backLink, forwardLink)

      const lesson = new LessonContent(lessonHeader, oldContent) // Re-add old content
      const generatedContent = new Content(lesson, lessonFooter)

      content.append(generatedContent.generate())

      element.append(content)
    }

    generateNavBar(content) {
      const navBar = $("<div />")
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
    generate(config, element, content, oldContent) {
      this.generateFirstHeading(config.title, config.image)
      this.generateTitle(element)
      this.generateBreadCrumb(element)
      this.generateMenu(config.menuURL)
      this.generateNavBar(content)
      this.generateContent(element, content, oldContent)
      this.fixGadgetsIncompatibility($("#moocwikiv"))
    }
}
