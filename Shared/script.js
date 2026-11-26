
/* ============================================
   NATANT SHIELD LIMITED
   MAIN APPLICATION JAVASCRIPT
============================================ */


/* ============================================
   1. APPLICATION DATA
============================================ */

const NATANT = window.NATANT;

const states = window.NATANT_STATES || [];
const categories = window.NATANT_CATEGORIES || [];

let products = window.NATANT_PRODUCTS || [];
let shops = window.NATANT_SHOPS || [];
let sellers = window.NATANT_SELLERS || [];

let currentCategory = null;
let selectedProduct = null;


/* ============================================
   2. LOCAL STORAGE
============================================ */

const STORAGE_KEYS = {
    location: "natant_customer_location",
    cart: "natant_customer_cart",
    wishlist: "natant_customer_wishlist"
};

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(key);

        return stored ? JSON.parse(stored) : fallback;

    } catch (error) {
        console.error("Storage error:", error);
        return fallback;
    }
}


/* ============================================
   3. CUSTOMER LOCATION
============================================ */

let customerLocation = getFromStorage(
    STORAGE_KEYS.location,
    window.NATANT_CUSTOMER_LOCATION || {
        state: "",
        city: "",
        latitude: null,
        longitude: null,
        manuallySelected: false
    }
);

function updateLocationDisplay() {
    const locationText = document.getElementById(
        "currentLocationText"
    );

    if (!locationText) return;

    if (customerLocation.city && customerLocation.state) {
        locationText.textContent =
            `${customerLocation.city}, ${customerLocation.state}`;
    } else if (customerLocation.state) {
        locationText.textContent = customerLocation.state;
    } else {
        locationText.textContent = "Select your location";
    }
}


function populateStateSelects() {
    const locationState = document.getElementById("locationState");
    const deliveryState = document.getElementById("deliveryState");

    [locationState, deliveryState].forEach(select => {

        if (!select) return;

        select.innerHTML = `
            <option value="">Select a state</option>
        `;

        states.forEach(state => {

            const option = document.createElement("option");

            const stateName =
                typeof state === "string" ? state : state.name;

            option.value = stateName;
            option.textContent = stateName;

            select.appendChild(option);

        });

    });

    if (locationState) {
        locationState.value = customerLocation.state || "";
    }
}


function openLocationPanel() {
    const panel = document.getElementById("locationPanel");

    if (panel) {
        panel.hidden = false;
    }
}


function closeLocationPanel() {
    const panel = document.getElementById("locationPanel");

    if (panel) {
        panel.hidden = true;
    }
}


function saveCustomerLocation() {

    const stateInput = document.getElementById("locationState");
    const cityInput = document.getElementById("locationCity");
    const message = document.getElementById("locationMessage");

    const state = stateInput?.value.trim();
    const city = cityInput?.value.trim();

    if (!state || !city) {

        if (message) {
            message.textContent = "Please select your state and enter your city.";
        }

        return;
    }

    customerLocation = {
        state,
        city,
        latitude: customerLocation.latitude,
        longitude: customerLocation.longitude,
        manuallySelected: true
    };

    saveToStorage(
        STORAGE_KEYS.location,
        customerLocation
    );

    updateLocationDisplay();

    renderHomepageProducts();

    if (message) {
        message.textContent = "Your location has been saved successfully.";
    }

    setTimeout(closeLocationPanel, 900);
}


/* ============================================
   4. OPTIONAL GPS LOCATION
============================================ */

