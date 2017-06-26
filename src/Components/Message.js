const MESSAGE_CLASS = "moocwikiv-debug"

export default class Message {

  static formatElement(element) {
    return element
      .css("color", "#f44336")
      .css("border", "1px solid #f44336")
      .css("padding", "7px")
  }

  /**
   * Replace an existing footer
   *
   * @param menu MenuFooter
   * @return void
   */
  static replace(msg) {
    $("." + MESSAGE_CLASS).html(msg.getMessage())
  }

  constructor(msg) {
    this._msg = msg
  }

  getMessage() {
    return this._msg
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    return Message.formatElement(
      $("<p />").addClass(MESSAGE_CLASS).html(this._msg)
    )
  }
}
