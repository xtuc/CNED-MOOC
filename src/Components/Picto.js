export default class Picto {

  /**
   * Get label by icon
   *
   * @param icon String
   * @return String
   */
  static getText(icon) {
    var str

    switch(icon) {
      case "prerequis":
        str = "Pré-requis"
      break

      case "objectif":
        str = "Objectif"
      break

      case "competencesvisees":
        str = "Compétences visées"
      break

      case "duree":
        str = "Durée"
      break

      case "public":
        str= "Public"
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
                  .css("width", "100%")
                  .append(icon)
                  .append("<br />")
                  .append(content)
  }
}
