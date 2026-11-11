"use strict";

const ceremonyDate = new Date("2027-07-07T09:00:00+05:30").getTime();
const countdownFields = ["days", "hours", "minutes", "seconds"].map((id) => document.getElementById(id));
const countdownStatus = document.getElementById("countdown-status");

function updateCountdown() {
  const remaining = Math.max(0, Math.floor((ceremonyDate - Date.now()) / 1000));
  const values = [
    Math.floor(remaining / 86400),
    Math.floor((remaining % 86400) / 3600),
    Math.floor((remaining % 3600) / 60),
    remaining % 60,
  ];
  countdownFields.forEach((field, index) => {
    field.textContent = String(values[index]).padStart(2, "0");
  });
  if (remaining === 0) {
    countdownStatus.textContent = "The wait is over. Welcome to our new beginning!";
  }
  return remaining;
}

if (updateCountdown() > 0) {
  const countdownInterval = setInterval(() => {
    if (updateCountdown() === 0) clearInterval(countdownInterval);
  }, 1000);
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));
  document.documentElement.classList.add("js-motion");
}

const form = document.forms["housewarming-rsvp"];
// Paste the deployed Google Apps Script web app /exec URL here.
const rsvpEndpoint = "";
const phoneInput = document.getElementById("guest-phone");
const nameInput = document.getElementById("guest-name");
const guestInput = document.getElementById("guest-count");

phoneInput.addEventListener("input", () => {
  const digitCount = phoneInput.value.replace(/\D/g, "").length;
  phoneInput.setCustomValidity(digitCount >= 7 && digitCount <= 15 ? "" : "Please enter a mobile number with 7 to 15 digits.");
});
nameInput.addEventListener("input", () => {
  nameInput.setCustomValidity(nameInput.value.trim() ? "" : "Please enter your name.");
});
form.addEventListener("change", (event) => {
  if (event.target.name !== "attendance") return;
  const attending = form.elements.attendance.value !== "No";
  guestInput.min = attending ? "1" : "0";
  if (!attending) guestInput.value = "0";
  else if (guestInput.value === "0") guestInput.value = "1";
});

const formNote = document.getElementById("form-environment-note");
if (/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(rsvpEndpoint)) {
  form.action = rsvpEndpoint;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = false;
  submitButton.firstChild.textContent = "Send my RSVP ";
  formNote.textContent = "Your RSVP is securely submitted to Google Sheets. You’ll see a confirmation after it is saved.";
} else {
  if (rsvpEndpoint) {
    formNote.prepend("The RSVP service URL is invalid. ");
    console.error("RSVP configuration error: use the deployed Google Apps Script HTTPS /exec URL.");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.setAttribute("role", "alert");
    formNote.querySelector("a").focus();
  });
}
