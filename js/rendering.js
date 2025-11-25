/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   rendering.js
/  Description:
/    This module provides functions to render content for the SPA. 
/-----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
/ SECTION: Module Imports
/-----------------------------------------------------------------------------*/
import { $qs, $qsa, $ce, $ac } from "./dom.js";


/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/
/**
 * @description renders the home view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
*/
export function renderHomeView(productsArr, imageMap) {
  // adjust page title
  $qs("title").textContent = "Closet Collection: Clothing, Shoes and Accessories for Men and Women";

  // sort out actual logic later
  const featuredArr = [];
  for (let i = 0; i < productsArr.length; i += 10) {
    featuredArr.push(productsArr[i]);
  }

  const featuredProducts = $qs("#featured-products-cards");
  removeAllChildren(featuredProducts);
  renderProductCards(featuredArr, imageMap, featuredProducts);


}




/**
 * @description renders the Men's landing page view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
*/
export function renderMensLandingView(productsArr, imageMap) {
  // adjust page title
  $qs("title").textContent = "Men's | Closet Collection";
  // create array of alphabetical categories w/o duplicates
  const mens = productsArr.filter(p => p.gender === "mens");
  const unique = mens.map(p => p.category);
  unique.sort();
  for (let i = 0; i < unique.length - 1; i++) {
    if (unique[i] === unique[i + 1]) {
      unique.splice(i + 1, 1);
      i -= 1;
    }
  }

  const categoryCards = $qs("#mens-category-cards");
  removeAllChildren(categoryCards);
  for (let category of unique) {
    renderCategoryCard(category, productsArr, imageMap, categoryCards, "mens");
  }
}


/**
 * @description renders the Women's landing page view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
*/
export function renderWomensLandingView(productsArr, imageMap) {
  // adjust page title
  $qs("title").textContent = "Women's | Closet Collection";
  // create array of alphabetical categories w/o duplicates
  const womens = productsArr.filter(p => p.gender === "womens");
  const unique = womens.map(p => p.category);
  unique.sort();
  for (let i = 0; i < unique.length - 1; i++) {
    if (unique[i] === unique[i + 1]) {
      unique.splice(i + 1, 1);
      i -= 1;
    }
  }

  const categoryCards = $qs("#womens-category-cards");
  removeAllChildren(categoryCards);
  for (let category of unique) {
    renderCategoryCard(category, productsArr, imageMap, categoryCards, "womens");
  }
}


/**
 * @description renders the browse view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
 */
export function renderBrowseView(productsArr, imageMap) {
  // adjust page title
  $qs("title").textContent = "Browse | Closet Collection";

  // render all color filters
  renderColorFilterLabels();

  const numMatches = $qs("#browse-num-matches");
  const removeFilterBtns = $qs("#remove-filter-btns");
  const browseList = $qs("#browse-product-list");
  const sortingOptions = $qs("#sorting-options");
  const filters = $qs("#filters");

  let currentList = [...productsArr];

  // initial setup
  updateNumMatches(productsArr);
  applyFilters();

  // as filters/sorting is set
  filters.addEventListener("change", applyFilters);
  sortingOptions.addEventListener("change", prepListForRender);

  

  function updateNumMatches(arr) {
    if (arr.length > 0) {
      numMatches.textContent = `${arr.length} Items`;
    } else {
      numMatches.textContent = "No Items Found";
    }
  }

  function prepListForRender() {
    const sortedList = [...currentList];
    if(sortingOptions.value === "product") {
      sortProductsAlphabetically(sortedList);
    }
    if(sortingOptions.value === "price") {
      sortProductsByPrice(sortedList);
    }
    if(sortingOptions.value === "category") {
      sortProductsByCategory(sortedList);
    }
    removeAllChildren(browseList);
    renderProductCards(sortedList, imageMap, browseList);
  }

  function applyFilters() {

    const genderFilters = [];
    const categoryFilters = [];
    const sizeFilters = [];
    const colorFilters = [];

    // convert node lists to arrays
    $qsa("[name='gender']:checked", filters).forEach(element => {
      genderFilters.push(element.value);
    });
    $qsa("[name='category']:checked", filters).forEach(element => {
      categoryFilters.push(element.value);
    });
    $qsa("[name='size']:checked", filters).forEach(element => {
      sizeFilters.push(element.value);
    });
    $qsa("[name='color']:checked", filters).forEach(element => {
      colorFilters.push(element.value);
    });

    currentList = productsArr.filter(e => {

      if (genderFilters.length > 0 && !(genderFilters.includes(e.gender))) {
        return false;
      }

      if (categoryFilters.length > 0 && !(categoryFilters.includes(e.category))) {
        return false;
      }

      if (sizeFilters.length > 0) {
        let sizeMatch = false;
        for (let size of e.sizes) {
          if (sizeFilters.includes(size)) {
            sizeMatch = true;
            break;
          }
        }
        if (!sizeMatch) {
          return false;
        }
      }

      if (colorFilters.length > 0) {
        let colorMatch = false;
        for (let color of e.color) {
          if (colorFilters.includes(color.name)) {
            colorMatch = true;
            break;
          }
        }
        if (!colorMatch) {
          return false;
        }
      }

      return true;

    });

    updateNumMatches(currentList);
    prepListForRender();

  }

  /**
   * @description renders the labels for the color filters in the browse view
   */
  function renderColorFilterLabels() {
    const colors = extractColors();
    const colorsFieldset = $qs("#color-filter-labels");
    const labelTmp = $qs("#filter-color-label-tmp");
    removeAllChildren(colorsFieldset);

    for (let c of colors) {
      const clone = labelTmp.content.cloneNode(true);
      const input = $qs("input", clone);
      const div = $qs("div", clone);
      const span = $qs("span", clone);
      input.value = c.name;
      div.style.backgroundColor = c.hex;
      span.textContent = c.name;
      $ac(clone, colorsFieldset);
    }

    /**
     * @description extracts colors from products, sorts, and removes duplicates
     * @returns {Array} array of sorted product colors with duplicates removed
     */
    function extractColors() {
      // get array of color objects
      const colors = productsArr.flatMap(p => p.color);
      // sort by name
      sortProductsAlphabetically(colors);
      // remove duplicates
      for (let i = 0; i < colors.length - 1; i++) {
        if (colors[i].name === colors[i + 1].name) {
          colors.splice(i + 1, 1);
          i -= 1;
        }
      }
      return colors;
    }
  }

}

