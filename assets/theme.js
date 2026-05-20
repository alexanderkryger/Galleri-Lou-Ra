var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// js/common/actions/confirm-button.js
var ConfirmButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (!window.confirm(this.getAttribute("data-message") ?? "Once confirmed, this action cannot be undone.")) {
        event.preventDefault();
      }
    });
  }
};
if (!window.customElements.get("confirm-button")) {
  window.customElements.define("confirm-button", ConfirmButton);
}

// js/common/actions/copy-button.js
var _CopyButton_instances, copyToClipboard_fn;
var CopyButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CopyButton_instances);
    this.addEventListener("click", __privateMethod(this, _CopyButton_instances, copyToClipboard_fn));
  }
};
_CopyButton_instances = new WeakSet();
copyToClipboard_fn = async function() {
  if (!navigator.clipboard) {
    return;
  }
  this.querySelector("button")?.setAttribute("aria-busy", "true");
  await navigator.clipboard.writeText(this.getAttribute("data-text") ?? "");
  setTimeout(() => {
    this.querySelector("button")?.setAttribute("aria-busy", "false");
  }, 2e3);
};
if (!window.customElements.get("copy-button")) {
  window.customElements.define("copy-button", CopyButton);
}

// js/common/actions/share-button.js
var _ShareButton_instances, showSystemShare_fn;
var ShareButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ShareButton_instances);
    if (navigator.share) {
      this.querySelector(".share-buttons--native").removeAttribute("hidden");
      this.addEventListener("click", __privateMethod(this, _ShareButton_instances, showSystemShare_fn));
    }
  }
};
_ShareButton_instances = new WeakSet();
showSystemShare_fn = async function() {
  try {
    await navigator.share({
      title: this.hasAttribute("share-title") ? this.getAttribute("share-title") : document.title,
      url: this.hasAttribute("share-url") ? this.getAttribute("share-url") : window.location.href
    });
  } catch (error) {
  }
};
if (!window.customElements.get("share-button")) {
  window.customElements.define("share-button", ShareButton);
}

// js/common/animation/marquee-text.js
import { inView, animate } from "vendor";

// js/common/utilities/media-query.js
function matchesMediaQuery(breakpointName) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    return false;
  }
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName]).matches;
}
function mediaQueryListener(breakpointName, func) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    throw `Media query ${breakpointName} does not exist`;
  }
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName]).addEventListener("change", func);
}

// js/common/animation/marquee-text.js
var _resizeObserver, _currentAnimation, _MarqueeText_instances, isVertical_get, direction_get, scroller_get, initializeShadowDom_fn, createElements_fn;
var MarqueeText = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _MarqueeText_instances);
    __privateAdd(this, _resizeObserver, new ResizeObserver(__privateMethod(this, _MarqueeText_instances, createElements_fn).bind(this)));
    __privateAdd(this, _currentAnimation);
    inView(this, __privateMethod(this, _MarqueeText_instances, initializeShadowDom_fn).bind(this), { margin: "400px" });
    if (this.hasAttribute("pause-on-hover")) {
      this.addEventListener("pointerenter", () => __privateGet(this, _currentAnimation)?.pause());
      this.addEventListener("pointerleave", () => __privateGet(this, _currentAnimation)?.play());
    }
  }
  static get observedAttributes() {
    return ["speed"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "speed" && oldValue !== null && oldValue !== newValue) {
      __privateMethod(this, _MarqueeText_instances, initializeShadowDom_fn).call(this);
      __privateMethod(this, _MarqueeText_instances, createElements_fn).call(this);
    }
  }
};
_resizeObserver = new WeakMap();
_currentAnimation = new WeakMap();
_MarqueeText_instances = new WeakSet();
isVertical_get = function() {
  if (!this.hasAttribute("vertical")) {
    return false;
  }
  return this.getAttribute("vertical") === "" || matchesMediaQuery(this.getAttribute("vertical"));
};
direction_get = function() {
  return this.getAttribute("direction") === "end-to-start" ? -1 : 1;
};
scroller_get = function() {
  return this.shadowRoot.querySelector('[part="scroller"]');
};
initializeShadowDom_fn = function() {
  if (!this.shadowRoot) {
    this.attachShadow({ mode: "open" }).appendChild(document.createRange().createContextualFragment(`
        <slot part="scroller"></slot>
      `));
    __privateGet(this, _resizeObserver).observe(this);
  }
};
createElements_fn = function() {
  const duplicateCount = __privateGet(this, _MarqueeText_instances, isVertical_get) ? Math.ceil(this.clientHeight / this.firstElementChild.clientHeight) : Math.ceil(this.clientWidth / this.firstElementChild.clientWidth);
  const fragment = document.createDocumentFragment();
  fragment.appendChild(this.firstElementChild.cloneNode(true));
  for (let i = 1; i <= duplicateCount; ++i) {
    for (let y = 0; y < 2; ++y) {
      const node = this.firstElementChild.cloneNode(true);
      const value = 100 * i * (y % 2 === 0 ? -1 : 1);
      node.setAttribute("aria-hidden", "true");
      node.style.cssText = __privateGet(this, _MarqueeText_instances, isVertical_get) ? `position: absolute; inset-block-start: ${value}%;` : `position: absolute; inset-inline-start: calc(${value}%);`;
      fragment.appendChild(node);
    }
  }
  this.replaceChildren(fragment);
  let transform = __privateGet(this, _MarqueeText_instances, isVertical_get) ? ["translateY(0)", `translateY(${__privateGet(this, _MarqueeText_instances, direction_get) * this.firstElementChild.clientHeight}px)`] : ["translateX(0px)", `translateX(calc(var(--transform-logical-flip) * ${__privateGet(this, _MarqueeText_instances, direction_get) * this.firstElementChild.clientWidth}px))`];
  let speedMultiplier = __privateGet(this, _MarqueeText_instances, isVertical_get) ? __privateGet(this, _MarqueeText_instances, scroller_get).clientHeight / 300 : __privateGet(this, _MarqueeText_instances, scroller_get).clientWidth / 300;
  __privateSet(this, _currentAnimation, animate(__privateGet(this, _MarqueeText_instances, scroller_get), { transform }, {
    duration: 1 / parseFloat(this.getAttribute("speed")) * speedMultiplier,
    ease: "linear",
    repeat: Infinity
  }));
};
if (!window.customElements.get("marquee-text")) {
  window.customElements.define("marquee-text", MarqueeText);
}

// js/common/behavior/custom-cursor.js
var _abortController, _scheduleSizeRecalculation, _parentBoundingClientReact, _clientWidth, _clientHeight, _CustomCursor_instances, onPointerLeave_fn, onPointerMove_fn, precomputeDimensions_fn, calculateCoordinates_fn;
var CustomCursor = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CustomCursor_instances);
    __privateAdd(this, _abortController);
    __privateAdd(this, _scheduleSizeRecalculation, true);
    __privateAdd(this, _parentBoundingClientReact);
    __privateAdd(this, _clientWidth);
    __privateAdd(this, _clientHeight);
  }
  connectedCallback() {
    __privateSet(this, _abortController, new AbortController());
    this.parentElement.addEventListener("pointermove", __privateMethod(this, _CustomCursor_instances, onPointerMove_fn).bind(this), { passive: true, signal: __privateGet(this, _abortController).signal });
    this.parentElement.addEventListener("pointerleave", __privateMethod(this, _CustomCursor_instances, onPointerLeave_fn).bind(this), { signal: __privateGet(this, _abortController).signal });
    window.addEventListener("scroll", () => __privateSet(this, _scheduleSizeRecalculation, true));
    window.addEventListener("resize", () => __privateSet(this, _scheduleSizeRecalculation, true));
  }
  disconnectedCallback() {
    __privateGet(this, _abortController).abort();
  }
  /**
   * This method is public to allow sub-classes to eventually adjust the logic
   */
  applyTransform({ mouseX, mouseY }) {
    this.animate({ translate: `${mouseX.toFixed(3)}px ${mouseY.toFixed(3)}px` }, { duration: 0, fill: "forwards" });
  }
};
_abortController = new WeakMap();
_scheduleSizeRecalculation = new WeakMap();
_parentBoundingClientReact = new WeakMap();
_clientWidth = new WeakMap();
_clientHeight = new WeakMap();
_CustomCursor_instances = new WeakSet();
onPointerLeave_fn = function() {
  this.classList.remove("is-visible", "is-half-start", "is-half-end");
};
onPointerMove_fn = function(event) {
  const isLink = event.target.matches("button, a[href], button :scope, a[href] :scope");
  if (!this.hasAttribute("for-links") && isLink || this.hasAttribute("for-links") && !isLink) {
    return this.classList.remove("is-visible");
  }
  const { mouseX, mouseY, containerBoundingRect } = __privateMethod(this, _CustomCursor_instances, calculateCoordinates_fn).call(this, event);
  this.applyTransform({ mouseX, mouseY, containerBoundingRect });
};
/**
 * Retrieving all the dimensions on every pointermove can be expensive, so we precompute them once, and only recalculate them when the window is resized
 */
precomputeDimensions_fn = function() {
  if (!__privateGet(this, _scheduleSizeRecalculation)) {
    return;
  }
  __privateSet(this, _clientWidth, this.clientWidth);
  __privateSet(this, _clientHeight, this.clientHeight);
  __privateSet(this, _parentBoundingClientReact, this.parentElement.getBoundingClientRect());
  __privateSet(this, _scheduleSizeRecalculation, false);
};
calculateCoordinates_fn = function(event) {
  __privateMethod(this, _CustomCursor_instances, precomputeDimensions_fn).call(this);
  const parentBoundingRect = __privateGet(this, _parentBoundingClientReact), parentXCenter = (parentBoundingRect.left + parentBoundingRect.right) / 2, isOnStartHalfPart = event.pageX < parentXCenter;
  this.classList.toggle("is-half-start", isOnStartHalfPart);
  this.classList.toggle("is-half-end", !isOnStartHalfPart);
  this.classList.add("is-visible");
  const mouseY = event.clientY - parentBoundingRect.y - __privateGet(this, _clientHeight) / 2, mouseX = event.clientX - parentBoundingRect.x - __privateGet(this, _clientWidth) / 2;
  return { mouseX, mouseY, containerBoundingRect: parentBoundingRect };
};
if (!window.customElements.get("custom-cursor")) {
  window.customElements.define("custom-cursor", CustomCursor);
}

// js/common/behavior/gesture-area.js
var _domElement, _thresholdDistance, _thresholdTime, _signal, _firstClientX, _tracking, _start, _GestureArea_instances, touchStart_fn, preventTouch_fn, gestureStart_fn, gestureMove_fn, gestureEnd_fn;
var GestureArea = class {
  constructor(domElement, { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}) {
    __privateAdd(this, _GestureArea_instances);
    __privateAdd(this, _domElement);
    __privateAdd(this, _thresholdDistance);
    __privateAdd(this, _thresholdTime);
    __privateAdd(this, _signal);
    __privateAdd(this, _firstClientX);
    __privateAdd(this, _tracking, false);
    __privateAdd(this, _start, {});
    __privateSet(this, _domElement, domElement);
    __privateSet(this, _thresholdDistance, thresholdDistance);
    __privateSet(this, _thresholdTime, thresholdTime);
    __privateSet(this, _signal, signal ?? new AbortController().signal);
    __privateGet(this, _domElement).addEventListener("touchstart", __privateMethod(this, _GestureArea_instances, touchStart_fn).bind(this), { passive: true, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("touchmove", __privateMethod(this, _GestureArea_instances, preventTouch_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerdown", __privateMethod(this, _GestureArea_instances, gestureStart_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointermove", __privateMethod(this, _GestureArea_instances, gestureMove_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerup", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerleave", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointercancel", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
  }
};
_domElement = new WeakMap();
_thresholdDistance = new WeakMap();
_thresholdTime = new WeakMap();
_signal = new WeakMap();
_firstClientX = new WeakMap();
_tracking = new WeakMap();
_start = new WeakMap();
_GestureArea_instances = new WeakSet();
touchStart_fn = function(event) {
  __privateSet(this, _firstClientX, event.touches[0].clientX);
};
preventTouch_fn = function(event) {
  if (Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) > 10) {
    event.preventDefault();
  }
};
gestureStart_fn = function(event) {
  __privateSet(this, _tracking, true);
  __privateSet(this, _start, {
    time: (/* @__PURE__ */ new Date()).getTime(),
    x: event.clientX,
    y: event.clientY
  });
};
gestureMove_fn = function(event) {
  if (__privateGet(this, _tracking)) {
    event.preventDefault();
  }
};
gestureEnd_fn = function(event) {
  if (!__privateGet(this, _tracking)) {
    return;
  }
  __privateSet(this, _tracking, false);
  const now = (/* @__PURE__ */ new Date()).getTime(), deltaTime = now - __privateGet(this, _start).time, deltaX = event.clientX - __privateGet(this, _start).x, deltaY = event.clientY - __privateGet(this, _start).y;
  if (deltaTime > __privateGet(this, _thresholdTime)) {
    return;
  }
  let matchedEvent;
  if (deltaX === 0 && deltaY === 0) {
    matchedEvent = "tap";
  } else if (deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swiperight";
  } else if (-deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeleft";
  } else if (deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipedown";
  } else if (-deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeup";
  }
  if (matchedEvent) {
    __privateGet(this, _domElement).dispatchEvent(new CustomEvent(matchedEvent, { bubbles: true, composed: true, detail: { originalEvent: event } }));
  }
};

// js/common/utilities/country-selector.js
var _onCountryChangedListener, _CountrySelector_instances, onCountryChanged_fn;
var CountrySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CountrySelector_instances);
    __privateAdd(this, _onCountryChangedListener, __privateMethod(this, _CountrySelector_instances, onCountryChanged_fn).bind(this));
  }
  connectedCallback() {
    this.countryElement = this.querySelector('[name="address[country]"]');
    this.provinceElement = this.querySelector('[name="address[province]"]');
    this.countryElement.addEventListener("change", __privateGet(this, _onCountryChangedListener));
    if (this.hasAttribute("country") && this.getAttribute("country") !== "") {
      this.countryElement.selectedIndex = Math.max(0, Array.from(this.countryElement.options).findIndex((option) => option.textContent === this.getAttribute("country")));
    }
    this.countryElement.dispatchEvent(new Event("change"));
  }
  disconnectedCallback() {
    this.countryElement.removeEventListener("change", __privateGet(this, _onCountryChangedListener));
  }
};
_onCountryChangedListener = new WeakMap();
_CountrySelector_instances = new WeakSet();
onCountryChanged_fn = function() {
  const option = this.countryElement.options[this.countryElement.selectedIndex], provinces = JSON.parse(option.getAttribute("data-provinces"));
  this.provinceElement.closest(".form-control").hidden = provinces.length === 0;
  if (provinces.length === 0) {
    return;
  }
  this.provinceElement.innerHTML = "";
  provinces.forEach((data) => {
    const selected = data[1] === this.getAttribute("province") || data[0] === this.getAttribute("province");
    this.provinceElement.options.add(new Option(data[1], data[0], selected, selected));
  });
};
if (!window.customElements.get("country-selector")) {
  window.customElements.define("country-selector", CountrySelector);
}

// js/common/utilities/dimensions.js
function getUntransformedBoundingClientReact(element) {
  let { top, left, width, height } = element.getBoundingClientRect();
  let transformArr = parseTransform(element);
  if (transformArr.length === 0) {
    return { top, left, width, height };
  } else if (transformArr.length === 6) {
    let t = transformArr;
    let det = t[0] * t[3] - t[1] * t[2];
    return {
      width: width / t[0],
      height: height / t[3],
      left: (left * t[3] - top * t[2] + t[2] * t[5] - t[4] * t[3]) / det,
      top: (-left * t[1] + top * t[0] + t[4] * t[1] - t[0] * t[5]) / det
    };
  } else {
    console.warn("Cannot nullify 3D matrix transforms");
  }
}
function parseTransform(element) {
  let transform = window.getComputedStyle(element).transform;
  return transform.split(/\(|,|\)/).slice(1, -1).map((v) => parseFloat(v));
}

// js/common/utilities/cached-fetch.js
var cachedMap = /* @__PURE__ */ new Map();
function cachedFetch(url, options) {
  const cacheKey = url;
  if (cachedMap.has(cacheKey)) {
    return Promise.resolve(new Response(new Blob([cachedMap.get(cacheKey)])));
  }
  return fetch(url, options).then((response) => {
    if (response.status === 200) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && (contentType.match(/application\/json/i) || contentType.match(/text\//i))) {
        response.clone().text().then((content) => {
          cachedMap.set(cacheKey, content);
        });
      }
    }
    return response;
  });
}

// js/common/utilities/extract-section-id.js
function extractSectionId(element) {
  if (element.hasAttribute("section-id")) {
    return element.getAttribute("section-id");
  }
  const sectionElement = element.classList.contains("shopify-section") ? element : element.closest(".shopify-section");
  if (sectionElement) {
    return sectionElement.id.replace("shopify-section-", "");
  }
  const elementWithSectionId = element.closest("[section-id]");
  return elementWithSectionId ? elementWithSectionId.getAttribute("section-id") : null;
}

// js/common/utilities/dom.js
function getSiblings(element) {
  let siblings = [];
  if (!element.parentNode) {
    return siblings;
  }
  let sibling = element.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== element) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
}
function deepQuerySelector(root, selector) {
  let element = root.querySelector(selector);
  if (element) {
    return element;
  }
  for (const template2 of root.querySelectorAll("template")) {
    element = deepQuerySelector(template2.content, selector);
    if (element) {
      return element;
    }
  }
  return null;
}
function throttle(callback) {
  let requestId = null, lastArgs;
  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };
  return throttled;
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const done = (event) => {
      if (event.target === element) {
        element.removeEventListener(eventName, done);
        resolve(event);
      }
    };
    element.addEventListener(eventName, done);
  });
}

// js/common/utilities/media.js
function videoLoaded(videoOrArray) {
  if (!videoOrArray) {
    return Promise.resolve();
  }
  videoOrArray = videoOrArray instanceof Element ? [videoOrArray] : Array.from(videoOrArray);
  return Promise.all(videoOrArray.map((video) => {
    return new Promise((resolve) => {
      if (video.tagName === "VIDEO" && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA || !video.offsetParent || video.parentNode.hasAttribute("suspended")) {
        resolve();
      } else {
        video.oncanplay = () => resolve();
      }
    });
  }));
}
function imageLoaded(imageOrArray) {
  if (!imageOrArray) {
    return Promise.resolve();
  }
  imageOrArray = imageOrArray instanceof Element ? [imageOrArray] : Array.from(imageOrArray);
  return Promise.all(imageOrArray.map((image) => {
    return new Promise((resolve) => {
      if (image.tagName === "IMG" && image.complete || !image.offsetParent) {
        resolve();
      } else {
        image.onload = () => resolve();
      }
    });
  }));
}
function generateSrcset(imageObjectOrString, widths = []) {
  let imageUrl, maxWidth;
  if (typeof imageObjectOrString === "string") {
    imageUrl = new URL(imageObjectOrString.startsWith("//") ? `https:${imageObjectOrString}` : imageObjectOrString);
    maxWidth = parseInt(imageUrl.searchParams.get("width"));
  } else {
    imageUrl = new URL(imageObjectOrString["src"].startsWith("//") ? `https:${imageObjectOrString["src"]}` : imageObjectOrString["src"]);
    maxWidth = imageObjectOrString["width"];
  }
  return widths.filter((width) => width <= maxWidth).map((width) => {
    imageUrl.searchParams.set("width", width.toString());
    return `${imageUrl.href} ${width}w`;
  }).join(", ");
}
function createMediaImg(media, widths = [], attributes = {}) {
  const image = new Image(media["preview_image"]["width"], media["preview_image"]["height"]), src = media["preview_image"]["src"], featuredMediaUrl = new URL(src.startsWith("//") ? `https:${src}` : src);
  for (const attributeKey in attributes) {
    image.setAttribute(attributeKey, attributes[attributeKey]);
  }
  image.alt = media["alt"] || "";
  image.src = featuredMediaUrl.href;
  image.srcset = generateSrcset(media["preview_image"], widths);
  return image;
}

// js/common/utilities/player.js
var _callback, _duration, _remainingTime, _startTime, _timer, _state, _onVisibilityChangeListener, _mustResumeOnVisibility, _Player_instances, onVisibilityChange_fn;
var Player = class extends EventTarget {
  constructor(durationInSec, stopOnVisibility = true) {
    super();
    __privateAdd(this, _Player_instances);
    __privateAdd(this, _callback);
    __privateAdd(this, _duration);
    __privateAdd(this, _remainingTime);
    __privateAdd(this, _startTime);
    __privateAdd(this, _timer);
    __privateAdd(this, _state, "paused");
    __privateAdd(this, _onVisibilityChangeListener, __privateMethod(this, _Player_instances, onVisibilityChange_fn).bind(this));
    __privateAdd(this, _mustResumeOnVisibility, true);
    __privateSet(this, _callback, () => this.dispatchEvent(new CustomEvent("player:end")));
    if (durationInSec !== void 0) {
      this.setDuration(durationInSec);
    }
    if (stopOnVisibility) {
      document.addEventListener("visibilitychange", __privateGet(this, _onVisibilityChangeListener));
    }
  }
  get paused() {
    return __privateGet(this, _state) === "paused";
  }
  setDuration(durationInSec) {
    __privateSet(this, _duration, __privateSet(this, _remainingTime, durationInSec * 1e3));
  }
  pause() {
    if (__privateGet(this, _state) !== "started") {
      return;
    }
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "paused");
    __privateSet(this, _remainingTime, __privateGet(this, _remainingTime) - ((/* @__PURE__ */ new Date()).getTime() - __privateGet(this, _startTime)));
    this.dispatchEvent(new CustomEvent("player:pause", { detail: { duration: __privateGet(this, _duration) / 1e3, remainingTime: __privateGet(this, _remainingTime) / 1e3 } }));
  }
  resume(restartTimer = false) {
    if (__privateGet(this, _state) !== "stopped") {
      if (restartTimer) {
        this.start();
      } else {
        clearTimeout(__privateGet(this, _timer));
        __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
        __privateSet(this, _state, "started");
        __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
        this.dispatchEvent(new CustomEvent("player:resume", { detail: { duration: __privateGet(this, _duration) / 1e3, remainingTime: __privateGet(this, _remainingTime) / 1e3 } }));
      }
    }
  }
  start() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
    __privateSet(this, _state, "started");
    __privateSet(this, _remainingTime, __privateGet(this, _duration));
    __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
    this.dispatchEvent(new CustomEvent("player:start", { detail: { duration: __privateGet(this, _duration) / 1e3, remainingTime: __privateGet(this, _remainingTime) / 1e3 } }));
  }
  stop() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "stopped");
    this.dispatchEvent(new CustomEvent("player:stop"));
  }
};
_callback = new WeakMap();
_duration = new WeakMap();
_remainingTime = new WeakMap();
_startTime = new WeakMap();
_timer = new WeakMap();
_state = new WeakMap();
_onVisibilityChangeListener = new WeakMap();
_mustResumeOnVisibility = new WeakMap();
_Player_instances = new WeakSet();
onVisibilityChange_fn = function() {
  if (void 0 === __privateGet(this, _duration)) {
    return;
  }
  if (document.visibilityState === "hidden") {
    __privateSet(this, _mustResumeOnVisibility, __privateGet(this, _state) === "started");
    this.pause();
    this.dispatchEvent(new CustomEvent("player:visibility-pause"));
  } else if (document.visibilityState === "visible" && __privateGet(this, _mustResumeOnVisibility)) {
    this.resume();
    this.dispatchEvent(new CustomEvent("player:visibility-resume"));
  }
};

// js/common/utilities/qr-code.js
var QrCode = class extends HTMLElement {
  connectedCallback() {
    new window.QRCode(this, {
      text: this.getAttribute("identifier"),
      width: this.hasAttribute("width") ? parseInt(this.getAttribute("width")) : 200,
      height: this.hasAttribute("height") ? parseInt(this.getAttribute("height")) : 200
    });
  }
};
if (!window.customElements.get("qr-code")) {
  window.customElements.define("qr-code", QrCode);
}

// js/common/utilities/accessibility.js
function announceText(holderId, message) {
  const holder = document.getElementById(holderId);
  holder.textContent = "";
  setTimeout(() => {
    holder.textContent = message;
  }, 100);
}
function announceStatus(message) {
  announceText("status-announcement", message);
}
function announceError(message) {
  announceText("error-announcement", message);
}

// js/common/behavior/height-observer.js
var _resizeObserver2, _HeightObserver_instances, updateCustomProperties_fn;
var HeightObserver = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _HeightObserver_instances);
    __privateAdd(this, _resizeObserver2, new ResizeObserver(throttle(__privateMethod(this, _HeightObserver_instances, updateCustomProperties_fn).bind(this))));
  }
  connectedCallback() {
    __privateGet(this, _resizeObserver2).observe(this);
    if (!window.ResizeObserver) {
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${this.clientHeight.toFixed(2)}px`);
    }
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver2).unobserve(this);
  }
};
_resizeObserver2 = new WeakMap();
_HeightObserver_instances = new WeakSet();
updateCustomProperties_fn = function(entries) {
  entries.forEach((entry) => {
    if (entry.target === this) {
      const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${height.toFixed(2)}px`);
    }
  });
};
if (!window.customElements.get("height-observer")) {
  window.customElements.define("height-observer", HeightObserver);
}

// js/common/behavior/loading-bar.js
import { animate as animate2 } from "vendor";
var _LoadingBar_instances, onLoadingStart_fn, onLoadingEnd_fn;
var LoadingBar = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LoadingBar_instances);
    document.addEventListener("theme:loading:start", __privateMethod(this, _LoadingBar_instances, onLoadingStart_fn).bind(this));
    document.addEventListener("theme:loading:end", __privateMethod(this, _LoadingBar_instances, onLoadingEnd_fn).bind(this));
  }
};
_LoadingBar_instances = new WeakSet();
onLoadingStart_fn = function() {
  animate2(this, { opacity: [0, 1], transform: ["scaleX(0)", "scaleX(0.4)"] }, { duration: 0.25 });
};
onLoadingEnd_fn = async function() {
  await animate2(this, { transform: ["scaleX(0)", "scaleX(1)"] }, { duration: 0.25 });
  animate2(this, { opacity: 0 }, { duration: 0.25 });
};
if (!window.customElements.get("loading-bar")) {
  window.customElements.define("loading-bar", LoadingBar);
}

// js/common/behavior/safe-sticky.js
import { inView as inView2 } from "vendor";
var _resizeObserver3, _checkPositionListener, _initialTop, _lastKnownY, _currentTop, _position, _SafeSticky_instances, recalculateStyles_fn, checkPosition_fn;
var SafeSticky = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SafeSticky_instances);
    __privateAdd(this, _resizeObserver3, new ResizeObserver(__privateMethod(this, _SafeSticky_instances, recalculateStyles_fn).bind(this)));
    __privateAdd(this, _checkPositionListener, __privateMethod(this, _SafeSticky_instances, checkPosition_fn).bind(this));
    __privateAdd(this, _initialTop, 0);
    __privateAdd(this, _lastKnownY, 0);
    // we could initialize it to window.scrollY but this avoids a costly reflow
    __privateAdd(this, _currentTop, 0);
    __privateAdd(this, _position, "relative");
  }
  connectedCallback() {
    inView2(this, () => {
      window.addEventListener("scroll", __privateGet(this, _checkPositionListener));
      __privateGet(this, _resizeObserver3).observe(this);
      return () => {
        window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
        __privateGet(this, _resizeObserver3).unobserve(this);
      };
    }, { margin: "500px" });
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
    __privateGet(this, _resizeObserver3).unobserve(this);
  }
};
_resizeObserver3 = new WeakMap();
_checkPositionListener = new WeakMap();
_initialTop = new WeakMap();
_lastKnownY = new WeakMap();
_currentTop = new WeakMap();
_position = new WeakMap();
_SafeSticky_instances = new WeakSet();
recalculateStyles_fn = function() {
  this.style.removeProperty("top");
  const computedStyles = getComputedStyle(this);
  __privateSet(this, _initialTop, parseInt(computedStyles.top));
  __privateSet(this, _position, computedStyles.position);
  __privateMethod(this, _SafeSticky_instances, checkPosition_fn).call(this);
};
checkPosition_fn = function() {
  if (__privateGet(this, _position) !== "sticky") {
    return this.style.removeProperty("top");
  }
  let bounds = this.getBoundingClientRect(), maxTop = bounds.top + window.scrollY - this.offsetTop + __privateGet(this, _initialTop), minTop = this.clientHeight - window.innerHeight + 20;
  if (window.scrollY < __privateGet(this, _lastKnownY)) {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) - (window.scrollY - __privateGet(this, _lastKnownY)));
  } else {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) + (__privateGet(this, _lastKnownY) - window.scrollY));
  }
  __privateSet(this, _currentTop, Math.min(Math.max(__privateGet(this, _currentTop), -minTop), maxTop, __privateGet(this, _initialTop)));
  __privateSet(this, _lastKnownY, window.scrollY);
  this.style.top = `${Math.round(__privateGet(this, _currentTop))}px`;
};
if (!window.customElements.get("safe-sticky")) {
  window.customElements.define("safe-sticky", SafeSticky);
}

// js/common/behavior/sandwich-visibility.js
var _intersectionObserver, _isStartMarkerOutOfView, _isEndMarkerInView, _SandwichVisibility_instances, onObserve_fn;
var SandwichVisibility = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SandwichVisibility_instances);
    __privateAdd(this, _intersectionObserver, new IntersectionObserver(__privateMethod(this, _SandwichVisibility_instances, onObserve_fn).bind(this)));
    __privateAdd(this, _isStartMarkerOutOfView, false);
    __privateAdd(this, _isEndMarkerInView, false);
  }
  connectedCallback() {
    __privateGet(this, _intersectionObserver).observe(this.startMarker);
    __privateGet(this, _intersectionObserver).observe(this.endMarker);
  }
  get startMarker() {
    console.warn("Must return a start marker element.");
  }
  get endMarker() {
    console.warn("Must return an end marker element.");
  }
};
_intersectionObserver = new WeakMap();
_isStartMarkerOutOfView = new WeakMap();
_isEndMarkerInView = new WeakMap();
_SandwichVisibility_instances = new WeakSet();
onObserve_fn = function(entries) {
  entries.forEach((entry) => {
    if (entry.target === this.startMarker) {
      __privateSet(this, _isStartMarkerOutOfView, !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }
    if (entry.target === this.endMarker) {
      __privateSet(this, _isEndMarkerInView, entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight);
    }
  });
  this.classList.toggle("is-visible", __privateGet(this, _isStartMarkerOutOfView) && !__privateGet(this, _isEndMarkerInView));
};

// js/common/behavior/scroll-shadow.js
var template = `
  <style>
    :host {
      display: block;
      contain: layout;
      position: relative;
    }
    
    :host([hidden]) {
      display: none;
    }
    
    s {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      margin: var(--scroll-shadow-margin, 0px);
      background-image:
        var(--scroll-shadow-top, linear-gradient(to bottom, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-bottom, linear-gradient(to top, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-left, linear-gradient(to right, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-right, linear-gradient(to left, rgb(var(--background)), rgb(var(--background) / 0)));
      background-position: top, bottom, left, right;
      background-repeat: no-repeat;
      background-size: 100% var(--top, 0), 100% var(--bottom, 0), var(--left, 0) 100%, var(--right, 0) 100%;
    }
  </style>
  <slot></slot>
  <s part="s"></s>
`;
var Updater = class {
  constructor(targetElement) {
    this.scheduleUpdate = throttle(() => this.update(targetElement, getComputedStyle(targetElement)));
    this.resizeObserver = new ResizeObserver(this.scheduleUpdate.bind(this));
  }
  start(element) {
    if (this.element) {
      this.stop();
    }
    if (element) {
      element.addEventListener("scroll", this.scheduleUpdate);
      this.resizeObserver.observe(element);
      this.element = element;
    }
  }
  stop() {
    if (!this.element) {
      return;
    }
    this.element.removeEventListener("scroll", this.scheduleUpdate);
    this.resizeObserver.unobserve(this.element);
    this.element = null;
  }
  update(targetElement, style) {
    if (!this.element) {
      return;
    }
    const maxSize = style.getPropertyValue("--scroll-shadow-size") ? parseInt(style.getPropertyValue("--scroll-shadow-size")) : 30;
    const scroll4 = {
      top: Math.max(this.element.scrollTop, 0),
      bottom: Math.max(this.element.scrollHeight - this.element.offsetHeight - this.element.scrollTop, 0),
      left: Math.max(this.element.scrollLeft, 0),
      right: Math.max(this.element.scrollWidth - this.element.offsetWidth - this.element.scrollLeft, 0)
    };
    requestAnimationFrame(() => {
      for (const position of ["top", "bottom", "left", "right"]) {
        targetElement.style.setProperty(
          `--${position}`,
          `${scroll4[position] > maxSize ? maxSize : scroll4[position]}px`
        );
      }
    });
  }
};
var ScrollShadow = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = template;
    this.updater = new Updater(this.shadowRoot.lastElementChild);
  }
  connectedCallback() {
    this.shadowRoot.querySelector("slot").addEventListener("slotchange", this.start);
    this.start();
  }
  disconnectedCallback() {
    this.updater.stop();
  }
  start() {
    if (this.firstElementChild) {
      this.updater.start(this.firstElementChild);
    }
  }
};
if ("ResizeObserver" in window && !window.customElements.get("scroll-shadow")) {
  window.customElements.define("scroll-shadow", ScrollShadow);
}