function detectCustomerLocation() {

    const message = document.getElementById("locationMessage");

    if (!navigator.geolocation) {

        if (message) {
            message.textContent =
                "Your browser does not support location detection.";
        }

        return;
    }

    if (message) {
        message.textContent =
            "Waiting for your permission to access your location...";
    }

    navigator.geolocation.getCurrentPosition(

        position => {

            customerLocation.latitude = position.coords.latitude;
            customerLocation.longitude = position.coords.longitude;

            saveToStorage(
                STORAGE_KEYS.location,
                customerLocation
            );

            if (message) {
                message.textContent =
                    "Your GPS coordinates have been saved. Please select your state and city manually.";
            }

        },

        error => {

            if (message) {

                if (error.code === error.PERMISSION_DENIED) {
                    message.textContent =
                        "Location permission was denied. You can enter your location manually.";
                } else {
                    message.textContent =
                        "We could not detect your location. Please enter it manually.";
                }

            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }

    );
}


/* ============================================
   5. SHOP AND SELLER HELPERS
============================================ */

function getShopById(shopId) {
    return shops.find(shop => shop.id === shopId);
}


function getSellerById(sellerId) {
    return sellers.find(seller => seller.id === sellerId);
}


function getProductShop(product) {
    return getShopById(product.shopId);
}


function isShopApproved(shop) {

    if (!shop) return false;

    return shop.status === "approved";
}


function isProductActive(product) {

    return product.status === "active";
}


/* ============================================
   6. PRODUCT VISIBILITY RULES
============================================ */

function isProductVisible(product) {

    const shop = getProductShop(product);

    if (!shop) return false;

    if (!isShopApproved(shop)) return false;

    if (!isProductActive(product)) return false;

    const productType = product.type;

    // Raw foodstuffs can be sold interstate.

    if (productType === "raw") {
        return true;
    }

    // Ready-to-eat food can only be displayed
    // when the seller and customer are in the same state.

    if (productType === "ready-to-eat") {

        if (!customerLocation.state) {
            return false;
        }

        return (
            shop.state?.toLowerCase() ===
            customerLocation.state.toLowerCase()
        );

    }

    return false;
}


function getVisibleProducts() {
    return products.filter(isProductVisible);
}


/* ============================================
   7. PRODUCT FORMATTING
============================================ */

function formatPrice(price) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2
    }).format(Number(price) || 0);

}


function getCategoryName(categoryId) {

    const category = categories.find(
        item => item.id === categoryId
    );

    return category ? category.name : "Food";
}


function getProductImage(product) {

    if (product.images && product.images.length > 0) {
        return product.images[0];
    }

    return "";
}


/* ============================================
   8. PRODUCT CARD CREATION
============================================ */

function createProductCard(product) {

    const shop = getProductShop(product);

    const card = document.createElement("article");

    card.className = "product-card";

    const image = document.createElement("div");
    image.className = "product-image";

    const imageUrl = getProductImage(product);

    if (imageUrl) {

        const img = document.createElement("img");

        img.src = imageUrl;
        img.alt = product.name || "Food product";
        img.loading = "lazy";

        image.appendChild(img);

    } else {

        image.textContent = "🍲";

    }

    const information = document.createElement("div");

    information.className = "product-information";

    const name = document.createElement("h3");

    name.textContent = product.name || "Food product";

    const price = document.createElement("p");

    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const shopName = document.createElement("p");

    shopName.className = "product-seller";
    shopName.textContent = shop?.name || "Seller";

    const location = document.createElement("p");

    location.className = "product-location";

    location.textContent = shop
        ? `${shop.city || ""}, ${shop.state || ""}`
        : "";

    const viewButton = document.createElement("button");

    viewButton.type = "button";
    viewButton.className = "primary-button";
    viewButton.textContent = "View Product";

    viewButton.addEventListener("click", () => {
        openProductDetails(product.id);
    });

    information.append(
        name,
        price,
        shopName,
        location,
        viewButton
    );

    card.append(image, information);

    card.addEventListener("click", event => {

        if (event.target.closest("button")) return;

        openProductDetails(product.id);

    });

    return card;
}


/* ============================================
   9. EMPTY STATE
============================================ */

function showEmptyMessage(element, message) {

    if (!element) return;

    element.textContent = message;
    element.hidden = false;

}


function hideEmptyMessage(element) {

    if (!element) return;

    element.textContent = "";
    element.hidden = true;

}


/* ============================================
   10. DISPLAY PRODUCT GRIDS
============================================ */

