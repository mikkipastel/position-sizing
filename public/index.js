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

Set isInstalledPWA if we're in app mode 😎

*************************************************************************/
// detect installed PWA and set a boolean we can check (this will only match after )
const isInstalledPWA = window.matchMedia("(display-mode: standalone)").matches;

/************************************************************************

Feature: Notifications

*************************************************************************/
const enablePushNotifications = true;
const pushServerBaseURL = "https://glortch-pusha-tee.glitch.me";
const VAPID_PUBLIC_KEY =
  "BKF_-c-PRt_hn-yGLXjYnlLJBEE2C3bvNRu5Tf1DQqbn_jCxbSYeoMKRHKLyCto-BUl_MaWrgE9-T08au99A-Xg";

// grab notification elements
const buttonNotifications = document.getElementById("button-notifications");

// set up event notification handlers
buttonNotifications.addEventListener("click", () => {
  askNotificationPermission();
});

alert('isPortrait');

// execute our notification functions and set up the page elements
handlePermission();

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
  if (Notification.permission !== "granted") {
    buttonNotifications.style.display = "block";
  } else {
    buttonNotifications.style.display = "none";
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

*************************************************************************/
// grab badging elements and set initial badge value
const badgeCount = document.getElementById("badge-count");
const buttonIncrementBadge = document.getElementById("button-set-badge");
const badgingFeatures = document.getElementById("badging-area");
// set up badging notification handlers
if (isInstalledPWA) {
  badgingFeatures.style.display = "block";
}
buttonIncrementBadge.addEventListener("click", (e) => {
  e.stopPropagation();
  setBadge(badgeCount.value);
  console.log(`set badge to ${badgeCount.value}`);
});

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

// set up isPortrait
const isPortrait = window.matchMedia("(orientation: portrait)");

// fix for iPhone zoom issues after orientation changes
// see: http://www.menucool.com/McMenu/prevent-page-content-zooming-on-mobile-orientation-change
if (
  /(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
  window.addEventListener &&
  document.querySelector
) {
  window.addEventListener("orientationchange", rotateWithNoScale, false);
}
function rotateWithNoScale() {
  let viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    let content = viewport.getAttribute("content");
    viewport.setAttribute("content", content + ", maximum-scale=1.0");
    setTimeout(function () {
      viewport.setAttribute("content", content);
    }, 90);
  }
}

// just an example of what can be done detecting orientation
// also good for taking video fullscreen, moving nav elements, etc.
// note: most desktop browsers always say "landscape"
function showOrientationBlocks(portrait) {
  if (portrait) {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "block";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "none";
    });
  } else {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "block";
    });
  }
}

// actually detect the orientation changes and reapply
isPortrait.addEventListener("change", (e) => {
  // Check if orientation is portrait
  if (e.matches) {
    showOrientationBlocks(true);
  } else {
    showOrientationBlocks(false);
  }
});

// show/hide orientation classes
showOrientationBlocks(isPortrait);
