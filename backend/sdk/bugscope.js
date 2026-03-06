(function () {

  class BugScope {

    constructor() {
      this.apiKey = null;

      // Auto-detect the backend URL based on where this script is hosted
      const scriptUrl = document.currentScript?.src || "http://localhost:5000";
      try {
        this.endpoint = new URL(scriptUrl).origin + "/api/errors";
      } catch {
        this.endpoint = "http://localhost:5000/api/errors";
      }
    }

    init(config) {

      if (!config || !config.apiKey) {
        console.error("BugScope: apiKey required");
        return;
      }

      this.apiKey = config.apiKey;
      if (config.endpoint) this.endpoint = config.endpoint;

      this.captureGlobalErrors();
      this.capturePromiseErrors();
      this.captureResourceErrors();
      this.captureNetworkErrors();

      console.log("BugScope initialized");

    }

    // -------------------------
    // GLOBAL JS ERRORS
    // -------------------------

    captureGlobalErrors() {

      window.onerror = (message, source, lineno, colno, error) => {

        this.sendError({
          message,
          stack: error ? error.stack : null,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

      };

    }

    // -------------------------
    // PROMISE REJECTIONS
    // -------------------------

    capturePromiseErrors() {

      window.addEventListener("unhandledrejection", (event) => {

        this.sendError({
          message: event.reason?.message || "Unhandled Promise Rejection",
          stack: event.reason?.stack || null,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

      });

    }

    // -------------------------
    // RESOURCE LOAD FAILURES
    // -------------------------

    captureResourceErrors() {

      window.addEventListener(
        "error",
        (event) => {

          const target = event.target;

          if (target && (target.src || target.href)) {

            const resourceUrl = target.src || target.href;
            const syntheticStack = `ResourceError: Failed to load <${target.tagName.toLowerCase()}> resource\n    at ${resourceUrl}\n    on page: ${window.location.href}`;

            this.sendError({
              message: "Resource failed to load",
              resource: resourceUrl,
              tag: target.tagName,
              stack: syntheticStack,
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            });

          }

        },
        true
      );

    }

    // -------------------------
    // NETWORK REQUEST FAILURES
    // -------------------------

    captureNetworkErrors() {

      const originalFetch = window.fetch;

      window.fetch = async (...args) => {

        const response = await originalFetch(...args);

        if (!response.ok) {

          const requestUrl = typeof args[0] === "string" ? args[0] : args[0]?.url;
          const syntheticStack = `NetworkError: HTTP ${response.status} (${response.statusText || "Error"})\n    at fetch: ${requestUrl}\n    on page: ${window.location.href}`;

          this.sendError({
            message: `Network request failed — HTTP ${response.status}`,
            requestUrl: requestUrl,
            status: response.status,
            stack: syntheticStack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          });

        }

        return response;

      };

    }

    // -------------------------
    // MANUAL ERROR CAPTURE
    // -------------------------

    captureException(error) {

      this.sendError({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

    }

    // -------------------------
    // SEND ERROR TO BACKEND
    // -------------------------

    async sendError(errorData) {

      try {

        await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey
          },
          body: JSON.stringify(errorData)
        });

      } catch (err) {
        console.error("BugScope failed to send error");
      }

    }

  }

  window.BugScope = new BugScope();

})();