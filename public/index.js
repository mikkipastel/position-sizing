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
        formNotification.style.display = 'block';
      }
    });
  });
} else {
  formNotification.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    doNotification(document.getElementById("notif-title").value,document.getElementById("notif-body").value);
  });
  
  formNotification.style.display = 'block';
}

function doNotification(notifTitle,notifBody) {
  const notifImg = `https://cdn.glitch.me/efc5414a-882b-4708-af81-8461abbc1a82%2Ftouch-icon.png?v=1633521972305`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
}
