// public/notification-sw.js

// Activate the new worker immediately and take control of open tabs
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// 1. Incoming push
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Alentah World", body: event.data.text() };
    }
  }

  const options = {
    body: data.body || "You have a new update from Alentah World.",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.url || "alentah-update", // same article = one notification
    renotify: false,
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Alentah World", options)
  );
});

// 2. Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // url from server is relative ("/en/..."), so resolve it to a full URL first
  const target = new URL(event.notification.data?.url || "/", self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === target && "focus" in client) {
            return client.focus();
          }
        }
        // Reuse an open tab of the site if there is one, otherwise open new
        for (const client of windowClients) {
          if (new URL(client.url).origin === self.location.origin && "navigate" in client) {
            return client.navigate(target).then((c) => c && c.focus());
          }
        }
        return self.clients.openWindow(target);
      })
  );
});