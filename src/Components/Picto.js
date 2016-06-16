export default class Picto {

  static getText(id) {
    var str

    switch(id) {
      case 1:
        str = "Pré-requis"
      break

      case 2:
        str = "Objectif"
      break

      case 3:
        str = "Compétences visées"
      break

      case 4:
        str = "Durée"
      break
    }

    return str
  }

  constructor(icon, title, text) {
    this._icon = icon
    this._title = title
    this._text = text
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    const content = $("<div />")
                        .html(`<strong>${this._title}&nbsp;:</strong><br>
                               <em>${this._text}</em>`)
                        .addClass("my-feature")

    const icon =  $("<div />")
                        .addClass("pic-feature sprite")
                        .addClass("pic-" + this._icon)

    return $("<div />")
                  .append(icon)
                  .append("<br />")
                  .append(content)
  }
}
