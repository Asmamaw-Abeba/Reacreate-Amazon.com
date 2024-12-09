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
	let gridElement = document.querySelector('.js-products-grid');
	if (gridElement) {
		gridElement.innerHTML = productHTML;
	}
	//document.querySelector('.js-products-grid').innerHTML = productHTML;

	function updateCartQuantity() {
		let cartQuantity = 0;
		cart.forEach((cartItem) => {
				cartQuantity += cartItem.quantity;
		});
		let cartElement = document.querySelector('.js-cart-quantity');
		if (cartElement) {
			cartElement.innerHTML = cartQuantity; 
		}
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


// search products from home page or filtering products instead of finding manually

async function filterProducts(searchValue) {
  let productsGrid = document.querySelectorAll('.product-container');
  productsGrid = Array.from(productsGrid); // Convert NodeList to an array
  let productsFound = false;

  productsGrid.forEach(product => {
    const productName = product.querySelector('.product-name').textContent.toLowerCase();
    if (productName.includes(searchValue.toLowerCase())) {
      product.style.display = 'block';
      productsFound = true;
      // console.log('found');
    } else {
      product.style.display = 'none';
    }
  });

  const noResultsMessage = document.getElementById('no-results-message');

  if (!productsFound) {
    // If no products match the search, display a message to the user
    if (!noResultsMessage) {
      const newNoResultsMessage = document.createElement('div');
      newNoResultsMessage.textContent = 'No products found.';
      newNoResultsMessage.id = 'no-results-message';
      document.querySelector('.js-products-grid').appendChild(newNoResultsMessage);
    }
  } else {
    // Remove the message if products are found
    if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href);
  const searchValue = url.searchParams.get('search');

	const searchInput = document.querySelector('.search-bar');
  // Check if searchInput exists before setting its value
  if (searchInput) {
    searchInput.value = searchValue !== null ? searchValue : '';
  }

  // Filter products on search input change
	if (searchInput) {
		searchInput.addEventListener('input', () => {
			const searchValue = searchInput.value.trim();//The .trim() method in JavaScript is used to remove whitespace from both ends of a string.
			filterProducts(searchValue);
			//window.history.pushState({ search: searchValue }, '', `index.html?search=${searchValue}`);
		});
	}
  


  // Set the search input value
  //document.querySelector('.search-bar').value = searchValue || '';

  // Filter products on search button click
 let searchButton = document.querySelector('.search-button');
 if (searchButton) {
	searchButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchValue = document.querySelector('.search-bar').value;
    filterProducts(searchValue);

    window.history.pushState({ search: searchValue }, '', `index.html?search=${searchValue}`);
  }); 
 }
 


  // Initial filter based on the search query parameter
  if (searchValue) {
    filterProducts(searchValue);
  }

  // Scroll to the first visible product
  const products = document.querySelectorAll('.product-container');

  let firstVisibleProduct = null;
  products.forEach(product => {
    if (window.getComputedStyle(product).display !== 'none') {
      firstVisibleProduct = product;
      return;
    }
  });

  if (firstVisibleProduct) {
    console.log(firstVisibleProduct);
    firstVisibleProduct.scrollIntoView({ behavior: "smooth", block: "start" });
  } 
});


	

