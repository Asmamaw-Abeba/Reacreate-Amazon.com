import { addToCart, cart } from "../data/cart.js";
import { getDeliveryOption } from "../data/deliveryoptions.js";
import { orders, getOrderedProducts } from "../data/orders.js";
import { products, getProductDetail, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/moneny.js";

function totalOrderCent() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    // getting product details
    const matchingProduct = getProductDetail(productId);
    productPriceCents += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  
  const totalCents = totalBeforeTaxCents + taxCents;

  return totalCents;
}


async function loadOrderPage() {
  await loadProductsFetch();

  let orderHTML = '';
  orders.forEach((orderItem) => {

    let productsDetails = '';

    const products = getOrderedProducts();
    products.forEach(items => {
      const productId = items.productId;

      //getting product details
      const matchingProduct = getProductDetail(productId);
      // To check the existance
      if (!matchingProduct || !matchingProduct.id) {
          console.error('Matching product or ID is undefined:', matchingProduct);
          return; // Exit the loop if there's an issue
      }

      productsDetails += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: August 15
            </div>
            <div class="product-quantity">
              Quantity: ${items.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again" data-product-id ="${productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=123&productId=456">
              <button class="track-package-button button-secondary js-track-package">
                Track package
              </button>
            </a>
          </div>
        </div>
      `;
      
    });

    orderHTML += `
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>August 12</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(totalOrderCent())}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderItem.id}</div>
          </div>
        </div>

        ${productsDetails}
      `;  
  });

  document.querySelector('.order-container')
  .innerHTML = orderHTML;

  document.querySelectorAll('.js-buy-again')
  .forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    //console.log(button.dataset.productId);
    addToCart(productId);
    diplayCartQuantity();
    loadOrderPage();
 });
 });

}loadOrderPage();

// update the available quantity in order page
function diplayCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
  });
  document.querySelector('.cart-quantity')
  .innerHTML = cartQuantity; 
}
diplayCartQuantity();






