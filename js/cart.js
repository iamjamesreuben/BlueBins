document.addEventListener("DOMContentLoaded", function () {
    // Initial update
    updateCart();
    updateCartCount();

    // Event listener to handle adding items to the cart when the "Add to Cart" button is clicked
    const addToCartButtons = document.querySelectorAll(".button-one");
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

// Function to generate HTML for each item in the cart
function generateCartItemHTML(item) {
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="image">
                <img src="${item.image}" alt="">
            </div>
            <div class="item-details">
                <div class="top">
                    <h4>${item.name}</h4>
                    <i class="fa-solid fa-trash trash-icon"></i>
                </div>
                <div class="bottom">                    
                    <div class="price">
                        <h4 class="item-price">$${(item.price * item.quantity).toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateOrderSummaryHTML(cart) {
    const summaryItemsHTML = cart.map(item => `
        <div class="summary-items">
            <div>
                <p class="">1 x  ${item.name}</p>
            </div>
            <div>
                <p class=" summary-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join("");

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const gstPrice = totalPrice * 0.15;
    const summaryTotal = totalPrice + gstPrice;

    return `
        <div class="order-summary">
            <div>
                <h4>Summary</h4>
            </div>
            ${summaryItemsHTML}
            <div class="order-line"></div>
            <div class="summary-total">
                <div>
                    <p class="">GST</p>
                </div>
                <div>
                    <p class=" gst-price">$${gstPrice.toFixed(2)}</p>
                </div>
            </div>
            <div class="summary-total">
                <div>
                    <p class="">Total</p>
                </div>
                <div>
                    <p class=" total-price">$${summaryTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
}

function updateCart() {
    const cartItemsContainer = document.querySelector(".cart-item-container");
    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const orderSummaryContainer = document.querySelector(".order-summary-container");

    const cart = getCartFromStorage();

    if (cart.length > 0) {
        // If there are items in the cart, display them
        if (emptyCartMessage) {
            emptyCartMessage.style.display = "none";
        }
        cartItemsContainer.innerHTML = cart.map(generateCartItemHTML).join("");

        // Update the order summary
        orderSummaryContainer.innerHTML = generateOrderSummaryHTML(cart);

        // Add event listener for trash icon click using event delegation
        cartItemsContainer.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('trash-icon')) {
                const itemIndex = getIndexFromTrashIcon(target);
                if (itemIndex !== -1) {
                    cart.splice(itemIndex, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                    updateCartCount();
                }
            }
        });
    } else {
        // If the cart is empty, show the empty cart message
        if (emptyCartMessage) {
            emptyCartMessage.style.display = "flex";
            cartItemsContainer.style.display = "none";
        }
        // Clear the cart items and order summary without recursive calls
        cartItemsContainer.innerHTML = ""; // Clear the cart items
        orderSummaryContainer.innerHTML = ""; // Clear the order summary
        // Update the cart count
        updateCartCount();
    }
}

// Function to get the index of the item based on the trash icon clicked
function getIndexFromTrashIcon(trashIcon) {
    const cartItem = trashIcon.closest('.cart-item');
    const itemId = cartItem.dataset.itemIndex; // Assume you have a data attribute for the index
    return parseInt(itemId, 10);
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
