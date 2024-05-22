let searchBtn = document.querySelector("#search-btn");
let searchBar = document.querySelector(".search-bar-container");
let formBtn = document.querySelector("#login-btn");
let loginForm = document.querySelector(".login-form-container");
let formClose = document.querySelector("#form-close");
let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");
let videoBtn = document.querySelectorAll(".vid-btn");
let footer = document.querySelector(".footer");

window.onscroll = () => {
  searchBtn.classList.remove("fa-times");
  searchBar.classList.remove("active");
};
menu.addEventListener("click", () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

searchBtn.addEventListener("click", () => {
  searchBtn.classList.toggle("fa-times");
  searchBar.classList.toggle("active");
});
formBtn.addEventListener("click", () => {
  loginForm.classList.add("active");
});

formClose.addEventListener("click", () => {
  loginForm.classList.remove("active");
});

videoBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".controls .active").classList.remove("active");
    btn.classList.add("active");
    let src = btn.getAttribute("data-src");
    document.querySelector("#video-slider").src = src;
  });
});

var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidePerView: 1,
    },
    768: {
      slidePerView: 2,
    },
    1024: {
      slidePerView: 3,
    },
  },
});

var swiper = new Swiper(".brand-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
    450: {
      slidePerView: 2,
    },
    768: {
      slidePerView: 3,
    },
    991: {
      slidePerView: 4,
    },
    1200: {
      slidePerView: 5,
    },
  },
});

// ====================================contact section  start====================//

// Function to validate email format
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Function to handle form submission
function sendEmail() {
  // Get form inputs
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validate email
  if (!validateEmail(email)) {
    alert("Please provide a valid email address");
    return;
  }

  // Construct email body
  const body = `Name: ${name}\nEmail: ${email} \nSubject: ${subject}\nMessage: ${message}`;

  // Compose email link
  const mailtoLink = `mailto:mannuarya2002@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Open default email client
  window.location.href = mailtoLink;
}

// Attach form submission function to the button click event
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default button behavior
  sendEmail(); // Call function to send email
});

// contact section   end====================//

// JavaScript code to handle the click event and place the name of service in book now service request input.
// it will redirect the service name to the service request input box.
document.querySelectorAll(".box .btn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default action of the link
    var serviceName = this.closest(".box")
      .querySelector(".content h3")
      .textContent.trim(); // Extract service name
    var serviceCharge = this.closest(".box")
      .querySelector(".price")
      .childNodes[0].textContent.trim(); //
    document.getElementById("service-request-input").value = serviceName; // Update input field with service name
    document.getElementById("service-charge-input").value = serviceCharge; // Update input field with service charge
  });
});



// =====================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const profileIcon = document.getElementById("login-btn");
  const qrIcon = document.getElementById("qr-code-icon");
  const infoContainer = document.getElementById("info-container");

  const toggleInfoDisplay = () => {

    event.stopPropagation()
    if (
      infoContainer.style.display === "none" ||
      infoContainer.style.display === ""
    ) {
      infoContainer.style.display = "block";
    } else {
      infoContainer.style.display = "none";
    }
  };
  profileIcon.addEventListener("click", toggleInfoDisplay);
  qrIcon.addEventListener("click", toggleInfoDisplay);

  // Prevent clicks inside infoContainer from bubbling up
  infoContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Optionally, close the infoContainer if clicking outside of it
  document.addEventListener("click", (event) => {
    if (infoContainer.style.display === "block") {
      infoContainer.style.display = "none";
    }
  });
});




// booking page-------------------------start----------@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$(document).ready(function () {
  // Fetch user details and populate fields
  $.get("/api/user-details", function (data) {
    $("#name-input").val(data.name);
    $("#contact-input").val(data.contact);
   // $("#location-input").val(data.location); // For the stored location
  });

  // Get real-time location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
          $("#location-input").val(locationLink);
        },
        function (error) {
          console.error("Error obtaining location", error);
        }
      );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
});
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
