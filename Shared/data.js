
/* =========================================
   NATANT SHIELD LIMITED
   SHARED MARKETPLACE DATA
========================================= */


/* =========================================
   1. APPLICATION INFORMATION
========================================= */

window.NATANT = {

    name: "Natant Shield Limited",

    country: "Nigeria",

    currency: "NGN",

    currencySymbol: "₦",

    version: "1.0.0"

};


/* =========================================
   2. NIGERIAN STATES AND FCT
========================================= */

window.NATANT_STATES = [

    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory"

];


/* =========================================
   3. FOOD CATEGORIES
========================================= */

window.NATANT_CATEGORIES = [

    {
        id: "fresh-produce",
        name: "Fresh Produce",
        description: "Fresh fruits and vegetables.",
        icon: "🥬"
    },

    {
        id: "grains-cereals",
        name: "Grains & Cereals",
        description: "Rice, beans, maize and other grains.",
        icon: "🌾"
    },

    {
        id: "seafood-protein",
        name: "Seafood & Protein",
        description: "Fish, meat, crayfish and other protein products.",
        icon: "🐟"
    },

    {
        id: "tubers-roots",
        name: "Tubers & Roots",
        description: "Yam, cassava, potatoes and other roots.",
        icon: "🍠"
    },

    {
        id: "oils-condiments",
        name: "Oils & Condiments",
        description: "Cooking oils, spices and seasonings.",
        icon: "🫒"
    },

    {
        id: "packaged-foods",
        name: "Packaged Foods",
        description: "Packaged food products and groceries.",
        icon: "🥫"
    },

    {
        id: "ready-to-eat-foods",
        name: "Ready-to-Eat Foods",
        description: "Prepared meals available from food vendors.",
        icon: "🍛"
    }

];


/* =========================================
   4. PRODUCT TYPES
========================================= */

window.NATANT_PRODUCT_TYPES = {

    RAW: "raw",

    READY_TO_EAT: "ready-to-eat"

};


/* =========================================
   5. PRODUCT STATUS
========================================= */

window.NATANT_PRODUCT_STATUS = {

    ACTIVE: "active",

    INACTIVE: "inactive",

    PENDING: "pending-approval",

    REJECTED: "rejected"

};


/* =========================================
   6. SHOP STATUS
========================================= */

window.NATANT_SHOP_STATUS = {

    PENDING: "pending-approval",

    APPROVED: "approved",

    REJECTED: "rejected",

    SUSPENDED: "suspended",

    REVOKED: "revoked"

};


/* =========================================
   7. SELLER DATA
========================================= */

/*
    Each seller will eventually have:

    - Unique seller ID
    - Seller's name
    - Shop name
    - Phone number
    - State
    - City
    - Actual shop photograph
    - Verification status
    - Administrator approval

    A seller's shop must be approved before
    it can become visible to customers.
*/

window.NATANT_SELLERS = [];


/* =========================================
   8. SHOP DATA
========================================= */

/*
    Each shop will eventually contain:

    - Unique shop ID
    - Seller ID
    - Shop name
    - Shop description
    - Shop photograph
    - State
    - City
    - Full shop address
    - Approval status

    Only approved shops should appear
    in the public marketplace.
*/

window.NATANT_SHOPS = [];


/* =========================================
   9. PRODUCT DATA
========================================= */

/*
    Each product will eventually contain:

    - Product ID
    - Shop ID
    - Seller ID
    - Product name
    - Product description
    - Category
    - Product type
    - Price
    - Available quantity
    - Product photographs
    - Seller location
    - Product approval status

    Products from unapproved shops must
    never appear in the marketplace.
*/

window.NATANT_PRODUCTS = [];


/* =========================================
   10. CUSTOMER LOCATION
========================================= */

window.NATANT_CUSTOMER_LOCATION = {

    state: "",

    city: "",

    latitude: null,

    longitude: null,

    manuallySelected: false

};


/* =========================================
   11. PRODUCT VISIBILITY RULES
========================================= */

/*
    RAW FOODSTUFFS:

    Raw foodstuffs may be displayed to
    customers in other Nigerian states.

    Delivery availability and delivery cost
    will be checked separately.

    READY-TO-EAT FOODS:

    Ready-to-eat meals should only be
    displayed when the seller's state matches
    the customer's selected delivery state.

    An approved shop is also required.
*/

window.NATANT_VISIBILITY_RULES = {

    rawFood: {

        allowInterstate: true,

        requiresSameState: false

    },

    readyToEat: {

        allowInterstate: false,

        requiresSameState: true

    },

    requireApprovedShop: true,

    requireActiveProduct: true

};


/* =========================================
   12. ORDER STATUS
========================================= */

window.NATANT_ORDER_STATUS = {

    PENDING: "pending",

    CONFIRMED: "confirmed",

    PROCESSING: "processing",

    READY_FOR_PICKUP: "ready-for-pickup",

    IN_TRANSIT: "in-transit",

    DELIVERED: "delivered",

    CANCELLED: "cancelled"

};


/* =========================================
   13. DELIVERY INFORMATION
========================================= */

/*
    Delivery pricing will be connected later.

    We will not invent or charge customers
    an unapproved delivery rate.
*/

window.NATANT_DELIVERY = {

    pricingMethod: "pending-configuration",

    measurementRequired: true,

    driverMeasurement: true,

    oversizedParcelRequiresQuote: true

};


/* =========================================
   END OF SHARED MARKETPLACE DATA
========================================= */
