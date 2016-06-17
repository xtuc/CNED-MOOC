
const LESSON_FOOTER_CLASS = "my-lesson-tools bifloat mutate"

import Link from "../Link.js"

export default class LessonFooter {

  constructor(back, next) {
    this._back = (back.length > 0) ? back : false
    this._next = (next.length > 0) ? next : false
  }

  generateLinks() {
    const row = $("<div />").addClass("row middle")
    const el = $("<div />").addClass("my-tools-2")

    /**
     * back
     */
    if (this._back) {

      let href = this._back.find("a").attr("href")

      const back = new Link(
        this._back.text().replace("<", ""),
        href,
        "link-pic-after pic-prev"
      )

      row.append(back.generate())

      this._back.empty()
      this._back.remove()
    }

    /**
     * Separation is needed since it will apply height
     */
    if (this._back || this._next)
      row.append("<div class=\"my-nav-sep\"></div>")

    /**
     * next
     */
    if (this._next) {

      let href = this._next.find("a").attr("href")

      const forward = new Link(
        this._next.text().replace(">", ""),
        href,
        "link-pic pic-next"
      )

      row.append(forward.generate())

      this._next.empty()
      this._next.remove()
    }

    return el.append(row)
  }

  generateLeft() {
    return $("<div />").addClass("my-tools-1")
  }

  generate() {
    const links = this.generateLinks()

    return $("<div />")
                  .addClass(LESSON_FOOTER_CLASS)
                  .append(this.generateLeft())
                  .append(links)
  }
}
