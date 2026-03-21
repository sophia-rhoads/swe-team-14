import {
  zindexutils
} from "./chunk-TNWZTUEL.js";
import {
  EyeIcon,
  RefreshIcon,
  SearchMinusIcon,
  SearchPlusIcon,
  TimesIcon,
  UndoIcon,
  blockBodyScroll,
  unblockBodyScroll
} from "./chunk-TWCZOBCJ.js";
import {
  BaseComponent,
  PARENT_INSTANCE
} from "./chunk-22RLYBBJ.js";
import {
  Bind,
  BindModule
} from "./chunk-2K3QRG6F.js";
import {
  BaseStyle
} from "./chunk-YFSSDSDE.js";
import {
  PrimeTemplate,
  SharedModule
} from "./chunk-LYC6AMTC.js";
import {
  CommonModule,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-R2UPRAV6.js";
import {
  Lt,
  P,
  Qt,
  U,
  W,
  bt,
  oe,
  qt,
  te,
  ut,
  vt,
  w
} from "./chunk-JDE3N6HW.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  EventEmitter,
  HostListener,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-75FMVJRB.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/primeng/fesm2022/primeng-focustrap.mjs
var FocusTrap = class _FocusTrap extends BaseComponent {
  /**
   * When set as true, focus wouldn't be managed.
   * @group Props
   */
  pFocusTrapDisabled = false;
  platformId = inject(PLATFORM_ID);
  document = inject(DOCUMENT);
  firstHiddenFocusableElement;
  lastHiddenFocusableElement;
  onInit() {
    if (isPlatformBrowser(this.platformId) && !this.pFocusTrapDisabled) {
      !this.firstHiddenFocusableElement && !this.lastHiddenFocusableElement && this.createHiddenFocusableElements();
    }
  }
  onChanges(changes) {
    if (changes.pFocusTrapDisabled && isPlatformBrowser(this.platformId)) {
      if (changes.pFocusTrapDisabled.currentValue) {
        this.removeHiddenFocusableElements();
      } else {
        this.createHiddenFocusableElements();
      }
    }
  }
  removeHiddenFocusableElements() {
    if (this.firstHiddenFocusableElement && this.firstHiddenFocusableElement.parentNode) {
      this.firstHiddenFocusableElement.parentNode.removeChild(this.firstHiddenFocusableElement);
    }
    if (this.lastHiddenFocusableElement && this.lastHiddenFocusableElement.parentNode) {
      this.lastHiddenFocusableElement.parentNode.removeChild(this.lastHiddenFocusableElement);
    }
  }
  getComputedSelector(selector) {
    return `:not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])${selector ?? ""}`;
  }
  createHiddenFocusableElements() {
    const tabindex = "0";
    const createFocusableElement = (onFocus) => {
      return U("span", {
        class: "p-hidden-accessible p-hidden-focusable",
        tabindex,
        role: "presentation",
        "aria-hidden": true,
        "data-p-hidden-accessible": true,
        "data-p-hidden-focusable": true,
        onFocus: onFocus?.bind(this)
      });
    };
    this.firstHiddenFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
    this.lastHiddenFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);
    this.firstHiddenFocusableElement.setAttribute("data-pc-section", "firstfocusableelement");
    this.lastHiddenFocusableElement.setAttribute("data-pc-section", "lastfocusableelement");
    this.el.nativeElement.prepend(this.firstHiddenFocusableElement);
    this.el.nativeElement.append(this.lastHiddenFocusableElement);
  }
  onFirstHiddenElementFocus(event) {
    const {
      currentTarget,
      relatedTarget
    } = event;
    const focusableElement = relatedTarget === this.lastHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? vt(currentTarget.parentElement, ":not(.p-hidden-focusable)") : this.lastHiddenFocusableElement;
    bt(focusableElement);
  }
  onLastHiddenElementFocus(event) {
    const {
      currentTarget,
      relatedTarget
    } = event;
    const focusableElement = relatedTarget === this.firstHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? Lt(currentTarget.parentElement, ":not(.p-hidden-focusable)") : this.firstHiddenFocusableElement;
    bt(focusableElement);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFocusTrap_BaseFactory;
    return function FocusTrap_Factory(__ngFactoryType__) {
      return (ɵFocusTrap_BaseFactory || (ɵFocusTrap_BaseFactory = ɵɵgetInheritedFactory(_FocusTrap)))(__ngFactoryType__ || _FocusTrap);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FocusTrap,
    selectors: [["", "pFocusTrap", ""]],
    inputs: {
      pFocusTrapDisabled: [2, "pFocusTrapDisabled", "pFocusTrapDisabled", booleanAttribute]
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrap, [{
    type: Directive,
    args: [{
      selector: "[pFocusTrap]",
      standalone: true
    }]
  }], null, {
    pFocusTrapDisabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var FocusTrapModule = class _FocusTrapModule {
  static ɵfac = function FocusTrapModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FocusTrapModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FocusTrapModule,
    imports: [FocusTrap],
    exports: [FocusTrap]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapModule, [{
    type: NgModule,
    args: [{
      imports: [FocusTrap],
      exports: [FocusTrap]
    }]
  }], null, null);
})();

// node_modules/@primeuix/motion/dist/index.mjs
var j = Object.defineProperty;
var T = Object.getOwnPropertySymbols;
var q = Object.prototype.hasOwnProperty;
var V = Object.prototype.propertyIsEnumerable;
var D = (t, n, e) => n in t ? j(t, n, { enumerable: true, configurable: true, writable: true, value: e }) : t[n] = e;
var p = (t, n) => {
  for (var e in n || (n = {})) q.call(n, e) && D(t, e, n[e]);
  if (T) for (var e of T(n)) V.call(n, e) && D(t, e, n[e]);
  return t;
};
var N = (t, n, e) => new Promise((o, m) => {
  var i = (r) => {
    try {
      f(e.next(r));
    } catch (u) {
      m(u);
    }
  }, M = (r) => {
    try {
      f(e.throw(r));
    } catch (u) {
      m(u);
    }
  }, f = (r) => r.done ? o(r.value) : Promise.resolve(r.value).then(i, M);
  f((e = e.apply(t, n)).next());
});
var E = "animation";
var v = "transition";
function H(t) {
  return t ? t.disabled || !!(t.safe && qt()) : false;
}
function k(t, n) {
  return t ? p(p({}, t), Object.entries(n).reduce((e, [o, m]) => {
    var i;
    return e[o] = (i = t[o]) != null ? i : m, e;
  }, {})) : n;
}
function L(t) {
  let { name: n, enterClass: e, leaveClass: o } = t || {};
  return { enter: { from: (e == null ? void 0 : e.from) || `${n}-enter-from`, to: (e == null ? void 0 : e.to) || `${n}-enter-to`, active: (e == null ? void 0 : e.active) || `${n}-enter-active` }, leave: { from: (o == null ? void 0 : o.from) || `${n}-leave-from`, to: (o == null ? void 0 : o.to) || `${n}-leave-to`, active: (o == null ? void 0 : o.active) || `${n}-leave-active` } };
}
function W2(t) {
  return { enter: { onBefore: t == null ? void 0 : t.onBeforeEnter, onStart: t == null ? void 0 : t.onEnter, onAfter: t == null ? void 0 : t.onAfterEnter, onCancelled: t == null ? void 0 : t.onEnterCancelled }, leave: { onBefore: t == null ? void 0 : t.onBeforeLeave, onStart: t == null ? void 0 : t.onLeave, onAfter: t == null ? void 0 : t.onAfterLeave, onCancelled: t == null ? void 0 : t.onLeaveCancelled } };
}
function A(t, n) {
  let e = window.getComputedStyle(t), o = (l) => {
    let c = e[`${l}Delay`], h = e[`${l}Duration`];
    return [c.split(", ").map(oe), h.split(", ").map(oe)];
  }, [m, i] = o(v), [M, f] = o(E), r = Math.max(...i.map((l, c) => l + m[c])), u = Math.max(...f.map((l, c) => l + M[c])), a, s = 0, d = 0;
  return n === v ? r > 0 && (a = v, s = r, d = i.length) : n === E ? u > 0 && (a = E, s = u, d = f.length) : (s = Math.max(r, u), a = s > 0 ? r > u ? v : E : void 0, d = a ? a === v ? i.length : f.length : 0), { type: a, timeout: s, count: d };
}
function $(t, n) {
  return typeof t == "number" ? t : typeof t == "object" && t[n] != null ? t[n] : null;
}
function S(t, n = true, e = false) {
  if (!n && !e) return;
  let o = w(t);
  n && te(t, "--pui-motion-height", o.height + "px"), e && te(t, "--pui-motion-width", o.width + "px");
}
var U2 = { name: "p", safe: true, disabled: false, enter: true, leave: true, autoHeight: true, autoWidth: false };
function tt(t, n) {
  if (!t) throw new Error("Element is required.");
  let e = {}, o = false, m = {}, i = null, M = {}, f = (a) => {
    if (Object.assign(e, k(a, U2)), !e.enter && !e.leave) throw new Error("Enter or leave must be true.");
    M = W2(e), o = H(e), m = L(e), i = null;
  }, r = (a) => N(null, null, function* () {
    i == null || i();
    let { onBefore: s, onStart: d, onAfter: l, onCancelled: c } = M[a] || {}, h = { element: t };
    if (o) {
      s == null || s(h), d == null || d(h), l == null || l(h);
      return;
    }
    let { from: g, active: y, to: P2 } = m[a] || {};
    return S(t, e.autoHeight, e.autoWidth), s == null || s(h), W(t, g), W(t, y), t.offsetHeight, P(t, g), W(t, P2), d == null || d(h), new Promise((b) => {
      let C = $(e.duration, a), x = () => {
        P(t, [P2, y]), i = null;
      }, R = () => {
        x(), l == null || l(h), b();
      };
      i = () => {
        x(), c == null || c(h), b();
      }, G(t, e.type, C, R);
    });
  });
  f(n);
  let u = { enter: () => e.enter ? r("enter") : Promise.resolve(), leave: () => e.leave ? r("leave") : Promise.resolve(), cancel: () => {
    i == null || i(), i = null;
  }, update: (a, s) => {
    if (!a) throw new Error("Element is required.");
    t = a, u.cancel(), f(s);
  } };
  return e.appear && u.enter(), u;
}
var z = 0;
function G(t, n, e, o) {
  let m = t._motionEndId = ++z, i = () => {
    m === t._motionEndId && o();
  };
  if (e != null) return setTimeout(i, e);
  let { type: M, timeout: f, count: r } = A(t, n);
  if (!M) {
    o();
    return;
  }
  let u = M + "end", a = 0, s = () => {
    t.removeEventListener(u, d, true), i();
  }, d = (l) => {
    l.target === t && ++a >= r && s();
  };
  t.addEventListener(u, d, { capture: true, once: true }), setTimeout(() => {
    a < r && s();
  }, f + 1);
}

// node_modules/primeng/fesm2022/primeng-motion.mjs
var _c0 = ["*"];
function Motion_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
var originalStyles = /* @__PURE__ */ new WeakMap();
function applyHiddenStyles(element, strategy) {
  if (!element) return;
  if (!originalStyles.has(element)) {
    originalStyles.set(element, {
      display: element.style.display,
      visibility: element.style.visibility,
      maxHeight: element.style.maxHeight
    });
  }
  switch (strategy) {
    case "display":
      element.style.display = "none";
      break;
    case "visibility":
      element.style.visibility = "hidden";
      element.style.maxHeight = "0";
      break;
  }
}
function resetStyles(element, strategy) {
  if (!element) return;
  const original = originalStyles.get(element) ?? element.style;
  switch (strategy) {
    case "display":
      element.style.display = original?.display || "";
      break;
    case "visibility":
      element.style.visibility = original?.visibility || "";
      element.style.maxHeight = original?.maxHeight || "";
      break;
  }
  originalStyles.delete(element);
}
var style = (
  /*css*/
  `
    .p-motion {
        display: block;
    }
`
);
var classes = {
  root: "p-motion"
};
var MotionStyle = class _MotionStyle extends BaseStyle {
  name = "motion";
  style = style;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMotionStyle_BaseFactory;
    return function MotionStyle_Factory(__ngFactoryType__) {
      return (ɵMotionStyle_BaseFactory || (ɵMotionStyle_BaseFactory = ɵɵgetInheritedFactory(_MotionStyle)))(__ngFactoryType__ || _MotionStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _MotionStyle,
    factory: _MotionStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MotionStyle, [{
    type: Injectable
  }], null, null);
})();
var MotionClasses;
(function(MotionClasses2) {
  MotionClasses2["root"] = "p-motion";
})(MotionClasses || (MotionClasses = {}));
var MOTION_INSTANCE = new InjectionToken("MOTION_INSTANCE");
var Motion = class _Motion extends BaseComponent {
  $pcMotion = inject(MOTION_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  onAfterViewChecked() {
    const options = this.options();
    const optionsAttrs = options?.root || {};
    this.bindDirectiveInstance.setAttrs(__spreadValues(__spreadValues({}, this.ptms(["host", "root"])), optionsAttrs));
  }
  _componentStyle = inject(MotionStyle);
  /******************** Inputs ********************/
  /**
   * Whether the element is visible or not.
   * @group Props
   */
  visible = input(false, ...ngDevMode ? [{
    debugName: "visible"
  }] : []);
  /**
   * Whether to mount the element on enter.
   * @group Props
   */
  mountOnEnter = input(true, ...ngDevMode ? [{
    debugName: "mountOnEnter"
  }] : []);
  /**
   * Whether to unmount the element on leave.
   * @group Props
   */
  unmountOnLeave = input(true, ...ngDevMode ? [{
    debugName: "unmountOnLeave"
  }] : []);
  /**
   * The name of the motion. It can be a predefined motion name or a custom one.
   * phases:
   *     [name]-enter
   *     [name]-enter-active
   *     [name]-enter-to
   *     [name]-leave
   *     [name]-leave-active
   *     [name]-leave-to
   * @group Props
   */
  name = input(void 0, ...ngDevMode ? [{
    debugName: "name"
  }] : []);
  /**
   * The type of the motion, valid values 'transition' and 'animation'.
   * @group Props
   */
  type = input(void 0, ...ngDevMode ? [{
    debugName: "type"
  }] : []);
  /**
   * Whether the motion is safe.
   * @group Props
   */
  safe = input(void 0, ...ngDevMode ? [{
    debugName: "safe"
  }] : []);
  /**
   * Whether the motion is disabled.
   * @group Props
   */
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled"
  }] : []);
  /**
   * Whether the motion should appear.
   * @group Props
   */
  appear = input(false, ...ngDevMode ? [{
    debugName: "appear"
  }] : []);
  /**
   * Whether the motion should enter.
   * @group Props
   */
  enter = input(true, ...ngDevMode ? [{
    debugName: "enter"
  }] : []);
  /**
   * Whether the motion should leave.
   * @group Props
   */
  leave = input(true, ...ngDevMode ? [{
    debugName: "leave"
  }] : []);
  /**
   * The duration of the motion.
   * @group Props
   */
  duration = input(void 0, ...ngDevMode ? [{
    debugName: "duration"
  }] : []);
  /**
   * The hide strategy of the motion, valid values 'display' and 'visibility'.
   * @group Props
   */
  hideStrategy = input("display", ...ngDevMode ? [{
    debugName: "hideStrategy"
  }] : []);
  /**
   * The enter from class of the motion.
   * @group Props
   */
  enterFromClass = input(void 0, ...ngDevMode ? [{
    debugName: "enterFromClass"
  }] : []);
  /**
   * The enter to class of the motion.
   * @group Props
   */
  enterToClass = input(void 0, ...ngDevMode ? [{
    debugName: "enterToClass"
  }] : []);
  /**
   * The enter active class of the motion.
   * @group Props
   */
  enterActiveClass = input(void 0, ...ngDevMode ? [{
    debugName: "enterActiveClass"
  }] : []);
  /**
   * The leave from class of the motion.
   * @group Props
   */
  leaveFromClass = input(void 0, ...ngDevMode ? [{
    debugName: "leaveFromClass"
  }] : []);
  /**
   * The leave to class of the motion.
   * @group Props
   */
  leaveToClass = input(void 0, ...ngDevMode ? [{
    debugName: "leaveToClass"
  }] : []);
  /**
   * The leave active class of the motion.
   * @group Props
   */
  leaveActiveClass = input(void 0, ...ngDevMode ? [{
    debugName: "leaveActiveClass"
  }] : []);
  /******************** All Inputs ********************/
  /**
   * The motion options.
   * @group Props
   */
  options = input({}, ...ngDevMode ? [{
    debugName: "options"
  }] : []);
  /******************** Outputs ********************/
  /**
   * Callback fired before the enter transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onBeforeEnter = output();
  /**
   * Callback fired when the enter transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onEnter = output();
  /**
   * Callback fired after the enter transition/animation ends.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onAfterEnter = output();
  /**
   * Callback fired when the enter transition/animation is cancelled.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onEnterCancelled = output();
  /**
   * Callback fired before the leave transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onBeforeLeave = output();
  /**
   * Callback fired when the leave transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onLeave = output();
  /**
   * Callback fired after the leave transition/animation ends.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onAfterLeave = output();
  /**
   * Callback fired when the leave transition/animation is cancelled.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onLeaveCancelled = output();
  /******************** Computed ********************/
  motionOptions = computed(() => {
    const options = this.options();
    return {
      name: options.name ?? this.name(),
      type: options.type ?? this.type(),
      safe: options.safe ?? this.safe(),
      disabled: options.disabled ?? this.disabled(),
      appear: false,
      enter: options.enter ?? this.enter(),
      leave: options.leave ?? this.leave(),
      duration: options.duration ?? this.duration(),
      enterClass: {
        from: options.enterClass?.from ?? (!options.name ? this.enterFromClass() : void 0),
        to: options.enterClass?.to ?? (!options.name ? this.enterToClass() : void 0),
        active: options.enterClass?.active ?? (!options.name ? this.enterActiveClass() : void 0)
      },
      leaveClass: {
        from: options.leaveClass?.from ?? (!options.name ? this.leaveFromClass() : void 0),
        to: options.leaveClass?.to ?? (!options.name ? this.leaveToClass() : void 0),
        active: options.leaveClass?.active ?? (!options.name ? this.leaveActiveClass() : void 0)
      },
      onBeforeEnter: options.onBeforeEnter ?? this.handleBeforeEnter,
      onEnter: options.onEnter ?? this.handleEnter,
      onAfterEnter: options.onAfterEnter ?? this.handleAfterEnter,
      onEnterCancelled: options.onEnterCancelled ?? this.handleEnterCancelled,
      onBeforeLeave: options.onBeforeLeave ?? this.handleBeforeLeave,
      onLeave: options.onLeave ?? this.handleLeave,
      onAfterLeave: options.onAfterLeave ?? this.handleAfterLeave,
      onLeaveCancelled: options.onLeaveCancelled ?? this.handleLeaveCancelled
    };
  }, ...ngDevMode ? [{
    debugName: "motionOptions"
  }] : []);
  motion;
  isInitialMount = true;
  cancelled = false;
  destroyed = false;
  rendered = signal(false, ...ngDevMode ? [{
    debugName: "rendered"
  }] : []);
  handleBeforeEnter = (event) => !this.destroyed && this.onBeforeEnter.emit(event);
  handleEnter = (event) => !this.destroyed && this.onEnter.emit(event);
  handleAfterEnter = (event) => !this.destroyed && this.onAfterEnter.emit(event);
  handleEnterCancelled = (event) => !this.destroyed && this.onEnterCancelled.emit(event);
  handleBeforeLeave = (event) => !this.destroyed && this.onBeforeLeave.emit(event);
  handleLeave = (event) => !this.destroyed && this.onLeave.emit(event);
  handleAfterLeave = (event) => !this.destroyed && this.onAfterLeave.emit(event);
  handleLeaveCancelled = (event) => !this.destroyed && this.onLeaveCancelled.emit(event);
  constructor() {
    super();
    effect(() => {
      const hideStrategy = this.hideStrategy();
      if (this.isInitialMount) {
        applyHiddenStyles(this.$el, hideStrategy);
        this.rendered.set(this.visible() && this.mountOnEnter() || !this.mountOnEnter());
      } else if (this.visible() && !this.rendered()) {
        applyHiddenStyles(this.$el, hideStrategy);
        this.rendered.set(true);
      }
    });
    effect(() => {
      if (!this.motion) {
        this.motion = tt(this.$el, this.motionOptions());
      } else {
      }
    });
    afterRenderEffect(async () => {
      if (!this.$el) return;
      const shouldAppear = this.isInitialMount && this.visible() && this.appear();
      const hideStrategy = this.hideStrategy();
      if (this.visible()) {
        await Qt();
        resetStyles(this.$el, hideStrategy);
        if (shouldAppear || !this.isInitialMount) {
          this.motion?.enter();
        }
      } else if (!this.isInitialMount) {
        await Qt();
        this.motion?.leave()?.then(async () => {
          if (this.$el && !this.cancelled && !this.visible()) {
            applyHiddenStyles(this.$el, hideStrategy);
            if (this.unmountOnLeave()) {
              await Qt();
              if (!this.cancelled) {
                this.rendered.set(false);
              }
            }
          }
        });
      }
      this.isInitialMount = false;
    });
  }
  onDestroy() {
    this.destroyed = true;
    this.cancelled = true;
    this.motion?.cancel();
    this.motion = void 0;
    resetStyles(this.$el, this.hideStrategy());
    this.$el?.remove();
    this.isInitialMount = true;
  }
  static ɵfac = function Motion_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Motion)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Motion,
    selectors: [["p-motion"]],
    hostVars: 2,
    hostBindings: function Motion_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("root"));
      }
    },
    inputs: {
      visible: [1, "visible"],
      mountOnEnter: [1, "mountOnEnter"],
      unmountOnLeave: [1, "unmountOnLeave"],
      name: [1, "name"],
      type: [1, "type"],
      safe: [1, "safe"],
      disabled: [1, "disabled"],
      appear: [1, "appear"],
      enter: [1, "enter"],
      leave: [1, "leave"],
      duration: [1, "duration"],
      hideStrategy: [1, "hideStrategy"],
      enterFromClass: [1, "enterFromClass"],
      enterToClass: [1, "enterToClass"],
      enterActiveClass: [1, "enterActiveClass"],
      leaveFromClass: [1, "leaveFromClass"],
      leaveToClass: [1, "leaveToClass"],
      leaveActiveClass: [1, "leaveActiveClass"],
      options: [1, "options"]
    },
    outputs: {
      onBeforeEnter: "onBeforeEnter",
      onEnter: "onEnter",
      onAfterEnter: "onAfterEnter",
      onEnterCancelled: "onEnterCancelled",
      onBeforeLeave: "onBeforeLeave",
      onLeave: "onLeave",
      onAfterLeave: "onAfterLeave",
      onLeaveCancelled: "onLeaveCancelled"
    },
    features: [ɵɵProvidersFeature([MotionStyle, {
      provide: MOTION_INSTANCE,
      useExisting: _Motion
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Motion
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 1,
    template: function Motion_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, Motion_Conditional_0_Template, 1, 0);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.rendered() ? 0 : -1);
      }
    },
    dependencies: [CommonModule, BindModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Motion, [{
    type: Component,
    args: [{
      selector: "p-motion",
      standalone: true,
      imports: [CommonModule, BindModule],
      template: `
        @if (rendered()) {
            <ng-content />
        }
    `,
      providers: [MotionStyle, {
        provide: MOTION_INSTANCE,
        useExisting: Motion
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Motion
      }],
      host: {
        "[class]": "cx('root')"
      },
      hostDirectives: [Bind]
    }]
  }], () => [], {
    visible: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "visible",
        required: false
      }]
    }],
    mountOnEnter: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "mountOnEnter",
        required: false
      }]
    }],
    unmountOnLeave: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "unmountOnLeave",
        required: false
      }]
    }],
    name: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "name",
        required: false
      }]
    }],
    type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "type",
        required: false
      }]
    }],
    safe: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "safe",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    appear: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "appear",
        required: false
      }]
    }],
    enter: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "enter",
        required: false
      }]
    }],
    leave: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "leave",
        required: false
      }]
    }],
    duration: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "duration",
        required: false
      }]
    }],
    hideStrategy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hideStrategy",
        required: false
      }]
    }],
    enterFromClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "enterFromClass",
        required: false
      }]
    }],
    enterToClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "enterToClass",
        required: false
      }]
    }],
    enterActiveClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "enterActiveClass",
        required: false
      }]
    }],
    leaveFromClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "leaveFromClass",
        required: false
      }]
    }],
    leaveToClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "leaveToClass",
        required: false
      }]
    }],
    leaveActiveClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "leaveActiveClass",
        required: false
      }]
    }],
    options: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "options",
        required: false
      }]
    }],
    onBeforeEnter: [{
      type: Output,
      args: ["onBeforeEnter"]
    }],
    onEnter: [{
      type: Output,
      args: ["onEnter"]
    }],
    onAfterEnter: [{
      type: Output,
      args: ["onAfterEnter"]
    }],
    onEnterCancelled: [{
      type: Output,
      args: ["onEnterCancelled"]
    }],
    onBeforeLeave: [{
      type: Output,
      args: ["onBeforeLeave"]
    }],
    onLeave: [{
      type: Output,
      args: ["onLeave"]
    }],
    onAfterLeave: [{
      type: Output,
      args: ["onAfterLeave"]
    }],
    onLeaveCancelled: [{
      type: Output,
      args: ["onLeaveCancelled"]
    }]
  });
})();
var MOTION_DIRECTIVE_INSTANCE = new InjectionToken("MOTION_DIRECTIVE_INSTANCE");
var MotionDirective = class _MotionDirective extends BaseComponent {
  $pcMotionDirective = inject(MOTION_DIRECTIVE_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  /******************** Inputs ********************/
  /**
   * Whether the element is visible or not.
   * @group Props
   */
  visible = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "visible"
  } : {}), {
    alias: "pMotion"
  }));
  /**
   * The name of the motion. It can be a predefined motion name or a custom one.
   * phases:
   *     [name]-enter
   *     [name]-enter-active
   *     [name]-enter-to
   *     [name]-leave
   *     [name]-leave-active
   *     [name]-leave-to
   * @group Props
   */
  name = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "name"
  } : {}), {
    alias: "pMotionName"
  }));
  /**
   * The type of the motion, valid values 'transition' and 'animation'.
   * @group Props
   */
  type = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "type"
  } : {}), {
    alias: "pMotionType"
  }));
  /**
   * Whether the motion is safe.
   * @group Props
   */
  safe = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "safe"
  } : {}), {
    alias: "pMotionSafe"
  }));
  /**
   * Whether the motion is disabled.
   * @group Props
   */
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : {}), {
    alias: "pMotionDisabled"
  }));
  /**
   * Whether the motion should appear.
   * @group Props
   */
  appear = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "appear"
  } : {}), {
    alias: "pMotionAppear"
  }));
  /**
   * Whether the motion should enter.
   * @group Props
   */
  enter = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "enter"
  } : {}), {
    alias: "pMotionEnter"
  }));
  /**
   * Whether the motion should leave.
   * @group Props
   */
  leave = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "leave"
  } : {}), {
    alias: "pMotionLeave"
  }));
  /**
   * The duration of the motion.
   * @group Props
   */
  duration = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "duration"
  } : {}), {
    alias: "pMotionDuration"
  }));
  /**
   * The hide strategy of the motion, valid values 'display' and 'visibility'.
   * @group Props
   */
  hideStrategy = input("display", __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "hideStrategy"
  } : {}), {
    alias: "pMotionHideStrategy"
  }));
  /**
   * The enter from class of the motion.
   * @group Props
   */
  enterFromClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "enterFromClass"
  } : {}), {
    alias: "pMotionEnterFromClass"
  }));
  /**
   * The enter to class of the motion.
   * @group Props
   */
  enterToClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "enterToClass"
  } : {}), {
    alias: "pMotionEnterToClass"
  }));
  /**
   * The enter active class of the motion.
   * @group Props
   */
  enterActiveClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "enterActiveClass"
  } : {}), {
    alias: "pMotionEnterActiveClass"
  }));
  /**
   * The leave from class of the motion.
   * @group Props
   */
  leaveFromClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "leaveFromClass"
  } : {}), {
    alias: "pMotionLeaveFromClass"
  }));
  /**
   * The leave to class of the motion.
   * @group Props
   */
  leaveToClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "leaveToClass"
  } : {}), {
    alias: "pMotionLeaveToClass"
  }));
  /**
   * The leave active class of the motion.
   * @group Props
   */
  leaveActiveClass = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "leaveActiveClass"
  } : {}), {
    alias: "pMotionLeaveActiveClass"
  }));
  /******************** All Inputs ********************/
  /**
   * The motion options.
   * @group Props
   */
  options = input({}, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "options"
  } : {}), {
    alias: "pMotionOptions"
  }));
  /******************** Outputs ********************/
  /**
   * Callback fired before the enter transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onBeforeEnter = output({
    alias: "pMotionOnBeforeEnter"
  });
  /**
   * Callback fired when the enter transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onEnter = output({
    alias: "pMotionOnEnter"
  });
  /**
   * Callback fired after the enter transition/animation ends.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onAfterEnter = output({
    alias: "pMotionOnAfterEnter"
  });
  /**
   * Callback fired when the enter transition/animation is cancelled.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onEnterCancelled = output({
    alias: "pMotionOnEnterCancelled"
  });
  /**
   * Callback fired before the leave transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onBeforeLeave = output({
    alias: "pMotionOnBeforeLeave"
  });
  /**
   * Callback fired when the leave transition/animation starts.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onLeave = output({
    alias: "pMotionOnLeave"
  });
  /**
   * Callback fired after the leave transition/animation ends.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onAfterLeave = output({
    alias: "pMotionOnAfterLeave"
  });
  /**
   * Callback fired when the leave transition/animation is cancelled.
   * @param {MotionEvent} [event] - The event object containing details about the motion.
   * @param {Element} event.element - The element being transitioned/animated.
   * @group Emits
   */
  onLeaveCancelled = output({
    alias: "pMotionOnLeaveCancelled"
  });
  /******************** Computed ********************/
  motionOptions = computed(() => {
    const options = this.options() ?? {};
    return {
      name: options.name ?? this.name(),
      type: options.type ?? this.type(),
      safe: options.safe ?? this.safe(),
      disabled: options.disabled ?? this.disabled(),
      appear: false,
      enter: options.enter ?? this.enter(),
      leave: options.leave ?? this.leave(),
      duration: options.duration ?? this.duration(),
      enterClass: {
        from: options.enterClass?.from ?? (!options.name ? this.enterFromClass() : void 0),
        to: options.enterClass?.to ?? (!options.name ? this.enterToClass() : void 0),
        active: options.enterClass?.active ?? (!options.name ? this.enterActiveClass() : void 0)
      },
      leaveClass: {
        from: options.leaveClass?.from ?? (!options.name ? this.leaveFromClass() : void 0),
        to: options.leaveClass?.to ?? (!options.name ? this.leaveToClass() : void 0),
        active: options.leaveClass?.active ?? (!options.name ? this.leaveActiveClass() : void 0)
      },
      onBeforeEnter: options.onBeforeEnter ?? this.handleBeforeEnter,
      onEnter: options.onEnter ?? this.handleEnter,
      onAfterEnter: options.onAfterEnter ?? this.handleAfterEnter,
      onEnterCancelled: options.onEnterCancelled ?? this.handleEnterCancelled,
      onBeforeLeave: options.onBeforeLeave ?? this.handleBeforeLeave,
      onLeave: options.onLeave ?? this.handleLeave,
      onAfterLeave: options.onAfterLeave ?? this.handleAfterLeave,
      onLeaveCancelled: options.onLeaveCancelled ?? this.handleLeaveCancelled
    };
  }, ...ngDevMode ? [{
    debugName: "motionOptions"
  }] : []);
  motion;
  isInitialMount = true;
  cancelled = false;
  destroyed = false;
  handleBeforeEnter = (event) => !this.destroyed && this.onBeforeEnter.emit(event);
  handleEnter = (event) => !this.destroyed && this.onEnter.emit(event);
  handleAfterEnter = (event) => !this.destroyed && this.onAfterEnter.emit(event);
  handleEnterCancelled = (event) => !this.destroyed && this.onEnterCancelled.emit(event);
  handleBeforeLeave = (event) => !this.destroyed && this.onBeforeLeave.emit(event);
  handleLeave = (event) => !this.destroyed && this.onLeave.emit(event);
  handleAfterLeave = (event) => !this.destroyed && this.onAfterLeave.emit(event);
  handleLeaveCancelled = (event) => !this.destroyed && this.onLeaveCancelled.emit(event);
  constructor() {
    super();
    effect(() => {
      if (!this.motion) {
        this.motion = tt(this.$el, this.motionOptions());
      } else {
      }
    });
    afterRenderEffect(() => {
      if (!this.$el) return;
      const shouldAppear = this.isInitialMount && this.visible() && this.appear();
      const hideStrategy = this.hideStrategy();
      if (this.visible()) {
        resetStyles(this.$el, hideStrategy);
        if (shouldAppear || !this.isInitialMount) {
          this.motion?.enter();
        }
      } else if (!this.isInitialMount) {
        this.motion?.leave()?.then(() => {
          if (this.$el && !this.cancelled && !this.visible()) {
            applyHiddenStyles(this.$el, hideStrategy);
          }
        });
      } else {
        applyHiddenStyles(this.$el, hideStrategy);
      }
      this.isInitialMount = false;
    });
  }
  onDestroy() {
    this.destroyed = true;
    this.cancelled = true;
    this.motion?.cancel();
    this.motion = void 0;
    resetStyles(this.$el, this.hideStrategy());
    this.isInitialMount = true;
  }
  static ɵfac = function MotionDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MotionDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MotionDirective,
    selectors: [["", "pMotion", ""]],
    inputs: {
      visible: [1, "pMotion", "visible"],
      name: [1, "pMotionName", "name"],
      type: [1, "pMotionType", "type"],
      safe: [1, "pMotionSafe", "safe"],
      disabled: [1, "pMotionDisabled", "disabled"],
      appear: [1, "pMotionAppear", "appear"],
      enter: [1, "pMotionEnter", "enter"],
      leave: [1, "pMotionLeave", "leave"],
      duration: [1, "pMotionDuration", "duration"],
      hideStrategy: [1, "pMotionHideStrategy", "hideStrategy"],
      enterFromClass: [1, "pMotionEnterFromClass", "enterFromClass"],
      enterToClass: [1, "pMotionEnterToClass", "enterToClass"],
      enterActiveClass: [1, "pMotionEnterActiveClass", "enterActiveClass"],
      leaveFromClass: [1, "pMotionLeaveFromClass", "leaveFromClass"],
      leaveToClass: [1, "pMotionLeaveToClass", "leaveToClass"],
      leaveActiveClass: [1, "pMotionLeaveActiveClass", "leaveActiveClass"],
      options: [1, "pMotionOptions", "options"]
    },
    outputs: {
      onBeforeEnter: "pMotionOnBeforeEnter",
      onEnter: "pMotionOnEnter",
      onAfterEnter: "pMotionOnAfterEnter",
      onEnterCancelled: "pMotionOnEnterCancelled",
      onBeforeLeave: "pMotionOnBeforeLeave",
      onLeave: "pMotionOnLeave",
      onAfterLeave: "pMotionOnAfterLeave",
      onLeaveCancelled: "pMotionOnLeaveCancelled"
    },
    features: [ɵɵProvidersFeature([MotionStyle, {
      provide: MOTION_DIRECTIVE_INSTANCE,
      useExisting: _MotionDirective
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _MotionDirective
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MotionDirective, [{
    type: Directive,
    args: [{
      selector: "[pMotion]",
      standalone: true,
      providers: [MotionStyle, {
        provide: MOTION_DIRECTIVE_INSTANCE,
        useExisting: MotionDirective
      }, {
        provide: PARENT_INSTANCE,
        useExisting: MotionDirective
      }]
    }]
  }], () => [], {
    visible: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotion",
        required: false
      }]
    }],
    name: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionName",
        required: false
      }]
    }],
    type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionType",
        required: false
      }]
    }],
    safe: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionSafe",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionDisabled",
        required: false
      }]
    }],
    appear: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionAppear",
        required: false
      }]
    }],
    enter: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionEnter",
        required: false
      }]
    }],
    leave: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionLeave",
        required: false
      }]
    }],
    duration: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionDuration",
        required: false
      }]
    }],
    hideStrategy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionHideStrategy",
        required: false
      }]
    }],
    enterFromClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionEnterFromClass",
        required: false
      }]
    }],
    enterToClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionEnterToClass",
        required: false
      }]
    }],
    enterActiveClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionEnterActiveClass",
        required: false
      }]
    }],
    leaveFromClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionLeaveFromClass",
        required: false
      }]
    }],
    leaveToClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionLeaveToClass",
        required: false
      }]
    }],
    leaveActiveClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionLeaveActiveClass",
        required: false
      }]
    }],
    options: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pMotionOptions",
        required: false
      }]
    }],
    onBeforeEnter: [{
      type: Output,
      args: ["pMotionOnBeforeEnter"]
    }],
    onEnter: [{
      type: Output,
      args: ["pMotionOnEnter"]
    }],
    onAfterEnter: [{
      type: Output,
      args: ["pMotionOnAfterEnter"]
    }],
    onEnterCancelled: [{
      type: Output,
      args: ["pMotionOnEnterCancelled"]
    }],
    onBeforeLeave: [{
      type: Output,
      args: ["pMotionOnBeforeLeave"]
    }],
    onLeave: [{
      type: Output,
      args: ["pMotionOnLeave"]
    }],
    onAfterLeave: [{
      type: Output,
      args: ["pMotionOnAfterLeave"]
    }],
    onLeaveCancelled: [{
      type: Output,
      args: ["pMotionOnLeaveCancelled"]
    }]
  });
})();
var MotionModule = class _MotionModule {
  static ɵfac = function MotionModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MotionModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MotionModule,
    imports: [Motion, MotionDirective],
    exports: [Motion, MotionDirective]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Motion]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MotionModule, [{
    type: NgModule,
    args: [{
      imports: [Motion, MotionDirective],
      exports: [Motion, MotionDirective]
    }]
  }], null, null);
})();