// js/common/behavior/split-lines.js
var _requireSplit, _lastScreenWidth, _SplitLines_instances, preserveLetters_get, split_fn, onWindowResized_fn;
var SplitLines = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _SplitLines_instances);
    __privateAdd(this, _requireSplit, true);
    __privateAdd(this, _lastScreenWidth, window.innerWidth);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(document.createRange().createContextualFragment("<slot></slot>"));
    window.addEventListener("resize", throttle(__privateMethod(this, _SplitLines_instances, onWindowResized_fn).bind(this)));
    new MutationObserver(__privateMethod(this, _SplitLines_instances, split_fn).bind(this, true)).observe(this, { characterData: true, attributes: false, childList: false, subtree: true });
  }
  connectedCallback() {
    if (this.hasAttribute("split-on-insert")) {
      __privateMethod(this, _SplitLines_instances, split_fn).call(this);
    }
  }
  get lines() {
    __privateMethod(this, _SplitLines_instances, split_fn).call(this);
    return Array.from(this.shadowRoot.children);
  }
};
_requireSplit = new WeakMap();
_lastScreenWidth = new WeakMap();
_SplitLines_instances = new WeakSet();
preserveLetters_get = function() {
  return this.hasAttribute("preserve-letters");
};
split_fn = function(force = false) {
  if (!__privateGet(this, _requireSplit) && !force) {
    return;
  }
  this.shadowRoot.innerHTML = this.textContent.replace(/./g, '<span part="letter">$&</span>').replace(/\s/g, " ");
  const bounds = /* @__PURE__ */ new Map();
  Array.from(this.shadowRoot.children).forEach((letter) => {
    const key = Math.round(letter.offsetTop);
    if (__privateGet(this, _SplitLines_instances, preserveLetters_get)) {
      bounds.set(key, (bounds.get(key) || "").concat(letter.outerHTML));
    } else {
      bounds.set(key, (bounds.get(key) || "").concat(letter.textContent));
    }
  });
  this.shadowRoot.replaceChildren(...Array.from(bounds.values(), (line) => {
    return document.createRange().createContextualFragment(`<span part="line" style="display: inline-block;">${line}</span>`);
  }));
  __privateSet(this, _requireSplit, false);
  this.classList.add("is-split");
  this.dispatchEvent(new CustomEvent("split-lines:split", { bubbles: true, detail: { lines: Array.from(this.shadowRoot.children) } }));
};
onWindowResized_fn = function() {
  if (__privateGet(this, _lastScreenWidth) === window.innerWidth) {
    return;
  }
  __privateMethod(this, _SplitLines_instances, split_fn).call(this, true);
  __privateSet(this, _lastScreenWidth, window.innerWidth);
};
if (!window.customElements.get("split-lines")) {
  window.customElements.define("split-lines", SplitLines);
}

// js/common/carousel/scroll-carousel.js
import { inView as inView3 } from "vendor";
var _hasPendingProgrammaticScroll, _onMouseDownListener, _onMouseMoveListener, _onMouseClickListener, _onMouseUpListener, _targetIndex, _forceChangeEvent, _dragPosition, _isDragging, _dispatchableScrollEvents, _scrollTimeout, _ScrollCarousel_instances, setupListeners_fn, updateTargetIndex_fn, onScroll_fn, onScrollEnd_fn, calculateLeftScroll_fn, calculateClosestIndexToAlignment_fn, onMouseDown_fn, onMouseMove_fn, onMouseClick_fn, onMouseUp_fn, onResize_fn, onMutate_fn, adaptHeight_fn, preloadImages_fn;
var ScrollCarousel = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ScrollCarousel_instances);
    __privateAdd(this, _hasPendingProgrammaticScroll, false);
    __privateAdd(this, _onMouseDownListener, __privateMethod(this, _ScrollCarousel_instances, onMouseDown_fn).bind(this));
    __privateAdd(this, _onMouseMoveListener, __privateMethod(this, _ScrollCarousel_instances, onMouseMove_fn).bind(this));
    __privateAdd(this, _onMouseClickListener, __privateMethod(this, _ScrollCarousel_instances, onMouseClick_fn).bind(this));
    __privateAdd(this, _onMouseUpListener, __privateMethod(this, _ScrollCarousel_instances, onMouseUp_fn).bind(this));
    __privateAdd(this, _targetIndex, 0);
    // The cell index to which we are currently going to
    __privateAdd(this, _forceChangeEvent, false);
    __privateAdd(this, _dragPosition, {});
    __privateAdd(this, _isDragging, false);
    __privateAdd(this, _dispatchableScrollEvents, { nearingStart: true, nearingEnd: true, leavingStart: true, leavingEnd: true });
    __privateAdd(this, _scrollTimeout);
    this.scrollTo({ left: 0, behavior: "instant" });
    __privateMethod(this, _ScrollCarousel_instances, setupListeners_fn).call(this);
    new ResizeObserver(__privateMethod(this, _ScrollCarousel_instances, onResize_fn).bind(this)).observe(this);
    new MutationObserver(__privateMethod(this, _ScrollCarousel_instances, onMutate_fn).bind(this)).observe(this, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }
  connectedCallback() {
    __privateSet(this, _targetIndex, Math.max(0, this.cells.findIndex((item) => item.classList.contains("is-initial"))));
    if (__privateGet(this, _targetIndex) > 0) {
      this.select(__privateGet(this, _targetIndex), { instant: true });
    }
    if (this.adaptiveHeight) {
      __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(this);
    }
    inView3(this, () => __privateMethod(this, _ScrollCarousel_instances, preloadImages_fn).call(this));
  }
  disconnectedCallback() {
    this.removeEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
    document.removeEventListener("mouseup", __privateGet(this, _onMouseUpListener));
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  canChangeSlide() {
    return true;
  }
  get cellSelector() {
    return this.hasAttribute("cell-selector") ? this.getAttribute("cell-selector") : null;
  }
  get allCells() {
    return this.cellSelector ? Array.from(this.querySelectorAll(this.cellSelector)) : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex);
  }
  get cellAlign() {
    const scrollSnapAlign = getComputedStyle(this.cells[0]).scrollSnapAlign;
    return scrollSnapAlign === "none" ? "center" : scrollSnapAlign;
  }
  get groupCells() {
    if (this.hasAttribute("group-cells")) {
      const number = parseInt(this.getAttribute("group-cells"));
      return isNaN(number) ? Math.floor(this.clientWidth / this.cells[0].clientWidth) : number;
    } else {
      return 1;
    }
  }
  get adaptiveHeight() {
    return this.hasAttribute("adaptive-height");
  }
  get isScrollable() {
    return this.scrollWidth !== this.clientWidth || this.scrollHeight !== this.clientHeight;
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    this.select(Math.max(__privateGet(this, _targetIndex) - this.groupCells, 0), { instant });
  }
  next({ instant = false } = {}) {
    this.select(Math.min(__privateGet(this, _targetIndex) + this.groupCells, this.cells.length - 1), { instant });
  }
  select(index, { instant = false } = {}) {
    if (!(index in this.cells)) {
      return;
    }
    this.dispatchEvent(new CustomEvent("carousel:select", { detail: { index, cell: this.cells[index] } }));
    if ("checkVisibility" in this && this.checkVisibility() || this.offsetWidth > 0 && this.offsetHeight > 0) {
      const targetScrollLeft = __privateMethod(this, _ScrollCarousel_instances, calculateLeftScroll_fn).call(this, this.cells[index]);
      if (this.scrollLeft !== targetScrollLeft) {
        __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, index);
        __privateSet(this, _hasPendingProgrammaticScroll, true);
        this.scrollTo({ left: targetScrollLeft, behavior: instant ? "auto" : "smooth" });
      } else {
        __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
      }
    } else {
      __privateSet(this, _targetIndex, index);
      __privateSet(this, _forceChangeEvent, true);
    }
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    __privateSet(this, _forceChangeEvent, true);
    this.dispatchEvent(new CustomEvent("carousel:filter", { detail: { filteredIndexes: indexes } }));
  }
};
_hasPendingProgrammaticScroll = new WeakMap();
_onMouseDownListener = new WeakMap();
_onMouseMoveListener = new WeakMap();
_onMouseClickListener = new WeakMap();
_onMouseUpListener = new WeakMap();
_targetIndex = new WeakMap();
_forceChangeEvent = new WeakMap();
_dragPosition = new WeakMap();
_isDragging = new WeakMap();
_dispatchableScrollEvents = new WeakMap();
_scrollTimeout = new WeakMap();
_ScrollCarousel_instances = new WeakSet();
/**
 * -------------------------------------------------------------------------------------------------------------------
 * PRIVATE METHODS
 * -------------------------------------------------------------------------------------------------------------------
 */
/**
 * Setup all the listeners needed for the carousel to work properly
 */
setupListeners_fn = function() {
  if (this.allCells.length > 1) {
    this.addEventListener("carousel:change", __privateMethod(this, _ScrollCarousel_instances, preloadImages_fn));
    this.addEventListener("scroll", throttle(__privateMethod(this, _ScrollCarousel_instances, onScroll_fn).bind(this)));
    this.addEventListener("scrollend", __privateMethod(this, _ScrollCarousel_instances, onScrollEnd_fn));
    if (this.hasAttribute("allow-drag")) {
      const mediaQuery = window.matchMedia("screen and (pointer: fine)");
      mediaQuery.addEventListener("change", (event) => {
        if (event.matches) {
          this.addEventListener("mousedown", __privateGet(this, _onMouseDownListener));
        } else {
          this.removeEventListener("mousedown", __privateGet(this, _onMouseDownListener));
        }
      });
      if (mediaQuery.matches) {
        this.addEventListener("mousedown", __privateGet(this, _onMouseDownListener));
      }
    }
    if (this.adaptiveHeight) {
      this.addEventListener("carousel:settle", __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.select(this.cells.indexOf(event.target), { instant: event.detail.load }));
    }
  }
};
updateTargetIndex_fn = function(newValue) {
  if (newValue === __privateGet(this, _targetIndex) && !__privateGet(this, _forceChangeEvent)) {
    return;
  }
  __privateSet(this, _targetIndex, newValue);
  __privateSet(this, _forceChangeEvent, false);
  this.dispatchEvent(new CustomEvent("carousel:change", { detail: { index: newValue, cell: this.cells[newValue] } }));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * SCROLL MANAGEMENT
 * -------------------------------------------------------------------------------------------------------------------
 */
onScroll_fn = function() {
  const scrollEdgeThreshold = 100, normalizedScrollLeft = Math.round(Math.abs(this.scrollLeft - Math.abs(parseInt(getComputedStyle(this).marginInlineStart) || 0)));
  if (normalizedScrollLeft < scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["nearingStart"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-nearing", { detail: { position: "start" } }));
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = true;
  }
  if (normalizedScrollLeft >= scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["leavingStart"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-leaving", { detail: { position: "start" } }));
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = true;
  }
  if (this.scrollWidth - this.clientWidth < normalizedScrollLeft + scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["nearingEnd"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-nearing", { detail: { position: "end" } }));
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = true;
  }
  if (this.scrollWidth - this.clientWidth >= normalizedScrollLeft + scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["leavingEnd"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-leaving", { detail: { position: "end" } }));
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = true;
  }
  if (!("onscrollend" in window)) {
    clearTimeout(__privateGet(this, _scrollTimeout));
    __privateSet(this, _scrollTimeout, setTimeout(() => {
      this.dispatchEvent(new CustomEvent("scrollend", { bubbles: true }));
    }, 75));
  }
  if (__privateGet(this, _hasPendingProgrammaticScroll)) {
    return;
  }
  __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
};
onScrollEnd_fn = function() {
  __privateSet(this, _hasPendingProgrammaticScroll, false);
  if (!__privateGet(this, _isDragging)) {
    this.style.removeProperty("scroll-snap-type");
  }
  __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
  this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index: this.selectedIndex, cell: this.selectedCell } }));
};
/**
 * Calculate the amount to scroll to align the cell with the "cell-align" rule
 */
calculateLeftScroll_fn = function(cell) {
  let scrollLeft;
  switch (this.cellAlign) {
    case "start":
      scrollLeft = document.dir === "ltr" ? cell.offsetLeft - (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0) - (parseInt(getComputedStyle(this).marginInlineStart) || 0) - (parseInt(getComputedStyle(this).paddingInlineStart) || 0) : cell.offsetLeft + cell.offsetWidth - this.clientWidth + (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0) + (parseInt(getComputedStyle(this).marginInlineStart) || 0) + (parseInt(getComputedStyle(this).paddingInlineStart) || 0);
      break;
    case "center":
      scrollLeft = Math.round(cell.offsetLeft - this.clientWidth / 2 + cell.clientWidth / 2);
      break;
    case "end":
      scrollLeft = document.dir === "ltr" ? cell.offsetLeft + cell.offsetWidth - this.clientWidth + (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0) + (parseInt(getComputedStyle(this).marginInlineEnd) || 0) + (parseInt(getComputedStyle(this).paddingInlineEnd) || 0) : cell.offsetLeft - (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0) - (parseInt(getComputedStyle(this).marginInlineEnd) || 0) - (parseInt(getComputedStyle(this).paddingInlineEnd) || 0);
      break;
  }
  return document.dir === "ltr" ? Math.min(Math.max(scrollLeft, 0), this.scrollWidth - this.clientWidth) : Math.min(Math.max(scrollLeft, this.clientWidth - this.scrollWidth), 0);
};
calculateClosestIndexToAlignment_fn = function() {
  let cellAlign = this.cellAlign, offsetAccumulators, targetPoint;
  if (cellAlign === "center") {
    offsetAccumulators = this.cells.map((cell) => Math.round(cell.offsetLeft + cell.clientWidth / 2));
    targetPoint = Math.round(this.scrollLeft + this.clientWidth / 2);
  } else if (cellAlign === "start" && document.dir === "ltr" || cellAlign === "end" && document.dir === "rtl") {
    offsetAccumulators = this.cells.map((cell) => cell.offsetLeft - (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0) - (parseInt(getComputedStyle(this).marginInlineStart) || 0) - (parseInt(getComputedStyle(this).paddingInlineStart) || 0));
    targetPoint = this.scrollLeft;
  } else {
    offsetAccumulators = this.cells.map((cell) => cell.offsetLeft + cell.clientWidth);
    targetPoint = this.scrollLeft + this.clientWidth;
  }
  return offsetAccumulators.indexOf(offsetAccumulators.reduce((prev, curr) => Math.abs(curr - targetPoint) < Math.abs(prev - targetPoint) ? curr : prev));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * DRAG FEATURE
 * -------------------------------------------------------------------------------------------------------------------
 */
onMouseDown_fn = function(event) {
  __privateSet(this, _dragPosition, {
    // The current scroll
    left: this.scrollLeft,
    top: this.scrollTop,
    // Get the current mouse position
    x: event.clientX,
    y: event.clientY
  });
  __privateSet(this, _isDragging, true);
  this.style.setProperty("scroll-snap-type", "none");
  this.addEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
  this.addEventListener("click", __privateGet(this, _onMouseClickListener), { once: true });
  document.addEventListener("mouseup", __privateGet(this, _onMouseUpListener));
};
onMouseMove_fn = function(event) {
  event.preventDefault();
  const [dx, dy] = [event.clientX - __privateGet(this, _dragPosition).x, event.clientY - __privateGet(this, _dragPosition).y];
  this.scrollTop = __privateGet(this, _dragPosition).top - dy;
  this.scrollLeft = __privateGet(this, _dragPosition).left - dx;
};
onMouseClick_fn = function(event) {
  if (event.clientX - __privateGet(this, _dragPosition).x !== 0) {
    event.preventDefault();
  }
};
onMouseUp_fn = function(event) {
  __privateSet(this, _isDragging, false);
  if (event.clientX - __privateGet(this, _dragPosition).x === 0) {
    this.style.removeProperty("scroll-snap-type");
  } else if (!__privateGet(this, _hasPendingProgrammaticScroll)) {
    this.scrollTo({ left: __privateMethod(this, _ScrollCarousel_instances, calculateLeftScroll_fn).call(this, this.selectedCell), behavior: "smooth" });
  }
  this.removeEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
  document.removeEventListener("mouseup", __privateGet(this, _onMouseUpListener));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * OTHER
 * -------------------------------------------------------------------------------------------------------------------
 */
onResize_fn = function() {
  if (this.selectedIndex !== __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this)) {
    this.select(this.selectedIndex, { instant: true });
  }
  if (this.adaptiveHeight) {
    __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(this);
  }
  this.classList.toggle("is-scrollable", this.scrollWidth > this.clientWidth);
};
onMutate_fn = function() {
  __privateSet(this, _forceChangeEvent, true);
};
adaptHeight_fn = function() {
  if (this.clientHeight === this.selectedCell.clientHeight) {
    return;
  }
  this.style.maxHeight = null;
  if (this.isScrollable) {
    this.style.maxHeight = `${this.selectedCell.clientHeight}px`;
  }
};
preloadImages_fn = function() {
  requestAnimationFrame(() => {
    const previousSlide = this.cells[Math.max(this.selectedIndex - 1, 0)], nextSlide = this.cells[Math.min(this.selectedIndex + 1, this.cells.length - 1)];
    [previousSlide, this.selectedCell, nextSlide].filter((item) => item !== null).forEach((item) => {
      Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.removeAttribute("loading"));
      Array.from(item.querySelectorAll('video[preload="none"]')).forEach((video) => video.setAttribute("preload", "metadata"));
    });
  });
};
if (!window.customElements.get("scroll-carousel")) {
  window.customElements.define("scroll-carousel", ScrollCarousel);
}

// js/common/carousel/carousel-navigation.js
var _abortController2, _allItems, _CarouselNavigation_instances, onCarouselFilter_fn;
var CarouselNavigation = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CarouselNavigation_instances);
    __privateAdd(this, _abortController2);
    __privateAdd(this, _allItems, []);
  }
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel navigation component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    __privateSet(this, _abortController2, new AbortController());
    __privateSet(this, _allItems, Array.from(this.querySelectorAll("button")));
    __privateGet(this, _allItems).forEach((button) => button.addEventListener("click", () => this.onButtonClicked(this.items.indexOf(button)), { signal: __privateGet(this, _abortController2).signal }));
    this.carousel.addEventListener("carousel:change", (event) => this.onNavigationChange(event.detail.index), { signal: __privateGet(this, _abortController2).signal });
    this.carousel.addEventListener("carousel:filter", __privateMethod(this, _CarouselNavigation_instances, onCarouselFilter_fn).bind(this), { signal: __privateGet(this, _abortController2).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController2).abort();
  }
  get items() {
    return __privateGet(this, _allItems).filter((item) => !item.hasAttribute("hidden"));
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
  get selectedIndex() {
    return __privateGet(this, _allItems).findIndex((button) => button.getAttribute("aria-current") === "true");
  }
  onButtonClicked(newIndex) {
    if (this.carousel.canChangeSlide()) {
      this.carousel.select(newIndex);
      this.onNavigationChange(newIndex);
    }
  }
  onNavigationChange(newIndex) {
    this.items.forEach((button, index) => button.setAttribute("aria-current", newIndex === index ? "true" : "false"));
    if (this.hasAttribute("align-selected") && (this.scrollWidth !== this.clientWidth || this.scrollHeight !== this.clientHeight)) {
      this.scrollTo({
        left: this.items[newIndex].offsetLeft - this.clientWidth / 2 + this.items[newIndex].clientWidth / 2,
        top: this.items[newIndex].offsetTop - this.clientHeight / 2 + this.items[newIndex].clientHeight / 2,
        behavior: matchesMediaQuery("motion-safe") ? "smooth" : "auto"
      });
    }
  }
};
_abortController2 = new WeakMap();
_allItems = new WeakMap();
_CarouselNavigation_instances = new WeakSet();
onCarouselFilter_fn = function(event) {
  __privateGet(this, _allItems).forEach((item, index) => {
    item.toggleAttribute("hidden", (event.detail.filteredIndexes || []).includes(index));
  });
};
var _abortController3, _mutationObserver, _CarouselDirectionButton_instances, onClick_fn, onCheckScrollability_fn;
var CarouselDirectionButton = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CarouselDirectionButton_instances);
    __privateAdd(this, _abortController3);
    __privateAdd(this, _mutationObserver, new MutationObserver(__privateMethod(this, _CarouselDirectionButton_instances, onCheckScrollability_fn).bind(this)));
  }
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel prev button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    __privateSet(this, _abortController3, new AbortController());
    this.addEventListener("click", __privateMethod(this, _CarouselDirectionButton_instances, onClick_fn), { signal: __privateGet(this, _abortController3).signal });
    this.carousel.addEventListener("scroll:edge-nearing", (event) => this.firstElementChild.disabled = event.detail.position === this.direction, { signal: __privateGet(this, _abortController3).signal });
    this.carousel.addEventListener("scroll:edge-leaving", (event) => this.firstElementChild.disabled = event.detail.position === this.direction ? false : this.firstElementChild.disabled, { signal: __privateGet(this, _abortController3).signal });
    __privateGet(this, _mutationObserver).observe(this.carousel, { attributes: true, attributeFilter: ["class"], childList: false, subtree: false });
    __privateMethod(this, _CarouselDirectionButton_instances, onCheckScrollability_fn).call(this);
  }
  disconnectedCallback() {
    __privateGet(this, _abortController3).abort();
  }
  get direction() {
    throw "Carousel direction button cannot be used directly. Use <carousel-prev-button> or <carousel-next-button> instead.";
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
_abortController3 = new WeakMap();
_mutationObserver = new WeakMap();
_CarouselDirectionButton_instances = new WeakSet();
onClick_fn = function() {
  this.direction === "start" ? this.carousel.previous() : this.carousel.next();
};
onCheckScrollability_fn = function() {
  if (this.carousel instanceof ScrollCarousel) {
    this.toggleAttribute("hidden", !this.carousel.isScrollable);
  }
};
var CarouselPrevButton = class extends CarouselDirectionButton {
  get direction() {
    return "start";
  }
};
var CarouselNextButton = class extends CarouselDirectionButton {
  get direction() {
    return "end";
  }
};
var _CarouselPlayerButton_instances, togglePlayer_fn, onPlayerStart_fn;
var CarouselPlayerButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CarouselPlayerButton_instances);
    this.addEventListener("click", __privateMethod(this, _CarouselPlayerButton_instances, togglePlayer_fn).bind(this));
    this.carousel.addEventListener("carousel:select", __privateMethod(this, _CarouselPlayerButton_instances, onPlayerStart_fn).bind(this));
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
_CarouselPlayerButton_instances = new WeakSet();
togglePlayer_fn = function() {
  const button = this.querySelector("button");
  button.firstElementChild.classList.toggle("hidden");
  button.lastElementChild.classList.toggle("hidden");
  if (this.carousel.player.paused) {
    this.carousel.player.resume();
  } else {
    this.carousel.player.pause();
  }
};
onPlayerStart_fn = function() {
  const button = this.querySelector("button");
  button.firstElementChild.classList.remove("hidden");
  button.lastElementChild.classList.add("hidden");
};
var _CarouselPageIndicator_instances, updateIndicator_fn;
var CarouselPageIndicator = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CarouselPageIndicator_instances);
  }
  connectedCallback() {
    this.carousel.addEventListener("carousel:change", __privateMethod(this, _CarouselPageIndicator_instances, updateIndicator_fn).bind(this));
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
  get currentSlideIndex() {
    return this.querySelector("[current-slide-index]");
  }
  get pageSize() {
    return this.querySelector("[page-size]");
  }
};
_CarouselPageIndicator_instances = new WeakSet();
updateIndicator_fn = function(event) {
  let pageSize = 0;
  Array.from(this.carousel.children).forEach((item) => {
    if (!item.hidden) {
      pageSize += 1;
    }
  });
  this.pageSize.innerText = pageSize.toString();
  this.currentSlideIndex.innerText = (event.detail.index + 1).toString();
};
if (!window.customElements.get("carousel-prev-button")) {
  window.customElements.define("carousel-prev-button", CarouselPrevButton);
}
if (!window.customElements.get("carousel-next-button")) {
  window.customElements.define("carousel-next-button", CarouselNextButton);
}
if (!window.customElements.get("carousel-navigation")) {
  window.customElements.define("carousel-navigation", CarouselNavigation);
}
if (!window.customElements.get("carousel-player-button")) {
  window.customElements.define("carousel-player-button", CarouselPlayerButton);
}
if (!window.customElements.get("carousel-page-indicator")) {
  window.customElements.define("carousel-page-indicator", CarouselPageIndicator);
}

// js/common/carousel/effect-carousel.js
import { animate as animate3, animateSequence, inView as inView4 } from "vendor";
var _listenersAbortController, _gestureArea, _player, _targetIndex2, _preventInitialTransition, _hasPendingTransition, _EffectCarousel_instances, setupListeners_fn2, onKeyboardNavigation_fn, preloadImages_fn2;
var EffectCarousel = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _EffectCarousel_instances);
    __privateAdd(this, _listenersAbortController);
    __privateAdd(this, _gestureArea);
    __privateAdd(this, _player);
    __privateAdd(this, _targetIndex2, 0);
    __privateAdd(this, _preventInitialTransition, false);
    __privateAdd(this, _hasPendingTransition, false);
    __privateMethod(this, _EffectCarousel_instances, setupListeners_fn2).call(this);
    inView4(this, () => this.onBecameVisible());
    this.addEventListener("carousel:settle", (event) => {
      this.allCells.forEach((cell) => cell.classList.toggle("is-selected", cell === event.detail.cell));
    });
  }
  connectedCallback() {
    __privateSet(this, _targetIndex2, Math.max(0, this.cells.findIndex((item) => item.classList.contains("is-selected"))));
    inView4(this, () => __privateMethod(this, _EffectCarousel_instances, preloadImages_fn2).call(this));
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get allowSwipe() {
    return this.hasAttribute("allow-swipe");
  }
  get cellSelector() {
    return this.hasAttribute("cell-selector") ? this.getAttribute("cell-selector") : null;
  }
  get blockChangeWhenTransitioning() {
    return false;
  }
  get allCells() {
    return this.cellSelector ? Array.from(this.querySelectorAll(this.cellSelector)) : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex2);
  }
  get player() {
    return __privateGet(this, _player);
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  canChangeSlide() {
    return !(this.blockChangeWhenTransitioning && __privateGet(this, _hasPendingTransition));
  }
  previous({ instant = false } = {}) {
    return this.select((this.selectedIndex - 1 + this.cells.length) % this.cells.length, { instant, direction: "previous" });
  }
  next({ instant = false } = {}) {
    return this.select((this.selectedIndex + 1 + this.cells.length) % this.cells.length, { instant, direction: "next" });
  }
  async select(index, { instant = false, direction = null } = {}) {
    if (!(index in this.cells) || this.blockChangeWhenTransitioning && __privateGet(this, _hasPendingTransition)) {
      return Promise.resolve();
    }
    this.dispatchEvent(new CustomEvent("carousel:select", { detail: { index, cell: this.cells[index] } }));
    if (index === this.selectedIndex) {
      return Promise.resolve();
    }
    __privateGet(this, _player)?.pause();
    const [fromSlide, toSlide] = [this.selectedCell, this.cells[index]];
    direction ??= index > this.selectedIndex ? "next" : "previous";
    __privateSet(this, _targetIndex2, index);
    this.dispatchEvent(new CustomEvent("carousel:change", { detail: { index, cell: this.cells[index] } }));
    const animationControls = this.createOnChangeAnimationControls(fromSlide, toSlide, { direction });
    __privateSet(this, _hasPendingTransition, true);
    if ("leaveControls" in animationControls && "enterControls" in animationControls) {
      const leaveAnimationControls = animationControls.leaveControls();
      if (instant) {
        leaveAnimationControls.complete();
      }
      await leaveAnimationControls;
      __privateGet(this, _player)?.setDuration(await this.getPlayerDurationForSlide(toSlide));
      __privateGet(this, _player)?.resume(true);
      fromSlide.classList.remove("is-selected");
      toSlide.classList.add("is-selected");
      const enterAnimationControls = animationControls.enterControls();
      if (instant) {
        enterAnimationControls.complete();
      }
      await enterAnimationControls;
    } else {
      if (instant) {
        animationControls.complete();
      }
      __privateGet(this, _player)?.setDuration(await this.getPlayerDurationForSlide(toSlide));
      __privateGet(this, _player)?.resume(true);
      toSlide.classList.add("is-selected");
      await animationControls;
      fromSlide.classList.remove("is-selected");
    }
    __privateSet(this, _hasPendingTransition, false);
    this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index, cell: this.cells[index] } }));
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    this.dispatchEvent(new CustomEvent("carousel:filter", { detail: { filteredIndexes: indexes } }));
  }
  async onBecameVisible() {
    const animationControls = this.createOnBecameVisibleAnimationControls(this.selectedCell);
    [this.selectedCell, ...this.selectedCell.querySelectorAll("[reveal-on-scroll]")].forEach((element) => {
      element.removeAttribute("reveal-on-scroll");
    });
    if (__privateGet(this, _preventInitialTransition) && typeof animationControls.complete === "function") {
      animationControls.complete();
    }
    return animationControls.then(async () => {
      __privateGet(this, _player)?.setDuration(await this.getPlayerDurationForSlide(this.selectedCell));
      __privateGet(this, _player)?.resume(true);
      this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index: this.selectedIndex, cell: this.selectedCell } }));
    });
  }
  /**
   * The animation controls when the carousel enter into the view for the first time (by default, none)
   */
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate3(toSlide, {}, { duration: 0 });
  }
  /**
   * Define the transition when the slide changes
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    return animateSequence([
      [fromSlide, { opacity: [1, 0] }, { duration: 0.3 }],
      [toSlide, { opacity: [0, 1] }, { duration: 0.3, at: "<" }]
    ]);
  }
  /**
   * This method is called whenever the slide changes. By default, it uses the duration set on the autoplay attribute,
   * but this can be overridden for each slide (the argument gives the new current slide). This can be useful for
   * slideshow for instance, to have a different duration for video slide.
   *
   * Please note this is an async function, because the metadata (video duration) might not be available yet.
   */
  async getPlayerDurationForSlide(slide) {
    return this.getAttribute("autoplay") ?? 5;
  }
  /**
   * When the breakpoint changes (for instance from mobile to desktop), we may have to clean up the existing
   * attributes leave by Motion
   */
  cleanUpAnimations() {
    this.allCells.forEach((cell) => {
      cell.style.removeProperty("opacity");
      cell.style.removeProperty("visibility");
    });
  }
};
_listenersAbortController = new WeakMap();
_gestureArea = new WeakMap();
_player = new WeakMap();
_targetIndex2 = new WeakMap();
_preventInitialTransition = new WeakMap();
_hasPendingTransition = new WeakMap();
_EffectCarousel_instances = new WeakSet();
setupListeners_fn2 = async function() {
  if (this.hasAttribute("disabled-on")) {
    mediaQueryListener(this.getAttribute("disabled-on"), (event) => {
      if (event.matches) {
        __privateGet(this, _listenersAbortController)?.abort();
        this.cleanUpAnimations();
      } else {
        __privateMethod(this, _EffectCarousel_instances, setupListeners_fn2).call(this);
      }
    });
    if (matchesMediaQuery(this.getAttribute("disabled-on"))) {
      return;
    }
  }
  __privateSet(this, _listenersAbortController, new AbortController());
  const listenerOptions = { signal: __privateGet(this, _listenersAbortController).signal };
  if (Shopify.designMode) {
    this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => __privateSet(this, _preventInitialTransition, event.detail.load), listenerOptions);
  }
  if (this.allCells.length > 1) {
    this.addEventListener("carousel:change", __privateMethod(this, _EffectCarousel_instances, preloadImages_fn2));
    if (this.allowSwipe) {
      __privateSet(this, _gestureArea, new GestureArea(this, { signal: __privateGet(this, _listenersAbortController).signal }));
      this.addEventListener("swipeleft", this.next, listenerOptions);
      this.addEventListener("swiperight", this.previous, listenerOptions);
    }
    if (!this.hasAttribute("disable-keyboard-navigation")) {
      this.tabIndex = 0;
      this.addEventListener("keydown", __privateMethod(this, _EffectCarousel_instances, onKeyboardNavigation_fn), listenerOptions);
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.select(this.cells.indexOf(event.target), { instant: event.detail.load }), listenerOptions);
    }
    if (this.hasAttribute("autoplay")) {
      __privateGet(this, _player) ?? __privateSet(this, _player, new Player());
      __privateGet(this, _player).addEventListener("player:end", this.next.bind(this), listenerOptions);
      if (this.hasAttribute("pause-on-hover")) {
        this.addEventListener("mouseenter", () => __privateGet(this, _player).pause(), listenerOptions);
        this.addEventListener("mouseleave", () => __privateGet(this, _player).resume(), listenerOptions);
      }
      if (Shopify.designMode) {
        this.addEventListener("shopify:block:select", () => __privateGet(this, _player).stop(), listenerOptions);
        this.addEventListener("shopify:block:deselect", () => __privateGet(this, _player).start(), listenerOptions);
      }
    }
  }
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * OTHER
 * -------------------------------------------------------------------------------------------------------------------
 */
onKeyboardNavigation_fn = function(event) {
  if (event.target !== this) {
    return;
  }
  if (event.code === "ArrowLeft") {
    this.previous();
  } else if (event.code === "ArrowRight") {
    this.next();
  }
};
preloadImages_fn2 = function() {
  const previousSlide = this.cells[(this.selectedIndex - 1 + this.cells.length) % this.cells.length], nextSlide = this.cells[(this.selectedIndex + 1 + this.cells.length) % this.cells.length];
  [previousSlide, this.selectedCell, nextSlide].forEach((item) => {
    Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.removeAttribute("loading"));
    Array.from(item.querySelectorAll('video[preload="none"]')).forEach((video) => video.setAttribute("preload", "metadata"));
  });
};
if (!window.customElements.get("effect-carousel")) {
  window.customElements.define("effect-carousel", EffectCarousel);
}

// js/common/cart/fetch-cart.js
var createCartPromise = () => {
  return new Promise(async (resolve) => {
    resolve(await (await fetch(`${Shopify.routes.root}cart.js`)).json());
  });
};
var fetchCart = createCartPromise();
document.addEventListener("cart:change", (event) => {
  fetchCart = event.detail["cart"];
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    fetchCart = createCartPromise();
  }
});
document.addEventListener("cart:refresh", () => {
  fetchCart = createCartPromise();
});

