var _sentryCollisionFreeGlobalObject = typeof window === "undefined" ? global : window;
_sentryCollisionFreeGlobalObject["__sentryRewritesTunnelPath__"] = undefined;
_sentryCollisionFreeGlobalObject["SENTRY_RELEASE"] = {"id":"tgwHSVgSQCm1ncy0KUrLp"};
_sentryCollisionFreeGlobalObject["__rewriteFramesAssetPrefixPath__"] = "";

// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://095ce6f49dbe4b30a53332d2b08f11af@o255533.ingest.sentry.io/5820660',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      maskAllInputs: false,
      networkDetailAllowUrls: ["https://probot.io/api", "https://staging.probot.io/api", "https://beta.probot.io/api"]
    })
  ],
  replaysSessionSampleRate: 0.30,
  replaysOnErrorSampleRate: 1.0
});
