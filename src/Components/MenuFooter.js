const MENU_FOOTER_CLASS = "my-sb-more"

export default class MenuFooter {

  /**
   * Replace an existing footer
   *
   * @param menu MenuFooter
   * @return void
   */
  static replace(menu) {
    $("." + MENU_FOOTER_CLASS).html(menu.generate())
  }

  constructor() {
    this._blocks = []
  }

  /**
   * Add info block
   * @param link String Link URL
   * @param label String Block text et link title
   * @param picto String picto id (class)
   */
  addInfo(link, label, picto) {

    const a = $("<a />")
                      .attr("href", link)
                      .attr("title", label)
                      .text(label)

    const block = $("<div />")
                        .addClass("btn btn-pic btn-pic-sb pic-" + picto)
                        .html(a)

    this._blocks.push(block)

    return this
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    return $("<div />").addClass(MENU_FOOTER_CLASS).html(this._blocks)
  }
}