// js/common/cart/cart-count.js
var _abortController4, _CartCount_instances, updateFromServer_fn;
var CartCount = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartCount_instances);
    __privateAdd(this, _abortController4);
  }
  connectedCallback() {
    __privateSet(this, _abortController4, new AbortController());
    document.addEventListener("cart:change", (event) => this.itemCount = event.detail["cart"]["item_count"], { signal: __privateGet(this, _abortController4).signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(this), { signal: __privateGet(this, _abortController4).signal });
    window.addEventListener("pageshow", __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(this), { signal: __privateGet(this, _abortController4).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController4).abort();
  }
  set itemCount(count) {
    this.hidden = count === 0;
    this.querySelector("span").innerText = count;
  }
};
_abortController4 = new WeakMap();
_CartCount_instances = new WeakSet();
updateFromServer_fn = async function() {
  this.itemCount = (await fetchCart)["item_count"];
};
if (!window.customElements.get("cart-count")) {
  window.customElements.define("cart-count", CartCount);
}

// js/common/cart/cart-discount.js
var AbstractCartDiscount = class extends HTMLElement {
  async getDiscountCodes() {
    return (await fetchCart)["discount_codes"].filter((discount) => discount.applicable).map((discount) => discount.code.toLowerCase());
  }
  async toggleDiscount(event) {
    let target = event.currentTarget;
    target.setAttribute("aria-busy", "true");
    let discountCodes = await this.getDiscountCodes();
    if (target.hasAttribute("discount-code")) {
      discountCodes = discountCodes.filter((discount2) => discount2 !== target.getAttribute("discount-code").toLowerCase());
    }
    let discount = (discountCodes.length > 0 ? discountCodes.join(",") + "," : "") + (event.target.value || "");
    const response = await fetch(`${Shopify.routes.root}cart/update.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ discount })
    });
    target.setAttribute("aria-busy", "false");
    if (!response.ok) {
      this.dispatchEvent(new CustomEvent("cart:discount:error", { bubbles: true }));
      return;
    }
    const responseJson = await response.json();
    if (responseJson.discount_codes.some((obj) => obj.applicable === false)) {
      this.dispatchEvent(new CustomEvent("cart:discount:error", { bubbles: true }));
      return;
    } else {
      this.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));
    }
    if (window.themeVariables.settings.pageType === "cart") {
      window.location.reload();
    }
  }
};
var _abortController5, _CartDiscountBanner_instances, onCartDiscountError_fn;
var CartDiscountBanner = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartDiscountBanner_instances);
    __privateAdd(this, _abortController5);
  }
  connectedCallback() {
    __privateSet(this, _abortController5, new AbortController());
    document.addEventListener("cart:discount:error", __privateMethod(this, _CartDiscountBanner_instances, onCartDiscountError_fn).bind(this), { signal: __privateGet(this, _abortController5).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController5).abort();
  }
};
_abortController5 = new WeakMap();
_CartDiscountBanner_instances = new WeakSet();
onCartDiscountError_fn = function() {
  this.hidden = false;
};
var _hiddenDiscountInputOriginalValue, _CartDiscountField_instances, hiddenDiscountInput_get, updateHiddenInput_fn;
var CartDiscountField = class extends AbstractCartDiscount {
  constructor() {
    super();
    __privateAdd(this, _CartDiscountField_instances);
    __privateAdd(this, _hiddenDiscountInputOriginalValue);
    __privateSet(this, _hiddenDiscountInputOriginalValue, __privateGet(this, _CartDiscountField_instances, hiddenDiscountInput_get).value);
    this.addEventListener("change", this.toggleDiscount.bind(this));
    this.addEventListener("input", __privateMethod(this, _CartDiscountField_instances, updateHiddenInput_fn));
  }
};
_hiddenDiscountInputOriginalValue = new WeakMap();
_CartDiscountField_instances = new WeakSet();
hiddenDiscountInput_get = function() {
  return this.querySelector('[name="discount"]');
};
updateHiddenInput_fn = function(event) {
  __privateGet(this, _CartDiscountField_instances, hiddenDiscountInput_get).value = [__privateGet(this, _hiddenDiscountInputOriginalValue), event.target.value].filter((val) => val && val.trim() !== "").join(",");
};
var CartDiscountRemoveButton = class extends AbstractCartDiscount {
  constructor() {
    super();
    this.addEventListener("click", this.toggleDiscount.bind(this));
  }
};
if (!window.customElements.get("cart-discount-field")) {
  window.customElements.define("cart-discount-field", CartDiscountField);
}
if (!window.customElements.get("cart-discount-remove-button")) {
  window.customElements.define("cart-discount-remove-button", CartDiscountRemoveButton);
}
if (!window.customElements.get("cart-discount-banner")) {
  window.customElements.define("cart-discount-banner", CartDiscountBanner);
}

// js/common/cart/cart-note.js
var _CartNote_instances, onNoteChanged_fn;
var CartNote = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CartNote_instances);
    this.addEventListener("change", __privateMethod(this, _CartNote_instances, onNoteChanged_fn));
  }
};
_CartNote_instances = new WeakSet();
onNoteChanged_fn = function(event) {
  if (event.target.getAttribute("name") !== "note") {
    return;
  }
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: event.target.value }),
    keepalive: true
    // Allows to make sure the request is fired even when submitting the form
  });
};
if (!window.customElements.get("cart-note")) {
  window.customElements.define("cart-note", CartNote);
}

// js/common/cart/free-shipping-bar.js
var FreeShippingBar = class extends HTMLElement {
};
if (!window.customElements.get("free-shipping-bar")) {
  window.customElements.define("free-shipping-bar", FreeShippingBar);
}

// js/common/cart/line-item.js
import { Delegate } from "vendor";
var _delegate, _LineItem_instances, onQuantityChanged_fn, onChangeLinkClicked_fn, changeLineItemQuantity_fn;
var LineItem = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LineItem_instances);
    __privateAdd(this, _delegate, new Delegate(this));
    __privateGet(this, _delegate).on("change", "[data-line-key]", __privateMethod(this, _LineItem_instances, onQuantityChanged_fn).bind(this));
    __privateGet(this, _delegate).on("click", `[href*="${Shopify.routes.root}cart/change"]`, __privateMethod(this, _LineItem_instances, onChangeLinkClicked_fn).bind(this));
  }
};
_delegate = new WeakMap();
_LineItem_instances = new WeakSet();
onQuantityChanged_fn = function(event, target) {
  __privateMethod(this, _LineItem_instances, changeLineItemQuantity_fn).call(this, target.getAttribute("data-line-key"), parseInt(target.value));
};
onChangeLinkClicked_fn = function(event, target) {
  event.preventDefault();
  const url = new URL(target.href);
  __privateMethod(this, _LineItem_instances, changeLineItemQuantity_fn).call(this, url.searchParams.get("id"), parseInt(url.searchParams.get("quantity")));
};
changeLineItemQuantity_fn = async function(lineKey, targetQuantity) {
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  const lineItem = this.closest("line-item");
  lineItem?.dispatchEvent(new CustomEvent("line-item:will-change", { bubbles: true, detail: { targetQuantity } }));
  let sectionsToBundle = /* @__PURE__ */ new Set();
  document.documentElement.dispatchEvent(new CustomEvent("cart:prepare-bundled-sections", { bubbles: true, detail: { sections: sectionsToBundle } }));
  const response = await fetch(`${Shopify.routes.root}cart/change.js`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: lineKey,
      quantity: targetQuantity,
      sections: [...sectionsToBundle].join(",")
    })
  });
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
  if (!response.ok) {
    const responseContent = await response.json();
    const errorContainer = this.querySelector(".line-item__error-container");
    errorContainer.innerHTML = "";
    const errorSvg = `<svg width="13" viewBox="0 0 13 13"><circle cx="6.5" cy="6.5" r="5.5" stroke="#fff" stroke-width="2"></circle><circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width=".7"></circle><path fill="#fff" d="m5.874 3.528.1 4.044h1.053l.1-4.044zm.627 6.133c.38 0 .68-.288.68-.656s-.3-.656-.68-.656-.681.288-.681.656.3.656.68.656"></path><path fill="#fff" stroke="#EB001B" stroke-width=".7" d="M5.874 3.178h-.359l.01.359.1 4.044.008.341h1.736l.008-.341.1-4.044.01-.359H5.873Zm.627 6.833c.56 0 1.03-.432 1.03-1.006s-.47-1.006-1.03-1.006-1.031.432-1.031 1.006.47 1.006 1.03 1.006Z"></path></svg>`;
    errorContainer.insertAdjacentHTML("afterbegin", `<p class="h-stack gap-1.5 text-sm text-error" role="alert">${errorSvg} ${responseContent["description"]}</p>`);
    this.querySelector("quantity-selector")?.restoreDefaultValue();
  } else {
    const cartContent = await response.json();
    if (window.themeVariables.settings.pageType === "cart") {
      window.location.reload();
    } else {
      const lineItemAfterChange = cartContent["items"].filter((lineItem2) => lineItem2["key"] === lineKey);
      lineItem?.dispatchEvent(new CustomEvent("line-item:change", {
        bubbles: true,
        detail: {
          quantity: lineItemAfterChange.length === 0 ? 0 : lineItemAfterChange[0]["quantity"],
          cart: cartContent
        }
      }));
      document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
        bubbles: true,
        detail: {
          baseEvent: "line-item:change",
          cart: cartContent
        }
      }));
    }
  }
};
if (!window.customElements.get("line-item")) {
  window.customElements.define("line-item", LineItem);
}

// js/common/cart/shipping-estimator.js
var _estimateShippingListener, _ShippingEstimator_instances, estimateShipping_fn, getAsyncShippingRates_fn, formatShippingRates_fn, formatError_fn;
var ShippingEstimator = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ShippingEstimator_instances);
    __privateAdd(this, _estimateShippingListener, __privateMethod(this, _ShippingEstimator_instances, estimateShipping_fn).bind(this));
  }
  connectedCallback() {
    this.submitButton = this.querySelector('[type="button"]');
    this.resultsElement = this.querySelector('[aria-live="polite"]');
    this.submitButton.addEventListener("click", __privateGet(this, _estimateShippingListener));
  }
  disconnectedCallback() {
    this.submitButton.removeEventListener("click", __privateGet(this, _estimateShippingListener));
  }
};
_estimateShippingListener = new WeakMap();
_ShippingEstimator_instances = new WeakSet();
estimateShipping_fn = async function(event) {
  event.preventDefault();
  const zip = this.querySelector('[name="address[zip]"]').value, country = this.querySelector('[name="address[country]"]').value, province = this.querySelector('[name="address[province]"]').value;
  this.submitButton.setAttribute("aria-busy", "true");
  const prepareResponse = await fetch(`${Shopify.routes.root}cart/prepare_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`, { method: "POST" });
  if (prepareResponse.ok) {
    const shippingRates = await __privateMethod(this, _ShippingEstimator_instances, getAsyncShippingRates_fn).call(this, zip, country, province);
    __privateMethod(this, _ShippingEstimator_instances, formatShippingRates_fn).call(this, shippingRates);
  } else {
    const jsonError = await prepareResponse.json();
    __privateMethod(this, _ShippingEstimator_instances, formatError_fn).call(this, jsonError);
  }
  this.resultsElement.hidden = false;
  this.submitButton.removeAttribute("aria-busy");
};
getAsyncShippingRates_fn = async function(zip, country, province) {
  const response = await fetch(`${Shopify.routes.root}cart/async_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`);
  const responseAsText = await response.text();
  if (responseAsText === "null") {
    return __privateMethod(this, _ShippingEstimator_instances, getAsyncShippingRates_fn).call(this, zip, country, province);
  } else {
    return JSON.parse(responseAsText)["shipping_rates"];
  }
};
formatShippingRates_fn = function(shippingRates) {
  let formattedShippingRates = shippingRates.map((shippingRate) => {
    return `<li>${shippingRate["presentment_name"]}: ${shippingRate["currency"]} ${shippingRate["price"]}</li>`;
  });
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${shippingRates.length === 0 ? window.themeVariables.strings.shippingEstimatorNoResults : shippingRates.length === 1 ? window.themeVariables.strings.shippingEstimatorOneResult : window.themeVariables.strings.shippingEstimatorMultipleResults}</p>
        ${formattedShippingRates === "" ? "" : `<ul class="list-disc" role="list">${formattedShippingRates.join("")}</ul>`}
      </div>
    `;
};
formatError_fn = function(errors) {
  let formattedShippingRates = Object.keys(errors).map((errorKey) => {
    return `<li>${errors[errorKey]}</li>`;
  });
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-1">
        <p>${window.themeVariables.strings.shippingEstimatorError}</p>
        <ul class="list-disc" role="list">${formattedShippingRates}</ul>
      </div>
    `;
};
if (!window.customElements.get("shipping-estimator")) {
  window.customElements.define("shipping-estimator", ShippingEstimator);
}

// js/common/collection/collection-facets-floating-button.js
var CollectionFacetsFloatingButton = class extends SandwichVisibility {
  get startMarker() {
    return document.querySelector(".collection__toolbar");
  }
  get endMarker() {
    return document.querySelector(".shopify-section--footer");
  }
};
if (!window.customElements.get("collection-facets-floating-button")) {
  window.customElements.define("collection-facets-floating-button", CollectionFacetsFloatingButton);
}

// js/common/collection/layout-selector-button.js
var _LayoutSelectorButton_instances, onChange_fn;
var LayoutSelectorButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LayoutSelectorButton_instances);
    this.addEventListener("change", __privateMethod(this, _LayoutSelectorButton_instances, onChange_fn));
  }
};
_LayoutSelectorButton_instances = new WeakSet();
onChange_fn = function(event) {
  let attributes = {};
  if (event.target.name === "desktop-layout") {
    attributes["product_card_desktop_layout"] = event.target.value;
  } else if (event.target.name === "mobile-items-per-row") {
    attributes["product_card_mobile_items_per_row"] = parseInt(event.target.value);
  }
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      attributes
    })
  });
  const productList = this.closest(".collection").querySelector(".product-list");
  if (event.target.name === "mobile-items-per-row") {
    productList.setAttribute("mobile-items-per-row", event.target.value);
  } else if (event.target.name === "desktop-layout") {
    productList.setAttribute("desktop-layout", event.target.value);
  }
  if (window.themeVariables.settings.staggerProducts) {
    this.closest(".collection").querySelector("product-list").reveal();
  }
};
if (!window.customElements.get("collection-layout-selector-button")) {
  window.customElements.define("collection-layout-selector-button", LayoutSelectorButton);
}

// js/common/overlay/dialog-element.js
import { animate as animate4, FocusTrap, Delegate as Delegate2 } from "vendor";
var lockLayerCount = 0;
var _isLocked, _delegate2, _focusLeaveDelegate, _abortController6, _focusTrap, _isTransitioningToState, _originalParentBeforeAppend, _DialogElement_instances, allowOutsideClick_fn, allowOutsideClickTouch_fn, allowOutsideClickMouse_fn, onActivatorClicked_fn, onActivatorPointerEnter_fn, updateSlotVisibility_fn;
var DialogElement = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _DialogElement_instances);
    __privateAdd(this, _isLocked, false);
    __privateAdd(this, _delegate2, new Delegate2(document.body));
    __privateAdd(this, _focusLeaveDelegate, new Delegate2(document.body));
    __privateAdd(this, _abortController6);
    __privateAdd(this, _focusTrap);
    __privateAdd(this, _isTransitioningToState);
    __privateAdd(this, _originalParentBeforeAppend);
    this.setAttribute("role", "dialog");
    if (this.shadowDomTemplate) {
      this.attachShadow({ mode: "open" }).appendChild(this.shadowDomTemplate.content.cloneNode(true));
      this.shadowRoot.addEventListener("slotchange", (event) => __privateMethod(this, _DialogElement_instances, updateSlotVisibility_fn).call(this, event.target));
    }
    this.addEventListener("dialog:force-close", (event) => {
      this.hide();
      event.stopPropagation();
    });
  }
  static get observedAttributes() {
    return ["open"];
  }
  connectedCallback() {
    if (this.id) {
      __privateGet(this, _delegate2).off();
      __privateGet(this, _delegate2).on("click", `[aria-controls="${this.id}"]`, __privateMethod(this, _DialogElement_instances, onActivatorClicked_fn).bind(this));
      if (window.matchMedia("screen and (pointer: fine)").matches) {
        __privateGet(this, _delegate2).on("pointerenter", `[aria-controls="${this.id}"][data-open-on-hover]`, __privateMethod(this, _DialogElement_instances, onActivatorPointerEnter_fn).bind(this), true);
      }
    }
    __privateSet(this, _abortController6, new AbortController());
    if (this.shadowDomTemplate) {
      this.getShadowPartByName("overlay")?.addEventListener("click", this.hide.bind(this), { signal: this.abortController.signal });
      Array.from(this.shadowRoot.querySelectorAll("slot")).forEach((slot) => __privateMethod(this, _DialogElement_instances, updateSlotVisibility_fn).call(this, slot));
    }
    if (Shopify.designMode) {
      this._shopifySection = this._shopifySection || this.closest(".shopify-section");
      if (this._shopifySection) {
        if (this.hasAttribute("handle-editor-events")) {
          this._shopifySection.addEventListener("shopify:section:select", (event) => this.show({ animate: !event.detail.load }), { signal: this.abortController.signal });
          this._shopifySection.addEventListener("shopify:section:deselect", this.hide.bind(this), { signal: this.abortController.signal });
        }
        this._shopifySection.addEventListener("shopify:section:unload", () => this.remove(), { signal: this.abortController.signal });
      }
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate2).off();
    this.abortController.abort();
    this.focusTrap?.deactivate({ onDeactivate: () => {
    } });
    if (__privateGet(this, _isLocked)) {
      __privateSet(this, _isLocked, false);
      document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
    }
  }
  /**
   * Open the dialog element (the animation can be disabled by passing false as an argument). It optionally accepts two parameters:
   *
   * animate: if set to false, the dialog will open immediately without any animation
   * activator: the activator that has been used to show the dialog (if any)
   */
  async show({ animate: animate25 = true, activator, conditionToFulfill } = {}) {
    if (__privateGet(this, _isTransitioningToState) === "open" && this.open) {
      return Promise.resolve();
    }
    __privateSet(this, _isTransitioningToState, "open");
    this.controls.forEach((activator2) => activator2.setAttribute("aria-expanded", "true"));
    this.setAttribute("open", "");
    if (conditionToFulfill) {
      await conditionToFulfill;
    }
    __privateSet(this, _originalParentBeforeAppend, null);
    this.style.removeProperty("display");
    this.style.setProperty("display", this.shadowRoot ? "contents" : getComputedStyle(this).display);
    this.dispatchEvent(new CustomEvent("dialog:before-show", { detail: { activator } }));
    if (this.shouldAppendToBody && this.parentElement !== document.body) {
      __privateSet(this, _originalParentBeforeAppend, this.parentElement);
      document.body.append(this);
    }
    const animationControls = this.createEnterAnimationControls();
    if (!animate25) {
      animationControls.complete();
    }
    animationControls.then(() => {
      this.dispatchEvent(new CustomEvent("dialog:after-show", { detail: { activator } }));
      __privateSet(this, _isTransitioningToState, null);
    });
    if (this.shouldTrapFocus) {
      this.focusTrap.activate({
        checkCanFocusTrap: () => animationControls
      });
    }
    if (this.shouldLock) {
      lockLayerCount += 1;
      __privateSet(this, _isLocked, true);
      document.documentElement.classList.add("lock");
    }
    return animationControls;
  }
  /**
   * Hide the dialog element
   */
  hide() {
    if (__privateGet(this, _isTransitioningToState) === "close" && !this.open) {
      return Promise.resolve();
    }
    __privateSet(this, _isTransitioningToState, "close");
    this.controls.forEach((activator) => activator.setAttribute("aria-expanded", "false"));
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("dialog:before-hide"));
    const hideTransitionPromise = this.createLeaveAnimationControls();
    hideTransitionPromise.then(() => {
      if (this.parentElement === document.body && __privateGet(this, _originalParentBeforeAppend)) {
        if (document.getElementById(this.id) !== this) {
          return this.remove();
        }
        __privateGet(this, _originalParentBeforeAppend).appendChild(this);
        __privateSet(this, _originalParentBeforeAppend, null);
      }
      this.style.setProperty("display", "none");
      this.dispatchEvent(new CustomEvent("dialog:after-hide"));
      __privateSet(this, _isTransitioningToState, null);
    });
    this.focusTrap?.deactivate({
      checkCanReturnFocus: () => hideTransitionPromise
    });
    if (this.shouldLock) {
      __privateSet(this, _isLocked, false);
      document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
    }
    return hideTransitionPromise;
  }
  /**
   * Get the abort controller used to clean listeners. You can retrieve it in children classes to add your own listeners
   * that will be cleaned when the element is removed or re-rendered
   */
  get abortController() {
    return __privateGet(this, _abortController6);
  }
  /**
   * Get all the elements controlling this dialog (typically, button). An element controls this dialog if it has an
   * aria-controls attribute matching the ID of this dialog element
   */
  get controls() {
    return Array.from(this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`));
  }
  /**
   * Returns if the dialog is open or closed
   */
  get open() {
    return this.hasAttribute("open");
  }
  /**
   * If true is returned, then FocusTrap will activate and manage all the focus management. This is required for good
   * accessibility (such as keyboard management) and should normally not be set to false in children classes unless
   * there is a very good reason to do so
   */
  get shouldTrapFocus() {
    return true;
  }
  /**
   * When the dialog focus is trapped, define if the page is lock (not scrollable). This is usually desirable on
   * full screen modals
   */
  get shouldLock() {
    return false;
  }
  /**
   * By default, when the focus is trapped on an element, a click outside the trapped element close it. Sometimes, it
   * may be desirable to turn off all interactions so that all clicks outside don't do anything
   */
  get clickOutsideDeactivates() {
    return true;
  }
  /**
   * Sometimes (especially for drawer) we need to ensure that an element is on top of everything else. To do that,
   * we need to move the element to the body. We are doing that on open, and then restore the initial position on
   * close
   */
  get shouldAppendToBody() {
    return this.hasAttribute("append-to-body") ? true : false;
  }
  /**
   * Decide which element to focus first when the dialog focus is trapped. By default, the first focusable element
   * will be focused, but this can be overridden by passing a selector in the "initial-focus" attribute
   */
  get initialFocus() {
    return this.hasAttribute("initial-focus") ? this.getAttribute("initial-focus") === "false" ? false : this.querySelector(this.getAttribute("initial-focus")) : this.hasAttribute("tabindex") ? this : this.querySelector('input:not([type="hidden"])') || false;
  }
  /**
   * If set to true, then focus trap will not automatically scroll to the first focused element, which can cause
   * annoying experience.
   */
  get preventScrollWhenTrapped() {
    return true;
  }
  /**
   * Allow custom elements to define their own, custom trap stack. If none is defined, the default one will be used
   */
  get trapStack() {
    return null;
  }
  /**
   * If set to true, dialog can be close by clicking "escape"
   */
  get escapeDeactivates() {
    return true;
  }
  /**
   * Get the focus trap element configured with all the other attributes
   */
  get focusTrap() {
    return __privateSet(this, _focusTrap, __privateGet(this, _focusTrap) || new FocusTrap.createFocusTrap(this, {
      onDeactivate: this.hide.bind(this),
      allowOutsideClick: this.clickOutsideDeactivates ? __privateMethod(this, _DialogElement_instances, allowOutsideClick_fn).bind(this) : false,
      initialFocus: matchesMediaQuery("supports-hover") ? this.initialFocus : false,
      fallbackFocus: this,
      preventScroll: this.preventScrollWhenTrapped,
      escapeDeactivates: this.escapeDeactivates,
      tabbableOptions: {
        getShadowRoot: true
      },
      trapStack: this.trapStack
    }));
  }
  /**
   * Get the ShadowDOM template (if any). If there is one defined, the dialog automatically constructs it with the
   * shadow DOM. It will first attempt to check the "template" attribute and, if none is found, will fallback with
   * the first template children tag
   */
  get shadowDomTemplate() {
    if (this.hasAttribute("template")) {
      return document.getElementById(this.getAttribute("template"));
    }
    return this.querySelector(":scope > template");
  }
  /**
   * For dialog that use Shadow DOM, this allows a quick retrieval of parts by name
   */
  getShadowPartByName(name) {
    return this.shadowRoot?.querySelector(`[part="${name}"]`);
  }
  /**
   * Callback called when attributes changes. To show/hide the dialog, you should use exclusively the "show" and "hide"
   * methods. However, the theme might insert dialog that we want to be pre-opened (for instance if it has an error). To
   * do that, we monitor the "open" attribute and open the dialog if it is set
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        if (oldValue === null && newValue === "") {
          this.show();
        } else if (oldValue !== null && newValue === null) {
          this.hide();
        }
        break;
    }
  }
  /**
   * Create the animation controls for the enter animation
   */
  createEnterAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * Create the animation controls for the leave animation
   */
  createLeaveAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * When "clickOutsideDeactivates" is true, this method is called on the final click destination. If this method
   * returns true, then the dialog closes (if false, the dialog remains in its current state). By default, this
   * will close the dialog if a click is done outside the dialog. However, this may be overridden in children classes
   * to provide custom behavior (for instance, to only allow some elements to close the dialog)
   */
  hideForOutsideClickTarget(target) {
    if (this.controls.includes(target) && target.hasAttribute("data-open-on-hover")) {
      return false;
    }
    return !this.contains(target);
  }
  /**
   * When "clickOutsideDeactivates" is set to true, this method allows to control which element, when clicked, allows
   * to pass-through and have its behavior being executed
   */
  allowOutsideClickForTarget(target) {
    if (this.controls.includes(target) && target.hasAttribute("data-open-on-hover")) {
      return true;
    }
    return false;
  }
};
_isLocked = new WeakMap();
_delegate2 = new WeakMap();
_focusLeaveDelegate = new WeakMap();
_abortController6 = new WeakMap();
_focusTrap = new WeakMap();
_isTransitioningToState = new WeakMap();
_originalParentBeforeAppend = new WeakMap();
_DialogElement_instances = new WeakSet();
/**
 * If "clickOutsideDeactivates" is true, then this listener will be called on every click outside the element. This
 * allows function separates touch and non-touch events
 */
allowOutsideClick_fn = function(event) {
  if ("TouchEvent" in window && event instanceof TouchEvent) {
    return __privateMethod(this, _DialogElement_instances, allowOutsideClickTouch_fn).call(this, event);
  } else {
    return __privateMethod(this, _DialogElement_instances, allowOutsideClickMouse_fn).call(this, event);
  }
};
/**
 * If "clickOutsideDeactivates" is true, this listener will be called on every touch click outside the trapped
 * element. By default, this will allow any click outside to cause the dialog to close
 */
allowOutsideClickTouch_fn = function(event) {
  event.target.addEventListener("touchend", (subEvent) => {
    const endTarget = document.elementFromPoint(subEvent.changedTouches.item(0).clientX, subEvent.changedTouches.item(0).clientY);
    if (this.hideForOutsideClickTarget(endTarget)) {
      this.hide();
    }
  }, { once: true, signal: this.abortController.signal });
  return this.allowOutsideClickForTarget(event.target);
};
/**
 * If "clickOutsideDeactivates" is true, this listener will be called on every mouse click outside the trapped
 * element. By default, this will allow any click outside to cause the dialog to close.
 */
allowOutsideClickMouse_fn = function(event) {
  if (event.type !== "click") {
    return false;
  }
  if (this.hideForOutsideClickTarget(event.target)) {
    this.hide();
  }
  if (this.allowOutsideClickForTarget(event.target)) {
    return true;
  }
  let target = event.target, closestControl = event.target.closest("[aria-controls]");
  if (closestControl && closestControl.getAttribute("aria-controls") === this.id) {
    target = closestControl;
  }
  return this.id !== target.getAttribute("aria-controls");
};
/**
 * This function is called whenever an activator (an element controlling this dialog) is called. This simply open
 * the dialog if closed, or close it if open
 */
onActivatorClicked_fn = function(event, activator) {
  if (this.open && this.controls.includes(event.target) && event.target.tagName === "A" && event.target.hasAttribute("data-open-on-hover")) {
    return;
  }
  event?.preventDefault();
  this.open ? this.hide() : this.show({ activator });
};
/**
 * This function is called whenever an activator with the attribute "data-open-on-hover" is hovered.
 */
onActivatorPointerEnter_fn = function() {
  if (!this.open) {
    this.show();
    __privateGet(this, _focusLeaveDelegate).off().on("pointerenter", (event) => {
      if (event.target.contains(this) || this.contains(event.target) || event.target.getAttribute("aria-controls") === this.id || event.target.closest("[aria-controls]")?.getAttribute("aria-controls") === this.id) {
        return;
      }
      __privateGet(this, _focusLeaveDelegate).off();
      this.hide();
    }, true);
  }
};
/**
 * Hide the slots that do not have any children
 */
updateSlotVisibility_fn = function(slot) {
  if (!["header", "footer"].includes(slot.name)) {
    return;
  }
  slot.parentElement.hidden = slot.assignedElements({ flatten: true }).length === 0;
};
var DialogCloseButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("dialog:force-close", { bubbles: true, cancelable: true, composed: true })));
  }
};
if (!window.customElements.get("dialog-element")) {
  window.customElements.define("dialog-element", DialogElement);
}
if (!window.customElements.get("dialog-close-button")) {
  window.customElements.define("dialog-close-button", DialogCloseButton);
}

// js/common/overlay/drawer.js
import { animateSequence as animateSequence2 } from "vendor";
var Drawer = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-modal", "true");
  }
  get shadowDomTemplate() {
    return document.getElementById(this.getAttribute("template") || "drawer-default-template");
  }
  get shouldLock() {
    return true;
  }
  get shouldAppendToBody() {
    return true;
  }
  get openFrom() {
    return this.getAttribute("open-from") || "right";
  }
  createEnterAnimationControls() {
    let contentTransform = this.openFrom === "right" ? ["translateX(calc(var(--transform-logical-flip) * 100%)", "translateX(0)"] : ["translateX(calc(-1 * var(--transform-logical-flip) * 100%)", "translateX(0)"];
    this.getShadowPartByName("content").style.marginInlineStart = this.openFrom === "right" ? "auto" : "0";
    return animateSequence2([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.25, ease: "easeInOut" }],
      [this.getShadowPartByName("content"), { opacity: [0, 1], transform: contentTransform }, { duration: 0.45, at: "-0.15", ease: [0.86, 0, 0.07, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    let contentTransform = this.openFrom === "right" ? ["translateX(0)", "translateX(calc(var(--transform-logical-flip) * 100%)"] : ["translateX(0)", "translateX(calc(-1 * var(--transform-logical-flip) * 100%)"];
    return animateSequence2([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.45, ease: "easeInOut" }],
      [this.getShadowPartByName("content"), { opacity: [1, 0], transform: contentTransform }, { duration: 0.45, at: "<", ease: [0.86, 0, 0.07, 1] }]
    ]);
  }
};
if (!window.customElements.get("x-drawer")) {
  window.customElements.define("x-drawer", Drawer);
}

// js/common/overlay/drawer-popover.js
import { animateSequence as animateSequence3 } from "vendor";
var DrawerPopover = class extends DialogElement {
  get shadowDomTemplate() {
    return document.getElementById(this.getAttribute("template") || "drawer-popover-default-template");
  }
  createEnterAnimationControls() {
    return animateSequence3([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.25, ease: "easeInOut" }],
      [this.getShadowPartByName("content"), { opacity: [0, 1], transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.45, at: "-0.15", ease: [0.86, 0, 0.07, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    return animateSequence3([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.45, ease: "easeInOut" }],
      [this.getShadowPartByName("content"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.45, at: "<", ease: [0.86, 0, 0.07, 1] }]
    ]);
  }
};
if (!window.customElements.get("x-drawer-popover")) {
  window.customElements.define("x-drawer-popover", DrawerPopover);
}

// js/common/overlay/modal.js
import { animateSequence as animateSequence4 } from "vendor";
var Modal = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-modal", "true");
  }
  get shouldLock() {
    return true;
  }
  get shadowDomTemplate() {
    return document.getElementById("modal-default-template");
  }
  createEnterAnimationControls() {
    return animateSequence4([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.25 }],
      [this.getShadowPartByName("content"), { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] }, { duration: 0.25, at: "-0.15" }]
    ]);
  }
  createLeaveAnimationControls() {
    return animateSequence4([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.15 }],
      [this.getShadowPartByName("content"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(40px)"] }, { duration: 0.15, at: "<" }]
    ]);
  }
};
if (!window.customElements.get("x-modal")) {
  window.customElements.define("x-modal", Modal);
}

// js/common/overlay/popover.js
import { animate as animate5, animateSequence as animateSequence5, Delegate as Delegate3 } from "vendor";
var Popover = class extends DialogElement {
  #delegate = new Delegate3(this);
  connectedCallback() {
    super.connectedCallback();
    this.controls.forEach((control) => control.setAttribute("aria-haspopup", "dialog"));
    if (this.hasAttribute("close-on-listbox-change")) {
      this.addEventListener("change", this.hide, { signal: this.abortController.signal });
      this.#delegate.off();
      this.#delegate.on("click", "a", this.hide.bind(this));
      this.#delegate.on("click", "input:checked", this.hide.bind(this));
    }
  }
  get shadowDomTemplate() {
    return document.getElementById(this.getAttribute("template") || "popover-default-template");
  }
  get shouldLock() {
    return matchesMediaQuery("md-max");
  }
  get shouldAppendToBody() {
    return matchesMediaQuery("md-max");
  }
  get preventScrollWhenTrapped() {
    return true;
  }
  createEnterAnimationControls() {
    this.getShadowPartByName("content").style.cssText = "";
    if (matchesMediaQuery("md-max")) {
      return animateSequence5([
        [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.3, at: "<", ease: [0.645, 0.045, 0.355, 1] }]
      ]);
    } else {
      return animate5(this.getShadowPartByName("content"), { opacity: [0, 1] }, { duration: 0.3, ease: "easeInOut" });
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return animateSequence5([
        [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(0%)", "translateY(100%)"] }, { duration: 0.3, at: "<", ease: [0.645, 0.045, 0.355, 1] }]
      ]);
    } else {
      return animate5(this.getShadowPartByName("content"), { opacity: [1, 0] }, { duration: 0.3, ease: "easeInOut" });
    }
  }
};
if (!window.customElements.get("x-popover")) {
  window.customElements.define("x-popover", Popover);
}

