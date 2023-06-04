/************************************************************************

App setup

*************************************************************************/
// force https
if (location.protocol === "http:") location.protocol = "https:";

// handle the service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker **not** registered", err));
} else {
  console.warn("Service Worker not supported in this browser");
}

/************************************************************************

Set a few booleans, detect install

*************************************************************************/
// Set isInstalledPWA if we're in app mode 😎
const isInstalledPWA = window.matchMedia("(display-mode: standalone)").matches;
// Check the user agent for iOS & Android (only for minor fixes — don't rely on user agent!)
const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);

// add a helper class for ".show-for-installed" and ".show-for-browser"
function showInstalledBlocks() {
  if (!isInstalledPWA) {
    document.querySelectorAll(".show-for-browser").forEach((el) => {
      el.style.display = "block";
    });
    document.querySelectorAll(".show-for-installed").forEach((el) => {
      el.style.display = "none";
    });
  } else {
    document.querySelectorAll(".show-for-browser").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-for-installed").forEach((el) => {
      el.style.display = "block";
    });
  }
}

showInstalledBlocks();

/************************************************************************

Feature: Install reminder

*************************************************************************/
// figure out if we should show the install nudges
const installNudge = document.querySelector("#install-nudge");
const closeButton = document.getElementById("close-button");
const hideBanner = localStorage.getItem("hide-install-nudge");

function handleCloseButton() {
  localStorage.setItem("hide-install-nudge", true);
  installNudge.style.display = "none";
}

if (!isInstalledPWA && installNudge && !hideBanner) {
  installNudge.style.display = "block";
  closeButton.addEventListener("click", handleCloseButton);
} else {
  installNudge.style.display = "none";
}

/************************************************************************

Feature: Notifications

*************************************************************************/
// add notifcation settings here:
const enablePushNotifications = false; // true to enable
const pushServerBaseURL = ""; // your full push server URL
const VAPID_PUBLIC_KEY = ""; // public key from push server

// track permissions for the sake of badging
let pushNotificationPermissionGranted = false;

// grab notification elements
const buttonNotifications = document.getElementById("button-notifications");

if (buttonNotifications && enablePushNotifications) {
  // set up event notification handlers
  buttonNotifications.addEventListener("click", () => {
    askNotificationPermission();
  });
  // execute our notification functions and set up the page elements
  handlePermission();
}

// touchstart event clears any active badges
window.addEventListener(
  "touchstart",
  (e) => {
    clearBadge();
  },
  false
);

function handlePermission() {
  // set the button and subsequent form to shown or hidden, depending on what the user answers
  if ("Notification" in window && buttonNotifications) {
    // Mobile Safari errors out without checking for the Notification obj first
    if (Notification.permission !== "granted") {
      buttonNotifications.style.display = "block";
      pushNotificationPermissionGranted = true;
    } else {
      // this looks extra but it clears the button after accepting permission on iOS
      buttonNotifications.style.display = "none";
    }
  }
}

function askNotificationPermission() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
  } else {
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        handlePermission();
        subscribeToPush();
        let notification = new Notification("Notifications enabled", {
          body: "We're best friends now! (We'll say hi when there's news.)",
          icon: "https://cdn.glitch.com/560ed5ed-9d00-433a-9ff9-7750d79d13da%2FGlitch_TeamAvatar.png?v=1624643105812",
        });
      }
    });
  }
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
  });
  postToServer(`${pushServerBaseURL}/add-subscription`, subscription);
}

async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  postToServer(`${pushServerBaseURL}/remove-subscription`, {
    endpoint: subscription.endpoint,
  });
  await subscription.unsubscribe();
}

// Utility functions for notifications
async function postToServer(url, data) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/************************************************************************

Feature: Badging

NOTE: badges require permission for Notifications to have been granted

*************************************************************************/
// grab badging elements and set initial badge value
const badgeCount = document.getElementById("badge-count");
const buttonIncrementBadge = document.getElementById("button-set-badge");
const badgingFeatures = document.getElementById("badging-area");
// set up badging notification handlers
if (isInstalledPWA && badgingFeatures && pushNotificationPermissionGranted) {
  badgingFeatures.style.display = "block";
}
if (buttonIncrementBadge) {
  buttonIncrementBadge.addEventListener("click", (e) => {
    e.stopPropagation();
    setBadge(badgeCount.value);
    console.log(`set badge to ${badgeCount.value}`);
  });
}

function setBadge(total) {
  if (navigator.setAppBadge) {
    navigator.setAppBadge(total);
  } else if (navigator.setExperimentalAppBadge) {
    navigator.setExperimentalAppBadge(total);
  } else if (window.ExperimentalBadge) {
    window.ExperimentalBadge.set(total);
  }
}

function clearBadge() {
  if (navigator.clearAppBadge) {
    navigator.clearAppBadge();
  } else if (navigator.clearExperimentalAppBadge) {
    navigator.clearExperimentalAppBadge();
  } else if (window.ExperimentalBadge) {
    window.ExperimentalBadge.clear();
  }
}

/************************************************************************

Feature: Orientation changes

*************************************************************************/

// just an example of what can be done detecting orientation
// sets up helper classes `.show-for-portrait` and `.show-for-landscape`
// also good for taking video fullscreen, moving nav elements, etc.
// note: most desktop browsers always say "landscape"
function showOrientationBlocks() {
  if (
    screen.orientation.type == "portrait-primary" ||
    screen.orientation.type == "portrait-secondary" // this means "upside down" lol
  ) {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "block";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "none";
    });
  } else if (
    screen.orientation.type == "landscape-primary" ||
    screen.orientation.type == "landscape-secondary" // upsie downsies again
  ) {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "block";
    });
  }
}

// fix for iPhone zoom issues after orientation changes
// see: http://www.menucool.com/McMenu/prevent-page-content-zooming-on-mobile-orientation-change
function rotateWithNoScale() {
  let viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    let content = viewport.getAttribute("content");
    viewport.setAttribute("content", content + ", maximum-scale=1.0");
    setTimeout(function () {
      viewport.setAttribute("content", content);
    }, 100);
  }
}

// actually detect the orientation changes and reapply
screen.orientation.addEventListener("change", function (e) {
  if (isIOS) {
    rotateWithNoScale();
  }
  showOrientationBlocks();
});

// show/hide orientation classes
showOrientationBlocks();
