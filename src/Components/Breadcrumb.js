export default class Breadcrumb {

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
  generate() {
    const content = this._items.reduce(this.reducer, [])

    return $("<div />")
                  .addClass("my-breadcrumb")
                  .html(content)
  }
}