// node_modules/@primeuix/styles/dist/image/index.mjs
var style2 = "\n    .p-image-mask {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .p-image-preview {\n        position: relative;\n        display: inline-flex;\n        line-height: 0;\n    }\n\n    .p-image-preview-mask {\n        position: absolute;\n        inset-inline-start: 0;\n        inset-block-start: 0;\n        width: 100%;\n        height: 100%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        opacity: 0;\n        border: 0 none;\n        padding: 0;\n        cursor: pointer;\n        background: transparent;\n        color: dt('image.preview.mask.color');\n        transition: background dt('image.transition.duration');\n    }\n\n    .p-image-preview:hover > .p-image-preview-mask,\n    .p-image-preview-mask:focus-visible {\n        opacity: 1;\n        cursor: pointer;\n        background: dt('image.preview.mask.background');\n        outline: 0 none;\n    }\n\n    .p-image-preview-icon {\n        font-size: dt('image.preview.icon.size');\n        width: dt('image.preview.icon.size');\n        height: dt('image.preview.icon.size');\n    }\n\n    .p-image-toolbar {\n        position: absolute;\n        inset-block-start: dt('image.toolbar.position.top');\n        inset-inline-end: dt('image.toolbar.position.right');\n        inset-inline-start: dt('image.toolbar.position.left');\n        inset-block-end: dt('image.toolbar.position.bottom');\n        display: flex;\n        z-index: 1;\n        padding: dt('image.toolbar.padding');\n        background: dt('image.toolbar.background');\n        backdrop-filter: blur(dt('image.toolbar.blur'));\n        border-color: dt('image.toolbar.border.color');\n        border-style: solid;\n        border-width: dt('image.toolbar.border.width');\n        border-radius: dt('image.toolbar.border.radius');\n        gap: dt('image.toolbar.gap');\n    }\n\n    .p-image-action {\n        display: inline-flex;\n        justify-content: center;\n        align-items: center;\n        color: dt('image.action.color');\n        background: transparent;\n        width: dt('image.action.size');\n        height: dt('image.action.size');\n        margin: 0;\n        padding: 0;\n        border: 0 none;\n        cursor: pointer;\n        user-select: none;\n        border-radius: dt('image.action.border.radius');\n        outline-color: transparent;\n        transition:\n            background dt('image.transition.duration'),\n            color dt('image.transition.duration'),\n            outline-color dt('image.transition.duration'),\n            box-shadow dt('image.transition.duration');\n    }\n\n    .p-image-action:hover {\n        color: dt('image.action.hover.color');\n        background: dt('image.action.hover.background');\n    }\n\n    .p-image-action:focus-visible {\n        box-shadow: dt('image.action.focus.ring.shadow');\n        outline: dt('image.action.focus.ring.width') dt('image.action.focus.ring.style') dt('image.action.focus.ring.color');\n        outline-offset: dt('image.action.focus.ring.offset');\n    }\n\n    .p-image-action .p-icon {\n        font-size: dt('image.action.icon.size');\n        width: dt('image.action.icon.size');\n        height: dt('image.action.icon.size');\n    }\n\n    .p-image-action.p-disabled {\n        pointer-events: auto;\n    }\n\n    .p-image-original {\n        max-width: 100vw;\n        max-height: 100vh;\n        transition: transform 300ms;\n    }\n\n    .p-image-original-enter-active {\n        animation: p-animate-image-original-enter 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    .p-image-original-leave-active {\n        animation: p-animate-image-original-leave 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    @keyframes p-animate-image-original-enter {\n        from {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n\n    @keyframes p-animate-image-original-leave {\n        to {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n";

