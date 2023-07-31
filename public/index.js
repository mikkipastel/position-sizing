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
