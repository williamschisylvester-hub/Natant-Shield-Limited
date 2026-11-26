
/* ========================================
   NATANT SHIELD LIMITED
   SELLER PORTAL APPLICATION
======================================== */


/* ========================================
   1. SELECT ELEMENTS
======================================== */

const registrationForm = document.getElementById("shopRegistrationForm");

const registrationMessage = document.getElementById("registrationMessage");

const shopState = document.getElementById("shopState");

const shopPhotograph = document.getElementById("shopPhotograph");


/* ========================================
   2. LOAD NIGERIAN STATES
======================================== */

function loadSellerStates() {

    if (!shopState || !window.NATANT_STATES) return;

    shopState.innerHTML = `
        <option value="">Select state</option>
    `;

    window.NATANT_STATES.forEach(state => {

        const option = document.createElement("option");

        // Support either string states or state objects
        if (typeof state === "string") {

            option.value = state;
            option.textContent = state;

        } else {

            option.value = state.name;
            option.textContent = state.name;

        }

        shopState.appendChild(option);

    });

}


/* ========================================
   3. SELLER PORTAL NAVIGATION
======================================== */

function setupSellerNavigation() {

    const navigationLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(".seller-section");

    function showSection(sectionId) {

        let targetSection = document.getElementById(sectionId);

        if (!targetSection || !targetSection.classList.contains("seller-section")) {

            targetSection = document.getElementById("dashboard");

        }

        sections.forEach(section => {

            section.style.display = "none";

        });

        targetSection.style.display = "block";

        navigationLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${targetSection.id}`) {

                link.classList.add("active");

            }

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navigationLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const sectionId = link.getAttribute("href").substring(1);

            showSection(sectionId);

            history.replaceState(null, "", `#${sectionId}`);

        });

    });


    // Handle direct links and browser navigation
    window.addEventListener("hashchange", () => {

        const sectionId = window.location.hash.substring(1) || "dashboard";

        showSection(sectionId);

    });


    // Display the correct section on initial loading
    const initialSection = window.location.hash.substring(1) || "dashboard";

    showSection(initialSection);

}


/* ========================================
   4. SHOP PHOTOGRAPH VALIDATION
======================================== */

function validateShopPhotograph() {

    if (!shopPhotograph) return false;

    const file = shopPhotograph.files[0];

    if (!file) {

        registrationMessage.textContent = "Please upload a photograph of your actual shop.";

        registrationMessage.style.color = "#C74646";

        return false;

    }

    if (!file.type.startsWith("image/")) {

        registrationMessage.textContent = "Please select a valid image file.";

        registrationMessage.style.color = "#C74646";

        return false;

    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {

        registrationMessage.textContent = "Your photograph must not exceed 5MB.";

        registrationMessage.style.color = "#C74646";

        return false;

    }

    return true;

}


/* ========================================
   5. REGISTRATION FORM
======================================== */

function setupShopRegistration() {

    if (!registrationForm) return;

    registrationForm.addEventListener("submit", event => {

        event.preventDefault();

        registrationMessage.textContent = "";

        const shopName = document.getElementById("shopName").value.trim();

        const ownerName = document.getElementById("ownerName").value.trim();

        const email = document.getElementById("sellerEmail").value.trim();

        const phone = document.getElementById("sellerPhone").value.trim();

        const description = document.getElementById("shopDescription").value.trim();

        const state = shopState.value;

        const city = document.getElementById("shopCity").value.trim();

        const address = document.getElementById("shopAddress").value.trim();

        const termsAccepted = document.getElementById("sellerTerms").checked;


        if (
            !shopName ||
            !ownerName ||
            !email ||
            !phone ||
            !description ||
            !state ||
            !city ||
            !address
        ) {

            registrationMessage.textContent = "Please complete all required fields.";

            registrationMessage.style.color = "#C74646";

            return;

        }


        if (!termsAccepted) {

            registrationMessage.textContent = "Please accept the seller terms before continuing.";

            registrationMessage.style.color = "#C74646";

            return;

        }


        if (!validateShopPhotograph()) {

            return;

        }


        /*
           FRONT-END DEMONSTRATION ONLY

           No real seller account or shop application
           is created at this stage.

           A secure backend will be needed to:
           - Authenticate the seller.
           - Store registration information.
           - Upload the shop photograph.
           - Create a pending shop application.
           - Notify the administrator.
        */


        registrationMessage.textContent =
            "Your information has passed the initial checks. Backend registration is not connected yet, so your application has not been submitted.";

        registrationMessage.style.color = "#966A16";

    });

}


/* ========================================
   6. INITIALIZE SELLER PORTAL
======================================== */

function initializeSellerPortal() {

    loadSellerStates();

    setupSellerNavigation();

    setupShopRegistration();

    console.log("Natant Shield Seller Portal initialized successfully.");

}


/* ========================================
   7. START APPLICATION
======================================== */

document.addEventListener("DOMContentLoaded", initializeSellerPortal);