// node_modules/primeng/fesm2022/primeng-image.mjs
var _c02 = ["indicator"];
var _c1 = ["rotaterighticon"];
var _c2 = ["rotatelefticon"];
var _c3 = ["zoomouticon"];
var _c4 = ["zoominicon"];
var _c5 = ["closeicon"];
var _c6 = ["preview"];
var _c7 = ["image"];
var _c8 = ["mask"];
var _c9 = ["previewButton"];
var _c10 = ["closeButton"];
var _c11 = (a0) => ({
  errorCallback: a0
});
var _c12 = (a0, a1) => ({
  height: a0,
  width: a1
});
var _c13 = (a0, a1, a2) => ({
  class: a0,
  style: a1,
  previewCallback: a2
});
function Image_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "img", 8);
    ɵɵlistener("error", function Image_ng_container_0_Template_img_error_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.imageError($event));
    });
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.imageClass);
    ɵɵproperty("ngStyle", ctx_r1.imageStyle)("pBind", ctx_r1.ptm("image"));
    ɵɵattribute("src", ctx_r1.src, ɵɵsanitizeUrl)("srcset", ctx_r1.srcSet)("sizes", ctx_r1.sizes)("alt", ctx_r1.alt)("width", ctx_r1.width)("height", ctx_r1.height)("loading", ctx_r1.loading);
  }
}
function Image_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Image_button_2_ng_container_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Image_button_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, Image_button_2_ng_container_2_ng_container_1_Template, 1, 0, "ng-container", 11);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.indicatorTemplate || ctx_r1._indicatorTemplate);
  }
}
function Image_button_2_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 12);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cx("previewIcon"));
    ɵɵproperty("pBind", ctx_r1.ptm("previewIcon"));
  }
}
function Image_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 9, 0);
    ɵɵlistener("click", function Image_button_2_Template_button_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onImageClick());
    });
    ɵɵtemplate(2, Image_button_2_ng_container_2_Template, 2, 1, "ng-container", 10)(3, Image_button_2_ng_template_3_Template, 1, 3, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const defaultTemplate_r4 = ɵɵreference(4);
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassMap(ctx_r1.cx("previewMask"));
    ɵɵproperty("ngStyle", ɵɵpureFunction2(7, _c12, ctx_r1.height + "px", ctx_r1.width + "px"))("pBind", ctx_r1.ptm("previewMask"));
    ɵɵattribute("aria-label", ctx_r1.zoomImageAriaLabel);
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r1.indicatorTemplate || ctx_r1._indicatorTemplate)("ngIfElse", defaultTemplate_r4);
  }
}
function Image_Conditional_3__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 23);
  }
}
function Image_Conditional_3_5_ng_template_0_Template(rf, ctx) {
}
function Image_Conditional_3_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Image_Conditional_3_5_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Image_Conditional_3__svg_svg_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 24);
  }
}
function Image_Conditional_3_8_ng_template_0_Template(rf, ctx) {
}
function Image_Conditional_3_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Image_Conditional_3_8_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Image_Conditional_3__svg_svg_10_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 25);
  }
}
function Image_Conditional_3_11_ng_template_0_Template(rf, ctx) {
}
function Image_Conditional_3_11_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Image_Conditional_3_11_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Image_Conditional_3__svg_svg_13_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 26);
  }
}
function Image_Conditional_3_14_ng_template_0_Template(rf, ctx) {
}
function Image_Conditional_3_14_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Image_Conditional_3_14_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Image_Conditional_3__svg_svg_17_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 27);
  }
}
function Image_Conditional_3_18_ng_template_0_Template(rf, ctx) {
}
function Image_Conditional_3_18_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Image_Conditional_3_18_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Image_Conditional_3_Conditional_19_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "img", 29);
    ɵɵlistener("click", function Image_Conditional_3_Conditional_19_ng_container_1_Template_img_click_1_listener() {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r1.onPreviewImageClick());
    });
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("original"));
    ɵɵproperty("ngStyle", ctx_r1.imagePreviewStyle())("pBind", ctx_r1.ptm("original"));
    ɵɵattribute("src", ctx_r1.previewImageSrc ? ctx_r1.previewImageSrc : ctx_r1.src, ɵɵsanitizeUrl)("srcset", ctx_r1.previewImageSrcSet)("sizes", ctx_r1.previewImageSizes);
  }
}
function Image_Conditional_3_Conditional_19_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Image_Conditional_3_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "p-motion", 28);
    ɵɵlistener("onBeforeEnter", function Image_Conditional_3_Conditional_19_Template_p_motion_onBeforeEnter_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onAnimationStart($event));
    })("onBeforeLeave", function Image_Conditional_3_Conditional_19_Template_p_motion_onBeforeLeave_0_listener() {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onBeforeLeave());
    })("onAfterLeave", function Image_Conditional_3_Conditional_19_Template_p_motion_onAfterLeave_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onAnimationEnd($event));
    });
    ɵɵtemplate(1, Image_Conditional_3_Conditional_19_ng_container_1_Template, 2, 7, "ng-container", 4)(2, Image_Conditional_3_Conditional_19_ng_container_2_Template, 1, 0, "ng-container", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("visible", ctx_r1.previewVisible)("appear", true)("options", ctx_r1.computedMotionOptions());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.previewTemplate && !ctx_r1._previewTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.previewTemplate || ctx_r1._previewTemplate)("ngTemplateOutletContext", ɵɵpureFunction3(6, _c13, ctx_r1.cx("original"), ctx_r1.imagePreviewStyle(), ctx_r1.onPreviewImageClick.bind(ctx_r1)));
  }
}
function Image_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 13, 2);
    ɵɵlistener("click", function Image_Conditional_3_Template_div_click_0_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onMaskClick());
    })("keydown", function Image_Conditional_3_Template_div_keydown_0_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onMaskKeydown($event));
    })("pMotionOnAfterLeave", function Image_Conditional_3_Template_div_pMotionOnAfterLeave_0_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onMaskAfterLeave());
    });
    ɵɵelementStart(2, "div", 14);
    ɵɵlistener("click", function Image_Conditional_3_Template_div_click_2_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.handleToolbarClick($event));
    });
    ɵɵelementStart(3, "button", 15);
    ɵɵlistener("click", function Image_Conditional_3_Template_button_click_3_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.rotateRight());
    });
    ɵɵtemplate(4, Image_Conditional_3__svg_svg_4_Template, 1, 0, "svg", 16)(5, Image_Conditional_3_5_Template, 1, 0, null, 11);
    ɵɵelementEnd();
    ɵɵelementStart(6, "button", 15);
    ɵɵlistener("click", function Image_Conditional_3_Template_button_click_6_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.rotateLeft());
    });
    ɵɵtemplate(7, Image_Conditional_3__svg_svg_7_Template, 1, 0, "svg", 17)(8, Image_Conditional_3_8_Template, 1, 0, null, 11);
    ɵɵelementEnd();
    ɵɵelementStart(9, "button", 18);
    ɵɵlistener("click", function Image_Conditional_3_Template_button_click_9_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.zoomOut());
    });
    ɵɵtemplate(10, Image_Conditional_3__svg_svg_10_Template, 1, 0, "svg", 19)(11, Image_Conditional_3_11_Template, 1, 0, null, 11);
    ɵɵelementEnd();
    ɵɵelementStart(12, "button", 18);
    ɵɵlistener("click", function Image_Conditional_3_Template_button_click_12_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.zoomIn());
    });
    ɵɵtemplate(13, Image_Conditional_3__svg_svg_13_Template, 1, 0, "svg", 20)(14, Image_Conditional_3_14_Template, 1, 0, null, 11);
    ɵɵelementEnd();
    ɵɵelementStart(15, "button", 15, 3);
    ɵɵlistener("click", function Image_Conditional_3_Template_button_click_15_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.closePreview());
    });
    ɵɵtemplate(17, Image_Conditional_3__svg_svg_17_Template, 1, 0, "svg", 21)(18, Image_Conditional_3_18_Template, 1, 0, null, 11);
    ɵɵelementEnd()();
    ɵɵconditionalCreate(19, Image_Conditional_3_Conditional_19_Template, 3, 10, "p-motion", 22);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassMap(ctx_r1.cx("mask"));
    ɵɵproperty("pBind", ctx_r1.ptm("mask"))("pMotion", ctx_r1.maskVisible)("pMotionAppear", true)("pMotionEnterActiveClass", "p-overlay-mask-enter-active")("pMotionLeaveActiveClass", "p-overlay-mask-leave-active")("pMotionOptions", ctx_r1.computedMaskMotionOptions());
    ɵɵattribute("aria-modal", ctx_r1.maskVisible);
    ɵɵadvance(2);
    ɵɵclassMap(ctx_r1.cx("toolbar"));
    ɵɵproperty("pBind", ctx_r1.ptm("toolbar"));
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("rotateRightButton"));
    ɵɵproperty("pBind", ctx_r1.ptm("rotateRightButton"));
    ɵɵattribute("aria-label", ctx_r1.rightAriaLabel());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.rotateRightIconTemplate && !ctx_r1._rotateRightIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.rotateRightIconTemplate || ctx_r1._rotateRightIconTemplate);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("rotateLeftButton"));
    ɵɵproperty("pBind", ctx_r1.ptm("rotateLeftButton"));
    ɵɵattribute("aria-label", ctx_r1.leftAriaLabel());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.rotateLeftIconTemplate && !ctx_r1._rotateLeftIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.rotateLeftIconTemplate || ctx_r1._rotateLeftIconTemplate);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("zoomOutButton"));
    ɵɵproperty("disabled", ctx_r1.isZoomOutDisabled)("pBind", ctx_r1.ptm("zoomOutButton"));
    ɵɵattribute("aria-label", ctx_r1.zoomOutAriaLabel());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.zoomOutIconTemplate && !ctx_r1._zoomOutIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.zoomOutIconTemplate || ctx_r1._zoomOutIconTemplate);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("zoomInButton"));
    ɵɵproperty("disabled", ctx_r1.isZoomInDisabled)("pBind", ctx_r1.ptm("zoomInButton"));
    ɵɵattribute("aria-label", ctx_r1.zoomInAriaLabel());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.zoomInIconTemplate && !ctx_r1._zoomInIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.zoomInIconTemplate || ctx_r1._zoomInIconTemplate);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("closeButton"));
    ɵɵproperty("pBind", ctx_r1.ptm("closeButton"));
    ɵɵattribute("aria-label", ctx_r1.closeAriaLabel());
    ɵɵadvance(2);
    ɵɵproperty("ngIf", !ctx_r1.closeIconTemplate && !ctx_r1._closeIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.closeIconTemplate || ctx_r1._closeIconTemplate);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.renderPreview() ? 19 : -1);
  }
}
var classes2 = {
  root: ({
    instance
  }) => ["p-image p-component", {
    "p-image-preview": instance.preview
  }],
  previewMask: "p-image-preview-mask",
  previewIcon: "p-image-preview-icon",
  mask: "p-image-mask p-overlay-mask",
  toolbar: "p-image-toolbar",
  rotateRightButton: "p-image-action p-image-rotate-right-button",
  rotateLeftButton: "p-image-action p-image-rotate-left-button",
  zoomOutButton: ({
    instance
  }) => ["p-image-action p-image-zoom-out-button", {
    "p-disabled": instance.isZoomOutDisabled
  }],
  zoomInButton: ({
    instance
  }) => ["p-image-action p-image-zoom-in-button", {
    "p-disabled": instance.isZoomInDisabled
  }],
  closeButton: "p-image-action p-image-close-button",
  original: "p-image-original"
};
var ImageStyle = class _ImageStyle extends BaseStyle {
  name = "image";
  style = style2;
  classes = classes2;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵImageStyle_BaseFactory;
    return function ImageStyle_Factory(__ngFactoryType__) {
      return (ɵImageStyle_BaseFactory || (ɵImageStyle_BaseFactory = ɵɵgetInheritedFactory(_ImageStyle)))(__ngFactoryType__ || _ImageStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ImageStyle,
    factory: _ImageStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageStyle, [{
    type: Injectable
  }], null, null);
})();
var ImageClasses;
(function(ImageClasses2) {
  ImageClasses2["root"] = "p-image";
  ImageClasses2["previewMask"] = "p-image-preview-mask";
  ImageClasses2["previewIcon"] = "p-image-preview-icon";
  ImageClasses2["mask"] = "p-image-mask";
  ImageClasses2["toolbar"] = "p-image-toolbar";
  ImageClasses2["rotateRightButton"] = "p-image-rotate-right-button";
  ImageClasses2["rotateLeftButton"] = "p-image-rotate-left-button";
  ImageClasses2["zoomOutButton"] = "p-image-zoom-out-button";
  ImageClasses2["zoomInButton"] = "p-image-zoom-in-button";
  ImageClasses2["closeButton"] = "p-image-close-button";
  ImageClasses2["original"] = "p-image-original";
})(ImageClasses || (ImageClasses = {}));
var IMAGE_INSTANCE = new InjectionToken("IMAGE_INSTANCE");
var Image = class _Image extends BaseComponent {
  componentName = "Image";
  $pcImage = inject(IMAGE_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  /**
   * Style class of the image element.
   * @group Props
   */
  imageClass;
  /**
   * Inline style of the image element.
   * @group Props
   */
  imageStyle;
  /**
   * Class of the element.
   * @deprecated since v20.0.0, use `class` instead.
   * @group Props
   */
  styleClass;
  /**
   * The source path for the main image.
   * @group Props
   */
  src;
  /**
   * The srcset definition for the main image.
   * @group Props
   */
  srcSet;
  /**
   * The sizes definition for the main image.
   * @group Props
   */
  sizes;
  /**
   * The source path for the preview image.
   * @group Props
   */
  previewImageSrc;
  /**
   * The srcset definition for the preview image.
   * @group Props
   */
  previewImageSrcSet;
  /**
   * The sizes definition for the preview image.
   * @group Props
   */
  previewImageSizes;
  /**
   * Attribute of the preview image element.
   * @group Props
   */
  alt;
  /**
   * Attribute of the image element.
   * @group Props
   */
  width;
  /**
   * Attribute of the image element.
   * @group Props
   */
  height;
  /**
   * Attribute of the image element.
   * @group Props
   */
  loading;
  /**
   * Controls the preview functionality.
   * @group Props
   */
  preview = false;
  /**
   * Transition options of the show animation
   * @group Props
   * @deprecated since v21.0.0. Use `motionOptions` instead.
   */
  showTransitionOptions = "150ms cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Transition options of the hide animation
   * @group Props
   * @deprecated since v21.0.0. Use `motionOptions` instead.
   */
  hideTransitionOptions = "150ms cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Enter animation class name of modal.
   * @defaultValue 'p-modal-enter'
   * @group Props
   */
  modalEnterAnimation = input("p-modal-enter", ...ngDevMode ? [{
    debugName: "modalEnterAnimation"
  }] : []);
  /**
   * Leave animation class name of modal.
   * @defaultValue 'p-modal-leave'
   * @group Props
   */
  modalLeaveAnimation = input("p-modal-leave", ...ngDevMode ? [{
    debugName: "modalLeaveAnimation"
  }] : []);
  /**
   * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
   * @defaultValue 'self'
   * @group Props
   */
  appendTo = input(void 0, ...ngDevMode ? [{
    debugName: "appendTo"
  }] : []);
  /**
   * The motion options for the mask.
   * @group Props
   */
  maskMotionOptions = input(void 0, ...ngDevMode ? [{
    debugName: "maskMotionOptions"
  }] : []);
  computedMaskMotionOptions = computed(() => {
    return __spreadValues(__spreadValues({}, this.ptm("maskMotion")), this.maskMotionOptions());
  }, ...ngDevMode ? [{
    debugName: "computedMaskMotionOptions"
  }] : []);
  /**
   * The motion options.
   * @group Props
   */
  motionOptions = input(void 0, ...ngDevMode ? [{
    debugName: "motionOptions"
  }] : []);
  computedMotionOptions = computed(() => {
    return __spreadValues(__spreadValues({}, this.ptm("motion")), this.motionOptions());
  }, ...ngDevMode ? [{
    debugName: "computedMotionOptions"
  }] : []);
  /**
   * Triggered when the preview overlay is shown.
   * @group Emits
   */
  onShow = new EventEmitter();
  /**
   * Triggered when the preview overlay is hidden.
   * @group Emits
   */
  onHide = new EventEmitter();
  /**
   * This event is triggered if an error occurs while loading an image file.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onImageError = new EventEmitter();
  mask;
  previewButton;
  closeButton;
  /**
   * Custom indicator template.
   * @group Templates
   */
  indicatorTemplate;
  /**
   * Custom rotate right icon template.
   * @group Templates
   */
  rotateRightIconTemplate;
  /**
   * Custom rotate left icon template.
   * @group Templates
   */
  rotateLeftIconTemplate;
  /**
   * Custom zoom out icon template.
   * @group Templates
   */
  zoomOutIconTemplate;
  /**
   * Custom zoom in icon template.
   * @group Templates
   */
  zoomInIconTemplate;
  /**
   * Custom close icon template.
   * @group Templates
   */
  closeIconTemplate;
  /**
   * Custom preview template.
   * @group Templates
   */
  previewTemplate;
  /**
   * Custom image template.
   * @group Templates
   */
  imageTemplate;
  renderMask = signal(false, ...ngDevMode ? [{
    debugName: "renderMask"
  }] : []);
  renderPreview = signal(false, ...ngDevMode ? [{
    debugName: "renderPreview"
  }] : []);
  maskVisible = false;
  previewVisible = false;
  rotate = 0;
  scale = 1;
  previewClick = false;
  container;
  wrapper;
  _componentStyle = inject(ImageStyle);
  $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo(), ...ngDevMode ? [{
    debugName: "$appendTo"
  }] : []);
  get isZoomOutDisabled() {
    return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
  }
  get isZoomInDisabled() {
    return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
  }
  zoomSettings = {
    default: 1,
    step: 0.1,
    max: 1.5,
    min: 0.5
  };
  templates;
  _indicatorTemplate;
  _rotateRightIconTemplate;
  _rotateLeftIconTemplate;
  _zoomOutIconTemplate;
  _zoomInIconTemplate;
  _closeIconTemplate;
  _imageTemplate;
  _previewTemplate;
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  onAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "indicator":
          this._indicatorTemplate = item.template;
          break;
        case "rotaterighticon":
          this._rotateRightIconTemplate = item.template;
          break;
        case "rotatelefticon":
          this._rotateLeftIconTemplate = item.template;
          break;
        case "zoomouticon":
          this._zoomOutIconTemplate = item.template;
          break;
        case "zoominicon":
          this._zoomInIconTemplate = item.template;
          break;
        case "closeicon":
          this._closeIconTemplate = item.template;
          break;
        case "image":
          this._imageTemplate = item.template;
          break;
        case "preview":
          this._previewTemplate = item.template;
          break;
        default:
          this._indicatorTemplate = item.template;
          break;
      }
    });
  }
  onImageClick() {
    if (this.preview) {
      this.maskVisible = true;
      this.previewVisible = true;
      this.renderMask.set(true);
      this.renderPreview.set(true);
      blockBodyScroll();
    }
  }
  onMaskClick() {
    if (!this.previewClick) {
      this.closePreview();
    }
    this.previewClick = false;
  }
  onMaskKeydown(event) {
    switch (event.code) {
      case "Escape":
        this.onMaskClick();
        setTimeout(() => {
          bt(this.previewButton?.nativeElement);
        }, 25);
        event.preventDefault();
        break;
      default:
        break;
    }
  }
  onPreviewImageClick() {
    this.previewClick = true;
  }
  rotateRight() {
    this.rotate += 90;
    this.previewClick = true;
  }
  rotateLeft() {
    this.rotate -= 90;
    this.previewClick = true;
  }
  zoomIn() {
    this.scale = this.scale + this.zoomSettings.step;
    this.previewClick = true;
  }
  zoomOut() {
    this.scale = this.scale - this.zoomSettings.step;
    this.previewClick = true;
  }
  onAnimationStart(event) {
    this.container = event.element;
    this.wrapper = this.container?.parentElement;
    this.$attrSelector && this.wrapper?.setAttribute(this.$attrSelector, "");
    this.appendContainer();
    this.moveOnTop();
    this.onShow.emit({});
    setTimeout(() => {
      bt(this.closeButton?.nativeElement);
    }, 25);
  }
  onBeforeLeave() {
    this.maskVisible = false;
  }
  onAnimationEnd() {
    this.renderPreview.set(false);
  }
  onMaskAfterLeave() {
    if (!this.renderPreview()) {
      this.renderMask.set(false);
    }
    zindexutils.clear(this.wrapper);
    this.container = null;
    this.wrapper = null;
    this.rotate = 0;
    this.scale = this.zoomSettings.default;
    unblockBodyScroll();
    this.onHide.emit({});
    this.cd.markForCheck();
  }
  moveOnTop() {
    zindexutils.set("modal", this.wrapper, this.config.zIndex.modal);
  }
  appendContainer() {
    if (this.$appendTo() && this.$appendTo() !== "self") {
      if (this.$appendTo() === "body" && this.wrapper) {
        this.document.body.appendChild(this.wrapper);
      } else if (this.wrapper) {
        ut(this.$appendTo(), this.wrapper);
      }
    }
  }
  imagePreviewStyle() {
    return {
      transform: "rotate(" + this.rotate + "deg) scale(" + this.scale + ")"
    };
  }
  get zoomImageAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.zoomImage : void 0;
  }
  handleToolbarClick(event) {
    event.stopPropagation();
  }
  closePreview() {
    this.previewVisible = false;
  }
  imageError(event) {
    this.onImageError.emit(event);
  }
  rightAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.rotateRight : void 0;
  }
  leftAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.rotateLeft : void 0;
  }
  zoomInAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.zoomIn : void 0;
  }
  zoomOutAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.zoomOut : void 0;
  }
  closeAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.close : void 0;
  }
  onKeydownHandler() {
    if (this.previewVisible) {
      this.closePreview();
    }
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵImage_BaseFactory;
    return function Image_Factory(__ngFactoryType__) {
      return (ɵImage_BaseFactory || (ɵImage_BaseFactory = ɵɵgetInheritedFactory(_Image)))(__ngFactoryType__ || _Image);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Image,
    selectors: [["p-image"]],
    contentQueries: function Image_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c02, 4)(dirIndex, _c1, 4)(dirIndex, _c2, 4)(dirIndex, _c3, 4)(dirIndex, _c4, 4)(dirIndex, _c5, 4)(dirIndex, _c6, 4)(dirIndex, _c7, 4)(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.indicatorTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.rotateRightIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.rotateLeftIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.zoomOutIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.zoomInIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.closeIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.previewTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.imageTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Image_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c8, 5)(_c9, 5)(_c10, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.mask = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.previewButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.closeButton = _t.first);
      }
    },
    hostVars: 2,
    hostBindings: function Image_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("keydown.escape", function Image_keydown_escape_HostBindingHandler() {
          return ctx.onKeydownHandler();
        }, ɵɵresolveDocument);
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cn(ctx.cx("root"), ctx.styleClass));
      }
    },
    inputs: {
      imageClass: "imageClass",
      imageStyle: "imageStyle",
      styleClass: "styleClass",
      src: "src",
      srcSet: "srcSet",
      sizes: "sizes",
      previewImageSrc: "previewImageSrc",
      previewImageSrcSet: "previewImageSrcSet",
      previewImageSizes: "previewImageSizes",
      alt: "alt",
      width: "width",
      height: "height",
      loading: "loading",
      preview: [2, "preview", "preview", booleanAttribute],
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      modalEnterAnimation: [1, "modalEnterAnimation"],
      modalLeaveAnimation: [1, "modalLeaveAnimation"],
      appendTo: [1, "appendTo"],
      maskMotionOptions: [1, "maskMotionOptions"],
      motionOptions: [1, "motionOptions"]
    },
    outputs: {
      onShow: "onShow",
      onHide: "onHide",
      onImageError: "onImageError"
    },
    features: [ɵɵProvidersFeature([ImageStyle, {
      provide: IMAGE_INSTANCE,
      useExisting: _Image
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Image
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    decls: 4,
    vars: 7,
    consts: [["previewButton", ""], ["defaultTemplate", ""], ["mask", ""], ["closeButton", ""], [4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["type", "button", 3, "class", "ngStyle", "pBind", "click", 4, "ngIf"], ["role", "dialog", "pFocusTrap", "", 3, "class", "pBind", "pMotion", "pMotionAppear", "pMotionEnterActiveClass", "pMotionLeaveActiveClass", "pMotionOptions"], [3, "error", "ngStyle", "pBind"], ["type", "button", 3, "click", "ngStyle", "pBind"], [4, "ngIf", "ngIfElse"], [4, "ngTemplateOutlet"], ["data-p-icon", "eye", 3, "pBind"], ["role", "dialog", "pFocusTrap", "", 3, "click", "keydown", "pMotionOnAfterLeave", "pBind", "pMotion", "pMotionAppear", "pMotionEnterActiveClass", "pMotionLeaveActiveClass", "pMotionOptions"], [3, "click", "pBind"], ["type", "button", 3, "click", "pBind"], ["data-p-icon", "refresh", 4, "ngIf"], ["data-p-icon", "undo", 4, "ngIf"], ["type", "button", 3, "click", "disabled", "pBind"], ["data-p-icon", "search-minus", 4, "ngIf"], ["data-p-icon", "search-plus", 4, "ngIf"], ["data-p-icon", "times", 4, "ngIf"], ["name", "p-image-original", 3, "visible", "appear", "options"], ["data-p-icon", "refresh"], ["data-p-icon", "undo"], ["data-p-icon", "search-minus"], ["data-p-icon", "search-plus"], ["data-p-icon", "times"], ["name", "p-image-original", 3, "onBeforeEnter", "onBeforeLeave", "onAfterLeave", "visible", "appear", "options"], [3, "click", "ngStyle", "pBind"]],
    template: function Image_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, Image_ng_container_0_Template, 2, 11, "ng-container", 4)(1, Image_ng_container_1_Template, 1, 0, "ng-container", 5)(2, Image_button_2_Template, 5, 10, "button", 6);
        ɵɵconditionalCreate(3, Image_Conditional_3_Template, 20, 45, "div", 7);
      }
      if (rf & 2) {
        ɵɵproperty("ngIf", !ctx.imageTemplate && !ctx._imageTemplate);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.imageTemplate || ctx._imageTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(5, _c11, ctx.imageError.bind(ctx)));
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.preview);
        ɵɵadvance();
        ɵɵconditional(ctx.renderMask() ? 3 : -1);
      }
    },
    dependencies: [CommonModule, NgIf, NgTemplateOutlet, NgStyle, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrap, SharedModule, BindModule, Bind, MotionModule, Motion, MotionDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Image, [{
    type: Component,
    args: [{
      selector: "p-image",
      standalone: true,
      imports: [CommonModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrap, SharedModule, BindModule, MotionModule],
      template: `
        <ng-container *ngIf="!imageTemplate && !_imageTemplate">
            <img
                [attr.src]="src"
                [attr.srcset]="srcSet"
                [attr.sizes]="sizes"
                [attr.alt]="alt"
                [attr.width]="width"
                [attr.height]="height"
                [attr.loading]="loading"
                [ngStyle]="imageStyle"
                [class]="imageClass"
                (error)="imageError($event)"
                [pBind]="ptm('image')"
            />
        </ng-container>

        <ng-container *ngTemplateOutlet="imageTemplate || _imageTemplate; context: { errorCallback: imageError.bind(this) }"></ng-container>

        <button *ngIf="preview" [attr.aria-label]="zoomImageAriaLabel" type="button" [class]="cx('previewMask')" (click)="onImageClick()" #previewButton [ngStyle]="{ height: height + 'px', width: width + 'px' }" [pBind]="ptm('previewMask')">
            <ng-container *ngIf="indicatorTemplate || _indicatorTemplate; else defaultTemplate">
                <ng-container *ngTemplateOutlet="indicatorTemplate || _indicatorTemplate"></ng-container>
            </ng-container>
            <ng-template #defaultTemplate>
                <svg data-p-icon="eye" [class]="cx('previewIcon')" [pBind]="ptm('previewIcon')" />
            </ng-template>
        </button>
        @if (renderMask()) {
            <div
                #mask
                [class]="cx('mask')"
                [attr.aria-modal]="maskVisible"
                role="dialog"
                (click)="onMaskClick()"
                (keydown)="onMaskKeydown($event)"
                pFocusTrap
                [pBind]="ptm('mask')"
                [pMotion]="maskVisible"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="'p-overlay-mask-enter-active'"
                [pMotionLeaveActiveClass]="'p-overlay-mask-leave-active'"
                [pMotionOptions]="computedMaskMotionOptions()"
                (pMotionOnAfterLeave)="onMaskAfterLeave()"
            >
                <div [class]="cx('toolbar')" (click)="handleToolbarClick($event)" [pBind]="ptm('toolbar')">
                    <button [class]="cx('rotateRightButton')" (click)="rotateRight()" type="button" [attr.aria-label]="rightAriaLabel()" [pBind]="ptm('rotateRightButton')">
                        <svg data-p-icon="refresh" *ngIf="!rotateRightIconTemplate && !_rotateRightIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate || _rotateRightIconTemplate"></ng-template>
                    </button>
                    <button [class]="cx('rotateLeftButton')" (click)="rotateLeft()" type="button" [attr.aria-label]="leftAriaLabel()" [pBind]="ptm('rotateLeftButton')">
                        <svg data-p-icon="undo" *ngIf="!rotateLeftIconTemplate && !_rotateLeftIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate || _rotateLeftIconTemplate"></ng-template>
                    </button>
                    <button [class]="cx('zoomOutButton')" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled" [attr.aria-label]="zoomOutAriaLabel()" [pBind]="ptm('zoomOutButton')">
                        <svg data-p-icon="search-minus" *ngIf="!zoomOutIconTemplate && !_zoomOutIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate || _zoomOutIconTemplate"></ng-template>
                    </button>
                    <button [class]="cx('zoomInButton')" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled" [attr.aria-label]="zoomInAriaLabel()" [pBind]="ptm('zoomInButton')">
                        <svg data-p-icon="search-plus" *ngIf="!zoomInIconTemplate && !_zoomInIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate || _zoomInIconTemplate"></ng-template>
                    </button>
                    <button [class]="cx('closeButton')" type="button" (click)="closePreview()" [attr.aria-label]="closeAriaLabel()" #closeButton [pBind]="ptm('closeButton')">
                        <svg data-p-icon="times" *ngIf="!closeIconTemplate && !_closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate || _closeIconTemplate"></ng-template>
                    </button>
                </div>
                @if (renderPreview()) {
                    <p-motion [visible]="previewVisible" name="p-image-original" [appear]="true" [options]="computedMotionOptions()" (onBeforeEnter)="onAnimationStart($event)" (onBeforeLeave)="onBeforeLeave()" (onAfterLeave)="onAnimationEnd($event)">
                        <ng-container *ngIf="!previewTemplate && !_previewTemplate">
                            <img
                                [attr.src]="previewImageSrc ? previewImageSrc : src"
                                [attr.srcset]="previewImageSrcSet"
                                [attr.sizes]="previewImageSizes"
                                [class]="cx('original')"
                                [ngStyle]="imagePreviewStyle()"
                                (click)="onPreviewImageClick()"
                                [pBind]="ptm('original')"
                            />
                        </ng-container>
                        <ng-container
                            *ngTemplateOutlet="
                                previewTemplate || _previewTemplate;
                                context: {
                                    class: cx('original'),
                                    style: imagePreviewStyle(),
                                    previewCallback: onPreviewImageClick.bind(this)
                                }
                            "
                        >
                        </ng-container>
                    </p-motion>
                }
            </div>
        }
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ImageStyle, {
        provide: IMAGE_INSTANCE,
        useExisting: Image
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Image
      }],
      host: {
        "[class]": "cn(cx('root'),styleClass)"
      },
      hostDirectives: [Bind]
    }]
  }], null, {
    imageClass: [{
      type: Input
    }],
    imageStyle: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    src: [{
      type: Input
    }],
    srcSet: [{
      type: Input
    }],
    sizes: [{
      type: Input
    }],
    previewImageSrc: [{
      type: Input
    }],
    previewImageSrcSet: [{
      type: Input
    }],
    previewImageSizes: [{
      type: Input
    }],
    alt: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    loading: [{
      type: Input
    }],
    preview: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    modalEnterAnimation: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "modalEnterAnimation",
        required: false
      }]
    }],
    modalLeaveAnimation: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "modalLeaveAnimation",
        required: false
      }]
    }],
    appendTo: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "appendTo",
        required: false
      }]
    }],
    maskMotionOptions: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "maskMotionOptions",
        required: false
      }]
    }],
    motionOptions: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "motionOptions",
        required: false
      }]
    }],
    onShow: [{
      type: Output
    }],
    onHide: [{
      type: Output
    }],
    onImageError: [{
      type: Output
    }],
    mask: [{
      type: ViewChild,
      args: ["mask"]
    }],
    previewButton: [{
      type: ViewChild,
      args: ["previewButton"]
    }],
    closeButton: [{
      type: ViewChild,
      args: ["closeButton"]
    }],
    indicatorTemplate: [{
      type: ContentChild,
      args: ["indicator", {
        descendants: false
      }]
    }],
    rotateRightIconTemplate: [{
      type: ContentChild,
      args: ["rotaterighticon", {
        descendants: false
      }]
    }],
    rotateLeftIconTemplate: [{
      type: ContentChild,
      args: ["rotatelefticon", {
        descendants: false
      }]
    }],
    zoomOutIconTemplate: [{
      type: ContentChild,
      args: ["zoomouticon", {
        descendants: false
      }]
    }],
    zoomInIconTemplate: [{
      type: ContentChild,
      args: ["zoominicon", {
        descendants: false
      }]
    }],
    closeIconTemplate: [{
      type: ContentChild,
      args: ["closeicon", {
        descendants: false
      }]
    }],
    previewTemplate: [{
      type: ContentChild,
      args: ["preview", {
        descendants: false
      }]
    }],
    imageTemplate: [{
      type: ContentChild,
      args: ["image", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    onKeydownHandler: [{
      type: HostListener,
      args: ["document:keydown.escape"]
    }]
  });
})();
var ImageModule = class _ImageModule {
  static ɵfac = function ImageModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ImageModule,
    imports: [Image, SharedModule],
    exports: [Image, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Image, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageModule, [{
    type: NgModule,
    args: [{
      imports: [Image, SharedModule],
      exports: [Image, SharedModule]
    }]
  }], null, null);
})();
export {
  Image,
  ImageClasses,
  ImageModule,
  ImageStyle
};
//# sourceMappingURL=primeng_image.js.map
