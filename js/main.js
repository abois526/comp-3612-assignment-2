/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   main.js
/  Description:
/    This website is a Single Page Application (SPA) and all of the various views
/    will be filled using DOM manipulation and set visible/hidden through the
/    script. The data for the SPA is fetched from an API and stored within 
/    localstorage after being parsed and turned into a string version of the 
/    array. 
/    
/  Modules Overview:
/    animations.js - handles animations for actions
/    dom.js - DOM manipulation helper functions
/    rendering.js - rendering of content for different page views
/    router.js - logic for routing all site navigation
/    shoppingCart.js - handles shopping cart functionality
/    storageAndApi.js - handles all API and localstorage functionality
/-----------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------
/ SECTION: Module Imports
/-----------------------------------------------------------------------------*/
import { $qs, $qsa, $ce, $ac } from "./dom.js";
import * as data from "./storageAndApi.js";
import * as router from "./router.js";
import * as render from "./rendering.js";
import * as cart from "./shoppingCart.js";
import * as anim from "./animations.js";


/*------------------------------------------------------------------------------
/ SECTION: Main Code Section
/-----------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {

  // populate productsArr from localstorage if exists; if not then fetch from API, store data, and retrieve it to populate productsArr
  const productsApiUrl = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";
  const productsKey = "productsData";
  let productsArr = data.retrieveStorage(productsKey);
  if (productsArr.length === 0) {
    productsArr = await data.fetchStoreAndRetrieveData(productsApiUrl, productsKey);
  }

  // populate shopping cart from local storage if it exists, or create empty array 
  const cartArr = data.retrieveStorage("shoppingCart");
  if (cartArr.length !== 0) {
    anim.cartAnimation(cartArr);
  }

  // populate imagesArr from localstorage if exists; if not, then fetch from API, store data, retrieve it, and populate the array, then create a hashmap with the id as the key
  const imagesApiUrl = "https://picsum.photos/v2/list?page=9&limit=100";
  const imagesKey = "imagesData";
  let imagesArr = data.retrieveStorage(imagesKey);
  if (imagesArr.length === 0) {
    imagesArr = await data.fetchStoreAndRetrieveData(imagesApiUrl, imagesKey);
  }
  prepImagesArray(imagesArr, productsArr);
  const imageMap = mapImagesById(imagesArr);
  data.updateStorage(imagesKey, imagesArr);


  console.log(cartArr);
  console.log(imageMap.get(imagesArr));
  console.log(imageMap.get(productsArr[0].id));

  // fill copywrite section
  fillCopywriteDate();
  
  $qs("#home-view").classList.remove("hidden");
  render.renderHomeView(productsArr, imageMap);

  // start the router up 
  router.handleRouting(productsArr, imageMap, cartArr, imagesArr);

  // get cart working
  cart.enableCartFunctionality(productsArr, imageMap, cartArr);


});


/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/
/** 
 * @description Gets the current year and fills the time tag in the copywrite section
 */
function fillCopywriteDate() {
  const date = new Date();
  $qs("#copywrite-text date").textContent = date.getFullYear().toString();
}


/**
 * @description Preps the images array for use by modifying sizes and object attributes
 * @param {Array} imagesArr array of all images
 * @param {Array} productsArr array of product data
 */
function prepImagesArray(imagesArr, productsArr) {
  for(let i = 0; i < 100; i++){
    imagesArr[i].id = productsArr[i].id;
    let subStr = imagesArr[i].download_url.slice(0, 29);
    imagesArr[i].width = 1000;
    imagesArr[i].height = 1200;
    imagesArr[i].download_url = subStr + imagesArr[i].width + "/" + imagesArr[i].height;
  }
}

/**
 * @description Creates a map of images to assist with matching the img src's url to the correct product by product id
 * @param {Array} imagesArr array of all images
 * @returns {Map} map of images with id as the key and url as value 
 */
function mapImagesById(imagesArr) {
  const map = new Map();
  for(let i of imagesArr) {
    map.set(i.id, i.download_url);
  }
  return map;
}