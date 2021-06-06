let cartitemsValue = sessionStorage.getItem("items")

if (cartitemsValue != 0) {
    document.getElementById('badge').innerHTML = cartitemsValue
}