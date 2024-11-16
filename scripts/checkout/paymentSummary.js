import { cart } from "../../data/cart.js";
import { getProductDetail } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { formatCurrency } from "../utils/moneny.js";


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

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
  
  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummartyHTML;
}


  
  