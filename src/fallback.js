import { debug } from "./messages.js"
import Menu from "./Components/Menu.js"
import Breadcrumb from "./Components/Breadcrumb.js"
import Header from "./Components/Header.js"
import MenuFooter from "./Components/MenuFooter.js"
import Title from "./Components/Title.js"
import FirstHeading from "./Components/FirstHeading.js"
import LessonHeader from "./Components/Lesson/LessonHeader.js"

class Empty {
  generate() {
    return ""
  }
}

/**
 * Fallback mode
 *
 * - Show the content we have currently in the page.
 * - Remove the loaders
 */
export function fallback() {
  debug("Entering fallback mode")

  Menu.replace(new Empty)
  MenuFooter.replace(new Empty)

  Breadcrumb.update(new Empty)
  FirstHeading.update(new Empty)

  Title.update("")
  LessonHeader.replaceTitle("")

  Header.delete()

  // Remove leftbar
  $(".my-sb").remove()
}
