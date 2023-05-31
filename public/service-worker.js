/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

// Specify what we want added to the cache for offline use
self.addEventListener("install", (e) => {
  e.waitUntil(
    // Give the cache a name
    caches.open("glitch-hello-installable-cache").then((cache) => {
      // Cache the homepage and stylesheets - add any assets you want to cache!
      return cache.addAll(["/", "/style.css", "/index.js"]);
    })
  );
});

// Network falling back to cache approach
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});

// Listen for push notifications
self.addEventListener("push", (e) => {
  const data = e.data.json();
  let promises = [];

  if ("setAppBadge" in self.navigator) {
    // this is hard-coded to "1" because getNotifications is tricky?
    const promise = self.navigator.setAppBadge(1);
    promises.push(promise);
  }

  // Promise to show a notification
  promises.push(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    })
  );

  // Finally...
  event.waitUntil(Promise.all(promises));
});