// js/common/facets/facets-drawer.js
var FacetsDrawer = class extends Drawer {
  constructor() {
    super();
    this.addEventListener("submit", this.hide);
    this.addEventListener("reset", this.hide);
    this.addEventListener("facet:update", this.hide);
  }
};
if (!window.customElements.get("facets-drawer")) {
  window.customElements.define("facets-drawer", FacetsDrawer);
}

// js/common/facets/facets-form.js
var _isDirty, _FacetsForm_instances, form_get, buildUrl_fn, onFormChanged_fn, onFormSubmitted_fn, onFormResetted_fn;
var FacetsForm = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _FacetsForm_instances);
    __privateAdd(this, _isDirty, false);
    this.addEventListener("change", __privateMethod(this, _FacetsForm_instances, onFormChanged_fn));
    this.addEventListener("submit", __privateMethod(this, _FacetsForm_instances, onFormSubmitted_fn), { capture: true });
    this.addEventListener("reset", __privateMethod(this, _FacetsForm_instances, onFormResetted_fn));
  }
};
_isDirty = new WeakMap();
_FacetsForm_instances = new WeakSet();
form_get = function() {
  return this.querySelector("form");
};
buildUrl_fn = function({ clearParams = false } = {}) {
  const searchParams = new URLSearchParams(new FormData(__privateGet(this, _FacetsForm_instances, form_get))), url = new URL(__privateGet(this, _FacetsForm_instances, form_get).action);
  url.search = "";
  if (!clearParams) {
    searchParams.forEach((value, key) => url.searchParams.append(key, value));
    ["page", "filter.v.price.gte", "filter.v.price.lte"].forEach((optionToClear) => {
      if (url.searchParams.get(optionToClear) === "") {
        url.searchParams.delete(optionToClear);
      }
    });
  }
  url.searchParams.set("section_id", this.getAttribute("section-id"));
  return url;
};
onFormChanged_fn = function() {
  __privateSet(this, _isDirty, true);
  if (this.hasAttribute("update-on-change")) {
    if (HTMLFormElement.prototype.requestSubmit) {
      __privateGet(this, _FacetsForm_instances, form_get).requestSubmit();
    } else {
      __privateGet(this, _FacetsForm_instances, form_get).dispatchEvent(new Event("submit", { bubbles: true }));
    }
  } else {
    cachedFetch(__privateMethod(this, _FacetsForm_instances, buildUrl_fn).call(this).toString());
  }
};
onFormSubmitted_fn = function(event) {
  event.preventDefault();
  if (!__privateGet(this, _isDirty)) {
    return;
  }
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url: __privateMethod(this, _FacetsForm_instances, buildUrl_fn).call(this),
      scrollTo: __privateGet(this, _FacetsForm_instances, form_get).getAttribute("scroll-to")
    }
  }));
  __privateSet(this, _isDirty, false);
};
onFormResetted_fn = function(event) {
  event.preventDefault();
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url: __privateMethod(this, _FacetsForm_instances, buildUrl_fn).call(this, { clearParams: true })
    }
  }));
  __privateSet(this, _isDirty, false);
};
if (!window.customElements.get("facets-form")) {
  window.customElements.define("facets-form", FacetsForm);
}

// js/common/facets/facet-link.js
var _FacetLink_instances, onFacetUpdate_fn;
var FacetLink = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _FacetLink_instances);
    this.addEventListener("click", __privateMethod(this, _FacetLink_instances, onFacetUpdate_fn).bind(this));
  }
};
_FacetLink_instances = new WeakSet();
onFacetUpdate_fn = function(event) {
  event.preventDefault();
  const sectionId = extractSectionId(event.target), url = new URL(this.firstElementChild.href);
  url.searchParams.set("section_id", sectionId);
  if (this.hasAttribute("merge-params")) {
    const existingParams = new URLSearchParams(window.location.search);
    for (const [key, value] of url.searchParams) {
      existingParams.set(key, value);
    }
    url.search = existingParams.toString();
  }
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url,
      scrollTo: url.hash,
      disableCache: this.hasAttribute("disable-cache"),
      ignoreUrlSearch: this.hasAttribute("ignore-url-search")
    }
  }));
};
if (!window.customElements.get("facet-link")) {
  window.customElements.define("facet-link", FacetLink);
}

// js/common/facets/facets-listeners.js
import { Delegate as Delegate4 } from "vendor";
var abortController = null;
var delegate = new Delegate4(document.body);
var openDetailsValues = new Set(Array.from(document.querySelectorAll('facets-form details[open] input[name*="filter."]'), (item) => item.name));
delegate.on("toggle", "facets-form details", (event, detailsElement) => {
  const inputNames = [...new Set(Array.from(detailsElement.querySelectorAll('input[name*="filter."]'), (item) => item.name))];
  inputNames.forEach((inputName) => {
    detailsElement.open ? openDetailsValues.add(inputName) : openDetailsValues.delete(inputName);
  });
}, true);
document.addEventListener("facet:update", async (event) => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const url = event.detail.url, shopifySection = document.getElementById(`shopify-section-${url.searchParams.get("section_id")}`);
  const clonedUrl = new URL(url);
  clonedUrl.searchParams.delete("section_id");
  clonedUrl.hash = "";
  if (event.detail.ignoreUrlSearch) {
    clonedUrl.search = "";
  }
  history.replaceState({}, "", clonedUrl.toString());
  try {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
    let tempContent;
    if (event.detail.disableCache) {
      tempContent = new DOMParser().parseFromString(await (await fetch(url.toString(), { signal: abortController.signal })).text(), "text/html");
    } else {
      tempContent = new DOMParser().parseFromString(await (await cachedFetch(url.toString(), { signal: abortController.signal })).text(), "text/html");
    }
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
    const newShopifySection = tempContent.querySelector(".shopify-section");
    newShopifySection.querySelectorAll("facets-form details").forEach((detailsElement) => {
      const inputNames = [...new Set(Array.from(detailsElement.querySelectorAll('input[name*="filter."]'), (item) => item.name))];
      inputNames.forEach((inputName) => {
        detailsElement.toggleAttribute("open", openDetailsValues.has(inputName));
      });
    });
    const focusedElement = document.activeElement;
    shopifySection.replaceChildren(...document.importNode(tempContent.querySelector(".shopify-section"), true).childNodes);
    if (focusedElement?.id && document.getElementById(focusedElement.id)) {
      document.getElementById(focusedElement.id).focus();
    }
    const scrollToProductList = () => shopifySection.querySelector(event.detail.scrollTo)?.scrollIntoView({ block: "start", behavior: "smooth" });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(scrollToProductList, { timeout: 500 });
    } else {
      requestAnimationFrame(scrollToProductList);
    }
  } catch (e) {
  }
});

// js/common/feedback/progress-bar.js
import { inView as inView5, scroll } from "vendor";
var progressValuesMapping = /* @__PURE__ */ new Map();
var _allowUpdatingProgress, _ProgressBar_instances, setupTargetTracking_fn, animateProgress_fn;
var ProgressBar = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProgressBar_instances);
    __privateAdd(this, _allowUpdatingProgress, !this.hasAttribute("animate-on-scroll") || this.hasAttribute("track-scroll-target"));
  }
  static get observedAttributes() {
    return ["aria-valuenow", "aria-valuemax"];
  }
  connectedCallback() {
    if (this.hasAttribute("track-scroll-target")) {
      inView5(this, __privateMethod(this, _ProgressBar_instances, setupTargetTracking_fn).bind(this));
    } else {
      if (this.hasAttribute("animate-on-scroll")) {
        inView5(this, () => {
          __privateSet(this, _allowUpdatingProgress, true);
          __privateMethod(this, _ProgressBar_instances, animateProgress_fn).call(this);
        });
      } else {
        __privateMethod(this, _ProgressBar_instances, animateProgress_fn).call(this);
      }
    }
  }
  disconnectedCallback() {
    if (this.id) {
      progressValuesMapping.set(this.id, this.progress);
    }
  }
  get progress() {
    return Math.min(1, this.getAttribute("aria-valuenow") / this.getAttribute("aria-valuemax"));
  }
  set valueMax(value) {
    this.setAttribute("aria-valuemax", value);
  }
  set valueNow(value) {
    this.setAttribute("aria-valuenow", value);
  }
  attributeChangedCallback() {
    if (!this.hasAttribute("track-scroll-target")) {
      __privateMethod(this, _ProgressBar_instances, animateProgress_fn).call(this);
    }
  }
};
_allowUpdatingProgress = new WeakMap();
_ProgressBar_instances = new WeakSet();
setupTargetTracking_fn = function() {
  const scrollTarget = document.getElementById(this.getAttribute("track-scroll-target"));
  const initialValue = scrollTarget.clientWidth / scrollTarget.scrollWidth;
  scroll((progress) => {
    this.style.setProperty("--progress-bar-progress", initialValue + Math.abs(progress) * (1 - initialValue));
  }, {
    container: scrollTarget,
    axis: "x"
  });
};
animateProgress_fn = function() {
  if (!__privateGet(this, _allowUpdatingProgress)) {
    return;
  }
  let previousValue = progressValuesMapping.get(this.id);
  this.animate({
    "--progress-bar-progress": previousValue ? [previousValue, this.progress] : this.progress
  }, {
    duration: 450,
    easing: "ease-out",
    fill: "both"
  });
  progressValuesMapping.delete(this.id);
};
if (!window.customElements.get("progress-bar")) {
  window.customElements.define("progress-bar", ProgressBar);
}

// js/common/feedback/toast.js
import { animate as animate6 } from "vendor";
var _Toast_instances, onShow_fn;
var Toast = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Toast_instances);
  }
  connectedCallback() {
    document.addEventListener("toast:show", __privateMethod(this, _Toast_instances, onShow_fn).bind(this));
  }
};
_Toast_instances = new WeakSet();
onShow_fn = function(event) {
  const messageFragment = document.createRange().createContextualFragment(`
      <div class="toast__message ${event.detail?.tone === "error" ? "toast__message--error" : ""}" role="${event.detail?.tone === "error" ? "alert" : "status"}" aria-live="polite">
        ${event.detail.message}
      </div>
    `);
  const messageElement = messageFragment.firstElementChild;
  this.replaceChildren(messageElement);
  animate6(messageElement, { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] }, { duration: 0.25, ease: "easeInOut" });
  setTimeout(async () => {
    await animate6(messageElement, { opacity: [1, 0], transform: ["scale(1)", "scale(0.85)"] }, { duration: 0.25, ease: "easeInOut" });
    messageElement.remove();
  }, event.detail?.duration || 2500);
};
if (!window.customElements.get("x-toast")) {
  window.customElements.define("x-toast", Toast);
}

// js/common/form/price-range.js
var PriceRange = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    this.#abortController = new AbortController();
    const rangeLowerBound = this.querySelector('input[type="range"]:first-child'), rangeHigherBound = this.querySelector('input[type="range"]:last-child'), textInputLowerBound = this.querySelector('input[name="filter.v.price.gte"]'), textInputHigherBound = this.querySelector('input[name="filter.v.price.lte"]');
    textInputLowerBound.addEventListener("focus", () => textInputLowerBound.select(), { signal: this.#abortController.signal });
    textInputHigherBound.addEventListener("focus", () => textInputHigherBound.select(), { signal: this.#abortController.signal });
    textInputLowerBound.addEventListener("change", (event) => {
      event.preventDefault();
      event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(textInputHigherBound.value || event.target.max) - 1), event.target.min);
      rangeLowerBound.value = event.target.value;
      rangeLowerBound.parentElement.style.setProperty("--range-min", `${parseInt(rangeLowerBound.value) / parseInt(rangeLowerBound.max) * 100}%`);
    }, { signal: this.#abortController.signal });
    textInputHigherBound.addEventListener("change", (event) => {
      event.preventDefault();
      event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(textInputLowerBound.value || event.target.min) + 1), event.target.max);
      rangeHigherBound.value = event.target.value;
      rangeHigherBound.parentElement.style.setProperty("--range-max", `${parseInt(rangeHigherBound.value) / parseInt(rangeHigherBound.max) * 100}%`);
    }, { signal: this.#abortController.signal });
    rangeLowerBound.addEventListener("change", (event) => {
      event.stopPropagation();
      textInputLowerBound.value = event.target.value;
      textInputLowerBound.dispatchEvent(new Event("change", { bubbles: true }));
    }, { signal: this.#abortController.signal });
    rangeHigherBound.addEventListener("change", (event) => {
      event.stopPropagation();
      textInputHigherBound.value = event.target.value;
      textInputHigherBound.dispatchEvent(new Event("change", { bubbles: true }));
    }, { signal: this.#abortController.signal });
    rangeLowerBound.addEventListener("input", (event) => {
      event.target.value = Math.min(parseInt(event.target.value), parseInt(textInputHigherBound.value || event.target.max) - 1);
      event.target.parentElement.style.setProperty("--range-min", `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      textInputLowerBound.value = event.target.value;
    }, { signal: this.#abortController.signal });
    rangeHigherBound.addEventListener("input", (event) => {
      event.target.value = Math.max(parseInt(event.target.value), parseInt(textInputLowerBound.value || event.target.min) + 1);
      event.target.parentElement.style.setProperty("--range-max", `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      textInputHigherBound.value = event.target.value;
    }, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
};
if (!window.customElements.get("price-range")) {
  window.customElements.define("price-range", PriceRange);
}

// js/common/form/quantity-selector.js
var _abortController7, _decreaseButton, _increaseButton, _inputElement, _QuantitySelector_instances, onDecreaseQuantity_fn, onIncreaseQuantity_fn, updateUI_fn;
var QuantitySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _QuantitySelector_instances);
    __privateAdd(this, _abortController7);
    __privateAdd(this, _decreaseButton);
    __privateAdd(this, _increaseButton);
    __privateAdd(this, _inputElement);
  }
  connectedCallback() {
    __privateSet(this, _abortController7, new AbortController());
    __privateSet(this, _decreaseButton, this.querySelector("button:first-of-type"));
    __privateSet(this, _increaseButton, this.querySelector("button:last-of-type"));
    __privateSet(this, _inputElement, this.querySelector("input"));
    __privateGet(this, _decreaseButton)?.addEventListener("click", __privateMethod(this, _QuantitySelector_instances, onDecreaseQuantity_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    __privateGet(this, _increaseButton)?.addEventListener("click", __privateMethod(this, _QuantitySelector_instances, onIncreaseQuantity_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    __privateGet(this, _inputElement)?.addEventListener("input", __privateMethod(this, _QuantitySelector_instances, updateUI_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController7).abort();
  }
  get quantity() {
    return __privateGet(this, _inputElement).value;
  }
  set quantity(quantity) {
    __privateGet(this, _inputElement).value = quantity;
    __privateGet(this, _inputElement).dispatchEvent(new Event("change", { bubbles: true }));
    __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
  }
  restoreDefaultValue() {
    __privateGet(this, _inputElement).value = __privateGet(this, _inputElement).defaultValue;
    __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
  }
};
_abortController7 = new WeakMap();
_decreaseButton = new WeakMap();
_increaseButton = new WeakMap();
_inputElement = new WeakMap();
_QuantitySelector_instances = new WeakSet();
onDecreaseQuantity_fn = function() {
  if (this.hasAttribute("allow-reset-to-zero") && __privateGet(this, _inputElement).value === __privateGet(this, _inputElement).min) {
    __privateGet(this, _inputElement).value = 0;
  } else {
    __privateGet(this, _inputElement).stepDown();
  }
  announceStatus(__privateGet(this, _inputElement).value);
  __privateGet(this, _inputElement).dispatchEvent(new Event("change", { bubbles: true }));
  __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
};
onIncreaseQuantity_fn = function() {
  __privateGet(this, _inputElement).stepUp();
  announceStatus(__privateGet(this, _inputElement).value);
  __privateGet(this, _inputElement).dispatchEvent(new Event("change", { bubbles: true }));
  __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
};
updateUI_fn = function() {
  if (__privateGet(this, _decreaseButton)) {
    __privateGet(this, _decreaseButton).disabled = parseInt(__privateGet(this, _inputElement).value) <= parseInt(__privateGet(this, _inputElement).min);
  }
  if (__privateGet(this, _increaseButton)) {
    __privateGet(this, _increaseButton).disabled = __privateGet(this, _inputElement).hasAttribute("max") ? parseInt(__privateGet(this, _inputElement).value) >= parseInt(__privateGet(this, _inputElement).max) : false;
  }
};
var _QuantityInput_instances, inputElement_get, onValueInput_fn, onValueChange_fn;
var QuantityInput = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _QuantityInput_instances);
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("input", __privateMethod(this, _QuantityInput_instances, onValueInput_fn).bind(this));
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("change", __privateMethod(this, _QuantityInput_instances, onValueChange_fn).bind(this));
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("focus", () => __privateGet(this, _QuantityInput_instances, inputElement_get).select());
  }
  connectedCallback() {
    this.style.setProperty("--quantity-selector-character-count", `${__privateGet(this, _QuantityInput_instances, inputElement_get).value.length}ch`);
  }
  get quantity() {
    return parseInt(__privateGet(this, _QuantityInput_instances, inputElement_get).value);
  }
};
_QuantityInput_instances = new WeakSet();
inputElement_get = function() {
  return this.firstElementChild;
};
onValueInput_fn = function() {
  if (__privateGet(this, _QuantityInput_instances, inputElement_get).value === "") {
    __privateGet(this, _QuantityInput_instances, inputElement_get).value = __privateGet(this, _QuantityInput_instances, inputElement_get).min || 1;
  }
  this.style.setProperty("--quantity-selector-character-count", `${__privateGet(this, _QuantityInput_instances, inputElement_get).value.length}ch`);
};
onValueChange_fn = function() {
  if (!__privateGet(this, _QuantityInput_instances, inputElement_get).checkValidity()) {
    __privateGet(this, _QuantityInput_instances, inputElement_get).stepDown();
  }
};
if (!window.customElements.get("quantity-selector")) {
  window.customElements.define("quantity-selector", QuantitySelector);
}
if (!window.customElements.get("quantity-input")) {
  window.customElements.define("quantity-input", QuantityInput);
}

// js/common/product/gift-card-recipient.js
var _recipientCheckbox, _recipientOtherProperties, _recipientSendOnProperty, _offsetProperty, _recipientFieldsContainer, _GiftCardRecipient_instances, synchronizeProperties_fn, formatDate_fn;
var GiftCardRecipient = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GiftCardRecipient_instances);
    __privateAdd(this, _recipientCheckbox);
    __privateAdd(this, _recipientOtherProperties, []);
    __privateAdd(this, _recipientSendOnProperty);
    __privateAdd(this, _offsetProperty);
    __privateAdd(this, _recipientFieldsContainer);
  }
  connectedCallback() {
    const properties = Array.from(this.querySelectorAll('[name*="properties"]')), checkboxPropertyName = "properties[__shopify_send_gift_card_to_recipient]";
    __privateSet(this, _recipientCheckbox, properties.find((input) => input.name === checkboxPropertyName));
    __privateSet(this, _recipientOtherProperties, properties.filter((input) => input.name !== checkboxPropertyName));
    __privateSet(this, _recipientFieldsContainer, this.querySelector(".gift-card-recipient__fields"));
    __privateSet(this, _offsetProperty, this.querySelector('[name="properties[__shopify_offset]"]'));
    if (__privateGet(this, _offsetProperty)) {
      __privateGet(this, _offsetProperty).value = (/* @__PURE__ */ new Date()).getTimezoneOffset().toString();
    }
    __privateSet(this, _recipientSendOnProperty, this.querySelector('[name="properties[Send on]"]'));
    const minDate = /* @__PURE__ */ new Date();
    const maxDate = /* @__PURE__ */ new Date();
    maxDate.setDate(minDate.getDate() + 90);
    __privateGet(this, _recipientSendOnProperty)?.setAttribute("min", __privateMethod(this, _GiftCardRecipient_instances, formatDate_fn).call(this, minDate));
    __privateGet(this, _recipientSendOnProperty)?.setAttribute("max", __privateMethod(this, _GiftCardRecipient_instances, formatDate_fn).call(this, maxDate));
    __privateGet(this, _recipientCheckbox)?.addEventListener("change", __privateMethod(this, _GiftCardRecipient_instances, synchronizeProperties_fn).bind(this));
    __privateMethod(this, _GiftCardRecipient_instances, synchronizeProperties_fn).call(this);
  }
};
_recipientCheckbox = new WeakMap();
_recipientOtherProperties = new WeakMap();
_recipientSendOnProperty = new WeakMap();
_offsetProperty = new WeakMap();
_recipientFieldsContainer = new WeakMap();
_GiftCardRecipient_instances = new WeakSet();
synchronizeProperties_fn = function() {
  __privateGet(this, _recipientOtherProperties).forEach((property) => property.disabled = !__privateGet(this, _recipientCheckbox).checked);
  __privateGet(this, _recipientFieldsContainer).toggleAttribute("hidden", !__privateGet(this, _recipientCheckbox).checked);
};
formatDate_fn = function(date) {
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - offset * 60 * 1e3);
  return offsetDate.toISOString().split("T")[0];
};
if (!window.customElements.get("gift-card-recipient")) {
  window.customElements.define("gift-card-recipient", GiftCardRecipient);
}

// js/common/product/product-card.js
import { Delegate as Delegate5 } from "vendor";
var _delegate3, _ProductCard_instances, onSwatchHovered_fn, onSwatchChanged_fn, createMediaImg_fn;
var ProductCard = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductCard_instances);
    __privateAdd(this, _delegate3, new Delegate5(this));
  }
  connectedCallback() {
    __privateGet(this, _delegate3).on("change", '.product-card__swatch-list [type="radio"]', __privateMethod(this, _ProductCard_instances, onSwatchChanged_fn).bind(this));
    __privateGet(this, _delegate3).on("pointerover", '.product-card__swatch-list [type="radio"] + label', __privateMethod(this, _ProductCard_instances, onSwatchHovered_fn).bind(this), true);
  }
  disconnectedCallback() {
    __privateGet(this, _delegate3).off();
  }
};
_delegate3 = new WeakMap();
_ProductCard_instances = new WeakSet();
onSwatchHovered_fn = async function(event, target) {
  const control = target.control;
  const primaryMediaElement = this.querySelector(".product-card__image--primary");
  if (control.hasAttribute("data-variant-media")) {
    __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, JSON.parse(control.getAttribute("data-variant-media")), primaryMediaElement.className, primaryMediaElement.sizes);
  }
};
onSwatchChanged_fn = async function(event, target) {
  if (target.hasAttribute("data-product-url")) {
    this.querySelectorAll(`a[href^="${Shopify.routes.root}products/"`).forEach((link) => {
      link.href = target.getAttribute("data-product-url");
    });
    this.querySelector("quick-buy-modal")?.setAttribute("product-url", target.getAttribute("data-product-url"));
  } else if (target.hasAttribute("data-variant-id")) {
    this.querySelectorAll(`a[href^="${Shopify.routes.root}products/"`).forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set("variant", target.getAttribute("data-variant-id"));
      link.href = `${url.pathname}${url.search}${url.hash}`;
    });
    const quickBuyModal = this.querySelector("quick-buy-modal");
    if (quickBuyModal) {
      const url = quickBuyModal.getAttribute("product-url").split("?")[0];
      quickBuyModal.setAttribute("product-url", `${url}?variant=${target.getAttribute("data-variant-id")}`);
    }
  }
  if (!target.hasAttribute("data-variant-media")) {
    return;
  }
  let newMedia = JSON.parse(target.getAttribute("data-variant-media")), primaryMediaElement = this.querySelector(".product-card__image--primary"), secondaryMediaElement = this.querySelector(".product-card__image--secondary"), newPrimaryMediaElement = __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, newMedia, primaryMediaElement.className, primaryMediaElement.sizes), newSecondaryMediaElement = null;
  if (target.hasAttribute("data-variant-secondary-media")) {
    let newSecondaryMedia = JSON.parse(target.getAttribute("data-variant-secondary-media"));
    newSecondaryMediaElement = __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, newSecondaryMedia, secondaryMediaElement.className, secondaryMediaElement.sizes);
    newSecondaryMediaElement.ariaHidden = "true";
  }
  if (primaryMediaElement.src !== newPrimaryMediaElement.src) {
    if (secondaryMediaElement && newSecondaryMediaElement) {
      secondaryMediaElement.replaceWith(newSecondaryMediaElement);
    }
    const shouldTransition = target.closest(".product-card__info") !== null;
    if (shouldTransition) {
      await primaryMediaElement.animate({ opacity: [1, 0] }, { duration: 150, easing: "ease-in", fill: "forwards" }).finished;
      await new Promise((resolve) => newPrimaryMediaElement.complete ? resolve() : newPrimaryMediaElement.onload = () => resolve());
    }
    primaryMediaElement.replaceWith(newPrimaryMediaElement);
    if (shouldTransition) {
      newPrimaryMediaElement.animate({ opacity: [0, 1] }, { duration: 150, easing: "ease-in" });
    }
  }
};
createMediaImg_fn = function(media, className, sizes) {
  return createMediaImg(media, [200, 300, 400, 500, 600, 700, 800, 1e3, 1200, 1400, 1600, 1800], { class: className, sizes });
};
if (!window.customElements.get("product-card")) {
  window.customElements.define("product-card", ProductCard);
}

