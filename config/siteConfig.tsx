export const metaConfig = {
  home_title: "Online Customized Cake Delivery in Kolkata - Boffocakes",
  home_desc:
    "Online Cake Delivery in Kolkata. 2 Hours cake delivery. Customized Cakes for all occasion. Online designer cakes. Birthday Cakes. Anniversary Cakes. Wedding Cakes. Bachelorette Cake. Photo Cake, Cream Cake, Pinata Cake, Tier Cake. boffocakes.com.",
  contact_title:
    "Contact | Online Customized Cake Delivery in Kolkata - Boffocakes",
  contact_desc:
    "Easy Contact Form to get in touch with us | Online Cake Delivery in Kolkata. 2 Hours cake delivery. Customized Cakes for all occasion. Online designer cakes. Birthday Cakes. Anniversary Cakes. Wedding Cakes. Bachelorette Cake. Photo Cake, Cream Cake, Pinata Cake, Tier Cake. boffocakes.com.",
};

export const serverConfig = {
  backend_url_test: "http://localhost:9000/",
  backend_url_server: "https://boffocakes-api.onrender.com/",
  request_timeout: 10000,
  del_time_arr: [
    {
      value: "9AM - 12PM",
      label: "9AM - 12PM",
    },
    {
      value: "12PM - 3PM",
      label: "12PM - 3PM",
    },
    {
      value: "3PM - 6PM",
      label: "3PM - 6PM",
    },
    {
      value: "6PM - 9PM",
      label: "6PM - 9PM",
    },
  ],
  smtp_creds: {
    from: "boffocakes.official@gmail.com",
    username: "boffocakes.official@gmail.com",
    password: "EB23ABFC719733BC10089CB19680BA1E8A03",
    port: 2525,
    server: "smtp.elasticemail.com",
    security_token: "48bacb5f-0ce3-443d-8ade-e2821d4c485a",
  },
};

export const labelConfig = {
  // global
  image_not_loaded: "Image not loaded!",
  inr_code: <span>&#8377;</span>,
  // header
  header_search_placeholder: "Search by typing...",
  login_label: "Log in",
  cart_label: "Cart",
  fav_label: "Wishlist",
  order_label: "Orders",
  // home page
  home_catagory_header_title: "Catagory",
  home_view_all_button: "View All",
  // product page
  product_qty_label: "Quantity",
  product_weight_label: "Weight",
  product_available_flavours_label: "Available flavours",
  product_no_flavours_label: "No flavour found!",
  product_message_label: "Message on cake",
  product_message_placeholder: "e.g. Happy Birthday David!",
  product_available_custom_label: "Available Customizations",
  product_no_custom_label: "No customization available!",
  product_allergy_label: "Any allergy?",
  product_allergy_placeholder: "e.g. Lactos intolerance",
  product_delivery_date_label: "Delivery date",
  product_delivery_time_label: "Delivery time",
  product_weight_unit: "lbs",
  product_unit_add: "+",
  product_unit_deduct: "-",
  product_add_to_cart: "Add to Cart",
  product_buy_now: "Buy Now",
};

export const storageConfig = {
  userProfile: "userProfile",
  cart: "userCart",
  wishlist: "userWishlist",
  jwtToken: "accessToken",
  address: "userAddress",
  orders: "userOrders",
};

export const colorPalette = {};

export const firebaseConfig = {
  apiKey: "AIzaSyBugAXf4QGSq2Mzhvtaskj9u3B_vUuXkJk",
  authDomain: "boffocake.firebaseapp.com",
  projectId: "boffocake",
  storageBucket: "boffocake.appspot.com",
  messagingSenderId: "1097452226849",
  appId: "1:1097452226849:web:c7f8f4f313b74d1d34d660",
};
export const EncKey = "31ac8db0438f395a5739fd7a113a4f41";
export const paytmConfig = {
  // production
  host: "https://securegw.paytm.in",
  mid: "WotNCM52358571558082",
  mkey: "!Q1oy4s9yV8trfja",
  // test
  stage_host: "https://securegw-stage.paytm.in",
  stage_mid: "lhpHNy94509335410871",
  stage_mkey: "gKQ07o!iuXn3ozZa",
};

export const productConfig = {
  qtyAdjustUnit: 1,
  weightAdjustUnit: 0.5,
  messageFieldLimit: 50,
  allergyFieldLimit: 200,
};