export function enableBrowseFilters(productsArr, imageMap, cartArr) {
  const form = document.querySelector("#filters");

  form.addEventListener("change", applyFilters);
  applyFilters(); // initial render

  function applyFilters() {
    const genders = [...form.querySelectorAll("input[name='gender']:checked")].map(i => i.value);
    const cats = [...form.querySelectorAll("input[name='category']:checked")].map(i => i.value);
    const sizes = [...form.querySelectorAll("input[name='size']:checked")].map(i => i.value.toLowerCase());
    const colors = [...form.querySelectorAll("input[name='color']:checked")].map(i => i.value);

    const filtered = productsArr.filter(p => {
      if (genders.length && !genders.includes(p.gender)) return false;
      if (cats.length && !cats.includes(p.category.toLowerCase())) return false;
      if (sizes.length && !p.sizes.some(s => sizes.includes(s.toLowerCase()))) return false;
      if (colors.length && !p.color.some(c => colors.includes(c.name))) return false;
      return true;
    });

    render.renderBrowseView(filtered, imageMap, cartArr);
  }
}



/**
 * @description renders the single product view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
*/
export function renderSingleProductView(product, imageMap, productsArr) {
  // adjust page title
  const itemName = product.name;
  const gender = product.gender;
  const genderFormatted = gender[0].toUpperCase() + gender.slice(0).substring(1, gender.length - 1);
  $qs("title").textContent = `${itemName} for ${genderFormatted} | Closet Collection`;


  // render breadcrumb
  const genderCrumb = $qs("#gender-crumb");
  const categoryCrumb = $qs("#category-crumb");
  const titleCrumb = $qs("#title-crumb");
  genderCrumb.textContent = genderFormatted;
  categoryCrumb.textContent = product.category;
  titleCrumb.textContent = itemName;

  // render product details and form
  const spvTitle = $qs("#spv-product-title");
  const spvPrice = $qs("#spv-product-price");
  const spvDesc = $qs("#spv-product-description");
  const spvMaterial = $qs("#spv-product-material");
  const spvSizes = $qs("#spv-product-sizes");
  const spvColor = $qs("#spv-product-color");
  const spvImage = $qsa("#spv-image");
  const spvAddToCart = $qs("#spv-add-to-cart");
  spvTitle.textContent = product.name;
  spvPrice.textContent = `$${product.price.toFixed(2)}`;
  spvDesc.textContent = product.description;
  spvMaterial.textContent = product.material;
  removeAllChildren(spvSizes);
  renderSizesSpan(product.sizes, spvSizes);
  spvColor.style.backgroundColor = product.color[0].hex;
  spvAddToCart.dataset.productId = product.id;

  for (let img of spvImage) {
    img.setAttribute("src", imageMap.get(product.id));
  }

  // render related products
  const relatedProducts = productsArr.filter((e) => {
    return e.category === product.category;
  });
  console.log(relatedProducts);
  const relatedProductsCardRow = $qs("#related-products-card-row");
  removeAllChildren(relatedProductsCardRow);
  for (let i = 0; i < 4; i++) {
    let li = $ce("li");
    $ac(li, relatedProductsCardRow);
    renderSingleProductCard(relatedProducts[i], imageMap.get(relatedProducts[i].id), li);
  }

}