// js/common/product/product-form.js
var _abortController8, _ProductForm_instances, form_get2, onSubmit_fn;
var ProductForm = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductForm_instances);
    __privateAdd(this, _abortController8);
  }
  connectedCallback() {
    __privateSet(this, _abortController8, new AbortController());
    if (__privateGet(this, _ProductForm_instances, form_get2)) {
      __privateGet(this, _ProductForm_instances, form_get2).addEventListener("submit", __privateMethod(this, _ProductForm_instances, onSubmit_fn).bind(this), { signal: __privateGet(this, _abortController8).signal });
      __privateGet(this, _ProductForm_instances, form_get2).id.disabled = false;
    }
  }
  disconnectedCallback() {
    __privateGet(this, _abortController8).abort();
  }
};
_abortController8 = new WeakMap();
_ProductForm_instances = new WeakSet();
form_get2 = function() {
  return this.querySelector('form[action*="/cart/add"]');
};
onSubmit_fn = async function(event) {
  event.preventDefault();
  if (event.submitter?.getAttribute("aria-busy") === "true") {
    return;
  }
  if (!__privateGet(this, _ProductForm_instances, form_get2).checkValidity()) {
    __privateGet(this, _ProductForm_instances, form_get2).reportValidity();
    return;
  }
  const showLoadingBar = event.submitter?.querySelector("button-content") === null;
  const submitButtons = Array.from(__privateGet(this, _ProductForm_instances, form_get2).elements).filter((button) => button.type === "submit");
  submitButtons.forEach((submitButton) => {
    submitButton.setAttribute("aria-busy", "true");
  });
  let sectionsToBundle = /* @__PURE__ */ new Set();
  document.documentElement.dispatchEvent(new CustomEvent("cart:prepare-bundled-sections", { bubbles: true, detail: { sections: sectionsToBundle } }));
  const formData = new FormData(__privateGet(this, _ProductForm_instances, form_get2));
  formData.set("sections", [...sectionsToBundle].join(","));
  if (showLoadingBar) {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  }
  const response = await fetch(`${Shopify.routes.root}cart/add.js`, {
    body: formData,
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
      // Needed for Shopify to check inventory
    }
  });
  submitButtons.forEach((submitButton) => {
    submitButton.removeAttribute("aria-busy");
  });
  const responseJson = await response.json();
  if (showLoadingBar) {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
  }
  if (response.ok) {
    if (window.themeVariables.settings.cartType === "page" || window.themeVariables.settings.pageType === "cart") {
      return window.location.href = `${Shopify.routes.root}cart`;
    }
    const cartContent = await (await fetch(`${Shopify.routes.root}cart.js`)).json();
    cartContent["sections"] = responseJson["sections"];
    const items = responseJson.hasOwnProperty("items") ? responseJson["items"] : [responseJson];
    __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(new CustomEvent("variant:add", {
      bubbles: true,
      detail: {
        items,
        cart: cartContent
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        baseEvent: "variant:add",
        cart: cartContent
      }
    }));
    if (window.themeVariables.settings.cartType === "message") {
      document.dispatchEvent(new CustomEvent("toast:show", {
        detail: {
          message: window.themeVariables.strings.addedToCart.replace("{{product_title}}", items?.[0]?.title)
        }
      }));
    } else if (window.themeVariables.settings.cartType === "drawer") {
      let content = [];
      items.forEach((item) => {
        content.push(window.themeVariables.strings.addedToCart.replace("{{product_title}}", item?.title || ""));
      });
      announceStatus(content.join(", "));
    }
  } else {
    __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(new CustomEvent("cart:error", {
      bubbles: true,
      detail: {
        error: responseJson["message"]
      }
    }));
    document.dispatchEvent(new CustomEvent("toast:show", {
      detail: {
        message: responseJson["message"],
        tone: "error"
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));
  }
};
if (!window.customElements.get("product-form")) {
  window.customElements.define("product-form", ProductForm);
}

// js/common/product/product-form-listeners.js
var BuyButtons = class extends HTMLElement {
  connectedCallback() {
  }
};
if (!window.customElements.get("buy-buttons")) {
  window.customElements.define("buy-buttons", BuyButtons);
}

// js/common/product/product-gallery.js
import { PhotoSwipeLightbox } from "vendor";
var _abortController9, _photoSwipeInstance, _onGestureChangedListener, _settledMedia, _ProductGallery_instances, registerLightboxUi_fn, onSectionRerender_fn, onVariantChange_fn, onMediaChange_fn, onMediaSettle_fn, onCarouselClick_fn, onGestureStart_fn, onGestureChanged_fn;
var ProductGallery = class extends HTMLElement {
  /* Keep track of the currently settled media */
  constructor() {
    super();
    __privateAdd(this, _ProductGallery_instances);
    __privateAdd(this, _abortController9);
    __privateAdd(this, _photoSwipeInstance);
    __privateAdd(this, _onGestureChangedListener, __privateMethod(this, _ProductGallery_instances, onGestureChanged_fn).bind(this));
    __privateAdd(this, _settledMedia);
    this.addEventListener("lightbox:open", (event) => this.openLightBox(event?.detail?.index));
  }
  connectedCallback() {
    __privateSet(this, _abortController9, new AbortController());
    if (!this.carousel) {
      return;
    }
    const form = document.forms[this.getAttribute("form")];
    form.addEventListener("product:rerender", __privateMethod(this, _ProductGallery_instances, onSectionRerender_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    form.addEventListener("variant:change", __privateMethod(this, _ProductGallery_instances, onVariantChange_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    this.carousel.addEventListener("carousel:change", __privateMethod(this, _ProductGallery_instances, onMediaChange_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    this.carousel.addEventListener("carousel:settle", __privateMethod(this, _ProductGallery_instances, onMediaSettle_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    this.carousel.addEventListener("click", __privateMethod(this, _ProductGallery_instances, onCarouselClick_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    if (this.hasAttribute("allow-zoom")) {
      this.carousel.addEventListener("gesturestart", __privateMethod(this, _ProductGallery_instances, onGestureStart_fn).bind(this), { capture: false, signal: __privateGet(this, _abortController9).signal });
    }
    __privateMethod(this, _ProductGallery_instances, onMediaChange_fn).call(this);
  }
  disconnectedCallback() {
    __privateGet(this, _abortController9).abort();
  }
  get viewInSpaceButton() {
    return this.querySelector("[data-shopify-xr]");
  }
  get carousel() {
    return this.querySelector(".product-gallery__carousel");
  }
  get customCursor() {
    return this.querySelector(".custom-cursor");
  }
  /**
   * Create the PhotoSwipe instance if it does not already exist. This is done on demand, so until the lightbox is
   * open, nothing is created to not impact performance
   */
  get lightBox() {
    if (__privateGet(this, _photoSwipeInstance)) {
      return __privateGet(this, _photoSwipeInstance);
    }
    __privateSet(this, _photoSwipeInstance, new PhotoSwipeLightbox({
      pswpModule: () => import("photoswipe"),
      bgOpacity: 1,
      mainClass: `color-scheme--${this.getAttribute("zoom-color-scheme-id")}`,
      // This outputs the CSS variables for the color scheme
      maxZoomLevel: parseInt(this.getAttribute("allow-zoom")) || 3,
      closeTitle: window.themeVariables.strings.closeGallery,
      zoomTitle: window.themeVariables.strings.zoomGallery,
      errorMsg: window.themeVariables.strings.errorGallery,
      // UX
      arrowPrev: false,
      arrowNext: false,
      counter: false,
      close: false,
      zoom: false
    }));
    __privateGet(this, _photoSwipeInstance).on("uiRegister", __privateMethod(this, _ProductGallery_instances, registerLightboxUi_fn).bind(this));
    __privateGet(this, _photoSwipeInstance).addFilter("thumbEl", (thumbEl, data) => data.thumbnailElement);
    __privateGet(this, _photoSwipeInstance).init();
    return __privateGet(this, _photoSwipeInstance);
  }
  get filteredIndexes() {
    return JSON.parse(this.getAttribute("filtered-indexes")).map((index) => parseInt(index) - 1);
  }
  /**
   * Open the lightbox at the given index (by default, it opens the selected image)
   */
  openLightBox(index) {
    const images = this.carousel.cells.flatMap((cell) => Array.from(cell.querySelectorAll(":scope > img")));
    const dataSource = images.map((image) => {
      return {
        thumbnailElement: image,
        src: image.src,
        srcset: image.srcset,
        msrc: image.currentSrc || image.src,
        width: parseInt(image.getAttribute("width")),
        height: parseInt(image.getAttribute("height")),
        alt: image.alt,
        thumbCropped: true
      };
    });
    const imageCells = this.carousel.cells.filter((cell) => cell.getAttribute("data-media-type") === "image");
    this.lightBox.loadAndOpen(index ?? imageCells.indexOf(this.carousel.selectedCell), dataSource);
  }
};
_abortController9 = new WeakMap();
_photoSwipeInstance = new WeakMap();
_onGestureChangedListener = new WeakMap();
_settledMedia = new WeakMap();
_ProductGallery_instances = new WeakSet();
/**
 * Add custom elements to PhotoSwipe gallery
 */
registerLightboxUi_fn = function() {
  __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
    name: "close-button circle-button circle-button--xl",
    className: "",
    ariaLabel: window.themeVariables.strings.closeGallery,
    order: 2,
    isButton: true,
    html: `
      <svg aria-hidden="true" focusable="false" fill="none" width="14" class="icon" viewBox="0 0 16 16">
        <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="1"/>
      </svg>
      `,
    onClick: () => {
      __privateGet(this, _photoSwipeInstance).pswp.close();
    }
  });
  if (__privateGet(this, _photoSwipeInstance).pswp.options.dataSource.length > 1) {
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "previous-button circle-button circle-button--xl",
      className: "",
      ariaLabel: window.themeVariables.strings.previous,
      order: 1,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" width="12" class="icon icon--direction-aware" viewBox="0 0 36 36">
          <path fill="none" stroke="currentColor" stroke-width="2" d="M35 18H3M19.5 34.5 3 18 19.5 1.5"/>
        </svg>
        `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.prev();
      }
    });
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "next-button circle-button circle-button--xl",
      className: "",
      ariaLabel: window.themeVariables.strings.next,
      order: 3,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" width="12" class="icon icon--direction-aware" viewBox="0 0 36 36">
          <path fill="none" stroke="currentColor" stroke-width="2" d="M1 18h32M16.5 1.5 33 18 16.5 34.5"/>
        </svg>
        `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.next();
      }
    });
  }
};
/**
 * When the section is re-rendered upon variant changes, the media might have been filtered
 */
onSectionRerender_fn = function(event) {
  const galleryMarkup = deepQuerySelector(event.detail.htmlFragment, `${this.tagName}[form="${this.getAttribute("form")}"]`);
  if (!galleryMarkup) {
    return;
  }
  if (galleryMarkup.filteredIndex !== this.filteredIndexes) {
    this.carousel.filter(galleryMarkup.filteredIndexes);
    this.setAttribute("filtered-indexes", galleryMarkup.getAttribute("filtered-indexes"));
    if (matchesMediaQuery("md")) {
      let buttonIndex = 0;
      Array.from(this.carousel.cells).forEach((item, index) => {
        if (item.getAttribute("data-media-type") === "image") {
          item.querySelector(".product-zoom-button")?.parentElement.setAttribute("image-index", buttonIndex.toString());
          buttonIndex += 1;
        }
      });
    }
  }
};
/**
 * When the variant changes, we check the alt tags for each media and filter them
 */
onVariantChange_fn = function(event) {
  if (!event.detail.variant) {
    return;
  }
  if (event.detail.variant["featured_media"] && event.detail.previousVariant?.["featured_media"]?.["id"] !== event.detail.variant["featured_media"]["id"]) {
    const position = event.detail.variant["featured_media"]["position"] - 1, filteredIndexBelowPosition = this.filteredIndexes.filter((filteredIndex) => filteredIndex < position);
    if (this.carousel.isScrollable) {
      this.carousel.select(position - filteredIndexBelowPosition.length, { instant: true });
    } else {
      this.querySelector(`[data-media-id="${event.detail.variant["featured_media"]["id"]}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
};
/**
 * When the media is about to change, we perform some logic
 */
onMediaChange_fn = function() {
  if (!__privateGet(this, _settledMedia)) {
    return;
  }
  if (this.customCursor) {
    this.customCursor.toggleAttribute("hidden", this.carousel.selectedCell.getAttribute("data-media-type") !== "image");
  }
  if (this.querySelector(".product-zoom-button")) {
    this.querySelector(".product-zoom-button").parentElement.toggleAttribute("hidden", this.carousel.selectedCell.getAttribute("data-media-type") !== "image");
  }
  switch (__privateGet(this, _settledMedia).getAttribute("data-media-type")) {
    case "external_video":
    case "video":
    case "model":
      __privateGet(this, _settledMedia).firstElementChild.pause();
  }
};
/**
 * When the media settles, we have to update various elements such as the AR button, the autoplay strategy...
 */
onMediaSettle_fn = function(event) {
  const media = event ? event.detail.cell : this.carousel.selectedCell;
  switch (media.getAttribute("data-media-type")) {
    case "image":
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id"));
      break;
    case "external_video":
    case "video":
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id"));
      if (this.hasAttribute("autoplay-media")) {
        media.firstElementChild.play();
      }
      break;
    case "model":
      if (matchesMediaQuery("md")) {
        media.firstElementChild.play();
      }
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", event.detail.cell.getAttribute("data-media-id"));
      break;
  }
  __privateSet(this, _settledMedia, media);
};
/**
 * Detect a click on an image on desktop, and open the lightbox for the corresponding image
 */
onCarouselClick_fn = function(event) {
  if (this.customCursor) {
    if (event.target.matches("button, a[href], button :scope, a[href] :scope") || !window.matchMedia("screen and (pointer: fine)").matches) {
      return;
    }
    if (this.carousel.selectedCell.getAttribute("data-media-type") !== "image") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect(), offsetX = event.clientX - rect.left;
    offsetX > this.carousel.clientWidth / 2 ? this.carousel.next() : this.carousel.previous();
  }
};
/**
 * For iOS devices only, we use the gesturechange event to easily detect a "pinch to zoom"
 */
onGestureStart_fn = function(event) {
  event.preventDefault();
  this.carousel.addEventListener("gesturechange", __privateGet(this, _onGestureChangedListener), { capture: false, signal: __privateGet(this, _abortController9).signal });
};
onGestureChanged_fn = function(event) {
  event.preventDefault();
  if (event.scale > 1.5) {
    this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true, detail: { index: this.carousel.selectedIndex } }));
    this.removeEventListener("gesturechange", __privateGet(this, _onGestureChangedListener));
  }
};
var OpenLightBoxButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true, detail: { index: this.hasAttribute("image-index") ? parseInt(this.getAttribute("image-index")) : null } })));
  }
};
if (!window.customElements.get("product-gallery")) {
  window.customElements.define("product-gallery", ProductGallery);
}
if (!window.customElements.get("open-lightbox-button")) {
  window.customElements.define("open-lightbox-button", OpenLightBoxButton);
}

// js/common/product/product-list.js
import { inView as inView6, animate as animate7, stagger } from "vendor";
var ProductList = class extends ScrollCarousel {
  connectedCallback() {
    if (matchesMediaQuery("motion-safe") && this.querySelectorAll('product-card[reveal-on-scroll="true"]').length > 0) {
      inView6(this, this.reveal.bind(this));
    }
  }
  async reveal() {
    animate7(this.querySelectorAll('product-card[reveal-on-scroll="true"], .product-list__promo[reveal-on-scroll="true"]'), {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0)"]
    }, {
      duration: 0.1,
      ease: "easeInOut",
      delay: window.themeVariables.settings.staggerProducts ? stagger(0.05, { startDelay: 0.1, ease: "easeOut" }) : 0
    });
  }
};
if (!window.customElements.get("product-list")) {
  window.customElements.define("product-list", ProductList);
}

// js/common/product/product-loader.js
var loadedProducts = {};
var ProductLoader = class {
  static load(productHandle) {
    if (!productHandle) {
      return;
    }
    if (loadedProducts[productHandle]) {
      return loadedProducts[productHandle];
    }
    loadedProducts[productHandle] = new Promise(async (resolve, reject) => {
      const response = await fetch(`${Shopify.routes.root}products/${productHandle}.js`);
      if (response.ok) {
        const responseAsJson = await response.json();
        resolve(responseAsJson);
      } else {
        reject(`
          Attempted to load information for product with handle ${productHandle}, but this product is in "draft" mode. You won't be able to
          switch between variants or access to per-variant information. To fully preview this product, change temporarily its status
          to "active".
        `);
      }
    });
    return loadedProducts[productHandle];
  }
};

// js/common/product/product-rerender.js
var _abortController10, _ProductRerender_instances, onRerender_fn;
var ProductRerender = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductRerender_instances);
    __privateAdd(this, _abortController10);
  }
  connectedCallback() {
    __privateSet(this, _abortController10, new AbortController());
    if (!this.id || !this.hasAttribute("observe-form")) {
      console.warn('The <product-rerender> requires an ID to identify the element to re-render, and an "observe-form" attribute referencing to the form to monitor.');
    }
    document.forms[this.getAttribute("observe-form")].addEventListener("product:rerender", __privateMethod(this, _ProductRerender_instances, onRerender_fn).bind(this), { signal: __privateGet(this, _abortController10).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController10).abort();
  }
};
_abortController10 = new WeakMap();
_ProductRerender_instances = new WeakSet();
onRerender_fn = function(event) {
  const matchingElement = deepQuerySelector(event.detail.htmlFragment, `#${this.id}`);
  if (!matchingElement) {
    return;
  }
  const focusedElement = document.activeElement;
  if (!this.hasAttribute("allow-partial-rerender") || event.detail.productChange) {
    this.replaceWith(matchingElement);
  } else {
    this.querySelectorAll(`[data-block-type][data-block-allow-rerender`).forEach((element) => {
      const matchingBlock = matchingElement.querySelector(`[data-block-type][data-block-id="${element.getAttribute("data-block-id")}"]`);
      if (matchingBlock) {
        const blockType = matchingBlock.getAttribute("data-block-type");
        if (blockType === "buy-buttons") {
          const existingQuantity = element.querySelector("quantity-selector")?.quantity;
          const buyButtons = matchingBlock.querySelector("buy-buttons");
          element.querySelector("buy-buttons").replaceWith(buyButtons);
          const newQuantitySelector = buyButtons.querySelector("quantity-selector");
          if (newQuantitySelector) {
            newQuantitySelector.quantity = existingQuantity;
          }
        } else if (blockType === "payment-terms") {
          element.querySelector('[name="id"]').value = matchingBlock.querySelector('[name="id"]').value;
          element.querySelector('[name="id"]').dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          element.replaceWith(matchingBlock);
        }
      }
    });
  }
  if (focusedElement.id) {
    const element = document.getElementById(focusedElement.id);
    if (this.contains(element)) {
      element.focus();
    }
  }
};
if (!window.customElements.get("product-rerender")) {
  window.customElements.define("product-rerender", ProductRerender);
}

// js/common/product/quick-buy-modal.js
var _QuickBuyModal_instances, onAfterHide_fn;
var QuickBuyModal = class extends Modal {
  constructor() {
    super();
    __privateAdd(this, _QuickBuyModal_instances);
    this.addEventListener("dialog:after-hide", __privateMethod(this, _QuickBuyModal_instances, onAfterHide_fn).bind(this));
  }
  get shouldAppendToBody() {
    return true;
  }
  async show() {
    const showLoadingBar = this.controls.every((control) => control.querySelector("button-content") === null);
    [this, ...this.controls].forEach((control) => control.setAttribute("aria-busy", "true"));
    const promise = new Promise(async (resolve, reject) => {
      if (showLoadingBar) {
        document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
      }
      const responseContent = await (await cachedFetch(this.getAttribute("product-url"))).text();
      const tempDoc = new DOMParser().parseFromString(responseContent, "text/html");
      const quickBuyContent = tempDoc.getElementById("quick-buy-content");
      this.replaceChildren(quickBuyContent.content.cloneNode(true).firstElementChild);
      [this, ...this.controls].forEach((control) => control.setAttribute("aria-busy", "false"));
      resolve();
      if (showLoadingBar) {
        document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
      }
    });
    return super.show({ conditionToFulfill: promise });
  }
};
_QuickBuyModal_instances = new WeakSet();
onAfterHide_fn = function() {
  this.innerHTML = "";
};
if (!window.customElements.get("quick-buy-modal")) {
  window.customElements.define("quick-buy-modal", QuickBuyModal);
}

// js/common/product/product-sticky-add-to-cart.js
var ProductStickyAddToCart = class extends SandwichVisibility {
  get startMarker() {
    return document.getElementById(this.getAttribute("main-product-form"));
  }
  get endMarker() {
    return document.querySelector(".shopify-section--footer");
  }
};
if (!window.customElements.get("product-sticky-add-to-cart")) {
  window.customElements.define("product-sticky-add-to-cart", ProductStickyAddToCart);
}

// js/common/product/variant-picker.js
import { Delegate as Delegate6 } from "vendor";
var CACHE_EVICTION_TIME = 1e3 * 60 * 5;
var _preloadedHtml, _delegate4, _intersectionObserver2, _form, _selectedVariant, _VariantPicker_instances, getActiveOptionValues_fn, getOptionValuesFromOption_fn, onOptionChanged_fn, onOptionPreload_fn, onIntersection_fn, renderForCombination_fn, createHashKeyForHtml_fn;
var _VariantPicker = class _VariantPicker extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _VariantPicker_instances);
    __privateAdd(this, _delegate4, new Delegate6(document.body));
    __privateAdd(this, _intersectionObserver2, new IntersectionObserver(__privateMethod(this, _VariantPicker_instances, onIntersection_fn).bind(this)));
    __privateAdd(this, _form);
    __privateAdd(this, _selectedVariant);
  }
  async connectedCallback() {
    __privateSet(this, _selectedVariant, JSON.parse(this.querySelector("script[data-variant]")?.textContent || "{}"));
    __privateSet(this, _form, document.forms[this.getAttribute("form-id")]);
    __privateGet(this, _delegate4).on("change", `input[data-option-position][form="${this.getAttribute("form-id")}"]`, __privateMethod(this, _VariantPicker_instances, onOptionChanged_fn).bind(this));
    __privateGet(this, _delegate4).on("pointerenter", `input[data-option-position][form="${this.getAttribute("form-id")}"]:not(:checked) + label`, __privateMethod(this, _VariantPicker_instances, onOptionPreload_fn).bind(this), true);
    __privateGet(this, _delegate4).on("touchstart", `input[data-option-position][form="${this.getAttribute("form-id")}"]:not(:checked) + label`, __privateMethod(this, _VariantPicker_instances, onOptionPreload_fn).bind(this), true);
    __privateGet(this, _intersectionObserver2).observe(this);
    if (Shopify.designMode) {
      document.addEventListener("shopify:section:unload", () => {
        __privateGet(_VariantPicker, _preloadedHtml).clear();
      });
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate4).off();
    __privateGet(this, _intersectionObserver2).unobserve(this);
  }
  get selectedVariant() {
    return __privateGet(this, _selectedVariant);
  }
  get productHandle() {
    return this.getAttribute("handle");
  }
  get updateUrl() {
    return this.hasAttribute("update-url");
  }
  /**
   * Select a variant using a list of option values. The list of option values might lead to no variant (for instance)
   * in the case of a combination that does not exist
   */
  async selectCombination({ optionValues, productChange }) {
    const previousVariant = this.selectedVariant;
    const newContent = document.createRange().createContextualFragment(await __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, optionValues));
    if (!productChange) {
      const newVariantPicker = deepQuerySelector(newContent, `${this.tagName}[form-id="${this.getAttribute("form-id")}"]`);
      const newVariant = JSON.parse(newVariantPicker.querySelector("script[data-variant]")?.textContent || "{}");
      __privateSet(this, _selectedVariant, newVariant);
      __privateGet(this, _form).id.value = __privateGet(this, _selectedVariant)?.id;
      __privateGet(this, _form).id.dispatchEvent(new Event("change", { bubbles: true }));
      if (this.updateUrl && __privateGet(this, _selectedVariant)?.id) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("variant", __privateGet(this, _selectedVariant).id);
        window.history.replaceState({ path: newUrl.toString() }, "", newUrl.toString());
      }
    }
    __privateGet(this, _form).dispatchEvent(new CustomEvent("product:rerender", {
      detail: {
        htmlFragment: newContent,
        productChange
      }
    }));
    if (!productChange) {
      __privateGet(this, _form).dispatchEvent(new CustomEvent("variant:change", {
        bubbles: true,
        detail: {
          formId: __privateGet(this, _form).id,
          variant: __privateGet(this, _selectedVariant),
          previousVariant
        }
      }));
    }
    Shopify?.PaymentButton?.init();
  }
};
_preloadedHtml = new WeakMap();
_delegate4 = new WeakMap();
_intersectionObserver2 = new WeakMap();
_form = new WeakMap();
_selectedVariant = new WeakMap();
_VariantPicker_instances = new WeakSet();
/**
 * Get the option values for the active combination
 */
getActiveOptionValues_fn = function() {
  return Array.from(__privateGet(this, _form).elements).filter((item) => item.matches("input[data-option-position]:checked")).sort((a, b) => parseInt(a.getAttribute("data-option-position")) - parseInt(b.getAttribute("data-option-position"))).map((input) => input.value);
};
/**
 * Get the option values for a given input
 */
getOptionValuesFromOption_fn = function(input) {
  const optionValues = [input, ...Array.from(__privateGet(this, _form).elements).filter((item) => item.matches(`input[data-option-position]:not([name="${input.name}"]):checked`))].sort((a, b) => parseInt(a.getAttribute("data-option-position")) - parseInt(b.getAttribute("data-option-position"))).map((input2) => input2.value);
  return optionValues;
};
onOptionChanged_fn = async function(event) {
  if (!event.target.name.includes("option")) {
    return;
  }
  this.selectCombination({
    optionValues: __privateMethod(this, _VariantPicker_instances, getActiveOptionValues_fn).call(this),
    productChange: event.target.hasAttribute("data-product-url")
  });
};
/**
 * To improve the user experience, we preload a variant whenever the user hovers over a specific option
 */
onOptionPreload_fn = function(event, target) {
  __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, __privateMethod(this, _VariantPicker_instances, getOptionValuesFromOption_fn).call(this, target.control));
};
/**
 * When the variant picker is intersecting the viewport, we preload the options to improve the user experience
 * so that switching variants is nearly instant
 */
onIntersection_fn = function(entries) {
  const prerenderOptions = () => {
    Array.from(__privateGet(this, _form).elements).filter((item) => item.matches("input[data-option-position]:not(:checked)")).forEach((input) => {
      __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, __privateMethod(this, _VariantPicker_instances, getOptionValuesFromOption_fn).call(this, input));
    });
  };
  if (entries[0].isIntersecting) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(prerenderOptions, { timeout: 2e3 });
    } else {
      prerenderOptions();
    }
  }
};
renderForCombination_fn = async function(optionValues) {
  const optionValuesAsString = optionValues.join(",");
  const hashKey = __privateMethod(this, _VariantPicker_instances, createHashKeyForHtml_fn).call(this, optionValuesAsString);
  let productUrl = `${Shopify.routes.root}products/${this.productHandle}`;
  for (const optionValue of optionValues) {
    const inputForOptionValue = Array.from(__privateGet(this, _form).elements).find((item) => item.matches(`input[value="${optionValue}"]`));
    if (inputForOptionValue?.dataset.productUrl) {
      productUrl = inputForOptionValue.dataset.productUrl;
      break;
    }
  }
  if (!__privateGet(_VariantPicker, _preloadedHtml).has(hashKey)) {
    const sectionQueryParam = this.getAttribute("context") === "quick_buy" ? "" : `&section_id=${this.getAttribute("section-id")}`;
    const promise = new Promise(async (resolve) => {
      resolve(await (await fetch(`${productUrl}?option_values=${optionValuesAsString}${sectionQueryParam}`)).text());
    });
    __privateGet(_VariantPicker, _preloadedHtml).set(hashKey, { htmlPromise: promise, timestamp: Date.now() });
    if (__privateGet(_VariantPicker, _preloadedHtml).size > 100) {
      __privateGet(_VariantPicker, _preloadedHtml).delete(Array.from(__privateGet(_VariantPicker, _preloadedHtml).keys())[0]);
    }
  }
  return __privateGet(_VariantPicker, _preloadedHtml).get(hashKey).htmlPromise;
};
createHashKeyForHtml_fn = function(optionValuesAsString) {
  return `${optionValuesAsString}-${this.getAttribute("section-id")}`;
};
__privateAdd(_VariantPicker, _preloadedHtml, /* @__PURE__ */ new Map());
var VariantPicker = _VariantPicker;
if (!window.customElements.get("variant-picker")) {
  window.customElements.define("variant-picker", VariantPicker);
}

// js/common/media/base-media.js
import { inView as inView7 } from "vendor";
var BaseMedia = class extends HTMLElement {
  static get observedAttributes() {
    return ["playing"];
  }
  connectedCallback() {
    this._abortController = new AbortController();
    if (this.hasAttribute("autoplay")) {
      inView7(this, this.play.bind(this), { margin: "0px 0px 0px 0px" });
    }
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
  get playing() {
    return this.hasAttribute("playing");
  }
  get player() {
    return this._playerProxy = this._playerProxy || new Proxy(this._playerTarget(), {
      get: (target, prop) => {
        return async () => {
          target = await target;
          this._playerHandler(target, prop);
        };
      }
    });
  }
  play() {
    if (!this.playing && this.offsetParent !== null) {
      this.player.play();
    }
  }
  pause() {
    if (this.playing) {
      this.player.pause();
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "playing") {
      if (oldValue === null && newValue === "") {
        this.dispatchEvent(new CustomEvent("media:play", { bubbles: true }));
        if (this.hasAttribute("group")) {
          Array.from(document.querySelectorAll(`[group="${this.getAttribute("group")}"]`)).filter((item) => item !== this).forEach((itemToPause) => {
            itemToPause.pause();
          });
        }
      } else if (newValue === null) {
        this.dispatchEvent(new CustomEvent("media:pause", { bubbles: true }));
      }
    }
  }
};

// js/common/media/model.js
var ModelMedia = class extends BaseMedia {
  connectedCallback() {
    super.connectedCallback();
    this.player;
  }
  _playerTarget() {
    return new Promise((resolve) => {
      this.setAttribute("loaded", "");
      window.Shopify.loadFeatures([
        {
          name: "shopify-xr",
          version: "1.0",
          onLoad: this._setupShopifyXr.bind(this)
        },
        {
          name: "model-viewer-ui",
          version: "1.0",
          onLoad: () => {
            const modelViewer = this.querySelector("model-viewer");
            modelViewer.addEventListener("shopify_model_viewer_ui_toggle_play", () => this.setAttribute("playing", ""));
            modelViewer.addEventListener("shopify_model_viewer_ui_toggle_pause", () => this.removeAttribute("playing"));
            resolve(new window.Shopify.ModelViewerUI(modelViewer, { focusOnPlay: true }));
          }
        }
      ]);
    });
  }
  _playerHandler(target, prop) {
    target[prop]();
  }
  async _setupShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener("shopify_xr_initialized", this._setupShopifyXr.bind(this));
    } else {
      const models = (await ProductLoader.load(this.getAttribute("handle")))["media"].filter((media) => media["media_type"] === "model");
      window.ShopifyXR.addModels(models);
      window.ShopifyXR.setupXRElements();
    }
  }
};
if (!window.customElements.get("model-media")) {
  window.customElements.define("model-media", ModelMedia);
}

// js/common/media/media-play-button.js
var _MediaPlayButton_instances, playMedia_fn;
var MediaPlayButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _MediaPlayButton_instances);
    this.addEventListener("click", __privateMethod(this, _MediaPlayButton_instances, playMedia_fn));
  }
};
_MediaPlayButton_instances = new WeakSet();
playMedia_fn = function() {
  document.getElementById(this.getAttribute("aria-controls"))?.play();
};
if (!window.customElements.get("media-play-button")) {
  window.customElements.define("media-play-button", MediaPlayButton);
}

// js/common/media/video.js
import { inView as inView8 } from "vendor";
var onYouTubePromise = new Promise((resolve) => {
  window.onYouTubeIframeAPIReady = () => resolve();
});
var VideoMedia = class extends BaseMedia {
  #mustRemoveControlsAfterSuspend = false;
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("autoplay")) {
      this.addEventListener("click", this.play, { once: true, signal: this._abortController.signal });
    }
    if (this.hasAttribute("show-play-button") && !this.shadowRoot) {
      this.attachShadow({ mode: "open" }).appendChild(document.getElementById("video-media-default-template").content.cloneNode(true));
    }
    if (this.getAttribute("type") === "video") {
      inView8(this, () => {
        this.querySelector("video")?.setAttribute("preload", "auto");
      }, { margin: "800px" });
    }
  }
  play({ restart = false } = {}) {
    if (restart && !this.hasAttribute("host")) {
      this.querySelector("video").currentTime = 0;
    }
    super.play();
  }
  _playerTarget() {
    if (this.hasAttribute("host")) {
      this.setAttribute("loaded", "");
      return new Promise(async (resolve) => {
        const templateElement = this.querySelector("template");
        if (templateElement) {
          templateElement.replaceWith(templateElement.content.firstElementChild.cloneNode(true));
        }
        const muteVideo = this.hasAttribute("autoplay") || matchesMediaQuery("md-max");
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (this.getAttribute("host") === "youtube") {
          if (!window.YT || !window.YT.Player) {
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          await onYouTubePromise;
          const player = new YT.Player(this.querySelector("iframe"), {
            events: {
              "onReady": () => {
                if (muteVideo) {
                  player.mute();
                }
                resolve(player);
              },
              "onStateChange": (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                  this.setAttribute("playing", "");
                } else if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
                  this.removeAttribute("playing");
                }
              }
            }
          });
        }
        if (this.getAttribute("host") === "vimeo") {
          if (!window.Vimeo || !window.Vimeo.Player) {
            script.src = "https://player.vimeo.com/api/player.js";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          const player = new Vimeo.Player(this.querySelector("iframe"));
          if (muteVideo) {
            player.setMuted(true);
          }
          player.on("play", () => {
            this.setAttribute("playing", "");
          });
          player.on("pause", () => this.removeAttribute("playing"));
          player.on("ended", () => this.removeAttribute("playing"));
          resolve(player);
        }
      });
    } else {
      const videoElement = this.querySelector("video");
      this.setAttribute("loaded", "");
      this.querySelector("custom-cursor")?.remove();
      videoElement.addEventListener("play", () => {
        this.setAttribute("playing", "");
        this.removeAttribute("suspended");
        if (this.#mustRemoveControlsAfterSuspend) {
          videoElement.controls = false;
        }
      });
      videoElement.addEventListener("pause", () => {
        if (!videoElement.seeking && videoElement.paused) {
          this.removeAttribute("playing");
        }
      });
      return videoElement;
    }
  }
  _playerHandler(target, prop) {
    if (this.getAttribute("host") === "youtube") {
      prop === "play" ? target.playVideo() : target.pauseVideo();
    } else {
      if (prop === "play" && !this.hasAttribute("host")) {
        target.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            this.setAttribute("suspended", "");
            if (!this.hasAttribute("controls")) {
              this.#mustRemoveControlsAfterSuspend = true;
              target.controls = true;
            }
          }
        });
      } else {
        target[prop]();
      }
    }
  }
};
if (!window.customElements.get("video-media")) {
  window.customElements.define("video-media", VideoMedia);
}

// js/common/navigation/accordion-disclosure.js
import { animateSequence as animateSequence6 } from "vendor";
var _detailsElement, _summaryElement, _contentElement, _AccordionDisclosure_instances, onSummaryClick_fn, open_fn, close_fn;
var AccordionDisclosure = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _AccordionDisclosure_instances);
    __privateAdd(this, _detailsElement, this.querySelector("details"));
    __privateAdd(this, _summaryElement, __privateGet(this, _detailsElement).firstElementChild);
    __privateAdd(this, _contentElement, __privateGet(this, _detailsElement).lastElementChild);
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => __privateMethod(this, _AccordionDisclosure_instances, open_fn).call(this, { instant: event.detail.load }));
      this.addEventListener("shopify:block:deselect", __privateMethod(this, _AccordionDisclosure_instances, close_fn));
    }
    __privateGet(this, _summaryElement).addEventListener("click", __privateMethod(this, _AccordionDisclosure_instances, onSummaryClick_fn).bind(this));
    this.classList.toggle("is-open", __privateGet(this, _detailsElement).open);
  }
  createOpenAnimationControls() {
    return animateSequence6([
      [__privateGet(this, _detailsElement), { height: [`${__privateGet(this, _summaryElement).clientHeight}px`, `${__privateGet(this, _detailsElement).clientHeight}px`] }, { duration: 0.25, ease: "easeInOut" }],
      [__privateGet(this, _contentElement), { opacity: [0, 1], transform: ["translateY(4px)", `translateY(0px)`] }, { duration: 0.15, at: "-0.1" }]
    ]);
  }
  createCloseAnimationControls() {
    return animateSequence6([
      [__privateGet(this, _contentElement), { opacity: 0 }, { duration: 0.15 }],
      [__privateGet(this, _detailsElement), { height: [`${__privateGet(this, _detailsElement).clientHeight}px`, `${__privateGet(this, _summaryElement).clientHeight}px`] }, { duration: 0.25, at: "<", ease: "easeInOut" }]
    ]);
  }
};
_detailsElement = new WeakMap();
_summaryElement = new WeakMap();
_contentElement = new WeakMap();
_AccordionDisclosure_instances = new WeakSet();
onSummaryClick_fn = function(event) {
  event.preventDefault();
  this.classList.toggle("is-open");
  if (this.classList.contains("is-open")) {
    __privateMethod(this, _AccordionDisclosure_instances, open_fn).call(this);
  } else {
    __privateMethod(this, _AccordionDisclosure_instances, close_fn).call(this);
  }
};
open_fn = async function({ instant = false } = {}) {
  this.classList.add("is-open");
  __privateGet(this, _detailsElement).open = true;
  __privateGet(this, _detailsElement).style.overflow = "hidden";
  const animationControls = this.createOpenAnimationControls();
  if (instant) {
    animationControls.complete();
  }
  await animationControls;
  __privateGet(this, _detailsElement).style.height = null;
  __privateGet(this, _detailsElement).style.overflow = null;
};
close_fn = async function() {
  this.classList.remove("is-open");
  const animationControls = this.createCloseAnimationControls();
  await animationControls;
  if (!this.classList.contains("is-open")) {
    __privateGet(this, _detailsElement).style.height = null;
    __privateGet(this, _detailsElement).open = false;
  }
};
if (!window.customElements.get("accordion-disclosure")) {
  window.customElements.define("accordion-disclosure", AccordionDisclosure);
}

// js/common/navigation/tabs.js
import { Delegate as Delegate7, animate as animate8 } from "vendor";
var _componentID, _buttons, _panels, _delegate5, _Tabs_instances, setupComponent_fn, onButtonClicked_fn, onSlotChange_fn, handleKeyboard_fn;
var Tabs = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _Tabs_instances);
    __privateAdd(this, _componentID, crypto.randomUUID ? crypto.randomUUID() : Math.floor(Math.random() * 1e4));
    __privateAdd(this, _buttons, []);
    __privateAdd(this, _panels, []);
    __privateAdd(this, _delegate5, new Delegate7(this));
    if (!this.shadowRoot) {
      const template2 = this.querySelector("template") || this.defaultTemplate;
      this.attachShadow({ mode: "open" }).appendChild(template2.content.cloneNode(true));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.selectedIndex = __privateGet(this, _buttons).indexOf(event.target));
    }
    __privateGet(this, _delegate5).on("click", 'button[role="tab"]', __privateMethod(this, _Tabs_instances, onButtonClicked_fn).bind(this));
    this.shadowRoot.addEventListener("slotchange", __privateMethod(this, _Tabs_instances, onSlotChange_fn).bind(this));
    this.addEventListener("keydown", __privateMethod(this, _Tabs_instances, handleKeyboard_fn));
  }
  static get observedAttributes() {
    return ["selected-index"];
  }
  connectedCallback() {
    __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this);
    this.selectedIndex = this.selectedIndex;
  }
  /**
   * --------------------------------------------------------------------------
   * GETTERS AND SETTERS
   * --------------------------------------------------------------------------
   */
  get defaultTemplate() {
    const template2 = document.createElement("template");
    template2.innerHTML = `
      <slot role="tablist" part="tab-list" name="tab"></slot>
      <slot part="tab-panels" name="tabpanel"></slot>
    `;
    return template2;
  }
  get animationDuration() {
    return this.hasAttribute("animation-duration") ? parseFloat(this.getAttribute("animation-duration")) : 0.15;
  }
  get selectedIndex() {
    return parseInt(this.getAttribute("selected-index")) || 0;
  }
  set selectedIndex(index) {
    this.setAttribute("selected-index", Math.min(Math.max(index, 0), __privateGet(this, _buttons).length - 1).toString());
    this.style.setProperty("--selected-index", this.selectedIndex.toString());
    __privateGet(this, _buttons).forEach((button, i) => {
      if (i === index) {
        button.removeAttribute("tabindex");
        this.scrollTo({ left: button.offsetLeft - this.clientWidth / 2 + button.clientWidth / 2, behavior: "smooth" });
      } else {
        button.tabIndex = -1;
      }
    });
  }
  /**
   * --------------------------------------------------------------------------
   * METHODS
   * --------------------------------------------------------------------------
   */
  attributeChangedCallback(name, oldValue, newValue) {
    __privateGet(this, _buttons).forEach((button, index) => button.setAttribute("aria-selected", index === parseInt(newValue) ? "true" : "false"));
    if (name === "selected-index" && oldValue !== null && oldValue !== newValue) {
      this.transition(__privateGet(this, _panels)[parseInt(oldValue)], __privateGet(this, _panels)[parseInt(newValue)]);
    }
  }
  /**
   * Perform a custom transition (can be overridden in subclasses). To "from" and "to" are hash representing the panel
   */
  async transition(fromPanel, toPanel) {
    await animate8(fromPanel, { opacity: [1, 0], transform: ["translateY(0)", "translateY(10px)"] }, { duration: this.animationDuration });
    fromPanel.hidden = true;
    toPanel.hidden = false;
    await animate8(toPanel, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: this.animationDuration });
  }
};
_componentID = new WeakMap();
_buttons = new WeakMap();
_panels = new WeakMap();
_delegate5 = new WeakMap();
_Tabs_instances = new WeakSet();
setupComponent_fn = function() {
  __privateSet(this, _buttons, Array.from(this.shadowRoot.querySelector('slot[name="tab"]').assignedNodes(), (item) => item.matches("button") && item || item.querySelector("button")).filter((button) => button !== null));
  __privateSet(this, _panels, []);
  if (__privateGet(this, _buttons).length > 0) {
    __privateGet(this, _buttons).forEach((button, index) => {
      button.setAttribute("role", "tab");
      button.id = `tab-${__privateGet(this, _componentID)}-${index}`;
      let panel;
      if (button.hasAttribute("aria-controls")) {
        panel = document.getElementById(button.getAttribute("aria-controls"));
      } else {
        panel = this.shadowRoot.querySelector('slot[name="tabpanel"]').assignedNodes()[index];
        panel.id = `tab-panel-${__privateGet(this, _componentID)}-${index}`;
        button.setAttribute("aria-controls", `tab-panel-${__privateGet(this, _componentID)}-${index}`);
      }
      if (!panel) {
      } else {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", `tab-${__privateGet(this, _componentID)}-${index}`);
        panel.hidden = index !== this.selectedIndex;
        if (!panel.matches(":scope:has(a[href], button:not([disabled]), details, iframe, object, input:not([disabled]), select:not([disabled]), textarea:not([disabled]))")) {
          panel.tabIndex = 0;
        }
        __privateGet(this, _panels)[index] = panel;
      }
    });
  }
  if (!__privateGet(this, _buttons).find((button) => button.getAttribute("aria-selected") === "true")) {
    this.selectedIndex = 0;
  }
  this.style.setProperty("--item-count", __privateGet(this, _buttons).length.toString());
};
onButtonClicked_fn = function(event, button) {
  this.selectedIndex = __privateGet(this, _buttons).indexOf(button);
};
onSlotChange_fn = function(event) {
  __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this);
};
/**
 * As per https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-automatic.html, when a tab is currently focused,
 * left and right arrow should switch the tab
 */
