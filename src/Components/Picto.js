export default class Picto {

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
                  .append(content)
  }
}