function displayProducts(gridId, emptyId, productList, message) {

    const grid = document.getElementById(gridId);
    const emptyMessage = document.getElementById(emptyId);

    if (!grid) return;

    grid.replaceChildren();

    if (!productList.length) {

        showEmptyMessage(emptyMessage, message);

        return;
    }

    hideEmptyMessage(emptyMessage);

    productList.forEach(product => {

        grid.appendChild(
            createProductCard(product)
        );

    });

}


/* ============================================
   11. HOMEPAGE PRODUCTS
============================================ */

function renderHomepageProducts() {

    const visibleProducts = getVisibleProducts();

    const foodstuffs = visibleProducts.filter(
        product => product.type === "raw"
    );

    const readyFoods = visibleProducts.filter(
        product => product.type === "ready-to-eat"
    );

    displayProducts(
        "foodstuffsProductGrid",
        "foodstuffsEmptyMessage",
        foodstuffs,
        "No approved foodstuff products are available yet. Please check again later."
    );

    displayProducts(
        "readyFoodsProductGrid",
        "readyFoodsEmptyMessage",
        readyFoods,
        customerLocation.state
            ? "No ready-to-eat foods are currently available in your selected state."
            : "Select your state and city to discover ready-to-eat foods near you."
    );

}


/* ============================================
   12. CATEGORY DISPLAY
============================================ */


function renderCategories() {

    // Select the actual category grid, not the entire section
    const container = document.querySelector("#categories .category-grid");

    if (!container) return;

    // Clear only the category cards
    container.replaceChildren();

    categories.forEach(category => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-card";

        const icon = document.createElement("span");

        icon.className = "category-icon";
        icon.textContent = category.icon || "🍽️";

        const name = document.createElement("span");

        name.textContent = category.name;

        button.append(icon, name);

        button.addEventListener("click", () => {

            openCategory(category.id);

        });

        container.appendChild(button);

    });

}



/* ============================================
   13. OPEN CATEGORY
============================================ */