handleKeyboard_fn = function(event) {
  const index = __privateGet(this, _buttons).indexOf(document.activeElement);
  if (index === -1) {
    return;
  }
  if (event.key === "ArrowLeft") {
    this.selectedIndex = (this.selectedIndex - 1 + __privateGet(this, _buttons).length) % __privateGet(this, _buttons).length;
    __privateGet(this, _buttons)[this.selectedIndex].focus();
  } else if (event.key === "ArrowRight") {
    this.selectedIndex = (this.selectedIndex + 1 + __privateGet(this, _buttons).length) % __privateGet(this, _buttons).length;
    __privateGet(this, _buttons)[this.selectedIndex].focus();
  }
};
if (!window.customElements.get("x-tabs")) {
  window.customElements.define("x-tabs", Tabs);
}

// js/common/search/predictive-search.js
import { Delegate as Delegate8 } from "vendor";
var _delegate6, _listenersAbortController2, _fetchAbortController, _searchForm, _queryInput, _PredictiveSearch_instances, onInputChanged_fn, onFormSubmitted_fn2, doPredictiveSearch_fn, onSearchCleared_fn;
var PredictiveSearch = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _PredictiveSearch_instances);
    __privateAdd(this, _delegate6, new Delegate8(this));
    __privateAdd(this, _listenersAbortController2);
    __privateAdd(this, _fetchAbortController);
    __privateAdd(this, _searchForm);
    __privateAdd(this, _queryInput);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(document.createRange().createContextualFragment(`<slot name="placeholder"></slot>`));
  }
  connectedCallback() {
    __privateSet(this, _listenersAbortController2, new AbortController());
    __privateSet(this, _searchForm, document.querySelector(`[aria-owns="${this.id}"]`));
    __privateSet(this, _queryInput, __privateGet(this, _searchForm).elements["q"]);
    __privateGet(this, _searchForm).addEventListener("submit", __privateMethod(this, _PredictiveSearch_instances, onFormSubmitted_fn2).bind(this), { signal: __privateGet(this, _listenersAbortController2).signal });
    __privateGet(this, _searchForm).addEventListener("reset", __privateMethod(this, _PredictiveSearch_instances, onSearchCleared_fn).bind(this), { signal: __privateGet(this, _listenersAbortController2).signal });
    __privateGet(this, _queryInput).addEventListener("input", debounce(__privateMethod(this, _PredictiveSearch_instances, onInputChanged_fn).bind(this), this.autoCompleteDelay, { signal: __privateGet(this, _listenersAbortController2).signal }));
  }
  disconnectedCallback() {
    __privateGet(this, _listenersAbortController2).abort();
  }
  /**
   * Return the delay in ms before we send the autocomplete request. Using a value too low can cause the results to
   * refresh too often, so we recommend to keep the default one
   */
  get autoCompleteDelay() {
    return 280;
  }
  /**
   * Check if the store supports the predictive API (some languages do not). When not supported, the predictive
   * search is simply disabled and only the standard search is used
   */
  supportsPredictiveApi() {
    return JSON.parse(document.getElementById("shopify-features").innerHTML)["predictiveSearch"];
  }
};
_delegate6 = new WeakMap();
_listenersAbortController2 = new WeakMap();
_fetchAbortController = new WeakMap();
_searchForm = new WeakMap();
_queryInput = new WeakMap();
_PredictiveSearch_instances = new WeakSet();
/**
 * Check if the input is not empty, and if so, trigger the predictive search
 */
onInputChanged_fn = function() {
  if (__privateGet(this, _queryInput).value === "") {
    return __privateMethod(this, _PredictiveSearch_instances, onSearchCleared_fn).call(this);
  }
  __privateGet(this, _fetchAbortController)?.abort();
  __privateSet(this, _fetchAbortController, new AbortController());
  return __privateMethod(this, _PredictiveSearch_instances, doPredictiveSearch_fn).call(this);
};
/**
 * Prevent the form submission if the query is empty
 */
onFormSubmitted_fn2 = function(event) {
  if (__privateGet(this, _queryInput).value === "") {
    return event.preventDefault();
  }
};
doPredictiveSearch_fn = async function() {
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  try {
    const url = `${window.Shopify.routes.root}search${this.supportsPredictiveApi() ? "/suggest" : ""}`, queryParams = `q=${encodeURIComponent(__privateGet(this, _queryInput).value)}&section_id=predictive-search&resources[limit]=10&resources[limit_scope]=each`, tempDoc = new DOMParser().parseFromString(await (await cachedFetch(`${url}?${queryParams}`, { signal: __privateGet(this, _fetchAbortController).signal })).text(), "text/html");
    this.shadowRoot.innerHTML = `<slot name="results"></slot>`;
    this.querySelector('[slot="results"]').replaceChildren(...document.importNode(tempDoc.querySelector(".shopify-section"), true).children);
  } catch (e) {
    if (e.name !== "AbortError") {
      throw e;
    }
  }
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
};
/**
 * If any search is pending, we abort them, and transition to the idle slot
 */
onSearchCleared_fn = function() {
  __privateGet(this, _fetchAbortController)?.abort();
  __privateGet(this, _queryInput).focus();
  this.shadowRoot.innerHTML = `<slot name="placeholder"></slot>`;
};
if (!window.customElements.get("predictive-search")) {
  window.customElements.define("predictive-search", PredictiveSearch);
}

// js/common/typography/button.js
import { animate as animate9, animateSequence as animateSequence7 } from "vendor";
var _isLoading, _ButtonContent_instances, startHoverEffect_fn, finishHoverEffect_fn, onObserveAttributes_fn, onLoadingChanged_fn;
var ButtonContent = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ButtonContent_instances);
    __privateAdd(this, _isLoading, false);
    const mutationObserver = new MutationObserver(__privateMethod(this, _ButtonContent_instances, onObserveAttributes_fn).bind(this));
    mutationObserver.observe(this.parentElement, { attributes: true, attributeFilter: ["aria-busy"], attributeOldValue: true });
    if (this.hasAttribute("rotated-text") && matchesMediaQuery("supports-hover") && matchesMediaQuery("motion-safe")) {
      this.parentElement.addEventListener("mouseenter", __privateMethod(this, _ButtonContent_instances, startHoverEffect_fn).bind(this));
      this.parentElement.addEventListener("mouseleave", __privateMethod(this, _ButtonContent_instances, finishHoverEffect_fn).bind(this));
    }
  }
  connectedCallback() {
    this.style.transform = "";
  }
};
_isLoading = new WeakMap();
_ButtonContent_instances = new WeakSet();
startHoverEffect_fn = function() {
  if (__privateGet(this, _isLoading)) {
    return;
  }
  const contentWidth = getComputedStyle(this, "::before").width;
  this.getAnimations().forEach((animation) => animation.cancel());
  const SPEED_PX_PER_SECOND = 100;
  const distance = this.clientWidth + parseFloat(contentWidth);
  const animationDuration = distance / SPEED_PX_PER_SECOND;
  return animate9(
    this,
    { transform: [null, `translateX(calc(var(--transform-logical-flip) * (50% + ${contentWidth} / 2)))`] },
    { repeat: Infinity, ease: "linear", duration: animationDuration }
  );
};
finishHoverEffect_fn = function() {
  if (!this?.checkVisibility()) {
    return;
  }
  return animate9(
    this,
    { transform: [null, "translateX(0px)"] },
    { ease: [0.33, 1, 0.68, 1], duration: 0.2 }
  );
};
/**
 * Detect whenever the button (the parent) has the attribute "aria-busy" being added, so that we display the transient content or not
 */
onObserveAttributes_fn = function(mutationList) {
  mutationList.forEach((mutation) => {
    switch (mutation.type) {
      case "attributes":
        switch (mutation.attributeName) {
          case "aria-busy":
            if (mutation.oldValue === mutation.target.getAttribute("aria-busy")) {
              break;
            }
            __privateMethod(this, _ButtonContent_instances, onLoadingChanged_fn).call(this, mutation.target.getAttribute("aria-busy") === "true");
            break;
        }
        break;
    }
  });
};
onLoadingChanged_fn = async function(loading) {
  if (!this.shadowRoot) {
    this.attachShadow({ mode: "open" });
    let transientContent2 = "";
    if (this.closest("copy-button")) {
      transientContent2 = `
          <span class="transient" style="display: flex; align-items: center; gap: 8px">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
              <path stroke="currentColor" stroke-width="1.5" d="M1.5 4.643 5 8.5l5.5-6"/>
            </svg>

            <span>Copied</span>
          </span>
        `;
    } else {
      transientContent2 = `
          <svg class="transient" width="20" viewBox="0 0 120 30" fill="currentColor" style="opacity: 0">
            <circle cx="15" cy="15" r="15">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
            </circle>
            <circle cx="60" cy="15" r="9" fill-opacity="0.3">
              <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/>
            </circle>
            <circle cx="105" cy="15" r="15">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
            </circle>
          </svg>
        `;
    }
    this.shadowRoot.appendChild(document.createRange().createContextualFragment(`
        <style>
          :host {
            display: grid !important;
            place-items: center !important;
          }

          .transient {
            opacity: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        </style>

        ${transientContent2}

        <div part="content">
          <slot></slot>
        </div>
      `));
  }
  __privateSet(this, _isLoading, loading);
  const transientContent = this.shadowRoot.querySelector(".transient");
  const content = this.shadowRoot.querySelector('[part="content"]');
  if (!this?.checkVisibility()) {
    return;
  }
  if (loading) {
    if (this.hasAttribute("rotated-text")) {
      await __privateMethod(this, _ButtonContent_instances, finishHoverEffect_fn).call(this);
    }
    if (__privateGet(this, _isLoading)) {
      animateSequence7([
        [content, { transform: ["translateY(0)", "translateY(-10px)"], opacity: [1, 0] }, { duration: 0.18 }],
        [transientContent, { transform: ["translate(-50%, calc(-50% + 10px))", "translate(-50%, -50%)"], opacity: [0, 1] }, { duration: 0.18 }]
      ]);
    }
  } else {
    animateSequence7([
      [transientContent, { transform: ["translate(-50%, -50%)", "translateY(-50%, calc(-50% + 10px))"], opacity: [1, 0] }, { duration: 0.18 }],
      [content, { transform: ["translateY(10px)", "translateY(0)"], opacity: [0, 1] }, { duration: 0.18 }]
    ]);
  }
};
if (!window.customElements.get("button-content")) {
  window.customElements.define("button-content", ButtonContent);
}

// js/common/typography/highlighted-heading.js
import { inView as inView9 } from "vendor";
function createPencilFilter(id) {
  return `
    <defs>
      <filter x="-5%" y="-5%" width="110%" height="110%" filterUnits="objectBoundingBox" id="${id}">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch" result="t1"></feTurbulence>
        <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="t2"></feColorMatrix>
        <feComposite operator="in" in2="t2" in="SourceGraphic" result="SourceTextured"></feComposite>
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" seed="1" result="f1"></feTurbulence>
        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2.5" in="SourceTextured" in2="f1" result="f4"></feDisplacementMap>
      </filter>
    </defs>
  `;
}
function createCircleSvg(pencilStyle = false) {
  const filterId = crypto.randomUUID();
  return `
    <svg part="shape circle-shape" preserveAspectRatio="none" viewBox="0 0 239 112" fill="none">
      ${pencilStyle ? createPencilFilter(filterId) : ""}
      <path part="path" ${pencilStyle && `filter="url(#${filterId})"`} stroke="currentColor" stroke-linecap="round" stroke-width="${pencilStyle ? 3 : 2}" vector-effect="non-scaling-stroke" d="M209.793 7.563c-3.761-.066-7.336-.809-11.059-1.198-10.522-1.1-21.334-1.187-31.894-1.589-17.861-.68-35.657-.632-53.487.755-17.875 1.39-36.15 3.045-53.724 6.72-17.695 3.699-32.947 11.442-45.652 24.193C8.604 41.836 3.724 46.924 1.712 54.49c-1.766 6.646-.057 13.37 3.04 19.376 7.31 14.176 24.289 21.161 38.576 25.938 31.322 10.471 65.275 12.613 98.066 10.417 18.208-1.22 36.408-3.315 54.221-7.344 9.566-2.164 19.614-4.969 28.225-9.844 9.515-5.388 15.133-14.411 14.02-25.392-1.145-11.3-8.044-20.744-15.828-28.594-15.36-15.49-37.406-23.105-58.153-28.569C140.302 4.271 116.23 1 91.863 1"/>
    </svg>
  `;
}
function createUnderlineSvg(pencilStyle = false) {
  const filterId = crypto.randomUUID();
  return `
    <svg part="shape underline-shape" preserveAspectRatio="none" viewBox="0 0 215 14" fill="none">
      ${pencilStyle ? createPencilFilter(filterId) : ""}
      <path part="path" ${pencilStyle && `filter="url(#${filterId})"`} stroke="currentColor" stroke-linecap="round" stroke-width="${pencilStyle ? 3 : 2}" vector-effect="non-scaling-stroke" d="M1 1c20.54 2.356 41.237 2.634 61.957 2.703 25.31.085 50.625.028 75.928-.467 19.199-.376 38.386-1.092 57.584-1.503 5.836-.125 11.686-.278 17.526-.278.17 0-4.327.618-4.547.644-29.274 3.52-58.822 5.58-88.31 7.542-26.569 1.768-53.22 2.055-79.861 2.552-2.122.039-4.269.06-6.388.176-2.502.137 4.997.4 7.505.443 46.458.782 92.838-1.125 139.285-1.125"/>
    </svg>
  `;
}
var _hasRevealed, _HighlightedHeading_instances, effect_get, showAnimation_get, onBecameVisible_fn, doTransition_fn, onSplit_fn;
var HighlightedHeading = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _HighlightedHeading_instances);
    __privateAdd(this, _hasRevealed, false);
    this.addEventListener("split-lines:split", __privateMethod(this, _HighlightedHeading_instances, onSplit_fn).bind(this));
  }
  connectedCallback() {
    if (__privateGet(this, _HighlightedHeading_instances, effect_get) !== "italic") {
      inView9(this, __privateMethod(this, _HighlightedHeading_instances, onBecameVisible_fn).bind(this), { margin: __privateGet(this, _HighlightedHeading_instances, showAnimation_get) ? "0% 0% -15% 0%" : "1000px 0px" });
    }
  }
  /**
   * Hide the effect (which basically restores to how it was initially). This is useful when you want to manually trigger the effect again.
   */
  hideEffect() {
    const lines = Array.from(this.querySelectorAll("split-lines")).flatMap((item) => item.lines);
    switch (__privateGet(this, _HighlightedHeading_instances, effect_get)) {
      case "marker":
      case "tilted-marker":
        lines.forEach((line) => {
          line.animate({ clipPath: "inset(100%)" }, { fill: "forwards", duration: 0, pseudoElement: "::before" });
          line.animate({ clipPath: "inset(100%)" }, { fill: "forwards", duration: 0, pseudoElement: "::after" });
          line.animate({ transform: "none" }, { fill: "forwards", duration: 0 });
        });
        break;
      case "circle":
      case "circle-pencil":
      case "underline":
      case "underline-pencil":
        lines.forEach((line) => {
          line.querySelector("svg")?.remove();
        });
        break;
    }
  }
  /**
   * Manually restart the effect
   */
  restartEffect() {
    __privateMethod(this, _HighlightedHeading_instances, doTransition_fn).call(this, {
      lines: Array.from(this.querySelectorAll("split-lines")).flatMap((item) => item.lines),
      instant: false
    });
  }
};
_hasRevealed = new WeakMap();
_HighlightedHeading_instances = new WeakSet();
effect_get = function() {
  return this.getAttribute("effect");
};
showAnimation_get = function() {
  return window.themeVariables.settings.showHeadingEffectAnimation && window.matchMedia("(prefers-reduced-motion: no-preference)").matches && !this.hasAttribute("instant");
};
/**
 * Initialize the effect by splitting the heading.  
 */
onBecameVisible_fn = function() {
  if (__privateGet(this, _HighlightedHeading_instances, effect_get) !== "italic") {
    __privateMethod(this, _HighlightedHeading_instances, doTransition_fn).call(this, {
      lines: Array.from(this.querySelectorAll("split-lines")).flatMap((item) => item.lines),
      instant: !__privateGet(this, _HighlightedHeading_instances, showAnimation_get)
    });
  }
};
/**
 * Do the actual transition based on the effect
 */
doTransition_fn = function({ lines, instant }) {
  switch (__privateGet(this, _HighlightedHeading_instances, effect_get)) {
    case "marker":
    case "tilted-marker":
      lines.forEach((line, index) => {
        line.style.zIndex = lines.length - index;
        line.setAttribute("data-content", line.textContent);
        line.animate(
          {
            clipPath: document.dir === "ltr" ? ["inset(0 100% 0 0)", "inset(0 0 0 0)"] : ["inset(0 0 0 100%)", "inset(0 0 0 0)"]
          },
          {
            fill: "forwards",
            duration: instant ? 0 : 700,
            delay: instant ? 0 : 350 * index,
            easing: "cubic-bezier(0.85, 0, 0.15, 1)",
            pseudoElement: "::before"
          }
        );
        line.animate(
          {
            clipPath: document.dir === "ltr" ? ["inset(0 100% 0 0)", "inset(0 0 0 0)"] : ["inset(0 0 0 100%)", "inset(0 0 0 0)"]
          },
          {
            fill: "forwards",
            duration: instant ? 0 : 700,
            delay: instant ? 0 : 350 * index,
            easing: "cubic-bezier(0.85, 0, 0.15, 1)",
            pseudoElement: "::after"
          }
        );
        if (__privateGet(this, _HighlightedHeading_instances, effect_get) === "tilted-marker") {
          line.animate(
            {
              transform: ["rotate(0)", "rotate(-4deg)"]
            },
            {
              fill: "forwards",
              duration: instant ? 0 : 700,
              delay: instant ? 0 : 350 * index,
              easing: "cubic-bezier(0.85, 0, 0.15, 1)"
            }
          );
        }
      });
      break;
    case "circle":
    case "circle-pencil":
    case "underline":
    case "underline-pencil":
      const pencilStyle = __privateGet(this, _HighlightedHeading_instances, effect_get).includes("pencil");
      lines.forEach((line, index) => {
        line.querySelector("svg")?.remove();
        line.insertAdjacentHTML("beforeend", __privateGet(this, _HighlightedHeading_instances, effect_get).includes("circle") ? createCircleSvg(pencilStyle) : createUnderlineSvg(pencilStyle));
        if (!instant) {
          const svg = line.querySelector("svg");
          const path = line.querySelector("path");
          const scaleFactor = Math.max(svg.getBoundingClientRect().width, svg.getBoundingClientRect().height) / Math.max(svg.getBBox().width, svg.getBBox().height);
          const adjustedPathLength = path.getTotalLength() * scaleFactor;
          path.setAttribute("stroke-dasharray", adjustedPathLength);
          path.setAttribute("stroke-dashoffset", adjustedPathLength);
          path.animate(
            {
              strokeDashoffset: [adjustedPathLength, 0]
            },
            {
              fill: "forwards",
              easing: "cubic-bezier(0.83, 0, 0.17, 1)",
              duration: 1e3,
              delay: 500 * index
            }
          );
        }
      });
  }
  __privateSet(this, _hasRevealed, true);
};
onSplit_fn = function(event) {
  if (__privateGet(this, _hasRevealed)) {
    __privateMethod(this, _HighlightedHeading_instances, doTransition_fn).call(this, { lines: event.detail.lines, instant: true });
  }
};
if (!window.customElements.get("highlighted-heading")) {
  window.customElements.define("highlighted-heading", HighlightedHeading);
}

// js/sections/age-verifier.js
var _AgeVerifierModal_instances, form_get3, checkBirthDate_fn, accessAuthorized_fn, accessDenied_fn, getCustomerAge_fn;
var AgeVerifierModal = class extends DialogElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _AgeVerifierModal_instances);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.verificationType === "date") {
      __privateGet(this, _AgeVerifierModal_instances, form_get3).addEventListener("submit", __privateMethod(this, _AgeVerifierModal_instances, checkBirthDate_fn).bind(this));
    } else {
      this.querySelector(".age-verifier__confirm-button")?.addEventListener("click", __privateMethod(this, _AgeVerifierModal_instances, accessAuthorized_fn).bind(this));
      this.querySelector(".age-verifier__decline-button")?.addEventListener("click", __privateMethod(this, _AgeVerifierModal_instances, accessDenied_fn).bind(this));
    }
    if (localStorage.getItem("authorized-access") === null && !Shopify.designMode) {
      this.show();
    }
  }
  get verificationType() {
    return this.getAttribute("verification-type");
  }
  get requiredAge() {
    return parseInt(this.getAttribute("required-age"));
  }
  get shouldLock() {
    return true;
  }
  get escapeDeactivates() {
    return false;
  }
};
_AgeVerifierModal_instances = new WeakSet();
form_get3 = function() {
  return this.querySelector("form");
};
checkBirthDate_fn = function(event) {
  if (event) {
    event.preventDefault();
  }
  const month = this.querySelector('[name="age-verifier[month]"]').value;
  const day = this.querySelector('[name="age-verifier[day]"]').value;
  const year = this.querySelector('[name="age-verifier[year]"]').value;
  const birthDate = new Date(year, month - 1, day);
  const customerAge = __privateMethod(this, _AgeVerifierModal_instances, getCustomerAge_fn).call(this, new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
  if (isNaN(birthDate.valueOf())) {
    return;
  }
  if (customerAge >= this.requiredAge) {
    __privateMethod(this, _AgeVerifierModal_instances, accessAuthorized_fn).call(this);
  } else {
    __privateMethod(this, _AgeVerifierModal_instances, accessDenied_fn).call(this);
  }
};
accessAuthorized_fn = function() {
  this.hide();
  localStorage.setItem("authorized-access", "true");
};
accessDenied_fn = function() {
  this.querySelector(".banner").hidden = false;
};
getCustomerAge_fn = function(birthDate) {
  const diffMs = Math.max(Date.now() - birthDate.getTime(), 0);
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};
if (!window.customElements.get("age-verifier-modal")) {
  window.customElements.define("age-verifier-modal", AgeVerifierModal);
}

// js/sections/customer.js
import { animate as animate10 } from "vendor";
var _AccountLogin_instances, loginForm_get, recoverForm_get, switchForm_fn;
var AccountLogin = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _AccountLogin_instances);
    window.addEventListener("hashchange", __privateMethod(this, _AccountLogin_instances, switchForm_fn).bind(this));
    if (window.location.hash === "#recover") {
      __privateGet(this, _AccountLogin_instances, loginForm_get).hidden = true;
      __privateGet(this, _AccountLogin_instances, recoverForm_get).hidden = false;
    }
  }
};
_AccountLogin_instances = new WeakSet();
loginForm_get = function() {
  return this.querySelector("#login");
};
recoverForm_get = function() {
  return this.querySelector("#recover");
};
switchForm_fn = async function() {
  const fromForm = window.location.hash === "#recover" ? __privateGet(this, _AccountLogin_instances, loginForm_get) : __privateGet(this, _AccountLogin_instances, recoverForm_get), toForm = window.location.hash === "#recover" ? __privateGet(this, _AccountLogin_instances, recoverForm_get) : __privateGet(this, _AccountLogin_instances, loginForm_get);
  await animate10(fromForm, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-10px)"] }, { duration: 0.25, ease: "easeInOut" });
  fromForm.hidden = true;
  toForm.hidden = false;
  await animate10(toForm, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.25, ease: "easeInOut" });
};
if (!window.customElements.get("account-login")) {
  window.customElements.define("account-login", AccountLogin);
}

// js/sections/announcement-bar.js
import { animate as animate11 } from "vendor";
var AnnouncementBar = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () => animate11(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-10px)"] }, { duration: 0.25, ease: [0.55, 0.055, 0.675, 0.19] }),
      enterControls: () => animate11(toSlide, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] })
    };
  }
};
if (!window.customElements.get("announcement-bar")) {
  window.customElements.define("announcement-bar", AnnouncementBar);
}

// js/sections/before-after-image.js
import { animate as animate12, inView as inView10 } from "vendor";
var _onPointerMoveListener, _touchStartTimestamp, _BeforeAfter_instances, onPointerDown_fn, onPointerMove_fn2, onTouchStart_fn, onPointerUp_fn, onKeyboardNavigation_fn2, calculatePosition_fn, animateInitialPosition_fn;
var BeforeAfter = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _BeforeAfter_instances);
    __privateAdd(this, _onPointerMoveListener, __privateMethod(this, _BeforeAfter_instances, onPointerMove_fn2).bind(this));
    __privateAdd(this, _touchStartTimestamp, 0);
    this.addEventListener("pointerdown", __privateMethod(this, _BeforeAfter_instances, onPointerDown_fn));
    this.addEventListener("keydown", __privateMethod(this, _BeforeAfter_instances, onKeyboardNavigation_fn2));
    this.addEventListener("touchstart", __privateMethod(this, _BeforeAfter_instances, onTouchStart_fn), { passive: false });
  }
  connectedCallback() {
    inView10(this, __privateMethod(this, _BeforeAfter_instances, animateInitialPosition_fn).bind(this));
  }
};
_onPointerMoveListener = new WeakMap();
_touchStartTimestamp = new WeakMap();
_BeforeAfter_instances = new WeakSet();
onPointerDown_fn = function(event) {
  if (event.target.tagName === "A") {
    return;
  }
  document.addEventListener("pointerup", __privateMethod(this, _BeforeAfter_instances, onPointerUp_fn).bind(this), { once: true });
  if (matchesMediaQuery("supports-hover")) {
    document.addEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
    __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
  }
};
onPointerMove_fn2 = function(event) {
  __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
  this.classList.add("is-dragging");
};
onTouchStart_fn = function(event) {
  const cursor = this.querySelector(".before-after__cursor");
  if (event.target === cursor || cursor.contains(event.target)) {
    event.preventDefault();
    document.addEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
  } else {
    __privateSet(this, _touchStartTimestamp, event.timeStamp);
  }
};
onPointerUp_fn = function(event) {
  document.removeEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
  this.classList.remove("is-dragging");
  if (!matchesMediaQuery("supports-hover")) {
    if (event.timeStamp - __privateGet(this, _touchStartTimestamp) <= 250) {
      __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
    }
  }
};
onKeyboardNavigation_fn2 = function(event) {
  if (!event.target.classList.contains("before-after__cursor") || !this.hasAttribute("vertical") && event.code !== "ArrowLeft" && event.code !== "ArrowRight" || this.hasAttribute("vertical") && event.code !== "ArrowUp" && event.code !== "ArrowDown") {
    return;
  }
  event.preventDefault();
  let currentPosition = parseInt(this.style.getPropertyValue("--before-after-cursor-position"));
  if (Number.isNaN(currentPosition)) {
    currentPosition = parseInt(getComputedStyle(this).getPropertyValue("--before-after-initial-cursor-position"));
  }
  let newPosition;
  if (this.hasAttribute("vertical")) {
    newPosition = event.code === "ArrowUp" ? currentPosition - 1 : currentPosition + 1;
  } else {
    newPosition = event.code === "ArrowLeft" ? currentPosition - 1 : currentPosition + 1;
  }
  this.style.setProperty("--before-after-cursor-position", `${Math.min(Math.max(newPosition, 0), 100)}%`);
};
calculatePosition_fn = function(event) {
  let rectangle = this.getBoundingClientRect(), percentage;
  if (this.hasAttribute("vertical")) {
    percentage = (event.clientY - rectangle.top) / this.clientHeight * 100;
  } else {
    percentage = (event.clientX - rectangle.left) / this.clientWidth * 100;
    percentage = document.dir === "rtl" ? 100 - percentage : percentage;
  }
  this.style.setProperty("--before-after-cursor-position", `${Math.min(Math.max(percentage, 0), 100)}%`);
};
animateInitialPosition_fn = function() {
  if (CSS.registerProperty) {
    animate12(this, { "--before-after-cursor-position": "var(--before-after-initial-cursor-position)" }, { duration: 0.6, ease: [0.85, 0, 0.15, 1] });
  } else {
    this.style.setProperty("--before-after-cursor-position", "var(--before-after-initial-cursor-position)");
  }
};
if (!window.customElements.get("before-after")) {
  window.customElements.define("before-after", BeforeAfter);
}

// js/sections/blog-post-list.js
import { inView as inView11, animate as animate13, stagger as stagger2 } from "vendor";
var BlogPostList = class extends ScrollCarousel {
  connectedCallback() {
    if (matchesMediaQuery("motion-safe") && this.querySelectorAll(':scope > [reveal-on-scroll="true"]').length > 0) {
      inView11(this, this.reveal.bind(this));
    }
  }
  reveal() {
    animate13(this.querySelectorAll(':scope > [reveal-on-scroll="true"]'), {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0)"]
    }, {
      duration: 0.1,
      ease: "easeInOut",
      delay: stagger2(0.05, { startDelay: 0.1, ease: "easeOut" })
    });
  }
};
if (!window.customElements.get("blog-post-list")) {
  window.customElements.define("blog-post-list", BlogPostList);
}

// js/sections/cart-drawer.js
var _sectionId, _CartDrawer_instances, onBundleSection_fn, onCartChange_fn, onPageShow_fn, refreshCart_fn, replaceContent_fn;
var CartDrawer = class extends Drawer {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartDrawer_instances);
    __privateAdd(this, _sectionId);
  }
  // We have to save the section ID, as the drawer may be replaced in the DOM
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _sectionId) ?? __privateSet(this, _sectionId, extractSectionId(this));
    document.addEventListener("cart:prepare-bundled-sections", __privateMethod(this, _CartDrawer_instances, onBundleSection_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:change", __privateMethod(this, _CartDrawer_instances, onCartChange_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _CartDrawer_instances, refreshCart_fn).bind(this), { signal: this.abortController.signal });
    window.addEventListener("pageshow", __privateMethod(this, _CartDrawer_instances, onPageShow_fn).bind(this), { signal: this.abortController.signal });
  }
  get initialFocus() {
    return false;
  }
};
_sectionId = new WeakMap();
_CartDrawer_instances = new WeakSet();
/**
 * This method is called when the cart is changing, and allow custom sections to order a "re-render"
 */
onBundleSection_fn = function(event) {
  event.detail.sections.add(__privateGet(this, _sectionId));
};
/**
 * When the cart changes, we need to re-render the cart drawer
 */
onCartChange_fn = function(event) {
  const html = new DOMParser().parseFromString(event.detail.cart["sections"][__privateGet(this, _sectionId)], "text/html"), itemCount = event.detail.cart["item_count"], newCartDrawer = document.createRange().createContextualFragment(html.getElementById(`shopify-section-${__privateGet(this, _sectionId)}`).querySelector("cart-drawer").innerHTML);
  if (itemCount === 0) {
    this.replaceChildren(...newCartDrawer.children);
  } else {
    this.replaceChildren(...newCartDrawer.children);
  }
  __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(this, event.detail.cart["sections"][__privateGet(this, _sectionId)]);
  if (window.themeVariables.settings.cartType === "drawer" && !this.open && event.detail.baseEvent === "variant:add") {
    this.show();
  }
};
onPageShow_fn = async function(event) {
  if (!event.persisted) {
    return;
  }
  __privateMethod(this, _CartDrawer_instances, refreshCart_fn).call(this);
};
refreshCart_fn = async function() {
  __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(this, await (await fetch(`${Shopify.routes.root}?section_id=${__privateGet(this, _sectionId)}`)).text());
};
replaceContent_fn = async function(html) {
  const domElement = new DOMParser().parseFromString(html, "text/html"), newCartDrawer = document.createRange().createContextualFragment(domElement.getElementById(`shopify-section-${__privateGet(this, _sectionId)}`).querySelector("cart-drawer").innerHTML), itemCount = (await fetchCart)["item_count"];
  if (itemCount === 0) {
    this.replaceChildren(...newCartDrawer.children);
  } else {
    this.replaceChildren(...newCartDrawer.children);
  }
  this.dispatchEvent(new CustomEvent("cart-drawer:refreshed", { bubbles: true }));
};
if (!window.customElements.get("cart-drawer")) {
  window.customElements.define("cart-drawer", CartDrawer);
}

