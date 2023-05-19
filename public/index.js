if (location.protocol == "http:") location.protocol = "https:";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker **not** registered", err));
} else {
  console.warn("Service Worker not supported in this browser");
}

const buttonNotifications = document.getElementById("button-notifications");
const formNotification = document.getElementById("form-notification");

if (Notification.permission !== "granted") {
  buttonNotifications.style.display = 'block';
  
  buttonNotifications.addEventListener("click", () => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        doNotification('Notifications enabled','Looks like we\'re best friends now!');
        buttonNotifications.style.display = 'none';
      }
    });
  });
} else {
  formNotification.style.display = 'block';
}

function doNotification(notifTitle,notifBody) {
  const notifImg = `https://cdn.glitch.com/560ed5ed-9d00-433a-9ff9-7750d79d13da%2FGlitch_TeamAvatar.png?v=1624643105812`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
}