function openCategory(categoryId) {

    currentCategory = categoryId;

    const category = categories.find(
        item => item.id === categoryId
    );

    if (!category) return;

    const homepage = document.getElementById("homepageContent");
    const categoryPage = document.getElementById("categoryResults");

    if (homepage) homepage.hidden = true;

    if (categoryPage) categoryPage.hidden = false;

    const title = document.getElementById("categoryTitle");
    const description = document.getElementById("categoryDescription");

    if (title) title.textContent = category.name;

    if (description) {
        description.textContent = category.description || "";
    }

    const matchingProducts = getVisibleProducts().filter(
        product => product.category === categoryId
    );

    displayProducts(
        "categoryProductGrid",
        "categoryEmptyMessage",
        matchingProducts,
        "There are no products in this category yet."
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================
   14. RETURN TO HOMEPAGE
============================================ */

function returnToHomepage() {

    currentCategory = null;

    const homepage = document.getElementById("homepageContent");
    const categoryPage = document.getElementById("categoryResults");
    const detailsPage = document.getElementById("productDetails");
    const cartPage = document.getElementById("cartPage");
    const checkoutPage = document.getElementById("checkoutPage");

    if (homepage) homepage.hidden = false;

    if (categoryPage) categoryPage.hidden = true;

    if (detailsPage) detailsPage.hidden = true;

    if (cartPage) cartPage.hidden = true;

    if (checkoutPage) checkoutPage.hidden = true;

    renderHomepageProducts();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================
   15. PRODUCT SEARCH
============================================ */

function searchProducts() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const searchResults = document.getElementById("searchResults");

    const homepage = document.getElementById("homepageContent");

    const categoryPage = document.getElementById("categoryResults");

    if (!searchTerm) {

        if (searchResults) searchResults.hidden = true;

        if (homepage) homepage.hidden = false;

        if (categoryPage) categoryPage.hidden = true;

        return;
    }

    if (homepage) homepage.hidden = true;

    if (categoryPage) categoryPage.hidden = true;

    if (searchResults) searchResults.hidden = false;

    const matchingProducts = getVisibleProducts().filter(product => {

        const shop = getProductShop(product);

        const searchableText = [
            product.name,
            product.description,
            getCategoryName(product.category),
            shop?.name,
            shop?.city,
            shop?.state
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm);

    });

    displayProducts(
        "searchProductGrid",
        "searchEmptyMessage",
        matchingProducts,
        "No matching products were found. Try another search."
    );

    const message = document.getElementById("searchMessage");

    if (message) {

        message.textContent = matchingProducts.length
            ? `${matchingProducts.length} matching product(s) found.`
            : "No matching products found.";

    }

}


function clearSearch() {

    const searchInput = document.getElementById("searchInput");

    if (searchInput) searchInput.value = "";

    const searchResults = document.getElementById("searchResults");

    if (searchResults) searchResults.hidden = true;

    returnToHomepage();

}


/* ============================================
   16. PRODUCT DETAILS
============================================ */

function openProductDetails(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product || !isProductVisible(product)) return;

    selectedProduct = product;

    const shop = getProductShop(product);

    const homepage = document.getElementById("homepageContent");
    const categoryPage = document.getElementById("categoryResults");
    const searchResults = document.getElementById("searchResults");
    const detailsPage = document.getElementById("productDetails");
    const cartPage = document.getElementById("cartPage");

    if (homepage) homepage.hidden = true;

    if (categoryPage) categoryPage.hidden = true;

    if (searchResults) searchResults.hidden = true;

    if (cartPage) cartPage.hidden = true;

    if (detailsPage) detailsPage.hidden = false;

    const detailsImage = document.getElementById("detailsImage");

    if (detailsImage) {

        detailsImage.replaceChildren();

        const imageUrl = getProductImage(product);

        if (imageUrl) {

            const img = document.createElement("img");

            img.src = imageUrl;
            img.alt = product.name || "Food product";

            detailsImage.appendChild(img);

        } else {

            detailsImage.textContent = "🍲";

        }

    }

    const fields = {
        detailsName: product.name || "",
        detailsPrice: formatPrice(product.price),
        detailsDescription: product.description || "No description available.",
        detailsSeller: shop?.name || "Seller",
        detailsLocation: shop
            ? `${shop.city || ""}, ${shop.state || ""}`
            : ""
    };

    Object.entries(fields).forEach(([id, value]) => {

        const element = document.getElementById(id);

        if (element) element.textContent = value;

    });

    const quantity = document.getElementById("productQuantity");

    if (quantity) quantity.value = 1;

    const feedback = document.getElementById("cartFeedback");

    if (feedback) feedback.textContent = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================
   17. CART DATA
============================================ */

let cart = getFromStorage(
    STORAGE_KEYS.cart,
    []
);


function saveCart() {

    saveToStorage(
        STORAGE_KEYS.cart,
        cart
    );

    updateCartCount();

}


function updateCartCount() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount = document.getElementById("cartCount");
    const sidebarCartCount = document.getElementById("sidebarCartCount");

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    if (sidebarCartCount) {
        sidebarCartCount.textContent = totalQuantity;
    }

}


/* ============================================
   18. ADD TO CART
============================================ */

function addToCart() {

    if (!selectedProduct) return;

    const quantityInput = document.getElementById("productQuantity");

    const quantity = Number(quantityInput?.value);

    const feedback = document.getElementById("cartFeedback");

    if (!Number.isInteger(quantity) || quantity < 1) {

        if (feedback) {
            feedback.textContent = "Please enter a valid quantity.";
        }

        return;
    }

    const existingItem = cart.find(
        item => item.productId === selectedProduct.id
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            productId: selectedProduct.id,
            quantity
        });

    }

    saveCart();

    if (feedback) {
        feedback.textContent = "Product successfully added to your cart.";
    }

}


/* ============================================
   19. CART PAGE
============================================ */