// js/sections/countdown-timer.js
import { animate as animate14, inView as inView12 } from "vendor";
var _flips, _expirationDate, _interval, _isVisible, _CountdownTimer_instances, recalculateFlips_fn;
var CountdownTimer = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CountdownTimer_instances);
    __privateAdd(this, _flips);
    __privateAdd(this, _expirationDate);
    __privateAdd(this, _interval);
    __privateAdd(this, _isVisible);
  }
  connectedCallback() {
    __privateSet(this, _flips, Array.from(this.querySelectorAll("countdown-timer-flip")));
    const expiresAt = this.getAttribute("expires-at");
    if (expiresAt !== "") {
      __privateSet(this, _expirationDate, new Date(expiresAt));
      __privateSet(this, _interval, setInterval(__privateMethod(this, _CountdownTimer_instances, recalculateFlips_fn).bind(this), 1e3));
      __privateMethod(this, _CountdownTimer_instances, recalculateFlips_fn).call(this);
    }
    inView12(this, () => {
      __privateSet(this, _isVisible, true);
      return () => __privateSet(this, _isVisible, false);
    }, { margin: "500px" });
  }
  disconnectedCallback() {
    clearInterval(__privateGet(this, _interval));
  }
  get daysFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "days");
  }
  get hoursFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "hours");
  }
  get minutesFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "minutes");
  }
  get secondsFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "seconds");
  }
};
_flips = new WeakMap();
_expirationDate = new WeakMap();
_interval = new WeakMap();
_isVisible = new WeakMap();
_CountdownTimer_instances = new WeakSet();
recalculateFlips_fn = function() {
  const dateNow = /* @__PURE__ */ new Date();
  if (__privateGet(this, _expirationDate) < dateNow) {
    if (this.getAttribute("expiration-behavior") === "hide") {
      this.closest(".shopify-section, [data-block-id]").remove();
    } else {
      return clearInterval(__privateGet(this, _interval));
    }
  }
  if (!__privateGet(this, _isVisible)) {
    return;
  }
  let delta = Math.abs(__privateGet(this, _expirationDate) - dateNow) / 1e3;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.floor(delta % 60);
  this.daysFlip?.updateValue(days);
  this.hoursFlip?.updateValue(hours);
  this.minutesFlip?.updateValue(minutes);
  this.secondsFlip?.updateValue(seconds);
};
var CountdownTimerFlip = class extends HTMLElement {
  constructor() {
    super();
    if (this.hasAttribute("animate")) {
      this.attachShadow({ mode: "open" });
      let flipHtml = [...this.textContent].map(() => `<countdown-timer-flip-digit part="digit" style="display: inline-block">0</countdown-timer-flip-digit>`);
      this.shadowRoot.appendChild(document.createRange().createContextualFragment(flipHtml.join("")));
    }
  }
  updateValue(value) {
    const newValue = Math.min(99, value).toString().padStart(2, "0");
    if (this.hasAttribute("animate")) {
      [...newValue].forEach((digit, index) => {
        this.shadowRoot.children[index].setAttribute("number", digit);
      });
    } else {
      this.textContent = newValue;
    }
  }
};
var CountdownTimerFlipDigit = class extends HTMLElement {
  static observedAttributes = ["number"];
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(document.createRange().createContextualFragment("<div><slot></slot></div>"));
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === null || oldValue === newValue) {
      return this.textContent = newValue;
    }
    await animate14(this.shadowRoot.firstElementChild, { transform: ["translateY(0)", "translateY(-50%)"] }, { duration: 0.3, ease: [0.36, 0, 0.66, -0.56] });
    this.textContent = newValue;
    animate14(this.shadowRoot.firstElementChild, { transform: ["translateY(100%)", "translateY(0px)"] }, { duration: 0.2, ease: [0.22, 1, 0.36, 1] });
  }
};
if (!window.customElements.get("countdown-timer")) {
  window.customElements.define("countdown-timer", CountdownTimer);
}
if (!window.customElements.get("countdown-timer-flip")) {
  window.customElements.define("countdown-timer-flip", CountdownTimerFlip);
}
if (!window.customElements.get("countdown-timer-flip-digit")) {
  window.customElements.define("countdown-timer-flip-digit", CountdownTimerFlipDigit);
}

// js/sections/featured-collections.js
var FeaturedCollectionsTabs = class extends Tabs {
  async transition(fromPanel, toPanel) {
    super.transition(fromPanel, toPanel);
    if (window.themeVariables.settings.staggerProducts) {
      toPanel.querySelector("product-list").reveal();
    }
    if (toPanel.hasAttribute("data-url")) {
      this.nextElementSibling?.setAttribute("href", toPanel.getAttribute("data-url"));
    }
  }
};
if (!window.customElements.get("featured-collections-tabs")) {
  window.customElements.define("featured-collections-tabs", FeaturedCollectionsTabs);
}

// js/sections/header.js
import { animate as animate15, animateSequence as animateSequence8, stagger as stagger3, frame, Delegate as Delegate9 } from "vendor";
var _headerTrackerIntersectionObserver, _abortController11, _scrollYTrackingPosition, _isVisible2, _Header_instances, onHeaderTrackerIntersection_fn, detectMousePosition_fn, detectScrollDirection_fn, setVisibility_fn;
var Header = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Header_instances);
    __privateAdd(this, _headerTrackerIntersectionObserver, new IntersectionObserver(__privateMethod(this, _Header_instances, onHeaderTrackerIntersection_fn).bind(this)));
    __privateAdd(this, _abortController11);
    __privateAdd(this, _scrollYTrackingPosition, 0);
    __privateAdd(this, _isVisible2, true);
  }
  connectedCallback() {
    __privateSet(this, _abortController11, new AbortController());
    __privateGet(this, _headerTrackerIntersectionObserver).observe(document.getElementById("header-scroll-tracker"));
    if (this.hasAttribute("hide-on-scroll")) {
      window.addEventListener("scroll", throttle(__privateMethod(this, _Header_instances, detectScrollDirection_fn).bind(this)), { signal: __privateGet(this, _abortController11).signal, passive: true });
      window.addEventListener("pointermove", __privateMethod(this, _Header_instances, detectMousePosition_fn).bind(this), { signal: __privateGet(this, _abortController11).signal });
    }
    document.addEventListener("header:allow-transparent-header", () => this.classList.remove("is-solid"), { signal: __privateGet(this, _abortController11).signal });
    document.addEventListener("header:disable-transparent-header", () => this.classList.add("is-solid"), { signal: __privateGet(this, _abortController11).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController11).abort();
  }
};
_headerTrackerIntersectionObserver = new WeakMap();
_abortController11 = new WeakMap();
_scrollYTrackingPosition = new WeakMap();
_isVisible2 = new WeakMap();
_Header_instances = new WeakSet();
onHeaderTrackerIntersection_fn = function(entries) {
  this.classList.toggle("is-solid", !entries[0].isIntersecting);
};
detectMousePosition_fn = function(event) {
  if (event.clientY < 100 && window.matchMedia("screen and (pointer: fine)").matches) {
    __privateMethod(this, _Header_instances, setVisibility_fn).call(this, true);
    __privateSet(this, _scrollYTrackingPosition, 0);
  }
};
detectScrollDirection_fn = function() {
  let isVisible;
  let absScrollY = Math.abs(window.scrollY);
  if (absScrollY > __privateGet(this, _scrollYTrackingPosition) && absScrollY - __privateGet(this, _scrollYTrackingPosition) > 100) {
    isVisible = false;
    __privateSet(this, _scrollYTrackingPosition, absScrollY);
  } else if (absScrollY < __privateGet(this, _scrollYTrackingPosition)) {
    __privateSet(this, _scrollYTrackingPosition, absScrollY);
    isVisible = true;
  }
  if (isVisible !== void 0) {
    __privateMethod(this, _Header_instances, setVisibility_fn).call(this, isVisible);
  }
};
setVisibility_fn = function(isVisible) {
  if (isVisible !== __privateGet(this, _isVisible2)) {
    if (!isVisible && this.querySelectorAll("[open]").length > 0) {
      return;
    }
    __privateSet(this, _isVisible2, isVisible);
    document.documentElement.style.setProperty("--header-is-visible", isVisible ? "1" : "0");
    this.classList.toggle("is-hidden", !isVisible);
  }
};
var HeaderDropdownMenu = class extends DialogElement {
  get trapStack() {
    return [];
  }
  createEnterAnimationControls() {
    const timelineSteps = [[this, { opacity: [0, 1] }, { duration: 0.2 }]];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push([this.querySelectorAll(":scope > ul > li"), { opacity: [0, 1], transform: ["translateY(0.8em)", "translateY(0)"] }, { duration: 0.1, at: "-0.1", delay: stagger3(0.05), ease: "easeInOut" }]);
    }
    return animateSequence8(timelineSteps);
  }
  createLeaveAnimationControls() {
    return animateSequence8([
      [this, { opacity: [1, 0] }, { duration: 0.2 }]
    ]);
  }
};
var HeaderMegaMenu = class extends DialogElement {
  createEnterAnimationControls() {
    const timelineSteps = [[this, { opacity: [0, 1] }, { duration: 0.2, ease: "easeInOut" }]];
    const links = this.querySelectorAll(".mega-menu__navigation > *");
    if (links.length > 0 && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push(
        [links, { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.2, at: "-0.1", delay: stagger3(0.05), ease: "easeInOut" }],
        [this.querySelectorAll(".menu-promo"), { opacity: [0, 1] }, { duration: 0.3, at: "-0.1", ease: "easeInOut" }]
      );
    }
    return animateSequence8(timelineSteps);
  }
  createLeaveAnimationControls() {
    return animateSequence8([
      [this, { opacity: [1, 0] }, { duration: 0.2 }]
    ]);
  }
};
var _delegate7, _isTransitioningPanel, _HeaderMenuDrawer_instances, onBeforeShow_fn, onAfterHide_fn2, onSwitchToPanel_fn, calculateOffsets_fn;
var HeaderMenuDrawer = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _HeaderMenuDrawer_instances);
    __privateAdd(this, _delegate7, new Delegate9(this));
    __privateAdd(this, _isTransitioningPanel, false);
    this.addEventListener("dialog:before-show", __privateMethod(this, _HeaderMenuDrawer_instances, onBeforeShow_fn).bind(this));
    this.addEventListener("dialog:after-hide", __privateMethod(this, _HeaderMenuDrawer_instances, onAfterHide_fn2).bind(this));
    __privateGet(this, _delegate7).on("click", "[data-panel-toggle]", (event, target) => __privateMethod(this, _HeaderMenuDrawer_instances, onSwitchToPanel_fn).call(this, target.getAttribute("aria-controls")));
    if (window.onscrollend !== void 0) {
      window.addEventListener("scrollend", __privateMethod(this, _HeaderMenuDrawer_instances, calculateOffsets_fn).bind(this));
    } else {
      window.addEventListener("scroll", __privateMethod(this, _HeaderMenuDrawer_instances, calculateOffsets_fn).bind(this));
    }
  }
  get shouldLock() {
    return true;
  }
  createEnterAnimationControls() {
    const timelineSteps = [
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.2 }]
    ];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { transform: ["translateX(calc(var(--transform-logical-flip) * -100%))", "translateX(0)"] }, { duration: 0.35, at: "<", ease: [0.2, 0.4, 0.2, 1] }]
      );
    } else {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { opacity: [0, 1] }, { duration: 0.2, at: "<" }]
      );
    }
    return animateSequence8(timelineSteps);
  }
  createLeaveAnimationControls() {
    const timelineSteps = [
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.25 }]
    ];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push(
        [this.shadowRoot.querySelector("slot").assignedElements(), { opacity: [1, 0] }, { duration: 0.15, ease: "easeInOut", at: "<" }],
        [this.getShadowPartByName("content"), { transform: ["translateX(0)", "translateX(calc(var(--transform-logical-flip) * -100%))"] }, { duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }]
      );
    } else {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { opacity: [1, 0] }, { duration: 0.2, at: "<" }]
      );
    }
    return animateSequence8(timelineSteps);
  }
};
_delegate7 = new WeakMap();
_isTransitioningPanel = new WeakMap();
_HeaderMenuDrawer_instances = new WeakSet();
/**
 * Before the drawer is open, we calculate the offsets and show the main panel
 */
onBeforeShow_fn = function() {
  __privateMethod(this, _HeaderMenuDrawer_instances, calculateOffsets_fn).call(this);
  this.querySelector(`#menu-drawer-panel-main`)?.show({ initial: true });
};
/**
 * After the drawer is fully closed, we hide all existing panels
 */
onAfterHide_fn2 = function() {
  this.querySelectorAll("header-menu-drawer-panel").forEach((panel) => panel.hide({ instant: true }));
};
onSwitchToPanel_fn = async function(panelId) {
  if (__privateGet(this, _isTransitioningPanel)) {
    return;
  }
  const fromPanel = this.querySelector(`header-menu-drawer-panel.is-visible`);
  const toPanel = this.querySelector(`header-menu-drawer-panel#${panelId}`);
  __privateSet(this, _isTransitioningPanel, true);
  const hidePromise = fromPanel.hide();
  const showPromise = toPanel.show({ initial: false });
  Promise.all([hidePromise, showPromise]).then(() => {
    __privateSet(this, _isTransitioningPanel, false);
  });
};
calculateOffsets_fn = function() {
  if (!this.open) {
    return;
  }
  const boundingRect = this.getShadowPartByName("content").getBoundingClientRect();
  this.style.setProperty("--menu-offset-top", `${boundingRect.top}px`);
};
var HeaderMenuDrawerPanel = class extends HTMLElement {
  async show({ initial = true } = {}) {
    this.classList.add("is-visible");
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      const rtlFlip = document.dir === "rtl" ? -1 : 1;
      if (initial) {
        return animateSequence8([
          [this.querySelectorAll(".menu-drawer__panel-body > *"), { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.2, delay: stagger3(0.1, { startDelay: 0.4 }) }],
          [this.querySelector(".menu-drawer__panel-footer"), { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.2, at: "-0.1", ease: "easeInOut" }]
        ]);
      } else {
        if (this.hasAttribute("data-main-panel")) {
          return animateSequence8([
            [this, { background: ["rgb(0 0 0 / 0.15)", "rgb(0 0 0 / 0)"], transform: [`translateX(${-30 * rtlFlip}%)`, "translateX(0)"] }, { duration: 0.25, ease: "easeInOut" }]
          ]);
        } else {
          return animateSequence8([
            [this, { transform: [`translateX(${rtlFlip * 100}%)`, "translateX(0)"] }, { duration: 0.4, ease: [0.645, 0.045, 0.355, 1] }]
          ]);
        }
      }
    } else {
      return animateSequence8([
        [this, { opacity: [0, 1] }, { duration: 0.2 }]
      ]);
    }
  }
  async hide({ instant = false } = {}) {
    let promise = Promise.resolve();
    if (!instant) {
      if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        const rtlFlip = document.dir === "rtl" ? -1 : 1;
        if (this.hasAttribute("data-main-panel")) {
          promise = animateSequence8([
            [this, { background: ["rgb(0 0 0 / 0)", "rgb(0 0 0 / 0.15)"], transform: ["translateX(0)", `translateX(${-30 * rtlFlip}%)`] }, { duration: 0.4, ease: [0.645, 0.045, 0.355, 1] }]
          ]);
        } else {
          promise = animateSequence8([
            [this, { transform: ["translateX(0%)", `translateX(${100 * rtlFlip}%)`] }, { duration: 0.25, ease: "easeInOut" }]
          ]);
        }
      } else {
        promise = animateSequence8([
          [this, { opacity: [1, 0] }, { duration: 0.2 }]
        ]);
      }
    }
    return promise.then(() => {
      frame.render(() => {
        this.style = "";
        this.classList.remove("is-visible");
      });
    });
  }
};
var _delegate8, _HeaderMenuDropdownSidebar_instances, onBeforeShow_fn2, onAfterHide_fn3, onFirstLevelClicked_fn, selectSidebarPosition_fn, calculateOffsets_fn2;
var HeaderMenuDropdownSidebar = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _HeaderMenuDropdownSidebar_instances);
    __privateAdd(this, _delegate8, new Delegate9(this));
    __privateGet(this, _delegate8).on("click", '[aria-current="false"][data-link-position]', __privateMethod(this, _HeaderMenuDropdownSidebar_instances, onFirstLevelClicked_fn).bind(this));
    this.addEventListener("dialog:before-show", __privateMethod(this, _HeaderMenuDropdownSidebar_instances, onBeforeShow_fn2).bind(this));
    this.addEventListener("dialog:after-hide", __privateMethod(this, _HeaderMenuDropdownSidebar_instances, onAfterHide_fn3).bind(this));
    if (window.onscrollend !== void 0) {
      window.addEventListener("scrollend", __privateMethod(this, _HeaderMenuDropdownSidebar_instances, calculateOffsets_fn2).bind(this));
    } else {
      window.addEventListener("scroll", __privateMethod(this, _HeaderMenuDropdownSidebar_instances, calculateOffsets_fn2).bind(this));
    }
  }
  get shouldLock() {
    return true;
  }
  createEnterAnimationControls() {
    const timelineSteps = [
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.2 }]
    ];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { transform: ["translateX(calc(var(--transform-logical-flip) * -100%))", "translateX(0)"] }, { duration: 0.35, at: "<", ease: [0.2, 0.4, 0.2, 1] }],
        [this.querySelectorAll(".menu-drawer__panel-body"), { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.2, delay: stagger3(0.1) }],
        [this.querySelector(".menu-drawer__panel-footer"), { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.2, at: "-0.1", ease: "easeInOut" }]
      );
    } else {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { opacity: [0, 1] }, { duration: 0.2, at: "<" }]
      );
    }
    return animateSequence8(timelineSteps);
  }
  createLeaveAnimationControls() {
    const timelineSteps = [
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.25 }]
    ];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      timelineSteps.push(
        [this.querySelectorAll(".menu-drawer__panel-body, .menu-drawer__panel-footer"), { opacity: [1, 0] }, { duration: 0.15, ease: "easeInOut", at: "<" }],
        [this.getShadowPartByName("content"), { transform: ["translateX(0)", "translateX(calc(var(--transform-logical-flip) * -100%))"] }, { duration: 0.25, at: "<", ease: [0.645, 0.045, 0.355, 1] }]
      );
    } else {
      timelineSteps.push(
        [this.getShadowPartByName("content"), { opacity: [1, 0] }, { duration: 0.2, at: "<" }]
      );
    }
    return animateSequence8(timelineSteps);
  }
};
_delegate8 = new WeakMap();
_HeaderMenuDropdownSidebar_instances = new WeakSet();
/**
 * Before the drawer is open, we calculate the offsets and show the main panel
 */
onBeforeShow_fn2 = function(event) {
  __privateMethod(this, _HeaderMenuDropdownSidebar_instances, calculateOffsets_fn2).call(this);
  __privateMethod(this, _HeaderMenuDropdownSidebar_instances, selectSidebarPosition_fn).call(this, event.detail?.activator?.getAttribute("data-link-position"));
};
/**
 * When the drawer is fully closed, we hide all existing sidebar levels
 */
onAfterHide_fn3 = function() {
  this.querySelectorAll(".menu-drawer__dropdown-sidebar-level").forEach((level) => level.classList.remove("is-visible"));
  this.querySelectorAll("[aria-current][data-link-position]").forEach((activator) => activator.setAttribute("aria-current", "false"));
};
/**
 * When the drawer is opened and that we clicked on a different link, we change the position
 */
onFirstLevelClicked_fn = function(event, target) {
  __privateMethod(this, _HeaderMenuDropdownSidebar_instances, selectSidebarPosition_fn).call(this, target.getAttribute("data-link-position"));
};
selectSidebarPosition_fn = async function(position) {
  const sidebarLevels = Array.from(this.querySelectorAll(".menu-drawer__dropdown-sidebar-level[data-level-position]"));
  const selectedSidebarLevel = sidebarLevels.find((level) => level.classList.contains("is-visible"));
  const activators = Array.from(this.querySelectorAll(`[aria-current][data-link-position]`));
  activators.forEach((activator) => activator.setAttribute("aria-current", "false"));
  (activators.find((activator) => activator.getAttribute("data-link-position") === position) ?? activators[0]).setAttribute("aria-current", "true");
  if (selectedSidebarLevel && position) {
    const transitionTo = sidebarLevels.find((level) => level.getAttribute("data-level-position") === position);
    transitionTo.classList.add("is-visible");
    const toHeight = transitionTo.clientHeight;
    transitionTo.classList.remove("is-visible");
    await animate15(selectedSidebarLevel, { opacity: [1, 0], height: [`${selectedSidebarLevel.clientHeight}px`, `${toHeight}px`] }, { duration: 0.15, ease: "easeInOut" });
    selectedSidebarLevel.style.cssText = "";
    selectedSidebarLevel.classList.remove("is-visible");
    transitionTo.classList.add("is-visible");
    animate15(transitionTo, { opacity: [0, 1] }, { duration: 0.15, ease: "easeInOut" });
  } else {
    sidebarLevels.forEach((level) => level.classList.remove("is-visible"));
    (sidebarLevels.find((level) => level.getAttribute("data-level-position") === position) ?? sidebarLevels[0]).classList.add("is-visible");
  }
};
calculateOffsets_fn2 = function() {
  if (!this.open) {
    return;
  }
  const boundingRect = this.getShadowPartByName("content").getBoundingClientRect();
  this.style.setProperty("--menu-offset-top", `${boundingRect.top}px`);
};
if (!window.customElements.get("x-header")) {
  window.customElements.define("x-header", Header);
}
if (!window.customElements.get("header-dropdown-menu")) {
  window.customElements.define("header-dropdown-menu", HeaderDropdownMenu);
}
if (!window.customElements.get("header-mega-menu")) {
  window.customElements.define("header-mega-menu", HeaderMegaMenu);
}
if (!window.customElements.get("header-menu-drawer")) {
  window.customElements.define("header-menu-drawer", HeaderMenuDrawer);
}
if (!window.customElements.get("header-menu-drawer-panel")) {
  window.customElements.define("header-menu-drawer-panel", HeaderMenuDrawerPanel);
}
if (!window.customElements.get("header-menu-dropdown-sidebar")) {
  window.customElements.define("header-menu-dropdown-sidebar", HeaderMenuDropdownSidebar);
}

// js/sections/featured-links.js
import { animate as animate16, spring, frame as frame2 } from "vendor";
var _FeaturedLinks_instances, onItemChange_fn;
var FeaturedLinks = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _FeaturedLinks_instances);
  }
  connectedCallback() {
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => __privateMethod(this, _FeaturedLinks_instances, onItemChange_fn).call(this, event.target, !event.detail.load));
    }
    Array.from(this.querySelectorAll(".big-link")).forEach(
      (item) => item.addEventListener("mouseenter", __privateMethod(this, _FeaturedLinks_instances, onItemChange_fn).bind(this, item))
    );
  }
};
_FeaturedLinks_instances = new WeakSet();
onItemChange_fn = function(item, transition = true) {
  const toImage = this.querySelector(`.featured-links__cursor-image[data-block-id="${item.getAttribute("data-block-id")}"]`);
  if (toImage) {
    animate16(this.querySelectorAll(`.featured-links__cursor-image:not([data-block-id="${item.getAttribute("data-block-id")}"])`), { opacity: 0 }, { duration: transition ? 0.15 : 0, ease: "easeInOut" });
    animate16(toImage, { opacity: 1 }, { duration: transition ? 0.15 : 0, delay: 0.15, ease: "easeInOut" });
  }
};
var FeaturedLinksImageCursor = class extends CustomCursor {
  applyTransform({ mouseX, mouseY, containerBoundingRect }) {
    const minRotation = -8;
    const maxRotation = 8;
    const minTranslateOffset = -20;
    const maxTranslateOffset = 20;
    const rotation = (maxRotation - minRotation) * (mouseX / containerBoundingRect.width) + minRotation;
    const translateOffset = (maxTranslateOffset - minTranslateOffset) * (mouseY / containerBoundingRect.height) + minTranslateOffset;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      this.animate({
        translate: [`${mouseX.toFixed(3)}px ${(mouseY - 350 * (translateOffset / 100)).toFixed(3)}px`],
        rotate: [`${rotation}deg`]
      }, { duration: 0.1, fill: "both" });
    } else {
      frame2.postRender(() => {
        animate16(this, {
          transform: [null, `translate(${mouseX.toFixed(3)}px, ${(mouseY - 350 * (translateOffset / 100)).toFixed(3)}px) rotate(${rotation}deg)`]
        }, {
          duration: 0,
          type: spring,
          stiffness: 150,
          damping: 15
        });
      });
    }
  }
};
if (!window.customElements.get("featured-links")) {
  window.customElements.define("featured-links", FeaturedLinks);
}
if (!window.customElements.get("featured-links-image-cursor")) {
  window.customElements.define("featured-links-image-cursor", FeaturedLinksImageCursor);
}

// js/sections/links-with-image.js
import { animate as animate17, animateSequence as animateSequence9 } from "vendor";
var _LinksWithImage_instances, onItemChange_fn2;
var LinksWithImage = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _LinksWithImage_instances);
  }
  connectedCallback() {
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => __privateMethod(this, _LinksWithImage_instances, onItemChange_fn2).call(this, event.target, !event.detail.load));
    }
    this.querySelectorAll(".big-link").forEach(
      (item) => item.addEventListener("mouseenter", __privateMethod(this, _LinksWithImage_instances, onItemChange_fn2).bind(this, item))
    );
  }
};
_LinksWithImage_instances = new WeakSet();
onItemChange_fn2 = function(item, transition = true) {
  const toImage = this.querySelector(`[data-image-block-id="${item.getAttribute("data-block-id")}"]`);
  if (toImage) {
    animate17(this.querySelectorAll(`[data-image-block-id]:not([data-image-block-id="${item.getAttribute("data-block-id")}"])`), { opacity: 0 }, { duration: transition ? 0.15 : 0, ease: "easeInOut" });
    animate17(toImage, { opacity: 1 }, { duration: transition ? 0.15 : 0, ease: "easeInOut" });
  }
};
var LinksWithImageCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    const toImage = this.parentElement.querySelector(`[data-image-block-id="${toSlide.getAttribute("data-block-id")}"]`);
    if (toImage) {
      animate17(this.parentElement.querySelectorAll(`[data-image-block-id]:not([data-image-block-id="${toSlide.getAttribute("data-block-id")}"])`), { opacity: 0, visibility: "hidden" }, { duration: 0.25, delay: 0.1, ease: "easeInOut" });
      animate17(toImage, { opacity: 1, visibility: "visible" }, { duration: 0.25, delay: 0.1, ease: "easeInOut" });
    }
    return animateSequence9([
      [fromSlide, { opacity: 0, transform: [null, "translateY(-10px)"] }, { duration: 0.35, ease: [0.55, 0.055, 0.675, 0.19] }],
      [toSlide, { opacity: 1, transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.35, at: "+0.2", ease: [0.25, 0.46, 0.45, 0.94] }]
    ]);
  }
};
var LinksWithImageMobileImageList = class extends HTMLElement {
  connectedCallback() {
    new GestureArea(this, { thresholdDistance: 80 });
    this.addEventListener("swipeleft", () => this.nextElementSibling.next());
    this.addEventListener("swiperight", () => this.nextElementSibling.previous());
  }
};
if (!window.customElements.get("links-with-image")) {
  window.customElements.define("links-with-image", LinksWithImage);
}
if (!window.customElements.get("links-with-image-carousel")) {
  window.customElements.define("links-with-image-carousel", LinksWithImageCarousel);
}
if (!window.customElements.get("links-with-image-mobile-image-list")) {
  window.customElements.define("links-with-image-mobile-image-list", LinksWithImageMobileImageList);
}

// js/sections/logo-list.js
import { animate as animate18, stagger as stagger4, inView as inView13 } from "vendor";
var _LogoList_instances, reveal_fn;
var LogoList = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LogoList_instances);
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      inView13(this, __privateMethod(this, _LogoList_instances, reveal_fn).bind(this));
    }
  }
};
_LogoList_instances = new WeakSet();
reveal_fn = function() {
  animate18(
    this.querySelectorAll('[reveal-on-scroll="true"]'),
    { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
    { duration: 1, delay: stagger4(0.05, { ease: "easeOut" }), ease: [0.22, 1, 0.36, 1] }
  );
};
if (!window.customElements.get("logo-list")) {
  window.customElements.define("logo-list", LogoList);
}

// js/sections/main-search.js
var SearchResultPanel = class extends HTMLElement {
  async connectedCallback() {
    if (!this.hasAttribute("load-from-url")) {
      return;
    }
    const textResponse = await (await fetch(encodeURI(`${this.getAttribute("load-from-url")}&section_id=${extractSectionId(this)}`))).text();
    const temporaryContent = new DOMParser().parseFromString(textResponse, "text/html");
    const searchResultsPanel = temporaryContent.querySelector(`#${this.getAttribute("id")}`);
    if (searchResultsPanel) {
      this.replaceChildren(...searchResultsPanel.children);
    } else {
      document.querySelector(`[aria-controls="${this.id}"]`).remove();
      this.remove();
    }
  }
};
if (!window.customElements.get("search-result-panel")) {
  window.customElements.define("search-result-panel", SearchResultPanel);
}

// js/sections/multi-column.js
var MultiColumn = class extends HTMLElement {
  constructor() {
    super();
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => {
        event.target.scrollIntoView({ inline: "center", block: "nearest", behavior: event.detail["load"] ? "auto" : "smooth" });
      });
    }
  }
};
if (!window.customElements.get("multi-column")) {
  window.customElements.define("multi-column", MultiColumn);
}

