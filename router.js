/*---------- ID HEADER ---------------------------------------------------------
/  Author(s):   Andrew Boisvert
/  Email(s):    abois526@mtroyal.ca 
/  File Name:   router.js
/  Description:
/    This module implements the router for the SPA which manages site navigation.
/-----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
/ SECTION: Module Imports
/-----------------------------------------------------------------------------*/
import { $qs, $qsa, $ce, $ac } from "./dom.js";
import * as render from "./rendering.js";


/*------------------------------------------------------------------------------
/ SECTION: Functions
/-----------------------------------------------------------------------------*/

/*
Notes and Citations: 
Wanted to state if you wondered about the logic for my router that I've based this on the logic that I used for a CLI app that I built as a personal project because I realized it was basically the same idea. For that, I was using function pointers in C that were stored in an array, so the number for the menu option would be provided by the user and that choice would be used to access array indices. For this, I set it up as a key-value pairing because it plays more nicely with the rest of the program and lets me access classes for each section more easily. While I wasn't using found code snippets, I did have to google a bit of syntax stuff such as "js pass value to function inside an object" to see how to pass values such as for the product function.

I found the closest() method by trying to google and find some method or attribute for event objects that would allow me to generalize my event delegation because I wanted to be able to click containers as if they were links for items such as my category cards. I looked up "set up event delegation for whole page finding values that match a dataset item" and came across it, so I read about it on MDN and determined this would probably work best for this case. I especially liked how I could access parents through bubbling, so I used it in some other spots after learning about it.
Link: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
*/
/**
 * @description handles all of the routing for the SPA 
 * @param {Array} productsArr array of product items
 * @param {Map} imageMap map of images with ID as key
 * @param {Array} cartArr array of cart objects
 * @param {Array} imagesArr array of placeholder images
 */
export function handleRouting(productsArr, imageMap, cartArr, imagesArr) {

    let currentId = null;

    const routes = {
        home: () => render.renderHomeView(productsArr, imageMap),
        mens: () => render.renderMensLandingView(productsArr, imageMap),
        womens: () => render.renderWomensLandingView(productsArr, imageMap),
        browse: () => render.renderBrowseView(productsArr, imageMap),
        product: (product) => render.renderSingleProductView(product, imageMap, productsArr),
        cart: () => render.renderCartView(productsArr, imageMap, cartArr),
        about: () => render.renderAboutUsView(imagesArr)
    };

    document.addEventListener("click", (e) => {
        const link = e.target.closest("[data-route]");
        if(link) {
            if(link.dataset.productId) {
                currentId = link.dataset.productId;
            }
            navigate(link.dataset.route);
        } 
    });

    function navigate(route) {
        if(route !== "about") {
            // hide all pages
            const pages = $qsa(".spa-page");
            pages.forEach(element => {
                element.classList.add("hidden");
            });
        }
        let product = null;
        if(route === "product") {
            product = productsArr.find((e) => e.id === currentId);
        }

        // show current page
        $qs(`#${route}-view`).classList.remove("hidden");

        // render page for specified route
        routes[route](product);
    }
}