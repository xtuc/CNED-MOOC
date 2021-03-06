const TITLE_CLASS = "secondHeading"


export default class Title {

  /**
   * Update title
   *
   * @param text String title
   */
  static update(text) {
    $("." + TITLE_CLASS).text(text)
  }

  static delete() {
    $("." + TITLE_CLASS).empty()
    $("." + TITLE_CLASS).remove()
  }

  /**
   * Constructor
   *
   * @param text String Title
   */
  constructor(text) {
    this._text = text
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    return $("<h1 />").addClass(TITLE_CLASS).html(this._text)
  }
}
