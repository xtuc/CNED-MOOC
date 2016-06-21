const FIRSTHEADING_ID = "firstHeading"

export default class FirstHeading {

  /**
   * Hot update
   *
   * @param title String
   * @return void
   */
  static update(title) {
    $("#" + FIRSTHEADING_ID).text(title)
  }

  /**
   * Constructor
   *
   * @param title String
   * @return void
   */
  constructor(title) {
    return FirstHeading.update(title)
  }
}
