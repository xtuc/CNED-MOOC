const MESSAGE_CLASS = "moocwikiv-debug"

export default class Message {

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
    return $("<p />")
      .addClass(MESSAGE_CLASS)
      .html(this._msg)
      .css("color", "#f44336")
  }
}
