import { debug } from "./messages.js"
import Menu from "./Components/Menu.js"
import Header from "./Components/Header.js"
import MenuFooter from "./Components/MenuFooter.js"

/**
 * Fallback mode
 *
 * - Show the content we have currently in the page.
 * - Remove the loaders
 */
export function fallback() {
  debug("Entering fallback mode")

  Menu.replace(new Menu())
  Header.replace(new Header())
  MenuFooter.replace(new MenuFooter())

  $("#moocwikiv").html("")
}
