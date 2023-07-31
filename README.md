# Hello Installable

This is a basic starter app you can use to build a new, installable PWA. PWA stands for “progressive
web app” — an app that looks great on the web and can be installed right to a phone without the need
for an app store. It’s mostly like any other web ap, with a few exceptions:

- **manifest.json:** PWAs have manifest files that tell the browser basic details about them so they can
  be installed locally to the desktop or to a phone. It has things like name and description, icons at a
  few different resolutions, a start URL, and things like `"display": "standalone"` which gets rid of all
  the usual browser window dressing so your app looks like, well... an app! The manifest file shipped in
  this app is pretty minimal to get you started, but here’s
  [more from Mozilla](https://developer.mozilla.org/en-US/docs/Web/Manifest).
- **service-worker.js:** PWAs also have service workers. They don’t have to be named “service-worker” but
  why not be literal? Service workers are a bit of JavaScript that can run in the background of your app
  and handle things like caching content and receiving push notifications. They’re cool! Mozilla’s got
  [docs for you](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
  about service workers, too.

PWAs installed to phones can even get access to a lot of the magic mobile device APIs like native push
notifications. This starter has all the hooks to receive notifications and if you want to play with that
you can even pair this app with a little push notification server we built called
[Push Sender](https://glitch.com/edit/#!/glitch-push-sender).

There’s a lot of other little features stuck into this app to get you started working with PWAs like:

- Events for orientation changes
- Helper classes: `.show-for-portrait` / `.show-for-landscape`
- A JS fix for a wacky iOS zooming bug on orientation change
- An example form setting and clearing app icon badges
- A global `isInstalledPWA` boolean so you know when your app is installed
- A tooltip you can display to people telling them how to install the app
- Helper classes: `.show-for-installed` / `.show-for-browser`
- Push notification support (with badging and badge clearing on interaction)

#### Getting started with notifications

Once you’ve set up your push server you just need to make a couple changes in the 
`index.js` file. Look for this section:
```
/**********************************************************

Feature: Notifications

***********************************************************/
// add notifcation settings here:
const enablePushNotifications = false; // true to enable
const pushServerBaseURL = ""; // your full push server URL
const VAPID_PUBLIC_KEY = ""; // public key from push server
```
First, change `enablePushNotifications` to true so your app knows you want to use
push notifications. Next, add your push server’s full URL (including “https://”) and 
the `VAPID_PUBLIC_KEY` value from the server. 

That’s it! A subscribe button will show up in your app and your users will be able to
suscribe to notifications you send!

#### TODO:

- Explore the getNotifications API in service worker to give accurate badge counts (currently hard-coded to "1" for new notifications)
- Add Android install screenshot

#### Credits

Made by your friends at Glitch. But wow it took a lot of research! If you want to learn more about PWAs
your best starting point is probably
[this guide on MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). There’s also this
great (technical) [guide to working with push notifications](https://felixgerschau.com/web-push-notifications-tutorial/)
from Felix Gerschau.

&nbsp;

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people build the web together.

- Need help? [Check out our Help Center](https://help.glitch.com/) for answers to common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your apps with private sharing, more storage and memory, domains and more.
