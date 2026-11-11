// Contact form validation

var form = document.getElementById("contactForm");

// Check that an email looks like name@site.com
function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Check that a phone number has digits only
function isDigitsOnly(phone) {
  var pattern = /^[0-9]+$/;
  return pattern.test(phone);
}

// Show an error message under a field
function setError(id, message) {
  document.getElementById(id).textContent = message;
}

// Runs when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var message = document.getElementById("message").value.trim();
  var isValid = true;

  // Clear old messages
  setError("nameError", "");
  setError("emailError", "");
  setError("phoneError", "");
  setError("messageError", "");
  document.getElementById("successMsg").textContent = "";

  // Name
  if (name === "") {
    setError("nameError", "Name cannot be empty.");
    isValid = false;
  }

  // Email
  if (email === "") {
    setError("emailError", "Email cannot be empty.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setError("emailError", "Please enter a valid email address.");
    isValid = false;
  }

  // Phone
  if (phone === "") {
    setError("phoneError", "Phone number cannot be empty.");
    isValid = false;
  } else if (!isDigitsOnly(phone)) {
    setError("phoneError", "Phone number must contain digits only.");
    isValid = false;
  }

  // Message
  if (message === "") {
    setError("messageError", "Message cannot be empty.");
    isValid = false;
  }

  // If everything is fine, show success and clear the form
  if (isValid) {
    document.getElementById("successMsg").textContent = "Thank you! Your message has been sent.";
    form.reset();
  }
});
