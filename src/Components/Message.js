const MESSAGE_CLASS = "moocwikiv-debug"

export default class Message {

  static formatElement(element) {
    return element
      .css("color", "#f44336")
  }

  /**
   * Replace an existing footer
   *
   * @param menu MenuFooter
   * @return void
   */
  static replace(msg) {
    $("." + MESSAGE_CLASS).html(msg.generate())
  }

  constructor(msg) {
    this._msg = msg
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
