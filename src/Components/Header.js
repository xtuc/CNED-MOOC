const HEADER_CLASS = "my-main-content-header"

export default class Header {

  /**
   * Constructor
   *
   * @param data String HTML
   */
  constructor(data) {
    this._data = data
  }

  generateTitle() {
    const title = $("<h2 />").text("foo")

    return $("<div />")
                  .addClass("my-title-wrap")
                  .html(title)
  }

  generatePicto(text) {
    return `<div class=\"my-feature-item w-60 bibloc mutate\"><div class=\"pic-feature pic-competence sprite\"></div> <div class=\"my-feature\"><strong>Compétences visées&nbsp;:</strong><br><em>${text}</em></div> </div>`
  }

  generateRow() {
     return $("<div />").addClass("row")
  }

  generateLeft(picto1, picto2) {
    const row = this.generateRow()

    row.append(this.generatePicto(picto1))
    row.append(this.generatePicto(picto2))

    return $("<div />").addClass("w-50 mutate-md").html(row)
  }

  generateRight(picto3, picto4) {
    const row = this.generateRow()

    row.append(this.generatePicto(picto3))
    row.append(this.generatePicto(picto4))

    return $("<div />").addClass("w-50 mutate-md").html(row)
  }

  generate() {
    const title = this.generateTitle()
    const row = this.generateRow().addClass("mutate")

    row.append(this.generateLeft(1, 2))
    row.append(this.generateRight(3, 4))

    return $("<div />")
                  .addClass(HEADER_CLASS)
                  .append(title)
                  .append(row)
  }
}