/**
 * @description renders the cart view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
 */
export function renderCartView(productsArr, imageMap, cartArr) {
  // adjust page title
  $qs("title").textContent = "Shopping Cart | Closet Collection";

  const header = $qs("#cart-header");
  const itemsList = $qs("#cart-items-list");
  const itemLiTmp = $qs("#cart-list-item-tmp");
  const shippingInfo = $qs("#cart-shipping-info");
  const orderSummary = $qs("#cart-order-summary");

  if (cartArr.length === 0) {
    header.textContent = "Looks like your cart is currently empty";
    itemsList.classList.add("hidden");
    shippingInfo.classList.add("hidden");
    orderSummary.classList.add("hidden");
  } else {
    itemsList.classList.remove("hidden");
    shippingInfo.classList.remove("hidden");
    orderSummary.classList.remove("hidden");

    let merchValue = 0;
    let shippingValue = 0;
    let taxValue = 0;
    let totalValue = 0;

    const cartFill = cartArr.reduce((prev, e) => prev + e.quantity, 0);

    header.textContent = `Your Cart (${cartFill})`;

    removeAllChildren(itemsList);
    for (let item of cartArr) {
      const clone = itemLiTmp.content.cloneNode(true);
      const cartListLi = $qs("#cart-list-li", clone);
      cartListLi.dataset.productId = item.id;
      cartListLi.dataset.productSize = item.size;
      const itemName = $qs("#cart-item-name", clone);
      const itemImg = $qs("#cart-item-img", clone);
      const itemSubtotal = $qs("#cart-item-subtotal", clone);
      const itemInfo = $qs("#cart-item-info", clone);
      const itemPrice = $qs("#cart-item-price", clone);
      const itemQuantity = $qs("#cart-item-quantity", clone);
      itemName.textContent = item.name;
      itemImg.setAttribute("src", imageMap.get(item.id));
      itemSubtotal.textContent = `$${(item.quantity * item.price).toFixed(2)}`;
      itemInfo.textContent = `#${item.id} / ${item.colorName} / ${item.size}`;
      itemPrice.textContent = `$${item.price}`;
      itemQuantity.textContent = `QTY: ${item.quantity}`;
      $ac(clone, itemsList);

      merchValue += parseFloat(item.price * item.quantity);
    }


    const merchValueEl = $qs("#merch-value");
    const shippingValueEl = $qs("#shipping-value");
    const taxValueEl = $qs("#tax-value");
    const totalValueEl = $qs("#total-value");



    const shippingMethod = $qs("#shipping-method");
    const shippingDestination = $qs("#shipping-destination");

    updateShippingCost();
    shippingMethod.addEventListener("change", updateShippingCost);
    shippingDestination.addEventListener("change", updateShippingCost);

    function updateShippingCost() {
      const shippingCosts = {
        "Standard": {
          "Canada": 10,
          "United States": 15,
          "International": 20
        },
        "Express": {
          "Canada": 25,
          "United States": 25,
          "International": 30
        },
        "Priority": {
          "Canada": 35,
          "United States": 50,
          "International": 50
        }
      };
      merchValueEl.textContent = `$${merchValue.toFixed(2)}`;
      const methodVal = shippingMethod.value;
      const destinationVal = shippingDestination.value;
      if (merchValue > 500) {
        shippingValue = 0;
      } else {
        shippingValue = shippingCosts[methodVal][destinationVal];
      }
      shippingValueEl.textContent = `$${shippingValue.toFixed(2)}`;
      if (destinationVal === "Canada") {
        const taxRate = 0.05;
        taxValue = ((merchValue + shippingValue) * taxRate);
      } else {
        taxValue = 0;
      }
      taxValueEl.textContent = `$${taxValue.toFixed(2)}`;
      totalValue = (merchValue + shippingValue + taxValue);
      totalValueEl.textContent = `$${totalValue.toFixed(2)}`;

    }


  }

}


/**
 * @description renders the about us view and contains helper functions to assist
 * @param {Array} productsArr the array populated from JSON data containing product info
 */
