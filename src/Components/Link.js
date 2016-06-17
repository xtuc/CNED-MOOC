export default class Link {

  constructor(content, to, className) {
    this._content = content
    this._to = to
    this._className = className
  }

  generate() {
    const link = $("<a />", { href: this._to }).html(this._content)

    return $("<div />")
                    .addClass("link")
                    .addClass(this._className)
                    .html(link)
  }
}
