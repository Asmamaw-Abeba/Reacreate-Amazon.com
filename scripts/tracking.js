import { cart } from "../data/cart.js";
import { getProductDetail, loadProductsFetch } from "../data/products.js";
import { returnOrderTime } from "./orders.js";
import { getDeliveryOption } from "../data/deliveryoptions.js";
/*
  the bleow syntax is called default export we can use it only want to 
  export one thing from that file
  e.g export default dayjs;
*/
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const url = new URL(window.location.href);

async function loadTrackingPage() {
  await loadProductsFetch();

  cart.forEach((cartItem) => {
    const productId = url.searchParams.get('productId');
    const quantity = url.searchParams.get('Quantity');
    //getting product details
    const matchingProduct = getProductDetail(productId);
    // To check the existance
    if (!matchingProduct || !matchingProduct.id) {
      console.error('Matching product or ID is undefined:', matchingProduct);
      return; // Exit the loop if there's an issue
    }
    
    const today = dayjs();

    if(cartItem.productId == productId) {

      const deliveyOptionId = cartItem.deliveryOptionId; 
      const deliveryOption = getDeliveryOption(deliveyOptionId);
      const deliveryDate = today.add(deliveryOption.deliveryDate, 'days');
      const dateString = dayjs(deliveryDate).format('dddd, MMMM D');
      
      //below is fo calculating on progress bar in percent 
      const currentTime = today.format('D');
      const order_time = dayjs(returnOrderTime()).format('D'); // Assuming orderTime() returns a valid date string
      const deliveryTime = dayjs(deliveryDate).format('D');

      const percent = (currentTime - order_time) / (deliveryTime - order_time) * 100;
      console.log(percent.toFixed(2) + '%');

      let trackHTML = '';
      trackHTML += `
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dateString}
        </div>

        <div class="product-info">
          ${matchingProduct.name}
        </div>

        <div class="product-info">
          Quantity: ${quantity}
        </div> 

        <img class="product-image" src="${matchingProduct.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${percent <= 49 ? `current-status` : ''}">
            Preparing
          </div>
          <div class="progress-label ${percent <= 99 && percent > 49 ? `current-status` : ''}">
            Shipped
          </div>
          <div class="progress-label ${percent >= 100 ? `current-status` : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar" style=" width:${percent == 0 ? '1%' : percent +'%'}"></div>
        </div>
      `;

      document.querySelector('.order-tracking').innerHTML = trackHTML;
    }
      
  });

} loadTrackingPage();

// update the available quantity in tracking  page
function diplayCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
  });
  document.querySelector('.cart-quantity')
  .innerHTML = cartQuantity; 
}
diplayCartQuantity();
