/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   animations.js
/  Description:
/    This module provides animations for actions on the site.
/-----------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------
/ SECTION: Module Imports
/-----------------------------------------------------------------------------*/
import { $qs, $qsa, $ce, $ac } from "./dom.js";


/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/
/*
Citation: I had trouble with the animation only playing once. Googled for a solution and the AI overview suggested setting offsetWidth would fix it, then found this explanation on stackoverflow: https://stackoverflow.com/questions/60686489/what-purpose-does-void-element-offsetwidth-serve
*/
/**
 * @description handles the animation for shopping cart updates (credits in CSS file)
 * @param {Array} cartArr array of cart items
 */
export function cartAnimation(cartArr) {

  const cartFill = cartArr.reduce((sum, element) => sum + element.quantity, 0);
  const cartBadge = $qs("#cart-badge");
  cartBadge.textContent = cartFill;
  if (cartFill > 0) {
    cartBadge.classList.remove("invisible");
    cartBadge.classList.add("visible");
  } else {
    cartBadge.classList.add("invisible");
    cartBadge.classList.remove("visible");
  }
  cartBadge.classList.remove("bounce-top");
  // force recalculation to make this actually work
  cartBadge.offsetWidth;
  cartBadge.classList.add("bounce-top");
}