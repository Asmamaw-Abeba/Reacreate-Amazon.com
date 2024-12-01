export const orders = JSON.parse(localStorage.getItem('orders')) || [];
// console.log(orders);
export function addOrder(order) {
  orders.unshift(order); // use unshift to put resent order at the top of the array
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrderedProducts(params) {
  let products = undefined; 
  orders.forEach(orderItem => {
    products = orderItem.products;
  });
 return products;
}
//getOrderedProducts();