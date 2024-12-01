import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { getProductDetail } from "../../data/products.js";

export function formatCurrency(priceCents) {
 return (Math.round(priceCents) / 100).toFixed(2);
}