export function renderAboutUsView(imagesArr) {
  const dialog = $qs("#about-view");
  const closeBtn = $qs("#close-btn");

  dialog.showModal();

  closeBtn.addEventListener("click", () => {
    dialog.close();
  });

  giveCreditWhereCreditIsDue(imagesArr);

  function giveCreditWhereCreditIsDue(imagesArr) {
    const attributions = $qs("#modal-attributions");
    for (let i of imagesArr) {
      const span = $ce("span");
      span.classList.add("block");
      span.classList.add("space-y-2");
      const p = $ce("p");
      p.classList.add("ml-4");
      const a = $ce("a");
      a.classList.add("text-cerulian");
      p.textContent = `${i.author} - `;
      a.setAttribute("href", i.url);
      a.textContent = "Link to Photo";
      $ac(a, p);
      $ac(p, span);
      $ac(span, attributions);
    }
  }

}


// MISC Rendering and helpers (from templates and stuff)

/**
 * @description renders multiple product cards, populated with the info contained in the objects in the array
 * @param {Array} productsArr array containing product items
 * @param {Map} imageMap map containing product images
 * @param {Node} parent the parent element each card will be appended to
 */
function renderProductCards(productsArr, imageMap, parent) {
  removeAllChildren(parent);
  for (let i = 0; i < productsArr.length; i++) {
    renderSingleProductCard(productsArr[i], imageMap.get(productsArr[i].id), parent);
  }
}

/**
 * @description renders a signle product card, populated with the info of a product
 * @param {Object} item the product item the card will be populated with
 * @param {Object} image the product image the card will be populated with
 * @param {Node} parent the parent element the product card will be appended to
 */
function renderSingleProductCard(item, image, parent) {
  const productCardTmp = $qs("#product-card-tmp");
  const clone = productCardTmp.content.cloneNode(true);
  const title = $qs("#product-card-title", clone);
  const desc = $qs("#product-card-description", clone);
  const color = $qs("#product-card-color", clone);
  const sizes = $qs("#product-card-sizes", clone);
  const price = $qs("#product-card-price", clone);
  const cardImage = $qs("#product-card-img", clone);
  const imgContainer = $qs("#img-container", clone);
  const btn = $qs("button", clone);

  title.textContent = item.name;

  desc.textContent = item.description;

  color.style.backgroundColor = item.color[0].hex;

  renderSizesSpan(item.sizes, sizes);

  price.textContent = `$${item.price.toFixed(2)}`;

  cardImage.setAttribute("src", image);

  imgContainer.setAttribute("data-product-id", item.id);
  btn.setAttribute("data-product-id", item.id);

  $ac(clone, parent);
}

/**
 * @description renders a single category card with info about the category
 * @param {String} category The category for the card
 * @param {Node} parent The node the card will be appended to
 */
function renderCategoryCard(category, productsArr, imageMap, parent, gender) {
  const categoryCardTmp = $qs("#category-card-tmp");
  const clone = categoryCardTmp.content.cloneNode(true);
  const span = $qs("#category-card-span", clone);
  const li = $ce("li");
  const categoryImg = $qs("#category-card-img", clone);
  const imgContainer = $qs("#img-container", clone);

  const match = productsArr.find(p => p.category === category);
  categoryImg.setAttribute("src", imageMap.get(match.id));

  span.textContent = category;

  imgContainer.setAttribute("data-category-gender", gender);
  imgContainer.setAttribute("data-category-type", category);

  $ac(clone, li);
  $ac(li, parent);

}

/**
 * @description renders a span full of the sizes of a given object
 * @param {Array} arr the array of sizes to fill the span
 * @param {Node} parent the parent element the span will be attached to
 */
function renderSizesSpan(arr, parent) {
  for (let a of arr) {
    const labelTmp = $qs("#product-card-size-label");
    const clone = labelTmp.content.cloneNode(true);
    const span = $qs("span", clone);
    const input = $qs("input", clone);
    span.textContent = a;
    input.value = a;
    $ac(clone, parent);
  }
}

/**
 * @description Sorts the array of products alphabetically (A-Z)
 * @param {Array} arr the array to be sorted
 */
function sortProductsAlphabetically(arr) {
  arr.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

/**
 * @description Sorts the array of products by price in ascending order
 * @param {Array} arr the array to be sorted
 */
function sortProductsByPrice(arr) {
  arr.sort((a, b) => {
    if (a.price < b.price) {
      return -1;
    }
    if (a.price > b.price) {
      return 1;
    }
    return 0;
  });
}

/**
 * @description Sorts the array of products by category (A-Z)
 * @param {Array} arr the array to be sorted
 */
function sortProductsByCategory(arr) {
  arr.sort((a, b) => {
    if (a.category < b.category) {
      return -1;
    }
    if (a.category > b.category) {
      return 1;
    }
    return 0;
  });
}

/**
 * @description removes all children from a parent node
 * @param {Node} parent the parent node which all children will be removed from 
 */
function removeAllChildren(parent) {
  while (parent.firstElementChild) {
    parent.removeChild(parent.firstChild);
  }
}
