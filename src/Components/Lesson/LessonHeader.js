export default class LessonHeader {

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

    return $("<div />").addClass("my-lesson-header").html(title)
  }
}
