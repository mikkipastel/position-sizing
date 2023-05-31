# Hello Installable

This is a basic starter app you can use to build a new, installable PWA. PWA stands for "progressive
web app" — an app that looks great on the web but that can be installed right to a phone without the need
for an app store. It's mostly like any other web ap, with a few exceptions:

- **manifest.json:** PWAs have manifest files that tell the browser basic details about them so they can
  be installed locally to the desktop or to a phone. It has things like name and description, icons at a 
  few different resolutions, a start URL, and things like `"display": "standalone"` which gets rid of all
  the usual browser window dressing so your app looks like, well... an app! The manifest file shipped in
  this app is pretty minimal to get you started, but here's 
  [more from Mozilla](https://developer.mozilla.org/en-US/docs/Web/Manifest).
- **service-worker.js:** PWAs also have service workers. They don't have to be named "service-worker" but
  why not be literal? Service workers are a bit of JavaScript that can run in the background of your app
  

README STUFF:

- Copy, explainer, and README (be sure to explain permissions in various browsers...)
- manifest _needs_ "display": "standalone" to work right on iOS!
- doesn't need apple specific stuff in the head — manifest is plenty now!
- Helpers: iOS orientation change zoom fix, isInstalledPWA boolean
- Features: push notifications, setting/clearing badges, orientation change detection
- Document https://glitch.com/edit/#!/glortch-pusha-tee


#### TODO:

- Page design, style cleanup
- Add install nudge for uninstalled apps via isInstalledPWA (show icons...)
- Explore the getNotifications stuff to give accurate badge counts
- Can we put the public key in a `.env` instead (to stop inclusion in remixes) ...does that work in GSS?


#### Credits

Made by your friends at Glitch. But wow it took a lot of research! If you want to learn more about PWAs 
your best starting point is probably 
[this guide on MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

&nbsp;

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people build the web together.

- Need help? [Check out our Help Center](https://help.glitch.com/) for answers to common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your apps with private sharing, more storage and memory, domains and more.
