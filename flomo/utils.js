// DOM utilities for optimized element access
class DOMCache {
  constructor() {
    this.cache = new Map();
  }

  // Get element with caching
  get(selector, refresh = false) {
    if (!refresh && this.cache.has(selector)) {
      return this.cache.get(selector);
    }
    
    const element = document.querySelector(selector);
    this.cache.set(selector, element);
    return element;
  }

  // Get all elements with caching
  getAll(selector, refresh = false) {
    const cacheKey = `${selector}:all`;
    if (!refresh && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const elements = document.querySelectorAll(selector);
    this.cache.set(cacheKey, elements);
    return elements;
  }

  // Clear cache for specific selector or all
  clear(selector = null) {
    if (selector) {
      this.cache.delete(selector);
      this.cache.delete(`${selector}:all`);
    } else {
      this.cache.clear();
    }
  }
}

// Create global DOM cache instance
window.domCache = new DOMCache();

// Performance utilities
const PerfUtils = {
  // Debounce function calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function calls
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Batch DOM operations
  batchDOMOperations(operations) {
    // Use document fragment for multiple DOM operations
    const fragment = document.createDocumentFragment();
    const results = [];
    
    operations.forEach(op => {
      if (typeof op === 'function') {
        results.push(op(fragment));
      }
    });
    
    return { fragment, results };
  }
};

// CSS class utilities for better performance than inline styles
const CSSUtils = {
  // Add multiple classes efficiently
  addClass(element, ...classes) {
    if (element && classes.length > 0) {
      element.classList.add(...classes);
    }
  },

  // Remove multiple classes efficiently
  removeClass(element, ...classes) {
    if (element && classes.length > 0) {
      element.classList.remove(...classes);
    }
  },

  // Toggle class with condition
  toggleClass(element, className, condition) {
    if (element) {
      element.classList.toggle(className, condition);
    }
  },

  // Apply styles using CSS custom properties
  setCustomProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
  }
};

// Export utilities
window.PerfUtils = PerfUtils;
window.CSSUtils = CSSUtils;