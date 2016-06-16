const CONTENT_CLASS = "my-main-content"

import {
    // removeToc,
    request,
    CONTENT_ID
} from "../utils"

import Header from "./Header"

export default class Content {

  /**
   * Hot update
   * @param content mixed Content
   */
  static update(element, content) {
    element.find("." + CONTENT_CLASS).html(content)
  }

  /**
   * Constructor
   *
   * @param content Content (LessonContent)
   */
  constructor(content) {
    this._content = content
  }

  generateHeaderByURL(url) {

    request(url, data => {
      data = $(data)
                  .find(CONTENT_ID)
                  .children()
                  .get() // get DOM element

      // removeToc(data)

      Header.replace(new Header(data)) // Header has loaded, replace it
    })
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    const header = new Header(false).generate()

    return $("<div />")
                  .addClass("my-main")
                  .addClass(CONTENT_CLASS)
                  .append(header)
                  .append(this._content.generate())
  }
}
