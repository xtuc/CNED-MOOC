const BREADCRUMB_CLASS = "my-breadcrumb"

export default class Breadcrumb {

  /**
   * Hot update
   * @param e Breadcrumb
   */
  static update(e) {
    $("." + BREADCRUMB_CLASS).html(e.generate(false))
  }

  /**
   * Constructor
   *
   * @param items Array[String]
   */
  constructor(items) {
    this._items = items

    this.reducer = this.reducer.bind(this)

    this.delimiter = "&gt;"
  }

  reducer(acc, el, i) {
    const isLast = i == this._items.length - 1
    const delimiter = (!isLast)
                            ? " " + this.delimiter + " "
                            : ""
    const text = (isLast)
                      ? "<strong>" + el + "</strong>"
                      : el

    acc.push(text + delimiter)

    return acc
  }

  /**
   * Generates jQuery elements
   */
  generate(useClass = true) {
    const content = this._items.reduce(this.reducer, [])
    const div = $("<div />").html(content)

    if (useClass)
      div.addClass(BREADCRUMB_CLASS)

    return div
  }
}
