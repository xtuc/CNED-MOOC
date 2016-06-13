export default class MenuFooter {

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
    return $("<div />").addClass("my-sb-more").html(this._blocks)
  }
}

export const MenuFooterDemo = new MenuFooter()
        .addInfo(
            "https://fr.wikiversity.org/wiki/Comment_bien_suivre_la_formation_d%27accessibilit%C3%A9_num%C3%A9rique",
            "Comment bien suivre la formation ?",
            "info"
        )
        .addInfo(
            "https://fr.wikiversity.org/wiki/Contribuer_%C3%A0_la_formation_d%27accessibilit%C3%A9_num%C3%A9rique",
            "Comment contribuer dans la wikiversité ?",
            "contrib"
        )
        .generate()

