const CONTENT_CLASS = "my-main-content"

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
   * @param content mixed Content
   */
  constructor(content) {
    this._content = content
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    return $("<div />")
                  .addClass("my-main")
                  .addClass(CONTENT_CLASS)
                  .text(this._content)
  }
}
