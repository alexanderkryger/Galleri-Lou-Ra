/**
 * Free Gift Module
 * --------------------------------------------------------------
 * Automatically adds a configured product to the cart when the
 * cart subtotal (excluding the gift itself) reaches a threshold,
 * and removes it again when the cart falls below.
 */
(function () {
  'use strict';

  // ---- Read configuration from the Liquid-rendered <script> tag ----
  var configEl = document.getElementById('free-gift-config');
  if (!configEl) return;

  var config;
  try {
    config = JSON.parse(configEl.textContent);
  } catch (e) {
    console.warn('[FreeGift] Invalid config JSON', e);
    return;
  }

  if (!config || !config.enabled || !config.variantId) {
    // Either disabled in theme settings, or no available variant exists.
    return;
  }

  // ---- State guards to prevent race conditions ----
  var isProcessing = false;     // Prevents overlapping add/remove calls
  var lastCartState = null;     // Cache to skip redundant evaluations

  // ---- Helpers ----------------------------------------------------

  function fetchCart() {
    return fetch('/cart.js', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) throw new Error('Cart fetch failed: ' + res.status);
      return res.json();
    });
  }

  function findGiftLine(cart) {
    if (!cart || !Array.isArray(cart.items)) return null;
    for (var i = 0; i < cart.items.length; i++) {
      var item = cart.items[i];
      // Match by variant ID AND the line item property so we never confuse
      // the free gift with a normal purchase of the same product.
      var props = item.properties || {};
      if (
        item.variant_id === config.variantId &&
        props[config.propertyKey] === config.propertyValue
      ) {
        return item;
      }
    }
    return null;
  }

  /**
   * Calculate the effective cart total (in cents), excluding the free
   * gift if it is already in the cart. We use `original_line_price` to
   * subtract the gift's contribution to `total_price`.
   */
  function getEffectiveTotal(cart) {
    var total = cart.total_price || 0;
    var giftLine = findGiftLine(cart);
    if (giftLine) {
      // Subtract the gift's line price so it doesn't count toward threshold.
      total -= (giftLine.original_line_price || giftLine.line_price || 0);
    }
    return total;
  }

  function addGift() {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        items: [{
          id: config.variantId,
          quantity: 1,
          properties: (function () {
            var p = {};
            p[config.propertyKey] = config.propertyValue;
            return p;
          })()
        }]
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error(err.description || 'Add to cart failed');
        });
      }
      return res.json();
    });
  }

  function removeGift(lineKey) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        id: lineKey,
        quantity: 0
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('Remove from cart failed');
      return res.json();
    });
  }

  /**
   * Notify the rest of the theme that the cart has changed, so cart
   * drawers, mini-carts, totals, etc. re-render. We dispatch a custom
   * event AND call common theme refresh hooks if they exist.
   */
  function notifyCartUpdated(cart) {
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cart } }));
    document.dispatchEvent(new CustomEvent('cart:refresh',  { detail: { cart: cart } }));

    // Common theme hooks — call if present, ignore otherwise.
    if (window.theme && typeof window.theme.cart === 'object') {
      if (typeof window.theme.cart.refresh === 'function') {
        try { window.theme.cart.refresh(); } catch (e) {}
      }
    }
  }

  // ---- Core evaluation -------------------------------------------

  function evaluate() {
    if (isProcessing) return Promise.resolve();
    isProcessing = true;

    return fetchCart()
      .then(function (cart) {
        var effectiveTotal = getEffectiveTotal(cart);
        var giftLine = findGiftLine(cart);
        var qualifies = effectiveTotal >= config.threshold;
        var cartHasItems = cart.item_count > (giftLine ? 1 : 0);

        // Edge case: don't add a gift to a cart that only contains the gift,
        // or to an empty cart. The gift requires real items to qualify.
        if (qualifies && cartHasItems && !giftLine) {
          return addGift()
            .then(function () { return fetchCart(); })
            .then(function (newCart) {
              notifyCartUpdated(newCart);
              lastCartState = newCart;
            })
            .catch(function (err) {
              console.warn('[FreeGift] Could not add gift:', err.message);
            });
        }

        if ((!qualifies || !cartHasItems) && giftLine) {
          return removeGift(giftLine.key)
            .then(function (newCart) {
              notifyCartUpdated(newCart);
              lastCartState = newCart;
            })
            .catch(function (err) {
              console.warn('[FreeGift] Could not remove gift:', err.message);
            });
        }

        // No action needed.
        lastCartState = cart;
      })
      .catch(function (err) {
        console.warn('[FreeGift] Evaluation failed:', err.message);
      })
      .then(function () {
        isProcessing = false;
      });
  }

  // ---- Intercept native cart endpoints ---------------------------
  // We wrap fetch() so any add/change/update/clear triggers re-evaluation,
  // regardless of which component (drawer, cart page, custom button) made it.

  var CART_ENDPOINTS = [
    '/cart/add',
    '/cart/change',
    '/cart/update',
    '/cart/clear'
  ];

  function isCartEndpoint(url) {
    if (!url) return false;
    var u = typeof url === 'string' ? url : (url.url || '');
    for (var i = 0; i < CART_ENDPOINTS.length; i++) {
      if (u.indexOf(CART_ENDPOINTS[i]) !== -1) return true;
    }
    return false;
  }

  var originalFetch = window.fetch;
  window.fetch = function () {
    var args = arguments;
    var url = args[0];
    var promise = originalFetch.apply(this, args);

    if (isCartEndpoint(url)) {
      // Re-evaluate AFTER the original cart mutation completes.
      promise.then(function () {
        // Tiny delay lets Shopify finalize cart state before we read it.
        setTimeout(evaluate, 50);
      }).catch(function () { /* swallow — original handler deals with it */ });
    }

    return promise;
  };

  // XMLHttpRequest fallback for older themes/plugins using jQuery.ajax etc.
  var originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (isCartEndpoint(url)) {
      this.addEventListener('load', function () {
        setTimeout(evaluate, 50);
      });
    }
    return originalXHROpen.apply(this, arguments);
  };

  // ---- Public API + theme integration hooks ----------------------
  window.FreeGift = {
    evaluate: evaluate,
    getConfig: function () { return Object.assign({}, config); }
  };

  // Allow themes that emit their own cart events to trigger re-evaluation.
  ['cart:updated', 'cart:refresh', 'cart:change', 'cart:added'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      // Avoid feedback loop: only re-evaluate if the event wasn't ours.
      if (e && e.detail && e.detail.__fromFreeGift) return;
      setTimeout(evaluate, 50);
    });
  });

  // ---- Initial run ------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', evaluate);
  } else {
    evaluate();
  }
})();