let cartCarD = document.getElementById('cart-card')
let emptyCart = document.getElementById('empty-cart-alert')

if (items == 0) {
    cartCarD.classList.add('d-none')
}
else {
    emptyCart.classList.add('d-none')
}