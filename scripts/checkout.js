import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderpaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
//import '../data/cart-class.js';
//import '../data/backend-practice.js';


// Async Await Example
async function loadPage() {
  console.log('load page');
}
loadPage().then(() => {
  console.log('next step');
})

// use  promise for waiting
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => { 
    loadCart(() => {
      resolve();
    });
  })

]).then((values) => {
  console.log(values);
  renderOrderSummary();
  renderpaymentSummary();
});


// new Promise((resolve) => { 
//   loadProducts(() => {
//     resolve();
//   });
// }).then(() => {
//   renderOrderSummary();
//   renderpaymentSummary();
// });

/*
loadProducts(() => {
  renderOrderSummary();
  renderpaymentSummary();
});
*/


