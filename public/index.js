if (location.protocol == "http:") location.protocol = "https:";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker **not** registered", err));
} else {
  console.warn("Service Worker not supported in this browser");
}

const button = document.getElementById("notifications");
button.addEventListener("click", () => {
  alert('oh no');
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      randomNotification();
    }
  });
});

function randomNotification() {
  const randomItem = Math.floor(Math.random() * 987543);
  const notifTitle = `oh hai ${randomItem}`;
  const notifBody = `Created by someone`;
  const notifImg = `https://cdn.glitch.com/560ed5ed-9d00-433a-9ff9-7750d79d13da%2FGlitch_TeamAvatar.png?v=1624643105812`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}