// js/sections/news-modal.js
import { animate as animate19, animateSequence as animateSequence10 } from "vendor";
var _NewsModal_instances, onBeforeShow_fn3, onAfterHide_fn4, checkUnread_fn;
var NewsModal = class extends Modal {
  constructor() {
    super();
    __privateAdd(this, _NewsModal_instances);
    this.addEventListener("dialog:before-show", __privateMethod(this, _NewsModal_instances, onBeforeShow_fn3));
    this.addEventListener("dialog:after-hide", __privateMethod(this, _NewsModal_instances, onAfterHide_fn4));
    this.addEventListener("news-modal-panel:check-unread", __privateMethod(this, _NewsModal_instances, checkUnread_fn));
  }
  async connectedCallback() {
    super.connectedCallback();
    await customElements.whenDefined("news-modal-button");
    __privateMethod(this, _NewsModal_instances, checkUnread_fn).call(this);
  }
  createEnterAnimationControls() {
    return animate19(this.getShadowPartByName("content"), { opacity: [0, 1], transform: ["translateY(-40px)", "translateY(0)"] }, { duration: 0.15, ease: [0.86, 0, 0.07, 1] });
  }
  createLeaveAnimationControls() {
    return animate19(this.getShadowPartByName("content"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(-40px)"] }, { duration: 0.15, ease: [0.86, 0, 0.07, 1] });
  }
};
_NewsModal_instances = new WeakSet();
onBeforeShow_fn3 = function() {
  const newsModalButton = document.querySelector(`.header [aria-controls="${this.id}"]`);
  const header = newsModalButton?.closest(".shopify-section");
  this.style.setProperty("--modal-news-margin-block-start", header?.getBoundingClientRect().top + header.offsetHeight + "px");
  if (matchesMediaQuery("sm")) {
    this.style.setProperty("--modal-news-margin-inline-end", document.dir === "ltr" ? window.innerWidth - (newsModalButton?.getBoundingClientRect().left + newsModalButton?.clientWidth) + "px" : newsModalButton?.getBoundingClientRect().left + "px");
  }
  if (matchesMediaQuery("sm-max")) {
    this.dispatchEvent(new CustomEvent("header:disable-transparent-header", { bubbles: true }));
  }
};
onAfterHide_fn4 = function() {
  if (matchesMediaQuery("sm-max")) {
    this.dispatchEvent(new CustomEvent("header:allow-transparent-header", { bubbles: true }));
  }
  Array.from(this.querySelectorAll(".news-modal-panel")).forEach((item) => {
    item.removeAttribute("open");
  });
};
checkUnread_fn = function() {
  this.dispatchEvent(new CustomEvent("news-modal:update-status", {
    detail: {
      hasUnread: Array.from(this.querySelectorAll(".news-modal-panel")).some((panel) => !panel.isRead)
    },
    bubbles: true
  }));
};
var _NewsPanelToggleButton_instances, onClick_fn2;
var NewsPanelToggleButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _NewsPanelToggleButton_instances);
    this.addEventListener("click", __privateMethod(this, _NewsPanelToggleButton_instances, onClick_fn2));
  }
  async connectedCallback() {
    await customElements.whenDefined("news-modal-panel");
    this.querySelector("button").classList.toggle("visited", this.controlledPanel.isRead);
  }
  get controlledPanel() {
    return document.getElementById(this.querySelector("button").getAttribute("aria-controls"));
  }
};
_NewsPanelToggleButton_instances = new WeakSet();
onClick_fn2 = function() {
  this.controlledPanel.isOpen = !this.controlledPanel.isOpen;
  this.querySelector("button").classList.toggle("visited", this.controlledPanel.isRead);
  this.dispatchEvent(new CustomEvent("news-modal-panel:check-unread", { bubbles: true }));
};
var _initialHeight, _newsModalContent, _NewsModalPanel_instances, markAsRead_fn, show_fn, hide_fn;
var NewsModalPanel = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _NewsModalPanel_instances);
    __privateAdd(this, _initialHeight);
    __privateAdd(this, _newsModalContent, this.closest(".modal--news").shadowRoot.querySelector('[part="content"]'));
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => __privateMethod(this, _NewsModalPanel_instances, show_fn).call(this, { animatePanel: !event.detail.load }));
      this.addEventListener("shopify:block:deselect", __privateMethod(this, _NewsModalPanel_instances, hide_fn));
    }
  }
  static get observedAttributes() {
    return ["open"];
  }
  get controls() {
    return Array.from(this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`));
  }
  get isRead() {
    return JSON.parse(localStorage.getItem("news-id-list") || "[]").includes(this.id);
  }
  get isOpen() {
    return this.hasAttribute("open");
  }
  set isOpen(value) {
    this.toggleAttribute("open", value);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        this.controls.forEach((activator) => activator.setAttribute("aria-expanded", this.isRead.toString()));
        if (oldValue === null && newValue === "") {
          __privateMethod(this, _NewsModalPanel_instances, show_fn).call(this);
        } else {
          __privateMethod(this, _NewsModalPanel_instances, hide_fn).call(this);
        }
        __privateMethod(this, _NewsModalPanel_instances, markAsRead_fn).call(this);
        break;
    }
  }
};
_initialHeight = new WeakMap();
_newsModalContent = new WeakMap();
_NewsModalPanel_instances = new WeakSet();
markAsRead_fn = function() {
  let newsRead = JSON.parse(localStorage.getItem("news-id-list") || "[]");
  if (!this.isRead) {
    newsRead.push(this.id);
    localStorage.setItem("news-id-list", JSON.stringify(newsRead));
  }
};
show_fn = function({ animatePanel = true } = {}) {
  __privateSet(this, _initialHeight, __privateGet(this, _newsModalContent)?.offsetHeight);
  const animation = animateSequence10([
    [this, { transform: ["translateY(-10px", "translateY(0)"], opacity: [0, 1], visibility: ["hidden", "visible"] }, { duration: 0.3, ease: [0.86, 0, 0.07, 1] }],
    [__privateGet(this, _newsModalContent), { height: [__privateGet(this, _initialHeight) + "px", Math.max(__privateGet(this, _initialHeight), this.scrollHeight / 1.3) + "px"] }, { duration: 0.3, ease: [0.86, 0, 0.07, 1], at: "<" }]
  ]);
  if (!animatePanel) {
    animation.complete();
  }
};
hide_fn = function() {
  const animation = animateSequence10([
    [this, { transform: ["translateY(0", "translateY(-10px)"], opacity: [1, 0], visibility: ["visible", "hidden"] }, { duration: 0.3, ease: [0.86, 0, 0.07, 1] }],
    [__privateGet(this, _newsModalContent), { height: [Math.max(__privateGet(this, _initialHeight), this.scrollHeight / 1.3) + "px", __privateGet(this, _initialHeight) + "px"] }, { duration: 0.3, ease: [0.86, 0, 0.07, 1], at: "<" }]
  ]);
};
var _onUpdatedListener, _NewsModalButton_instances, onModalUpdated_fn;
var NewsModalButton = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _NewsModalButton_instances);
    __privateAdd(this, _onUpdatedListener, __privateMethod(this, _NewsModalButton_instances, onModalUpdated_fn).bind(this));
  }
  connectedCallback() {
    document.documentElement.addEventListener("news-modal:update-status", __privateGet(this, _onUpdatedListener));
  }
  disconnectedCallback() {
    document.documentElement.removeEventListener("news-modal:update-status", __privateGet(this, _onUpdatedListener));
  }
};
_onUpdatedListener = new WeakMap();
_NewsModalButton_instances = new WeakSet();
onModalUpdated_fn = function(event) {
  this.querySelector("button").classList.toggle("active", event.detail.hasUnread);
};
if (!window.customElements.get("news-modal")) {
  window.customElements.define("news-modal", NewsModal);
}
if (!window.customElements.get("news-panel-toggle-button")) {
  window.customElements.define("news-panel-toggle-button", NewsPanelToggleButton);
}
if (!window.customElements.get("news-modal-panel")) {
  window.customElements.define("news-modal-panel", NewsModalPanel);
}
if (!window.customElements.get("news-modal-button")) {
  window.customElements.define("news-modal-button", NewsModalButton);
}

// js/sections/newsletter-popup.js
var NewsletterPopup = class extends Modal {
  connectedCallback() {
    super.connectedCallback();
    if (this.shouldAppearAutomatically) {
      setTimeout(() => this.show(), this.apparitionDelay);
    }
  }
  get apparitionDelay() {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3;
  }
  get shouldAppendToBody() {
    return false;
  }
  get shouldAppearAutomatically() {
    return !(localStorage.getItem("theme:popup-filled") === "true" || this.hasAttribute("only-once") && localStorage.getItem("theme:popup-appeared") === "true");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "open" && this.open) {
      localStorage.setItem("theme:popup-appeared", "true");
    }
  }
};
if (!window.customElements.get("newsletter-popup")) {
  window.customElements.define("newsletter-popup", NewsletterPopup);
}

// js/sections/press.js
import { animate as animate20, animateSequence as animateSequence11 } from "vendor";
var PressCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    if (toSlide.hasAttribute("reveal-on-scroll") && toSlide.getAttribute("reveal-on-scroll") === "true") {
      return animate20(toSlide, { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] });
    }
    return super.createOnBecameVisibleAnimationControls(toSlide);
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return animateSequence11([
      [fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-1em)"] }, { duration: 0.5, ease: [0.55, 0.055, 0.675, 0.19] }],
      [toSlide, { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.5, at: "+0.2", ease: [0.25, 0.46, 0.45, 0.94] }]
    ]);
  }
};
if (!window.customElements.get("press-carousel")) {
  window.customElements.define("press-carousel", PressCarousel);
}

// js/sections/product-recommendations.js
var _isLoaded, _ProductRecommendations_instances, loadRecommendations_fn;
var ProductRecommendations = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductRecommendations_instances);
    __privateAdd(this, _isLoaded, false);
  }
  connectedCallback() {
    __privateMethod(this, _ProductRecommendations_instances, loadRecommendations_fn).call(this);
  }
};
_isLoaded = new WeakMap();
_ProductRecommendations_instances = new WeakSet();
loadRecommendations_fn = async function() {
  if (__privateGet(this, _isLoaded)) {
    return;
  }
  __privateSet(this, _isLoaded, true);
  const intent = this.getAttribute("intent") || "related", url = `${Shopify.routes.root}recommendations/products?product_id=${this.getAttribute("product")}&limit=${this.getAttribute("limit") || 4}&section_id=${extractSectionId(this)}&intent=${intent}`, response = await fetch(url, { priority: intent === "related" ? "low" : "auto" });
  const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), productRecommendationsElement = tempDiv.querySelector("product-recommendations");
  if (productRecommendationsElement.childElementCount > 0) {
    this.replaceChildren(...document.importNode(productRecommendationsElement, true).childNodes);
    this.hidden = false;
  } else {
    this.remove();
  }
};
if (!window.customElements.get("product-recommendations")) {
  window.customElements.define("product-recommendations", ProductRecommendations);
}

// js/sections/reading-text.js
import { animate as animate21, animateSequence as animateSequence12, scroll as scroll2, stagger as stagger5, inView as inView14 } from "vendor";
var _resizeObserver4, _enterEffectDone, _ReadingText_instances, textStartOpacity_get, lines_get, chars_get, animatableElements_get, setupEffect_fn, showEnterEffect_fn, showLeaveEffect_fn, startLettersAnimation_fn, calculateScrollingHeight_fn;
var ReadingText = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ReadingText_instances);
    __privateAdd(this, _resizeObserver4, new ResizeObserver(__privateMethod(this, _ReadingText_instances, calculateScrollingHeight_fn).bind(this)));
    __privateAdd(this, _enterEffectDone, false);
  }
  connectedCallback() {
    inView14(this, __privateMethod(this, _ReadingText_instances, setupEffect_fn).bind(this), { margin: "50% 0% 50% 0%" });
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      inView14(this, __privateMethod(this, _ReadingText_instances, showEnterEffect_fn).bind(this), { margin: "-50% 0% -50% 0%" });
    }
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver4)?.disconnect();
  }
};
_resizeObserver4 = new WeakMap();
_enterEffectDone = new WeakMap();
_ReadingText_instances = new WeakSet();
textStartOpacity_get = function() {
  return parseFloat(this.getAttribute("text-start-opacity"));
};
lines_get = function() {
  return this.querySelector("split-lines")?.lines;
};
chars_get = function() {
  return __privateGet(this, _ReadingText_instances, lines_get)?.flatMap((line) => Array.from(line.children));
};
animatableElements_get = function() {
  return [this.querySelector(".subheading"), ...__privateGet(this, _ReadingText_instances, lines_get)].filter((item) => item !== null);
};
setupEffect_fn = function() {
  __privateGet(this, _resizeObserver4).observe(this);
};
// Create the effect performed when the section becomes visible in the viewport
showEnterEffect_fn = function() {
  if (!__privateGet(this, _enterEffectDone)) {
    this.querySelector("[reveal-on-scroll]")?.removeAttribute("reveal-on-scroll");
    __privateSet(this, _enterEffectDone, true);
    const timelineSteps = [
      [
        __privateGet(this, _ReadingText_instances, animatableElements_get),
        { opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] },
        { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: stagger5(0.08) }
      ]
    ];
    if (this.querySelector(".button")) {
      timelineSteps.push([
        this.querySelector(".button"),
        { opacity: [0, __privateGet(this, _ReadingText_instances, textStartOpacity_get)], transform: ["translateY(1em)", "translateY(0)"] },
        { duration: 0.6, at: 0.6, ease: [0.22, 1, 0.36, 1] }
      ]);
    }
    animateSequence12(timelineSteps);
  }
  return __privateMethod(this, _ReadingText_instances, showLeaveEffect_fn).bind(this);
};
// Create an effect when the section is left from the top
showLeaveEffect_fn = function(leaveInfo) {
  if (leaveInfo.boundingClientRect.top < 0) {
    return;
  }
  animateSequence12([
    [
      [...__privateGet(this, _ReadingText_instances, animatableElements_get), this.querySelector(".button")].filter((item) => item !== null),
      { opacity: [null, 0], transform: ["translateY(0)", "translateY(0.2em)"] },
      { duration: 0.2 }
    ]
  ]);
  __privateSet(this, _enterEffectDone, false);
};
// Setup the different timelines to perform the reveal animation on letters on scroll
startLettersAnimation_fn = function() {
  const lettersToSimultaenouslyReveal = 15;
  const step = 100 / (__privateGet(this, _ReadingText_instances, chars_get).length + lettersToSimultaenouslyReveal);
  if (window.ViewTimeline) {
    const timeline = new ViewTimeline({
      subject: this,
      axis: "block",
      inset: `${getComputedStyle(this).getPropertyValue("--sticky-area-height")} 0px`
    });
    [...__privateGet(this, _ReadingText_instances, chars_get), this.querySelector(".button")].forEach((item, index) => {
      item?.getAnimations().forEach((animation) => animation.cancel());
      item?.animate({
        opacity: [__privateGet(this, _ReadingText_instances, textStartOpacity_get), 1]
      }, {
        fill: "both",
        timeline,
        rangeStart: `contain ${index * step}%`,
        rangeEnd: `contain ${(index + (lettersToSimultaenouslyReveal + 1)) * step}%`
      });
    });
  } else {
    [...__privateGet(this, _ReadingText_instances, chars_get), this.querySelector(".button")].forEach((item, index) => {
      scroll2(
        animate21(item, { opacity: [__privateGet(this, _ReadingText_instances, textStartOpacity_get), 1] }),
        {
          target: this,
          offset: [`${index * step}% ${(index + (lettersToSimultaenouslyReveal + 1)) * step}%`, `${(index + (lettersToSimultaenouslyReveal + 1)) * step}% ${index * step}%`]
        }
      );
    });
  }
};
// Calculate the section height based on the number of letters
calculateScrollingHeight_fn = function() {
  this.style.setProperty(
    "--reading-text-scroll-height",
    `${parseFloat(this.getAttribute("reading-speed")) * __privateGet(this, _ReadingText_instances, chars_get).length}vh`
  );
  __privateMethod(this, _ReadingText_instances, startLettersAnimation_fn).call(this);
};
if (!window.customElements.get("reading-text")) {
  window.customElements.define("reading-text", ReadingText);
}

// js/sections/recently-viewed-products.js
var _isLoaded2, _RecentlyViewedProducts_instances, searchQueryString_get, loadProducts_fn;
var RecentlyViewedProducts = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _RecentlyViewedProducts_instances);
    __privateAdd(this, _isLoaded2, false);
  }
  connectedCallback() {
    __privateMethod(this, _RecentlyViewedProducts_instances, loadProducts_fn).call(this);
  }
};
_isLoaded2 = new WeakMap();
_RecentlyViewedProducts_instances = new WeakSet();
searchQueryString_get = function() {
  const items = new Set(JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]"));
  if (this.hasAttribute("exclude-id")) {
    items.delete(parseInt(this.getAttribute("exclude-id")));
  }
  return Array.from(items.values(), (item) => `id:${item}`).slice(0, parseInt(this.getAttribute("products-count"))).join(" OR ");
};
loadProducts_fn = async function() {
  if (__privateGet(this, _isLoaded2)) {
    return;
  }
  __privateSet(this, _isLoaded2, true);
  const section = this.closest(".shopify-section"), url = `${Shopify.routes.root}search?type=product&q=${__privateGet(this, _RecentlyViewedProducts_instances, searchQueryString_get)}&section_id=${extractSectionId(section)}`, response = await fetch(url, { priority: "low" });
  const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), recentlyViewedProductsElement = tempDiv.querySelector("recently-viewed-products");
  if (recentlyViewedProductsElement.childElementCount > 0) {
    this.replaceChildren(...document.importNode(recentlyViewedProductsElement, true).childNodes);
  } else {
    section.remove();
  }
};
if (!window.customElements.get("recently-viewed-products")) {
  window.customElements.define("recently-viewed-products", RecentlyViewedProducts);
}

// js/sections/slideshow.js
import { animate as animate22, animateSequence as animateSequence13 } from "vendor";
var _navigationButtonAnimationControls, _completedHighlightedHeadings, _Slideshow_instances, effect_get2, onSlideChange_fn, onPlayerStart_fn2, onPlayerStop_fn, onPlayerPause_fn, onPlayerResume_fn;
var Slideshow = class extends EffectCarousel {
  constructor() {
    super();
    __privateAdd(this, _Slideshow_instances);
    __privateAdd(this, _navigationButtonAnimationControls);
    __privateAdd(this, _completedHighlightedHeadings, []);
    this.addEventListener("carousel:change", __privateMethod(this, _Slideshow_instances, onSlideChange_fn).bind(this));
    if (this.player) {
      this.player.addEventListener("player:start", __privateMethod(this, _Slideshow_instances, onPlayerStart_fn2).bind(this));
      this.player.addEventListener("player:pause", __privateMethod(this, _Slideshow_instances, onPlayerPause_fn).bind(this));
      this.player.addEventListener("player:stop", __privateMethod(this, _Slideshow_instances, onPlayerStop_fn).bind(this));
      this.player.addEventListener("player:resume", __privateMethod(this, _Slideshow_instances, onPlayerResume_fn).bind(this));
    }
  }
  connectedCallback() {
    super.connectedCallback();
    __privateMethod(this, _Slideshow_instances, onSlideChange_fn).call(this, { detail: { cell: this.selectedCell } });
    __privateGet(this, _completedHighlightedHeadings).push(...Array.from(this.selectedCell.querySelectorAll("highlighted-heading")));
  }
  get blockChangeWhenTransitioning() {
    return __privateGet(this, _Slideshow_instances, effect_get2) !== "fade";
  }
  /**
   * If the slide is a video, we return the video duration instead of the default slide duration
   */
  async getPlayerDurationForSlide(slide) {
    if (slide.getAttribute("data-slide-type") === "video") {
      const video = Array.from(slide.querySelectorAll("video")).filter((video2) => video2.offsetParent !== null).pop();
      if (isNaN(video.duration)) {
        await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve();
        });
      }
      return video.duration;
    }
    return super.getPlayerDurationForSlide(slide);
  }
  /**
   * Reference for animations: https://tympanus.net/Development/SlideshowAnimations/index.html
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    let flip;
    let toSlideHighlightedHeadings = Array.from(toSlide.querySelectorAll("highlighted-heading"));
    toSlideHighlightedHeadings = toSlideHighlightedHeadings.filter((heading) => !__privateGet(this, _completedHighlightedHeadings).includes(heading));
    toSlideHighlightedHeadings.forEach((highlightedHeading) => highlightedHeading.hideEffect());
    let animationControls;
    switch (__privateGet(this, _Slideshow_instances, effect_get2)) {
      case "fade":
        animationControls = super.createOnChangeAnimationControls(fromSlide, toSlide, { direction });
        break;
      case "vertical_reveal":
        flip = direction === "next" ? document.dir === "rtl" ? -1 : 1 : document.dir === "rtl" ? 1 : -1;
        animationControls = animateSequence13([
          [fromSlide, { transform: ["translateY(0)", `translateY(${flip * -100}%)`] }, { duration: 0.3, ease: [0.55, 0.085, 0.68, 0.53], at: 0 }],
          [fromSlide.firstElementChild, { transform: ["translateY(0)", `translateY(${flip * 75}%)`] }, { duration: 0.3, ease: [0.55, 0.085, 0.68, 0.53], at: 0 }],
          { name: "middle", at: "+0.1" },
          [toSlide, { transform: [`translateY(${flip * 100}%)`, "translateY(0)"], opacity: [1, 1] }, { duration: 0.7, ease: [0.19, 1, 0.22, 1], at: "middle" }],
          [toSlide.firstElementChild, { transform: [`translateY(${flip * -75}%)`, "translateY(0)"] }, { duration: 0.7, ease: [0.19, 1, 0.22, 1], at: "middle" }]
        ]);
        break;
      case "curtain":
        flip = direction === "next" ? document.dir === "rtl" ? -1 : 1 : document.dir === "rtl" ? 1 : -1;
        animationControls = animateSequence13([
          [fromSlide, { transform: ["translateX(0)", `translateX(${flip * -100}%)`] }, { ease: [0.77, 0, 0.175, 1], at: 0 }],
          [fromSlide.firstElementChild, { transform: ["translateX(0)", `translateX(${flip * 30}%)`] }, { ease: [0.77, 0, 0.175, 1], at: 0 }],
          [toSlide, { transform: [`translateX(${flip * 100}%)`, "translateX(0)"] }, { ease: [0.77, 0, 0.175, 1], at: 0 }],
          [toSlide.firstElementChild, { transform: [`translateX(${flip * -30}%)`, "translateX(0)"] }, { ease: [0.77, 0, 0.175, 1], at: 0 }]
        ], {
          duration: window.innerWidth < 699 ? 0.8 : 1
        });
        break;
      case "distortion":
        flip = direction === "next" ? document.dir === "rtl" ? -1 : 1 : document.dir === "rtl" ? 1 : -1;
        if (direction === "next" || direction.dir === "rtl" && direction === "prev") {
          fromSlide.firstElementChild.style.transformOrigin = "100% 50%";
          toSlide.firstElementChild.style.transformOrigin = "0% 50%";
        } else {
          fromSlide.firstElementChild.style.transformOrigin = "0% 50%";
          toSlide.firstElementChild.style.transformOrigin = "100% 50%";
        }
        animationControls = animateSequence13([
          [fromSlide, { transform: ["translateX(0)", `translateX(${flip * -100}%)`] }, { ease: [0.645, 0.045, 0.355, 1], at: 0 }],
          [fromSlide.firstElementChild, { transform: ["scaleX(1)", "scaleX(2.5)"] }, { ease: [0.645, 0.045, 0.355, 1], at: 0 }],
          [toSlide, { transform: [`translateX(${flip * 100}%)`, "translateX(0)"] }, { ease: [0.645, 0.045, 0.355, 1], at: 0 }],
          [toSlide.firstElementChild, { transform: [`translateX(${flip * -100}%) scaleX(2.5)`, "translateX(0) scaleX(1)"] }, { ease: [0.645, 0.045, 0.355, 1], at: 0 }]
        ], {
          duration: window.innerWidth < 699 ? 0.6 : 0.8
        });
        break;
      case "perspective":
        animationControls = animateSequence13([
          [fromSlide, { transform: ["scale(1)", "scale(0.9)"], opacity: [1, 0.3] }, { duration: 0.15, ease: [0.445, 0.05, 0.55, 0.95] }],
          { name: "middle", at: "+0.1" },
          [fromSlide, { transform: ["translateY(0) scale(0.9)", `translateY(-20%) scale(0.9)`], opacity: [0.3, 0] }, { at: "middle", ease: [0.77, 0, 0.175, 1] }],
          [toSlide, { transform: [`translateY(100%) scale(1)`, `translateY(0) scale(1)`], opacity: [1, 1] }, { at: "middle", ease: [0.77, 0, 0.175, 1] }],
          [toSlide.firstElementChild, { transform: [`translateY(-50%)`, "translateY(0)"] }, { at: "middle", ease: [0.77, 0, 0.175, 1] }]
        ], {
          duration: 0.7
        });
        break;
      case "scale_down":
        flip = direction === "next" ? document.dir === "rtl" ? -1 : 1 : document.dir === "rtl" ? 1 : -1;
        animationControls = animateSequence13([
          [fromSlide, { opacity: [1, 0], transform: ["scale(1)", `scale(0.7)`] }, { duration: 0.5, ease: [0.645, 0.045, 0.355, 1], at: 0 }],
          [toSlide, { opacity: [1, 1], transform: [`translateY(${flip * 100}%)`, "translateY(0)"] }, { duration: 0.7, ease: [0.645, 0.045, 0.355, 1], at: "<" }]
        ]);
        break;
    }
    return animationControls.then(() => {
      toSlideHighlightedHeadings.forEach((highlightedHeading) => highlightedHeading.restartEffect());
      __privateGet(this, _completedHighlightedHeadings).push(...toSlideHighlightedHeadings);
    });
  }
};
_navigationButtonAnimationControls = new WeakMap();
_completedHighlightedHeadings = new WeakMap();
_Slideshow_instances = new WeakSet();
effect_get2 = function() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "fade";
  }
  return this.getAttribute("transition");
};
onSlideChange_fn = function(event) {
  this.querySelectorAll("video-media").forEach((video) => {
    customElements.upgrade(video);
    video.pause();
  });
  if (event.detail.cell.getAttribute("data-slide-type") === "video") {
    event.detail.cell.querySelectorAll("video-media").forEach((video) => video.play({ restart: true }));
  }
};
onPlayerStart_fn2 = function(event) {
  __privateGet(this, _navigationButtonAnimationControls)?.complete();
  requestAnimationFrame(() => {
    this.querySelectorAll('.scroll-marker[aria-current="false"] .scroll-marker-group__line-progress').forEach((button) => button.style.transform = null);
  });
  __privateSet(this, _navigationButtonAnimationControls, animate22(
    this.querySelectorAll('.scroll-marker[aria-current="true"] .scroll-marker-group__line-progress'),
    {
      transform: ["scaleX(0)", "scaleX(1)"]
    },
    {
      duration: event.detail.duration,
      ease: "linear"
    }
  ));
};
onPlayerStop_fn = function() {
  __privateGet(this, _navigationButtonAnimationControls)?.complete();
};
onPlayerPause_fn = function() {
  __privateGet(this, _navigationButtonAnimationControls)?.pause();
  this.selectedCell.querySelectorAll("video-media").forEach((video) => video.pause());
};
onPlayerResume_fn = function() {
  __privateGet(this, _navigationButtonAnimationControls)?.play();
  this.selectedCell.querySelectorAll("video-media").forEach((video) => video.play());
};
if (!window.customElements.get("slideshow-carousel")) {
  window.customElements.define("slideshow-carousel", Slideshow);
}

// js/sections/dynamic-grid.js
import { animate as animate23, scroll as scroll3 } from "vendor";
var _DynamicGrid_instances, setupEmulateScrollTimeline_fn;
var DynamicGrid = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _DynamicGrid_instances);
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener("shopify:section:select", () => this.classList.add("editor-is-selected"));
      this.closest(".shopify-section").addEventListener("shopify:section:deselect", () => this.classList.remove("editor-is-selected"));
      this.addEventListener("shopify:block:select", (event) => event.target.classList.add("editor-is-selected"));
      this.addEventListener("shopify:block:deselect", (event) => event.target.classList.remove("editor-is-selected"));
    }
  }
  connectedCallback() {
    if (!window.ViewTimeline) {
      __privateMethod(this, _DynamicGrid_instances, setupEmulateScrollTimeline_fn).call(this);
    }
  }
};
_DynamicGrid_instances = new WeakSet();
/**
 * On older browsers, we fallback to a more standard "scroll listener" based approach, by using MotionJS.
 */
setupEmulateScrollTimeline_fn = function() {
  Array.from(this.querySelectorAll(".dynamic-grid__cell")).forEach((element) => {
    const parallaxSpeed = parseInt(element.style.getPropertyValue("--parallax-speed"));
    if (parallaxSpeed === 0) {
      return;
    }
    const offsetAmount = `${parallaxSpeed * 10 / 2}vmin`;
    scroll3(
      animate23(element, {
        transform: element.getAttribute("data-parallax-direction") === "horizontal" ? [`translateX(calc(-1 * ${offsetAmount}))`, `translateX(${offsetAmount})`] : [`translateY(calc(-1 * ${offsetAmount}))`, `translateY(${offsetAmount})`]
      }),
      {
        offset: ["start end", "end start"],
        target: this.closest(".shopify-section")
      }
    );
  });
};
if (!window.customElements.get("dynamic-grid")) {
  window.customElements.define("dynamic-grid", DynamicGrid);
}

// js/sections/testimonials.js
import { animate as animate24, animateSequence as animateSequence14 } from "vendor";
var TestimonialsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    const toInfo = this.closest(".testimonials").querySelector(`[data-info-block-id="${toSlide.getAttribute("data-block-id")}"]`);
    const fromInfo = this.closest(".testimonials").querySelectorAll(`[data-info-block-id]:not([data-info-block-id="${toSlide.getAttribute("data-block-id")}"])`);
    if (toInfo && toInfo) {
      animate24(fromInfo, { opacity: 0, visibility: "hidden" }, { duration: 0.25, delay: 0.1, ease: "easeInOut" });
      animate24(toInfo, { opacity: [0, 1], visibility: ["hidden", "visible"] }, { duration: 0.25, delay: 0.1, ease: "easeInOut" });
    }
    return animateSequence14([
      [fromSlide, { visibility: ["visible", "hidden"], opacity: [1, 0], transform: ["translateY(0)", "translateY(-1em)"] }, { duration: 0.3, at: 0, ease: [0.55, 0.055, 0.675, 0.19] }],
      [toSlide, { visibility: ["hidden", "visible"], opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.5, at: "+0.2", ease: [0.25, 0.46, 0.45, 0.94] }]
    ]);
  }
};
if (!window.customElements.get("testimonials-carousel")) {
  window.customElements.define("testimonials-carousel", TestimonialsCarousel);
}

// js/sections/timeline.js
import { animateSequence as animateSequence15, Delegate as Delegate10 } from "vendor";
var Timeline = class extends HTMLElement {
  #delegate = new Delegate10(this);
  connectedCallback() {
    this.#delegate.on("click", '.timeline__nav button[aria-current="false"]', (event, target) => this.select({ blockId: target.dataset.blockId }));
    this.addEventListener("shopify:block:select", (event) => this.select({ blockId: event.detail.blockId, instant: event.detail.load }));
  }
  disconnectedCallback() {
    this.#delegate.off();
  }
  async select({ blockId, instant = false } = {}) {
    const fromPicture = this.querySelector(".timeline__image.is-selected");
    const toPicture = this.querySelector(`.timeline__image[data-block-id="${blockId}"]`);
    const fromContent = this.querySelector(".timeline__content.is-selected");
    const toContent = this.querySelector(`.timeline__content[data-block-id="${blockId}"]`);
    if (toPicture && fromPicture !== toPicture) {
      fromPicture.classList.remove("is-selected");
      toPicture.classList.add("is-selected");
    }
    this.querySelectorAll(".timeline__nav button").forEach((button) => {
      const isCurrent = button.dataset.blockId === blockId;
      button.setAttribute("aria-current", isCurrent ? "true" : "false");
      if (isCurrent && (button.offsetParent.scrollWidth !== button.offsetParent.clientWidth || button.offsetParent.scrollHeight !== button.offsetParent.clientHeight)) {
        button.offsetParent.scrollTo({
          left: button.offsetLeft - button.offsetParent.clientWidth / 2 + button.clientWidth / 2,
          top: button.offsetTop - button.offsetParent.clientHeight / 2 + button.clientHeight / 2,
          behavior: "smooth"
        });
      }
    });
    fromContent.classList.remove("is-selected");
    toContent.classList.add("is-selected");
    const timelineSteps = [];
    if (toPicture && fromPicture !== toPicture) {
      fromPicture.classList.remove("is-selected");
      toPicture.classList.add("is-selected");
      timelineSteps.push(
        [fromPicture, { visibility: ["visible", "hidden"], opacity: [1, 0], transform: ["scale(1)", "scale(1.05)"] }, { duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }],
        [toPicture, { visibility: ["hidden", "visible"], opacity: [0, 1], transform: ["scale(1.05)", "scale(1)"] }, { duration: 0.5, at: "<", delay: 0.2, ease: [0.4, 0, 0.2, 1] }]
      );
    }
    timelineSteps.push(
      [fromContent, { visibility: ["visible", "hidden"], opacity: [1, 0], transform: ["translateY(0)", "translateY(-1em)"] }, { duration: 0.3, at: 0, ease: [0.55, 0.055, 0.675, 0.19] }],
      [toContent, { visibility: ["hidden", "visible"], opacity: [0, 1], transform: ["translateY(1em)", "translateY(0)"] }, { duration: 0.5, at: "+0.2", ease: [0.25, 0.46, 0.45, 0.94] }]
    );
    const animationControls = animateSequence15(timelineSteps);
    if (instant) {
      animationControls.complete();
    }
    await animationControls;
  }
};
if (!window.customElements.get("time-line")) {
  window.customElements.define("time-line", Timeline);
}

/**
 * Drag-to-scroll for .collection-quick-navigation
 * – pointer-events based (works with mouse, pen, touch)
 * – prevents accidental link clicks when dragging
 * – does NOT interfere with touch swipe or trackpad scroll
 */
(function () {
  const DRAG_THRESHOLD = 5;

  document.querySelectorAll('.collection-quick-navigation').forEach((el) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;
    let pointerId = null;

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;

      isDown = true;
      hasDragged = false;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
      pointerId = e.pointerId;
      // Do NOT setPointerCapture here
    });

    el.addEventListener('pointermove', (e) => {
      if (!isDown) return;

      const delta = e.clientX - startX;

      if (!hasDragged && Math.abs(delta) > DRAG_THRESHOLD) {
        hasDragged = true;
        el.setPointerCapture(pointerId); // ← only capture after real drag
        el.classList.add('is-dragging');
      }

      if (hasDragged) {
        el.scrollLeft = scrollLeft - delta;
      }
    });

    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      if (hasDragged) {
        el.releasePointerCapture(e.pointerId);
      }
      el.classList.remove('is-dragging');
    };

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    el.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    }, true);
  });
})();


// js/theme.js
import { Delegate as Delegate11 } from "vendor";
(() => {
  const delegateDocument = new Delegate11(document.documentElement);
  delegateDocument.on("click", 'a[href*="#"]', (event, target) => {
    if (event.defaultPrevented || target.matches("[allow-hash-change]") || target.pathname !== window.location.pathname || target.search !== window.location.search) {
      return;
    }
    const url = new URL(target.href);
    if (url.hash === "") {
      return;
    }
    const anchorElement = document.querySelector(url.hash);
    if (anchorElement) {
      event.preventDefault();
      anchorElement.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto" });
      document.documentElement.dispatchEvent(new CustomEvent("hashchange:simulate", { bubbles: true, detail: { hash: url.hash } }));
    }
  });
  if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, maximum-scale=1.0";
  }
  Array.from(document.querySelectorAll(".prose table")).forEach((table) => {
    table.outerHTML = '<div class="table-scroller">' + table.outerHTML + "</div>";
  });
})();
export {
  AccordionDisclosure,
  AccountLogin,
  AgeVerifierModal,
  AnnouncementBar,
  BeforeAfter,
  BlogPostList,
  ButtonContent,
  BuyButtons,
  CarouselNavigation,
  CarouselNextButton,
  CarouselPageIndicator,
  CarouselPrevButton,
  CartCount,
  CartDiscountBanner,
  CartDiscountField,
  CartDiscountRemoveButton,
  CartDrawer,
  CartNote,
  CollectionFacetsFloatingButton,
  ConfirmButton,
  CopyButton,
  CountdownTimer,
  CountdownTimerFlip,
  CountrySelector,
  CustomCursor,
  DialogCloseButton,
  DialogElement,
  Drawer,
  DrawerPopover,
  DynamicGrid,
  EffectCarousel,
  FacetLink,
  FacetsDrawer,
  FacetsForm,
  FeaturedCollectionsTabs,
  FeaturedLinks,
  FeaturedLinksImageCursor,
  FreeShippingBar,
  GestureArea,
  GiftCardRecipient,
  Header,
  HeaderDropdownMenu,
  HeaderMegaMenu,
  HeaderMenuDrawer,
  HeaderMenuDrawerPanel,
  HeaderMenuDropdownSidebar,
  HeightObserver,
  HighlightedHeading,
  LayoutSelectorButton,
  LineItem,
  LinksWithImage,
  LinksWithImageCarousel,
  LoadingBar,
  LogoList,
  MarqueeText,
  MediaPlayButton,
  Modal,
  ModelMedia,
  MultiColumn,
  NewsModal,
  NewsModalButton,
  NewsModalPanel,
  NewsPanelToggleButton,
  NewsletterPopup,
  OpenLightBoxButton,
  Player,
  Popover,
  PredictiveSearch,
  PressCarousel,
  PriceRange,
  ProductCard,
  ProductForm,
  ProductGallery,
  ProductList,
  ProductLoader,
  ProductRecommendations,
  ProductRerender,
  ProductStickyAddToCart,
  ProgressBar,
  QrCode,
  QuantityInput,
  QuantitySelector,
  QuickBuyModal,
  ReadingText,
  RecentlyViewedProducts,
  SafeSticky,
  SandwichVisibility,
  ScrollCarousel,
  ScrollShadow,
  SearchResultPanel,
  ShareButton,
  ShippingEstimator,
  Slideshow,
  SplitLines,
  Tabs,
  TestimonialsCarousel,
  Timeline,
  Toast,
  VariantPicker,
  VideoMedia,
  announceError,
  announceStatus,
  cachedFetch,
  createMediaImg,
  debounce,
  deepQuerySelector,
  extractSectionId,
  fetchCart,
  generateSrcset,
  getSiblings,
  getUntransformedBoundingClientReact,
  imageLoaded,
  matchesMediaQuery,
  mediaQueryListener,
  throttle,
  videoLoaded,
  waitForEvent
};
