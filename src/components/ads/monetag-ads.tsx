import Script from "next/script";

export default function MonetagAds() {
  return (
    <>
      {/* Monetag In-Page Push — Zone 12295219 (DISABLED - was showing floating notification ads) */}
      {/*
      <Script
        id="monetag-in-page-push"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s) {
              s.dataset.zone = "12295219";
              s.src = "https://nap5k.com/tag.min.js";
            })(
              [document.documentElement, document.body]
                .filter(Boolean)
                .pop()
                .appendChild(document.createElement("script"))
            );
          `,
        }}
      />
      */}

      {/* Monetag Vignette Banner — Zone 12295221 */}
      <Script
        id="monetag-vignette"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s) {
              s.dataset.zone = "12295221";
              s.src = "https://n6wxm.com/vignette.min.js";
            })(
              [document.documentElement, document.body]
                .filter(Boolean)
                .pop()
                .appendChild(document.createElement("script"))
            );
          `,
        }}
      />

      {/* Monetag Push Notifications — Zone 12295296 */}
      <Script
        id="monetag-push-notifications"
        src="https://5gvci.com/act/files/tag.min.js?z=12295296"
        strategy="beforeInteractive"
        data-cfasync="false"
        async
      />
    </>
  );
}