export default class LessonContent {

  /**
   * Constructor
   *
   * @param header Header (LessonHeader for ex)
   * @param content String
   */
  constructor(header, content) {
    this._header = header
    this._content = content
  }

  /**
   * Generates jQuery elements
   *
   * @return jQuery
   */
  generate() {
    const content = $("<div />")
                          .addClass("my-lesson-content")
                          .html(this._content)

    return $("<div />")
                  .addClass("my-lesson")
                  .append(this._header.generate())
                  .append(content)
  }
}
