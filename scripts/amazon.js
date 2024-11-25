import {products, loadProductsFetch} from '../data/products.js';
import {cart, addToCart} from '../data/cart.js';
import { formatCurrency } from './utils/moneny.js';



loadProductsFetch();

export function renderProductsGrid() {
    let productHTML = '';

    products.forEach((product) => {
			productHTML += `
				<div class="product-container">
					<div class="product-image-container">
						<img class="product-image"
						src="${product.image}">
					</div>

					<div class="product-name limit-text-to-2-lines">
						${product.name}
					</div>

					<div class="product-rating-container">
						<img class="product-rating-stars"
						src="${product.getStarUrl()}">
						<div class="product-rating-count link-primary">
							${product.rating.count}
						</div>
					</div>

					<div class="product-price">
						${product.getPrice()}
					</div>

					<div class="product-quantity-container">
						<select>
						<option selected value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
						</select>
					</div>

			
					${product.extraInfoHTML()}

					<div class="product-spacer"></div>

					<div class="added-to-cart" data-product-id = "${product.id}">
						
					</div>

					<button class="add-to-cart-button button-primary
					js-add-to-cart"
					data-product-id = "${product.id}">
						Add to Cart
					</button>
				</div>
			`;
	});

	const addFeadback = `
		<img src="images/icons/checkmark.png">
		Added
	`;


	//console.log(productHTML);
	document.querySelector('.js-products-grid').innerHTML = productHTML;

	function updateCartQuantity() {
			let cartQuantity = 0;
			cart.forEach((cartItem) => {
					cartQuantity += cartItem.quantity;
			});
			document.querySelector('.js-cart-quantity')
			.innerHTML = cartQuantity; 
	}
	updateCartQuantity();

	document.querySelectorAll('.js-add-to-cart')
	.forEach((button) => {
	button.addEventListener('click', () => {
			const productId = button.dataset.productId;
			addToCart(productId);
			updateCartQuantity();
			//diplayCartQuantity();
	});
	});


	// Display feadback whe added items
	document.querySelectorAll('.js-add-to-cart').forEach((button) => {
		button.addEventListener('click', () => {
			const productId1 = button.dataset.productId;
      document.querySelectorAll('.added-to-cart').forEach((button) => {
				  const productId2 = button.dataset.productId;
					if (productId2 === productId1) {
						button.innerHTML = addFeadback;
					}
			  });
			 setTimeout(() => {
				document.querySelectorAll('.added-to-cart').forEach((button) => {
				  const productId2 = button.dataset.productId;
					if (productId2 === productId1) {
						button.innerHTML = '';
					}
			  });
			}, 3000); 
  });	
	});	

}