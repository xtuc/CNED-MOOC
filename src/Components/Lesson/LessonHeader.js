const LESSON_HEADER_CLASS = "my-lesson-header"

export default class LessonHeader {

  static replaceTitle(title) {
    $("." + LESSON_HEADER_CLASS + " h3").text(title)
  }

  /**
   * Constructor
   *
   * @param content String
   */
  constructor(content) {
    this._content = content
  }

  /**
   * Generates jQuery elements
   *
   * @return jQuery
   */
  generate() {
    const title = $("<h3 />").text(this._content)

    return $("<div />").addClass(LESSON_HEADER_CLASS).html(title)
  }
}