function openCart() {

    const homepage = document.getElementById("homepageContent");
    const categoryPage = document.getElementById("categoryResults");
    const detailsPage = document.getElementById("productDetails");
    const searchResults = document.getElementById("searchResults");
    const cartPage = document.getElementById("cartPage");
    const checkoutPage = document.getElementById("checkoutPage");

    if (homepage) homepage.hidden = true;

    if (categoryPage) categoryPage.hidden = true;

    if (detailsPage) detailsPage.hidden = true;

    if (searchResults) searchResults.hidden = true;

    if (checkoutPage) checkoutPage.hidden = true;

    if (cartPage) cartPage.hidden = false;

    renderCart();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function renderCart() {

    const container = document.getElementById("cartItems");
    const summary = document.getElementById("cartSummary");

    if (!container) return;

    container.replaceChildren();

    if (!cart.length) {

        const empty = document.createElement("p");

        empty.textContent = "Your cart is currently empty.";

        container.appendChild(empty);

        if (summary) summary.textContent = "Total: ₦0";

        return;
    }

    let total = 0;

    cart = cart.filter(item => {

        const product = products.find(
            product => product.id === item.productId
        );

        return product && isProductVisible(product);

    });

    cart.forEach(item => {

        const product = products.find(
            product => product.id === item.productId
        );

        if (!product) return;

        const itemTotal = Number(product.price) * item.quantity;

        total += itemTotal;

        const row = document.createElement("div");

        row.className = "cart-item";

        const name = document.createElement("h3");

        name.textContent = product.name;

        const price = document.createElement("p");

        price.textContent =
            `${formatPrice(product.price)} × ${item.quantity}`;

        const subtotal = document.createElement("p");

        subtotal.textContent = `Subtotal: ${formatPrice(itemTotal)}`;

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {

            removeFromCart(product.id);

        });

        row.append(
            name,
            price,
            subtotal,
            removeButton
        );

        container.appendChild(row);

    });

    saveCart();

    if (summary) {

        summary.textContent =
            `Total: ${formatPrice(total)}`;

    }

}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.productId !== productId
    );

    saveCart();

    renderCart();

}


/* ============================================
   20. CHECKOUT
============================================ */

function openCheckout() {

    if (!cart.length) {

        alert("Your cart is empty.");

        return;
    }

    const cartPage = document.getElementById("cartPage");
    const checkoutPage = document.getElementById("checkoutPage");

    if (cartPage) cartPage.hidden = true;

    if (checkoutPage) checkoutPage.hidden = false;

    populateStateSelects();

    const deliveryState = document.getElementById("deliveryState");

    if (deliveryState && customerLocation.state) {
        deliveryState.value = customerLocation.state;
    }

    renderCheckoutSummary();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function renderCheckoutSummary() {

    const container = document.getElementById("checkoutOrderItems");
    const totalElement = document.getElementById("checkoutOrderTotal");

    if (!container) return;

    container.replaceChildren();

    let total = 0;

    cart.forEach(item => {

        const product = products.find(
            product => product.id === item.productId
        );

        if (!product) return;

        const itemTotal = Number(product.price) * item.quantity;

        total += itemTotal;

        const line = document.createElement("p");

        line.textContent =
            `${product.name} × ${item.quantity} — ${formatPrice(itemTotal)}`;

        container.appendChild(line);

    });

    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }

}


/* ============================================
   21. CHECKOUT VALIDATION
============================================ */

function handleCheckout(event) {

    event.preventDefault();

    const message = document.getElementById("checkoutMessage");

    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const state = document.getElementById("deliveryState")?.value;
    const city = document.getElementById("deliveryCity")?.value.trim();
    const address = document.getElementById("deliveryAddress")?.value.trim();

    if (!name || !phone || !state || !city || !address) {

        if (message) {
            message.textContent = "Please complete all delivery information.";
        }

        return;
    }

    // Raw foodstuffs may travel interstate.
    // Ready-to-eat food must be delivered within the seller's state.

    for (const item of cart) {

        const product = products.find(
            product => product.id === item.productId
        );

        if (!product) continue;

        const shop = getProductShop(product);

        if (
            product.type === "ready-to-eat" &&
            shop?.state?.toLowerCase() !== state.toLowerCase()
        ) {

            if (message) {
                message.textContent =
                    `Ready-to-eat food from ${shop?.name || "this seller"} cannot be delivered outside ${shop?.state || "the seller's state"}.`;
            }

            return;
        }

    }

    // Real account authentication and secure order creation
    // will be connected when the backend is developed.

    if (message) {

        message.textContent =
            "Your delivery details are valid. Customer sign-in and secure order placement will be connected before real orders can be submitted.";

    }

}


