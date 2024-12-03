import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProductDetail} from '../../data/products.js';
import { formatCurrency} from '../utils/moneny.js';
//import { removeFromCart} from '../data/cart.js';

/*
  the bleow syntax is called default export we can use it only want to 
  export one thing from that file
  e.g export default dayjs;
*/
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryoptions.js';
import { renderpaymentSummary } from './paymentSummary.js';


//  const today = dayjs();
//  const deliveryDate = today.add(7, 'days');
//  console.log(deliveryDate.format('dddd, MMMM D'));
 
  export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
      //getting product details
      const matchingProduct = getProductDetail(productId);
      // To check the existance
      if (!matchingProduct || !matchingProduct.id) {
          console.error('Matching product or ID is undefined:', matchingProduct);
          return; // Exit the loop if there's an issue
        }

      const deliveyOptionId = cartItem.deliveryOptionId;

      const deliveryOption = getDeliveryOption(deliveyOptionId);

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDate, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      cartSummaryHTML += `
      
        <div class="cart-item-container
          js-cart-item-container
          js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
              <img class="product-image"
              src="${matchingProduct.image}">

              <div class="cart-item-details">
              <div class="product-name">
                  ${matchingProduct.name}
              </div>
              <div class="product-price">
                  ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity
              js-product-quantity-${matchingProduct.id}">
                  <span>
                  Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                  Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link
                  js-delete-link-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}">
                  Delete
                  </span>
              </div>
              </div>

              <div class="delivery-options">
              <div class="delivery-options-title">
                  Choose a delivery option:
              </div>
          
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>   
      `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
      let deliveryHTML = '';
      
      deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDate, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        const  priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `${formatCurrency(deliveryOption.priceCents)} -`;

        let isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        // if (deliveryoption.id === cartItem.deliveryOptionId) {
        //   isChecked = true;
        // } else {
        //   isChecked = false;
        // }

        deliveryHTML += ` 
          <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                  ${dateString}
              </div>
              <div class="delivery-option-price">
                  ${priceString} Shipping
              </div>
            </div>
          </div>
        `
      });
      return deliveryHTML;
    }


  // update the available quantity in checkout page
   function diplayCartQuantity() {
      let cartQuantity = 0;
      cart.forEach((cartItem) => {
          cartQuantity += cartItem.quantity;
      });
      document.querySelector('.return-to-home-link')
      .innerHTML = cartQuantity + ' items'; 
    }
    diplayCartQuantity();


    document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

    // deleting controller
    document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      diplayCartQuantity();

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      
      // regenerate all html payment summary by using MVC
      renderpaymentSummary();
      });
    });

      // updating delivery option
    document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary(); //to refresh a page automatically and show result after updated.
        renderpaymentSummary(); // to refresh the payment section authomatically
      });
    } );
  } 
  
  
 

