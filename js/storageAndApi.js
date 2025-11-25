/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   storageAndApi.js
/  Description:
/    This module provides functions to retrieve, update, and remove data in
/    localstorage. It also provides a function to retrieve data from a web API 
/    before storing it in localstorage for future use when revisiting the site.
/-----------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/
/**
 * @description attempts to retrieve data from localstorage
 * @param {String} key a key for a localstorage item
 * @returns either whatever string is stored in localstorage for the key, or if it does not exist, then an empty array
 */
export function retrieveStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * @description updates storage with a revised collection
 * @param {String} key a key for a localstorage item
 * @param {Array} arr the array to be stored in localstorage as a string
 */
export function updateStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 * @description removes a collection from localstorage
 * @param {String} key a key for a localstorage item
 */
export function removeStorage(key) {
  localStorage.removeItem(key);
}

/**
 * @description uses async and await to safely retrieve the data from the API
 * and saves the data in localstorage to be retrieved when revisitng the site
 * @param {String} apiUrl the URL of the API that is being fetched
 * @param {String} key a key for the localstorage item
 * @returns {Array} the data that has been fetched from the API
 */
export async function fetchStoreAndRetrieveData(apiUrl, key) {
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");

  try {
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    loader.classList.add("hidden");
    updateStorage(key, data);
    return data;
  } catch (err) {
    console.error(`${resp.status} ${resp.statusText}`);
  }
  
}