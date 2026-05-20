/**
 * ============================================================================
 * upsell-drawer.js — Frame Upsell Drawer for Galleri Lou Ra
 * Theme: Stretch by Maestrooo
 * ============================================================================
 *
 * ARCHITECTURE
 * ────────────────────────────────────────────────────────────────────────────
 * 1. On DOMContentLoaded, read the variant→upsell map from the Liquid-injected
 *    JSON blob (#upsell-drawer-data).
 *
 * 2. Intercept add-to-cart by monkey-patching window.fetch. When a POST to
 *    /cart/add.js (or /cart/add) succeeds, we extract the variant ID from the
 *    request body. If that variant has upsell products → open the drawer.
 *
 * 3. Fetch each frame product via /products/{handle}.js to get its variants,
 *    images, and prices.
 *
 * 4. Render selectable cards in the drawer. One card = one variant (color) of
 *    a frame product. Exactly one can be selected (radio behavior).
 *
 * 5. "Add frame to cart" adds the selected frame variant via /cart/add.js,
 *    then refreshes Stretch's cart drawer.
 *
 * 6. "Continue without frame" simply closes the drawer and lets Stretch's
 *    cart drawer open normally.
 *
 * WHY FETCH-PATCHING?
 * ────────────────────────────────────────────────────────────────────────────
 * Stretch (Maestrooo) does not expose reliable public hooks for its cart
 * lifecycle. Different theme versions use different internal APIs. Patching
 * fetch is the most robust, version-agnostic approach. We only intercept
 * /cart/add — all other requests pass through untouched.
 * ============================================================================
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════════
     §1  CONFIGURATION & STATE
     ══════════════════════════════════════════════════════════════════════════ */

  const SELECTORS = {
    drawer:       '#upsell-drawer',
    closeBtn:     '[data-upsell-close]',
    loading:      '[data-upsell-loading]',
    framesWrap:   '[data-upsell-frames]',
    errorWrap:    '[data-upsell-error]',
    retryBtn:     '[data-upsell-retry]',
    addBtn:       '[data-upsell-add]',
    skipBtn:      '[data-upsell-skip]',
    delivery:     '[data-upsell-delivery]',
  };

  // Product cache: handle → product JSON
  const productCache = {};

  // Current state
  let state = {
    isOpen: false,
    isAdding: false,
    selectedVariantId: null,
    upsellMap: {},
    enabled: false,
    previousFocus: null,
    pendingVariantId: null,
  };

  // Debounce flag to prevent duplicate opens
  let openLock = false;


  /* ══════════════════════════════════════════════════════════════════════════
     §2  INIT
     ══════════════════════════════════════════════════════════════════════════ */

  function init() {
    // Parse the Liquid-injected data
    const dataEl = document.getElementById('upsell-drawer-data');
    if (!dataEl) return;

    let data;
    try {
      data = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.warn('[UpsellDrawer] Failed to parse upsell data', e);
      return;
    }

    if (!data.enabled) return;
    if (!data.variantUpsellMap || Object.keys(data.variantUpsellMap).length === 0) return;

    state.upsellMap = data.variantUpsellMap;
    state.enabled = true;

    // Bind UI events
    bindEvents();

    // Patch fetch to intercept add-to-cart
    patchFetch();

    console.log('[UpsellDrawer] Initialized with', Object.keys(state.upsellMap).length, 'variant mappings');
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §3  FETCH INTERCEPTION
     ══════════════════════════════════════════════════════════════════════════ */

  function patchFetch() {
    const originalFetch = window.fetch;

    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');

      // Only intercept /cart/add calls
      if (!isCartAddUrl(url) || !state.enabled) {
        return originalFetch.apply(this, arguments);
      }

      // Let the original request go through
      return originalFetch.apply(this, arguments).then(function (response) {
        // Clone so we can read the body without consuming it
        const cloned = response.clone();

        // Don't interfere if the add failed
        if (!response.ok) return response;

        // Try to extract the variant ID from the request body
        extractVariantIdFromRequest(init).then(function (variantId) {
          if (!variantId) return;

          const vid = String(variantId);
          if (state.upsellMap[vid]) {
            // Delay slightly to let Stretch finish its cart-add processing
            setTimeout(function () {
              openDrawer(vid, state.upsellMap[vid]);
            }, 150);
          }
        });

        return response;
      });
    };

    // Also patch XMLHttpRequest for older Stretch versions that may use XHR
    patchXHR();
  }

  function patchXHR() {
    const XHR = XMLHttpRequest.prototype;
    const originalOpen = XHR.open;
    const originalSend = XHR.send;

    XHR.open = function (method, url) {
      this._upsellUrl = url;
      this._upsellMethod = method;
      return originalOpen.apply(this, arguments);
    };

    XHR.send = function (body) {
      if (
        state.enabled &&
        this._upsellMethod &&
        this._upsellMethod.toUpperCase() === 'POST' &&
        isCartAddUrl(this._upsellUrl || '')
      ) {
        const xhr = this;
        const originalOnLoad = xhr.onload;

        xhr.addEventListener('load', function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            extractVariantIdFromBody(body).then(function (variantId) {
              if (!variantId) return;
              const vid = String(variantId);
              if (state.upsellMap[vid]) {
                setTimeout(function () {
                  openDrawer(vid, state.upsellMap[vid]);
                }, 150);
              }
            });
          }
        });
      }

      return originalSend.apply(this, arguments);
    };
  }

  function isCartAddUrl(url) {
    return /\/cart\/add(\.js|\.json)?\s*$/i.test(url.split('?')[0]);
  }

  /**
   * Extract variant ID from a fetch `init` object's body.
   */
  async function extractVariantIdFromRequest(init) {
    if (!init || !init.body) return null;

    const body = init.body;

    // JSON body (most common in Stretch)
    if (typeof body === 'string') {
      return extractFromString(body);
    }

    // FormData
    if (body instanceof FormData) {
      return body.get('id') || body.get('items[0][id]') || null;
    }

    // URLSearchParams
    if (body instanceof URLSearchParams) {
      return body.get('id') || null;
    }

    return null;
  }

  async function extractVariantIdFromBody(body) {
    if (!body) return null;
    if (typeof body === 'string') return extractFromString(body);
    if (body instanceof FormData) return body.get('id') || null;
    return null;
  }

  function extractFromString(str) {
    // Try JSON
    try {
      const parsed = JSON.parse(str);
      if (parsed.id) return parsed.id;
      if (parsed.items && parsed.items[0] && parsed.items[0].id) return parsed.items[0].id;
    } catch (_) {
      // Not JSON — try URL-encoded
      const params = new URLSearchParams(str);
      return params.get('id') || null;
    }
    return null;
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §4  DRAWER OPEN / CLOSE
     ══════════════════════════════════════════════════════════════════════════ */

  function openDrawer(variantId, frameHandles) {
    // Prevent duplicate opens
    if (state.isOpen || openLock) return;
    openLock = true;
    setTimeout(function () { openLock = false; }, 500);

    const drawer = document.querySelector(SELECTORS.drawer);
    if (!drawer) return;

    state.isOpen = true;
    state.selectedVariantId = null;
    state.pendingVariantId = variantId;

    // Save current focus for restoration
    state.previousFocus = document.activeElement;

    // Show drawer
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset UI
    showLoading(true);
    showError(false);
    showDelivery(false);
    updateAddButton();
    clearFrames();

    // Move focus into drawer
    requestAnimationFrame(function () {
      drawer.focus();
    });

    // Fetch frame products
    loadFrameProducts(frameHandles);

    // Prevent Stretch cart drawer from opening on top of ours.
    // Stretch typically fires a custom event or auto-opens its drawer.
    // We temporarily suppress it.
    suppressStretchCartDrawer(true);
  }

  function closeDrawer() {
    const drawer = document.querySelector(SELECTORS.drawer);
    if (!drawer || !state.isOpen) return;

    state.isOpen = false;
    state.selectedVariantId = null;

    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus
    if (state.previousFocus && typeof state.previousFocus.focus === 'function') {
      state.previousFocus.focus();
    }

    // Re-enable Stretch cart drawer
    suppressStretchCartDrawer(false);

    // Optionally open Stretch's cart drawer after a small delay
    // so the user sees the cart updated
    setTimeout(function () {
      refreshStretchCart();
    }, 200);
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §5  FRAME PRODUCT LOADING
     ══════════════════════════════════════════════════════════════════════════ */

  async function loadFrameProducts(handles) {
    try {
      const products = await Promise.all(
        handles.map(function (handle) {
          return fetchProduct(handle);
        })
      );

      // Filter out any null results (failed fetches)
      const validProducts = products.filter(Boolean);

      if (validProducts.length === 0) {
        showLoading(false);
        showError(true);
        return;
      }

      renderFrameOptions(validProducts);
      showLoading(false);
    } catch (err) {
      console.error('[UpsellDrawer] Failed to load frame products', err);
      showLoading(false);
      showError(true);
    }
  }

  async function fetchProduct(handle) {
    // Check cache first
    if (productCache[handle]) return productCache[handle];

    try {
      const resp = await fetch('/products/' + handle + '.js');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const product = await resp.json();
      productCache[handle] = product;
      return product;
    } catch (err) {
      console.warn('[UpsellDrawer] Failed to fetch product:', handle, err);
      return null;
    }
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §6  RENDER FRAME OPTIONS
     ══════════════════════════════════════════════════════════════════════════ */

  function renderFrameOptions(products) {
    const container = document.querySelector(SELECTORS.framesWrap);
    if (!container) return;

    container.innerHTML = '';
    container.removeAttribute('hidden');

    let isFirstProduct = true;

    products.forEach(function (product) {
      const group = document.createElement('div');
      group.className = 'upsell-drawer__product-group';

      // Product title (e.g. "Egetræ ramme i A4")
      const title = document.createElement('h3');
      title.className = 'upsell-drawer__product-title';
      title.textContent = product.title;
      group.appendChild(title);

      // Optional description
      if (product.description) {
        const desc = document.createElement('p');
        desc.className = 'upsell-drawer__product-desc';
        // Strip HTML and truncate
        const tmp = document.createElement('div');
        tmp.innerHTML = product.description;
        const text = (tmp.textContent || '').trim();
        if (text.length > 0) {
          desc.textContent = text.length > 300 ? text.substring(0, 300) + '…' : text;
          group.appendChild(desc);
        }
      }

      // Variants grid
      const grid = document.createElement('div');
      grid.className = 'upsell-drawer__variants-grid';
      grid.setAttribute('role', 'radiogroup');
      grid.setAttribute('aria-label', product.title + ' — vælg farve');

      product.variants.forEach(function (variant, idx) {
        const card = createVariantCard(product, variant, isFirstProduct && idx === 0);
        grid.appendChild(card);
      });

      group.appendChild(grid);
      container.appendChild(group);
      isFirstProduct = false;
    });
  }

  function createVariantCard(product, variant, isMostPopular) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'upsell-drawer__card';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('data-variant-id', variant.id);

    const isAvailable = variant.available !== false;
    if (!isAvailable) {
      card.setAttribute('aria-disabled', 'true');
      card.disabled = true;
    }

    // Badge for most popular
    if (isMostPopular && isAvailable) {
      const badge = document.createElement('span');
      badge.className = 'upsell-drawer__card-badge';
      badge.textContent = 'Mest populær';
      card.appendChild(badge);
    }

    // Image
    const img = document.createElement('img');
    img.className = 'upsell-drawer__card-image';
    img.alt = variant.title + ' — ' + product.title;
    img.loading = 'lazy';

    // Use variant featured image if available, else product featured image
    const imageUrl = variant.featured_image
      ? variant.featured_image.src
      : (product.featured_image ? product.featured_image : (product.images && product.images[0] ? product.images[0] : ''));

    if (imageUrl) {
      // Resize to 300px wide for performance
      img.src = getSizedImageUrl(imageUrl, '300x');
    } else {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="%23f5f5f5"/></svg>';
    }

    card.appendChild(img);

    // Name
    const name = document.createElement('p');
    name.className = 'upsell-drawer__card-name';
    name.textContent = variant.title !== 'Default Title' ? variant.title : product.title;
    card.appendChild(name);

  // Price
    const price = document.createElement('p');
    price.className = 'upsell-drawer__card-price';

    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      const salePrice = document.createElement('span');
      salePrice.className = 'upsell-drawer__card-price--sale';
      salePrice.textContent = formatMoney(variant.price);

      const comparePrice = document.createElement('span');
      comparePrice.className = 'upsell-drawer__card-price--compare';
      comparePrice.textContent = formatMoney(variant.compare_at_price);

      price.appendChild(salePrice);
      price.appendChild(document.createTextNode(' '));
      price.appendChild(comparePrice);
    } else {
      price.textContent = formatMoney(variant.price);
    }

    card.appendChild(price);

    // Out of stock notice
    if (!isAvailable) {
      const stock = document.createElement('p');
      stock.className = 'upsell-drawer__card-stock';
      stock.textContent = 'Udsolgt';
      card.appendChild(stock);
    }

    // Click handler
    if (isAvailable) {
      card.addEventListener('click', function () {
        selectVariant(variant.id);
      });
    }

    return card;
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §7  SELECTION & CART ACTIONS
     ══════════════════════════════════════════════════════════════════════════ */

  function selectVariant(variantId) {
    state.selectedVariantId = variantId;

    // Update radio states
    const cards = document.querySelectorAll(SELECTORS.drawer + ' .upsell-drawer__card');
    cards.forEach(function (card) {
      const isSelected = card.getAttribute('data-variant-id') === String(variantId);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    showDelivery(true);
    updateAddButton();
  }

  function updateAddButton() {
    const btn = document.querySelector(SELECTORS.addBtn);
    if (!btn) return;
    btn.disabled = !state.selectedVariantId;
  }

  async function addFrameToCart() {
    if (!state.selectedVariantId || state.isAdding) return;

    state.isAdding = true;
    const btn = document.querySelector(SELECTORS.addBtn);
    if (btn) {
      btn.classList.add('upsell-drawer__add-btn--loading');
      btn.textContent = 'Tilføjer…';
    }

    try {
      // Temporarily disable our interceptor so we don't trigger upsell-on-upsell
      state.enabled = false;

      const resp = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: state.selectedVariantId,
          quantity: 1,
        }),
      });

      // Re-enable interceptor
      state.enabled = true;

      if (!resp.ok) {
        const errData = await resp.json().catch(function () { return {}; });
        throw new Error(errData.description || 'Failed to add frame');
      }

      // Success — close drawer and refresh cart
      closeDrawer();
    } catch (err) {
      console.error('[UpsellDrawer] Failed to add frame to cart', err);
      state.enabled = true;

      // Show inline error on the button
      if (btn) {
        btn.textContent = 'Fejl — prøv igen';
        setTimeout(function () {
          btn.textContent = 'Tilføj ramme til kurven';
        }, 2000);
      }
    } finally {
      state.isAdding = false;
      if (btn) {
        btn.classList.remove('upsell-drawer__add-btn--loading');
      }
    }
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §8  STRETCH / MAESTROOO INTEGRATION
     ══════════════════════════════════════════════════════════════════════════ */

  /**
   * Stretch uses a cart drawer that auto-opens after add-to-cart.
   * We need to suppress it while our upsell drawer is open,
   * then trigger it when we close.
   *
   * Common Stretch patterns:
   * - The theme dispatches 'theme:cart:open' / 'cart:open' custom events
   * - Or it has a global CartDrawer object with open()/close() methods
   * - Or it uses [data-cart-drawer] with a class toggle
   *
   * We try multiple approaches for compatibility across Stretch versions.
   */

  let stretchCartDrawerEl = null;
  let stretchSuppressed = false;

  function findStretchCartDrawer() {
    if (stretchCartDrawerEl) return stretchCartDrawerEl;

    // Try common Stretch selectors
    stretchCartDrawerEl =
      document.querySelector('[data-cart-drawer]') ||
      document.querySelector('.cart-drawer') ||
      document.querySelector('#cart-drawer') ||
      document.querySelector('.mini-cart') ||
      document.querySelector('[data-section-type="cart-drawer"]');

    return stretchCartDrawerEl;
  }

  function suppressStretchCartDrawer(suppress) {
    stretchSuppressed = suppress;

    if (suppress) {
      // Try to close Stretch's cart drawer if it opened
      const drawerEl = findStretchCartDrawer();
      if (drawerEl) {
        // Common Stretch: remove the 'is-open' or 'is-visible' class
        drawerEl.classList.remove('is-open', 'is-visible', 'is-active', 'drawer--is-open');
        drawerEl.setAttribute('aria-hidden', 'true');
      }

      // Try Stretch's global API
      if (window.theme && window.theme.cartDrawer && typeof window.theme.cartDrawer.close === 'function') {
        try { window.theme.cartDrawer.close(); } catch (_) {}
      }

      // Intercept the theme:cart:open event
      document.addEventListener('theme:cart:open', preventStretchOpen, true);
      document.addEventListener('cart:open', preventStretchOpen, true);
      document.addEventListener('open-cart-drawer', preventStretchOpen, true);
    } else {
      document.removeEventListener('theme:cart:open', preventStretchOpen, true);
      document.removeEventListener('cart:open', preventStretchOpen, true);
      document.removeEventListener('open-cart-drawer', preventStretchOpen, true);
    }
  }

  function preventStretchOpen(e) {
    if (stretchSuppressed) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }

  /**
   * Refresh Stretch's cart drawer after we've modified the cart.
   * Try multiple approaches for compatibility.
   */
  function refreshStretchCart() {
    // Approach 1: Dispatch custom events that Stretch listens for
    document.dispatchEvent(new CustomEvent('theme:cart:update'));
    document.dispatchEvent(new CustomEvent('cart:refresh'));
    document.dispatchEvent(new CustomEvent('theme:cart:change'));

    // Approach 2: Use Stretch's global cart API
    if (window.theme && window.theme.cartDrawer) {
      if (typeof window.theme.cartDrawer.refresh === 'function') {
        try { window.theme.cartDrawer.refresh(); } catch (_) {}
      }
      if (typeof window.theme.cartDrawer.open === 'function') {
        try {
          setTimeout(function () { window.theme.cartDrawer.open(); }, 100);
        } catch (_) {}
      }
    }

    // Approach 3: Use Maestrooo's Cart class if available
    if (window.theme && window.theme.cart && typeof window.theme.cart.refresh === 'function') {
      try { window.theme.cart.refresh(); } catch (_) {}
    }

    // Approach 4: Fire a generic Shopify Section Rendering event
    // This is what Shopify themes increasingly use
    document.dispatchEvent(new CustomEvent('cart:update'));

    // Approach 5: Update the cart count badge manually
    updateCartCount();
  }

  /**
   * Update cart count badges in the header.
   * Fetches /cart.js and updates any elements showing the cart count.
   */
  async function updateCartCount() {
    try {
      const resp = await fetch('/cart.js');
      if (!resp.ok) return;
      const cart = await resp.json();

      // Common selectors for cart count across Shopify themes
      const countEls = document.querySelectorAll(
        '[data-cart-count], .cart-count, .cart-count-bubble, .js-cart-count, ' +
        '.header__cart-count, .site-header__cart-count, [data-header-cart-count]'
      );

      countEls.forEach(function (el) {
        el.textContent = cart.item_count;
        // Toggle visibility
        if (cart.item_count > 0) {
          el.removeAttribute('hidden');
          el.classList.remove('is-hidden', 'hide');
        }
      });
    } catch (_) {
      // Silently fail — not critical
    }
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §9  UI HELPERS
     ══════════════════════════════════════════════════════════════════════════ */

  function showLoading(show) {
    const el = document.querySelector(SELECTORS.loading);
    if (el) el.hidden = !show;
    const frames = document.querySelector(SELECTORS.framesWrap);
    if (frames) frames.hidden = show;
  }

  function showError(show) {
    const el = document.querySelector(SELECTORS.errorWrap);
    if (el) el.hidden = !show;
  }

  function showDelivery(show) {
    const el = document.querySelector(SELECTORS.delivery);
    if (el) el.hidden = !show;
  }

  function clearFrames() {
    const container = document.querySelector(SELECTORS.framesWrap);
    if (container) {
      container.innerHTML = '';
      container.hidden = true;
    }
  }

  function formatMoney(cents) {
    // Shopify stores prices in cents. Format for DKK (Danish Krone).
    // Example: 19900 → "199 kr"
    const amount = (cents / 100).toFixed(0);
    return amount + ' kr';
  }

  function getSizedImageUrl(src, size) {
    // Shopify image URL resizing
    // e.g. image.jpg → image_300x.jpg
    if (!src) return src;
    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|webp)(\?.*)?$/i);
    if (!match) return src;
    const prefix = src.split(match[0])[0];
    return prefix + '_' + size + '.' + match[1] + (match[2] || '');
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §10  EVENT BINDING
     ══════════════════════════════════════════════════════════════════════════ */

  function bindEvents() {
    const drawer = document.querySelector(SELECTORS.drawer);
    if (!drawer) return;

    // Close buttons (X, backdrop)
    drawer.querySelectorAll(SELECTORS.closeBtn).forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });

    // Skip button
    const skipBtn = drawer.querySelector(SELECTORS.skipBtn);
    if (skipBtn) {
      skipBtn.addEventListener('click', closeDrawer);
    }

    // Add frame button
    const addBtn = drawer.querySelector(SELECTORS.addBtn);
    if (addBtn) {
      addBtn.addEventListener('click', addFrameToCart);
    }

    // Retry button
    const retryBtn = drawer.querySelector(SELECTORS.retryBtn);
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        if (state.pendingVariantId && state.upsellMap[state.pendingVariantId]) {
          showError(false);
          showLoading(true);
          loadFrameProducts(state.upsellMap[state.pendingVariantId]);
        }
      });
    }

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.isOpen) {
        e.preventDefault();
        closeDrawer();
      }
    });

    // Focus trap
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !state.isOpen) return;
      trapFocus(drawer, e);
    });
  }

  function trapFocus(container, e) {
    const focusableEls = container.querySelectorAll(
      'button:not([disabled]):not([hidden]), ' +
      '[href]:not([hidden]), ' +
      'input:not([disabled]):not([hidden]), ' +
      'select:not([disabled]):not([hidden]), ' +
      'textarea:not([disabled]):not([hidden]), ' +
      '[tabindex]:not([tabindex="-1"]):not([hidden])'
    );

    if (focusableEls.length === 0) return;

    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }


  /* ══════════════════════════════════════════════════════════════════════════
     §11  BOOT
     ══════════════════════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
