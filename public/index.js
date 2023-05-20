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

const totalBadgeCount = 0;
const buttonIncrementBadge = document.getElementById("button-increment-badge");
const buttonClearBadge = document.getElementById("button-clear-badge");

// set up event handlers
buttonNotifications.addEventListener("click", () => {
  askNotificationPermission();
});
formNotification.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  doNotification(document.getElementById("notif-title").value,document.getElementById("notif-body").value);
});

buttonIncrementBadge.addEventListener("click", () => {
  askNotificationPermission();
});
buttonClearBadge.addEventListener("click", () => {
  askNotificationPermission();
});

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
    buttonNotifications.style.display = 'block';
  } else {
    buttonNotifications.style.display = 'none';
    formNotification.style.display = 'block';
  }
}

function askNotificationPermission() {
  // function to actually ask the permissions
  
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

function doNotification(notifTitle,notifBody) {
  const notifImg = `https://cdn.glitch.me/efc5414a-882b-4708-af81-8461abbc1a82%2Ftouch-icon.png?v=1633521972305`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
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

// execute our functions and set up the page
handlePermission();