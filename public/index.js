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
