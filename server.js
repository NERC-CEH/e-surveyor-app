const PORT = process.env.PORT || 8000;
const express = require('express');
const fallback = require('express-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { join } = require('path');
const log4js = require('log4js');
const Sentry = require('@sentry/node');

const logger = log4js.getLogger();
logger.level = 'debug';

const apiKey = process.env.PLANT_NET_API_KEY;

if (!apiKey) {
  throw new Error('PLANT_NET_API_KEY is missing');
}

function initAnalytics() {
  const { VERCEL_URL, VERCEL_GITLAB_COMMIT_SHA } = process.env;

  Sentry.init({
    dsn: process.env.SERVER_SENTRY_KEY,
    release: VERCEL_URL,
  });
  Sentry.setTag('commitSHA', VERCEL_GITLAB_COMMIT_SHA);
}

const app = express();

initAnalytics(app);

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(express.static(join(__dirname, 'build')));
app.use(express.static(join(__dirname, 'other')));

app.use(fallback('index.html', { root: 'build' })); // BrowserHistory router

app.post(
  '/identify',
  createProxyMiddleware({
    target: 'https://my-api.plantnet.org',
    changeOrigin: true,
    pathRewrite: {
      '/identify': `/v2/identify/all?include-related-images=true&api-key=${apiKey}`,
    },
    onProxyRes(proxyRes) {
      if (proxyRes.statusCode >= 400) {
        const withScoreWrap = scope => {
          scope.setExtra('downstreamStatusCode', proxyRes.statusCode);
          scope.setExtra('downstreamStatusMessage', proxyRes.statusMessage);
          const eventId = Sentry.captureException(
            new Error('Downstream proxy')
          );

          logger.error(
            `Downstream proxy error occurred. \nCode: ${proxyRes.statusCode} \nMessage: ${proxyRes.statusMessage} \nException id: ${eventId}`
          );
        };

        Sentry.withScope(withScoreWrap);
      }
    },
  })
);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

const server = app.listen(PORT, function showLogger() {
  const host = server.address().address;
  const { port } = server.address();

  logger.info('App listening at http://%s:%s', host, port);
});
