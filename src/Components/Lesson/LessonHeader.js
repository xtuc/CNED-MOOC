const LESSON_HEADER_CLASS = "my-lesson-header"

export default class LessonHeader {

  static replaceTitle(title) {
    $("." + LESSON_HEADER_CLASS + " h3").text(title)
  }

  static delete() {
    $("." + LESSON_HEADER_CLASS).empty()
    $("." + LESSON_HEADER_CLASS).remove()
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
