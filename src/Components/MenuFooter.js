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

  /**
   * Search for url in blocks
   *
   * @param url String
   * @return Boolean|Object
   */
  getByURL(url) {

    return this._blocks.reduce((acc, block) => {
      const a = $(block).find("a")

      if (!acc && url === a.attr("href"))
        return { 3: a }

      return acc
    }, false)
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
