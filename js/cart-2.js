document.addEventListener("DOMContentLoaded", function () {
    // Initial update
    updateCartCount();

    // Event listener to handle adding items to the cart when the "Add to Cart" button is clicked
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productElement = this.parentElement.parentElement.parentElement; // Adjusted the path to reach the product element
            const productName = productElement.getAttribute("data-product");
            addToCart(productName);
        });
    });
});

// Function to get the cart data from localStorage
function getCartFromStorage() {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
}

// Function to update the cart count in the header
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-amount");
    if (cartCountElement) {
        const cart = getCartFromStorage();
        cartCountElement.textContent = cart.length;
    }
}

// Function to save the cart data to localStorage
function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to handle adding items to the cart
let cart = getCartFromStorage();

function addToCart(product) {
    const productElement = document.querySelector(`[data-product="${product}"]`);

    // Check if the product element is found
    if (productElement) {
        const productId = productElement.id;
        const productName = productElement.querySelector("h2").textContent.trim();
        const productImage = productElement.querySelector(".image img").src;
        const productPrice = parseFloat(productElement.querySelector(".product-cta h3").textContent.replace("$", ""));
        const productQuantity = 1;

        cart.push({ id: productId, name: productName, image: productImage, quantity: productQuantity, price: productPrice });
        saveCartToStorage();
        updateCartCount();
    } else {
        console.error(`Product element with data-product="${product}" not found.`);
    }
}
