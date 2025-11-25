/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   shoppingCart.js
/  Description:
/    This module implements the shopping cart functionality for the site.
/-----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
/ SECTION: Module Imports
/-----------------------------------------------------------------------------*/
import { $qs, $qsa, $ce, $ac } from "./dom.js";
import * as data from "./storageAndApi.js";
import * as anim from "./animations.js";
import * as render from "./rendering.js";



/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/

export function enableCartFunctionality(productsArr, imageMap, cartArr) {

  function CartItem(id, name, gender, price, colorName, size, quantity, sales) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.price = price;
    this.colorName = colorName;
    this.size = size;
    this.quantity = quantity;
    this.sales = sales;
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-product-id]");
    if(btn) {
      const productId = btn.dataset.productId;
      const productCard = btn.closest("article");
      const productSize = productCard.querySelector("input[type='radio']:checked").value;
      console.log(productId);
      console.log(productSize);
      addToCart(e, productId, productSize);
      const product = productsArr.find((e) => e.id === productId);
      snackBarHandler(`${product.name} added to cart`);

      function addToCart(e, productId, productSize) {
        e.preventDefault();
        const match = productsArr.find((e) => e.id === productId);
        let cartItemIndex = cartArr.findIndex((e) => e.id === productId && e.size === productSize);
    
        console.log(match);
        console.log(cartItemIndex);
    
        if (cartItemIndex === -1) { // if item does not yet exist
          const item = new CartItem(match.id, match.name, match.gender, match.price, match.color[0].name, productSize, 1, match.sales);
          cartArr.push(item);
          anim.cartAnimation(cartArr);
        } else { // if item does exist in the cart
          const currItem = cartArr[cartItemIndex];
          currItem.quantity += 1;
        }
    
        data.updateStorage("shoppingCart", cartArr);
        anim.cartAnimation(cartArr);
        render.renderCartView(productsArr, imageMap, cartArr);
      }
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button#cart-remove-btn");
    if(btn) {
      const li = btn.closest("li");
      const productId = li.dataset.productId;
      const productSize = li.dataset.productSize;
      removeFromCart(productId, productSize);
      anim.cartAnimation(cartArr);

      function removeFromCart(productId, productSize) {
        let cartItemIndex = cartArr.findIndex((e) => e.id === productId && e.size === productSize);

        if(cartItemIndex !== -1) { // if item exists
          const item = cartArr[cartItemIndex];
          
          if(item.quantity > 1) {
            item.quantity -= 1;
          } else {
            cartArr.splice(cartItemIndex, 1);
          }

          data.updateStorage("shoppingCart", cartArr);
          render.renderCartView(productsArr, imageMap, cartArr);
        }
      }
    }
  });


  function snackBarHandler(message) {
    const bar = $qs("#snackbar");
    bar.classList.remove("hidden");
    bar.textContent = message;
    setTimeout(() => {
      bar.classList.add("hidden");
    }, 4000);
  }

}