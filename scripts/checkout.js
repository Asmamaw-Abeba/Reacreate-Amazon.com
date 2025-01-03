import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderpaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import {loadCart } from "../data/cart.js";
//import '../data/cart-class.js';
//import '../data/backend-practice.js';


// Async Await Example for waiting
async function loadPage() {
  try{ // error handling in async await
    // throw 'error1'; // manually create an error
    await loadProductsFetch(); // wait to finish

    await new Promise((resolve) => { 
      loadCart(() => {
        resolve();
      });
    });

  } catch(error) { // error handling in async await
    console.log('unexpected error, please try again.');
  }

  renderOrderSummary();
  renderpaymentSummary();

}
loadPage();



