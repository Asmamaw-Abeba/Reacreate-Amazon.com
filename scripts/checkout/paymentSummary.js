import { cart } from "../../data/cart.js";
import { getProductDetail } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { formatCurrency } from "../utils/moneny.js";
import { addOrder } from "../../data/orders.js";


export function renderpaymentSummary () {
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

  const paymentSummartyHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;
  
  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummartyHTML;

  // Here for place order button
  document.querySelector('.js-place-order')
   .addEventListener('click', async() => {
    try {
      const response = await fetch('https:supersimplebackend.dev/orders', { // make a request to the backend
        method: 'POST', // request method
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          cart: cart
        })
       });
  
       const order = await response.json();
       addOrder(order); // add response to an orders array to manipulate it

    } catch (error) {
      console.log('unexpected error, please try again.');
    }
     
    window.location.href = 'orders.html'; // change the url to orders.html page
    //console.log(totalCents);

   });
}


  
  