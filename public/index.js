/************************************************************************

App setup

*************************************************************************/
// force https
if (location.protocol == "http:") location.protocol = "https:";
// handle the service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker **not** registered", err));
} else {
  console.warn("Service Worker not supported in this browser");
}
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

/************************************************************************

Set isInstalledPWA if we're in app mode 😎

*************************************************************************/
// detect installed PWA and set a boolean we can check (this will only match after )
const isInstalledPWA = window.matchMedia("(display-mode: standalone)").matches;

/************************************************************************

Feature: Notifications

*************************************************************************/
// grab notification elements
const buttonNotifications = document.getElementById("button-notifications");
const formNotification = document.getElementById("form-notification");

function testNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }
  return true;
}

function handlePermission() {
  // set the button and subsequent form to shown or hidden, depending on what the user answers
  if (Notification.permission !== "granted") {
    buttonNotifications.style.display = "block";
  } else {
    buttonNotifications.style.display = "none";
    formNotification.style.display = "block";
  }
}

function askNotificationPermission() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
  } else if (testNotificationPromise()) {
    Notification.requestPermission().then(() => {
      handlePermission();
    });
  } else {
    Notification.requestPermission(() => {
      handlePermission();
    });
  }
}

function doNotification(notifTitle, notifBody) {
  const notifImg = `https://cdn.glitch.me/efc5414a-882b-4708-af81-8461abbc1a82%2Ftouch-icon.png?v=1633521972305`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
}

// set up event notification handlers
buttonNotifications.addEventListener("click", () => {
  askNotificationPermission();
});
formNotification.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  doNotification(
    document.getElementById("notif-title").value,
    document.getElementById("notif-body").value
  );
});

// execute our notification functions and set up the page elements
handlePermission();

//
//
//
// new new new WIP
//
//
//
const publicVapidKey =
  "BMrfFtMtL9IWl9vchDbbbYzJlbQwplyZ_fbv8Pei8gPNna_Dr1O-Ng7U7fy0LLqz5RKIxEytTIzyk6TLrcKbN30";

// Copied from the web-push documentation
const urlBase64ToUint8Array = (base64String) => {
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
};

window.subscribe = async () => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  
  await fetch('/subscription', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
};

/************************************************************************

Feature: Badging

*************************************************************************/
// grab badging elements and set initial badge value
let totalBadgeCount = 0;
const buttonIncrementBadge = document.getElementById("button-increment-badge");
const buttonClearBadge = document.getElementById("button-clear-badge");
// set up badging notification handlers
if (isInstalledPWA) {
  buttonIncrementBadge.style.display = "block";
  buttonClearBadge.style.display = "block";
}
buttonIncrementBadge.addEventListener("click", () => {
  totalBadgeCount++;
  setBadge(totalBadgeCount);
  console.log(`set badge to ${totalBadgeCount}`);
});
buttonClearBadge.addEventListener("click", () => {
  totalBadgeCount = 0;
  clearBadge();
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

// just an example of what can be done detecting orientation
// also good for taking video fullscreen, moving nav elements, etc.
// note: most desktop browsers always say "landscape"
function showOrientationBlocks() {
  if (
    screen.orientation.type == "portrait-primary" ||
    screen.orientation.type == "portrait-secondary" // this means "upside down" lol
  ) {
    document.querySelector(".show-for-portrait").style.display = "block";
    document.querySelector(".show-for-landscape").style.display = "none";
  } else if (
    screen.orientation.type == "landscape-primary" ||
    screen.orientation.type == "landscape-secondary" // upsie downsies again
  ) {
    document.querySelector(".show-for-portrait").style.display = "none";
    document.querySelector(".show-for-landscape").style.display = "block";
  }
}

// actually detect the orientation changes and reapply
screen.orientation.addEventListener("change", function (e) {
  showOrientationBlocks();
});

// show/hide orientation classes
showOrientationBlocks();