/* ============================================
   22. WISHLIST
============================================ */

let wishlist = getFromStorage(
    STORAGE_KEYS.wishlist,
    []
);


function toggleWishlist() {

    if (!selectedProduct) {

        alert("Open a product first to add it to your wishlist.");

        return;
    }

    if (wishlist.includes(selectedProduct.id)) {

        wishlist = wishlist.filter(
            id => id !== selectedProduct.id
        );

        alert("Product removed from your wishlist.");

    } else {

        wishlist.push(selectedProduct.id);

        alert("Product added to your wishlist.");

    }

    saveToStorage(
        STORAGE_KEYS.wishlist,
        wishlist
    );

}


/* ============================================
   23. NAVIGATION
============================================ */

function showHomepage() {

    const searchInput = document.getElementById("searchInput");

    if (searchInput) searchInput.value = "";

    const searchResults = document.getElementById("searchResults");

    if (searchResults) searchResults.hidden = true;

    returnToHomepage();

}


function showAccountMessage() {

    alert(
        "Customer and seller account registration will be available when the account pages are connected."
    );

}


/* ============================================
   24. EVENT LISTENERS
============================================ */

function attachEventListeners() {

    document.getElementById("locationButton")
        ?.addEventListener("click", openLocationPanel);

    document.getElementById("closeLocationPanel")
        ?.addEventListener("click", closeLocationPanel);

    document.getElementById("saveLocationButton")
        ?.addEventListener("click", saveCustomerLocation);

    document.getElementById("detectLocationButton")
        ?.addEventListener("click", detectCustomerLocation);

    document.getElementById("searchInput")
        ?.addEventListener("input", searchProducts);

    document.getElementById("clearSearchButton")
        ?.addEventListener("click", clearSearch);

    document.getElementById("backButton")
        ?.addEventListener("click", showHomepage);

    document.getElementById("backFromDetails")
        ?.addEventListener("click", showHomepage);

    document.getElementById("addToCartButton")
        ?.addEventListener("click", addToCart);

    document.getElementById("backFromCart")
        ?.addEventListener("click", showHomepage);

    document.getElementById("cartButton")
        ?.addEventListener("click", openCart);

    document.getElementById("backFromCheckout")
        ?.addEventListener("click", openCart);

    document.getElementById("checkoutForm")
        ?.addEventListener("submit", handleCheckout);

    document.getElementById("wishlistButton")
        ?.addEventListener("click", toggleWishlist);

    document.getElementById("accountButton")
        ?.addEventListener("click", showAccountMessage);

    document.getElementById("exploreButton")
        ?.addEventListener("click", () => {

            document.getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" });

        });

    document.getElementById("viewAllFoodstuffs")
        ?.addEventListener("click", () => {

            const category = categories.find(
                item => item.id === "fresh-produce"
            );

            if (category) openCategory(category.id);

            else {
                openCategory(categories[0]?.id);
            }

        });

    document.getElementById("viewAllReadyFoods")
        ?.addEventListener("click", () => {

            const readyCategory = categories.find(
                item => item.id === "ready-to-eat-foods"
            );

            if (readyCategory) {
                openCategory(readyCategory.id);
            }

        });

    document.getElementById("continueAfterOrder")
        ?.addEventListener("click", showHomepage);

    document.getElementById("visitSellerShopButton")
        ?.addEventListener("click", () => {

            alert(
                "Individual seller storefronts will be connected when we build the seller pages."
            );

        });

}


/* ============================================
   25. INITIALISE APPLICATION
============================================ */

function initialiseApplication() {

    populateStateSelects();

    updateLocationDisplay();

    renderCategories();

    renderHomepageProducts();

    updateCartCount();

    attachEventListeners();

    console.log(
        "Natant Shield Limited application initialised successfully."
    );

}


// Start the application after the HTML has loaded.

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseApplication
    );

} else {

    initialiseApplication();

}
