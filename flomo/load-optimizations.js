// Auto-load optimization resources
(function() {
  'use strict';
  
  // Ensure proper viewport meta tag
  function ensureViewportMeta() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }
  
  // Call immediately
  ensureViewportMeta();
  
  // Load optimized CSS
  const optimizedCSS = document.createElement('link');
  optimizedCSS.rel = 'stylesheet';
  optimizedCSS.href = './optimized-styles.css';
  document.head.appendChild(optimizedCSS);
  
  // Load mobile fixes
  const mobileFixCSS = document.createElement('link');
  mobileFixCSS.rel = 'stylesheet';
  mobileFixCSS.href = './mobile-fix.css';
  document.head.appendChild(mobileFixCSS);
  
  // Load utility functions
  const utilsScript = document.createElement('script');
  utilsScript.src = './utils.js';
  utilsScript.async = true;
  document.head.appendChild(utilsScript);
  
  // Load mobile fixes (critical for mobile display)
  const mobileFixScript = document.createElement('script');
  mobileFixScript.src = './apply-mobile-fixes.js';
  mobileFixScript.async = false; // 立即执行，不能异步
  document.head.appendChild(mobileFixScript);
  
  // Initialize optimization when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Add performance marker
    if (window.performance && window.performance.mark) {
      window.performance.mark('flomo-optimization-start');
    }
    
    // Apply optimizations
    initOptimizations();
  });
  
  function initOptimizations() {
    // Remove redundant inline styles where CSS classes are now used
    removeInlineStyles();
    
    // Add performance monitoring
    if (window.performance && window.performance.measure) {
      window.performance.mark('flomo-optimization-end');
      window.performance.measure('flomo-optimization', 'flomo-optimization-start', 'flomo-optimization-end');
    }
  }
  
  function removeInlineStyles() {
    // Find elements with redundant inline styles
    const elementsWithStyles = document.querySelectorAll('[style]');
    
    elementsWithStyles.forEach(element => {
      const style = element.getAttribute('style');
      
      // Only remove styles that are now covered by CSS classes
      if (element.classList.length > 0) {
        // Check if element has classes that would replace inline styles
        const hasRelevantClasses = [
          'search-container', 'search-input', 'search-button',
          'dark-mode-toggle', 'tag-cloud', 'tag-cloud-item',
          'back-to-top', 'search-status', 'filter-status'
        ].some(cls => element.classList.contains(cls));
        
        if (hasRelevantClasses) {
          // Remove redundant inline styles
          element.removeAttribute('style');
        }
      }
    });
  }
})();