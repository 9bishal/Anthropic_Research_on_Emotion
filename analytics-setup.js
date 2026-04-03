/* ==========================================
   VERCEL ANALYTICS SETUP
   For proper tracking in static HTML sites
   ========================================== */

// Initialize Vercel Analytics and Web Vitals tracking
(function initVercelAnalytics() {
  // Ensure va queue is available
  if (!window.va) {
    window.va = function () {
      (window.vaq = window.vaq || []).push(arguments);
    };
  }

  // Track page views
  window.va('pageview');

  // Track Web Vitals: Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          window.va('webVitals', {
            name: 'CLS',
            value: entry.value,
            rating: entry.hadRecentInput ? 'good' : 'poor',
          });
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.debug('CLS tracking not available:', e);
    }
  }

  // Track First Input Delay (FID) / Interaction to Next Paint (INP)
  if ('PerformanceObserver' in window && 'PerformanceEventTiming' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 0) {
            window.va('webVitals', {
              name: entry.name === 'first-input' ? 'FID' : 'INP',
              value: entry.processingDuration,
              rating: entry.processingDuration < 100 ? 'good' : 'poor',
            });
          }
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'interaction', buffered: true });
    } catch (e) {
      console.debug('FID/INP tracking not available:', e);
    }
  }

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.va('webVitals', {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: lastEntry.renderTime || lastEntry.loadTime < 2500 ? 'good' : 'poor',
        });
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.debug('LCP tracking not available:', e);
    }
  }

  // Track First Paint (FP) and First Contentful Paint (FCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.va('webVitals', {
            name: entry.name === 'first-paint' ? 'FP' : 'FCP',
            value: entry.startTime,
            rating: entry.startTime < 1800 ? 'good' : 'poor',
          });
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.debug('Paint metrics tracking not available:', e);
    }
  }

  console.log('✓ Vercel Analytics initialized');
})();
