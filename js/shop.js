// ==========================
// ELEMENTS
// ==========================

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");

const productDetails = document.getElementById("productDetails");

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

const API_URL = "https://fakestoreapi.com/products";

let allProducts = [];

// ==========================
// SHOP PAGE
// ==========================

if (productContainer) {

    loadProducts();

}

async function loadProducts() {

    productContainer.innerHTML = "<h2>Loading Products...</h2>";

    try {

        const response = await fetch(API_URL);

        allProducts = await response.json();

        displayProducts(allProducts);

    }

    catch {

        productContainer.innerHTML =
        "<h2>Failed to load products.</h2>";

    }

}

function displayProducts(products) {

    productContainer.innerHTML = "";

    products.forEach(product => {

        productContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p class="price">₹${Math.round(product.price * 85)}</p>

            <a href="product.html?id=${product.id}" class="btn">
                View Details
            </a>

        </div>

        `;

    });

}

// ==========================
// SEARCH
// ==========================

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const search = this.value.toLowerCase();

        const filtered = allProducts.filter(product =>

            product.title.toLowerCase().includes(search)

        );

        displayProducts(filtered);

    });

}

// ==========================
// CATEGORY FILTER
// ==========================

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn =>

            btn.classList.remove("active")

        );

        this.classList.add("active");

        const category = this.dataset.category;

        if (category === "all") {

            displayProducts(allProducts);

            return;

        }

        const filtered = allProducts.filter(product =>

            product.category === category

        );

        displayProducts(filtered);

    });

});

// ==========================
// PRODUCT DETAILS PAGE
// ==========================

if (productDetails) {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    loadProduct(id);

}

async function loadProduct(id) {

    productDetails.innerHTML = "<h2>Loading Product...</h2>";

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const product = await response.json();

        productDetails.innerHTML = `

        <div class="product-details">

            <img src="${product.image}" alt="${product.title}">

            <div class="product-info">

                <h2>${product.title}</h2>

                <h3>₹${Math.round(product.price * 85)}</h3>

                <p><strong>Category:</strong> ${product.category}</p>

                <p>${product.description}</p>

                <button class="btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>

        </div>

        `;

    }

    catch {

        productDetails.innerHTML =
        "<h2>Failed to load product.</h2>";

    }

}

// ==========================
// ADD TO CART
// ==========================

function addToCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(id);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");

}

window.addToCart = addToCart;

// ==========================
// CART PAGE
// ==========================

if (cartItems) {

    loadCart();

}

async function loadCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";

    let total = 0;

    for (const id of cart) {

        const response = await fetch(`${API_URL}/${id}`);

        const product = await response.json();

        total += product.price * 85;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${product.image}" width="80">

            <div class="cart-details">

                <h3>${product.title}</h3>

                <p>₹${Math.round(product.price * 85)}</p>

            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${id})">

                Remove

            </button>

        </div>

        `;

    }

    if (totalPrice) {

        totalPrice.innerHTML =

        "<strong>Total : ₹" + Math.round(total) + "</strong>";

    }

}

function removeItem(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.indexOf(id);

    if (index > -1) {

        cart.splice(index, 1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();

}

window.removeItem = removeItem;