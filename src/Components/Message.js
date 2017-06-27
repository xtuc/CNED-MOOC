const MESSAGE_CLASS = "moocwikiv-debug"

export default class Message {

  static formatElement(element) {
    return element
      .css("color", "#f44336")
      .css("border", "1px solid #f44336")
      .css("padding", "7px")
      .css("width", "100%")
  }

  /**
   * Replace an existing footer
   *
   * @param menu MenuFooter
   * @return void
   */
  static replace(msg) {
    $("." + MESSAGE_CLASS).html(msg.getFormatedMessage())
  }

  constructor(msg) {
    this._msg = msg
  }

  getFormatedMessage() {
    return Message.formatElement($("<div />").html(this._msg))
  }

  /**
   * Generate jQuery elements
   */
  generate() {

    // Return placeholder if no message
    if (this._msg === "") {
      return $("<p />").addClass(MESSAGE_CLASS)
    }

    const msg = Message.formatElement($("<div />").html(this._msg))

    return $("<p />").addClass(MESSAGE_CLASS).html(msg)
  }
}
