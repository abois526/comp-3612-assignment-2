/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   dom.js
/  Description:
/    This module provides some helper functions for working with the DOM.
/-----------------------------------------------------------------------------*/

/**
 * @description helper function for querySelector()
 * @param {String} selector one or more CSS selectors
 * @param {String} parent (optional) the parent node of the selection, which is document by default
 * @returns {HTMLElement} the element that matches the selector(s)
 * @example const el = ${".header-nav ul"};
 */
export function $qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * @description helper function for querySelectorAll()
 * @param {String} selectors one or more CSS selectors
 * @param {String} parent (optional) the parent node of the selection, which is document by default
 * @returns {NodeList} list of elements that match the selector(s)
 * @example const allCards = $$(".cards");
 */
export function $qsa(selectors, parent = document) {
  return parent.querySelectorAll(selectors);
}

/**
 * @description helper function for createElement()
 * @param {String} element the element to be created
 * @returns the element that was created
 * @example const divEl = $ca("div");
 */
export function $ce(element) {
  return document.createElement(element);
}

/**
 * @description Helper function for appendChild()
 * @param {String} child the child element to be appended
 * @param {String} parent the parent element the child will be appended to
 * @returns the child element that was appended
 * @example const child = $ac(li, ul);
 * @example $ac($ce("li"), $qs("#itemList")).textContent = "list item e.g.";
 */
export function $ac(child, parent) {
  return parent.appendChild(child);
}