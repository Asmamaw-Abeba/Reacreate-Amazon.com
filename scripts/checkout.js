import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderpaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import {loadCart } from "../data/cart.js";
//import '../data/cart-class.js';
//import '../data/backend-practice.js';


// Async Await Example for waiting
async function loadPage() {

  await loadProductsFetch(); // wait to finish

  await new Promise((resolve) => { 
    loadCart(() => {
      resolve();
    });
  });

  renderOrderSummary();
  renderpaymentSummary();

}
loadPage();


// // use  promise for waiting
// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => { 
//     loadCart(() => {
//       resolve();
//     });
//   })

// ]).then((values) => {
//   console.log(values);
//   renderOrderSummary();
//   renderpaymentSummary();
// });



/*
loadProducts(() => {
  renderOrderSummary();
  renderpaymentSummary();
});
*/


