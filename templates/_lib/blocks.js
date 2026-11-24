/* ============================================================================
   积木社 BLOCKBRUT · 动效运行时 v1
   ----------------------------------------------------------------------------
   解决两件事：
   1) 排版守卫 fit()——之前那批素材最大的毛病是大字溢出画布。
      根因是「按感觉写死 font-size」。这里改成**按容器实测缩放**：
      先按上界排版，再测实际宽度，超了就整体缩。字号永远落在容器的框里。
   2) 统一的时间轴登记——云渲染的 settle / 逐帧定位全靠 window.__timelines，
      组件此前 0/6 注册、模板也有 14 个漏了，导致渲染停在第 0 帧、整层空白。
      模板一律走 BBlocks.tl()，不存在忘注册的可能。

   用法：
     const B = window.BBlocks;
     const v = B.vars();
     const tl = B.tl();                       // 自动 paused + 自动登记
     tl.to('#a', {...}, 0);
     B.fit('#title', { max: 96, min: 24 });  // 排版完统一收口
   ========================================================================== */
(function (global) {
  'use strict';

  var BB = {};

  /* ---------- 变量：P1 自描述约定 ----------
     三个层次的来源，优先级从低到高：
       1. 模板 HTML 上 data-composition-variables 里每条的 default（自描述，真源）
       2. 调用方显式传入的 defaults
       3. 宿主注入的 window.__hyperframes 变量（编辑器和云渲染时才有）
     为什么必须先读 1：本地预览、单开调试、以及任何没注入变量的场合下，
     模板应该照样显示一份完整正确的画面，而不是一堆 "—" 和 0。
     上一轮 blk-punch-counter 就是在这里翻车的——JS 里调 B.vars() 没传兜底值，
     本地渲染时 v.accent 为空，var(--accent) 整个失效，大数字那块黄底方块
     变成一个空洞，肉眼看着像没做完。**指标全绿、图是坏的。**
     所以兜底值不再靠每个模板在 JS 里抄一遍，而是直接从 HTML 声明里读。 */
  BB.declared = function () {
    var out = {};
    try {
      var raw = document.documentElement.getAttribute('data-composition-variables');
      if (raw) {
        var arr = JSON.parse(raw);
        (arr || []).forEach(function (d) {
          if (d && d.id) out[d.id] = d.default;
        });
      }
    } catch (e) { /* 声明坏了就当没有，模板自带的兜底值顶上 */ }
    return out;
  };

  BB.vars = function (defaults) {
    var out = Object.assign({}, BB.declared(), defaults || {});
    try {
      var g = global.__hyperframes && global.__hyperframes.getVariables;
      if (g) {
        var v = g();
        if (v) Object.keys(v).forEach(function (k) {
          if (v[k] != null && v[k] !== '') out[k] = v[k];
        });
      }
    } catch (e) { /* 沙箱里读不到就用兜底值，不影响出图 */ }
    return out;
  };

  /* ---------- 时间轴：paused + 自动登记 ---------- */
  BB.tl = function (opts) {
    var o = Object.assign({ paused: true }, opts || {});
    var t = gsap.timeline(o);
    // 云渲染靠 window.__timelines 驱动时间轴。忘了登记 = 渲染停在第 0 帧。
    global.__timelines = global.__timelines || {};
    global.__timelines.main = t;
    return t;
  };

  /* ---------- 排版守卫 ----------
     把 el 的文字缩放到刚好塞进它的容器。
     opts: { max, min, box, axis:'x'|'y', align }
     box  : 参照容器（默认 el 的父元素）
     为什么必须实测：中文/英文、数字/汉字的宽度差一个数量级，
     写死 font-size 必然有一半素材在某组默认值下溢出。
     ---------------------------------------------------------------------- */
  BB.fit = function (sel, opts) {
    var o = Object.assign({ max: 96, min: 18, axis: 'x' }, opts || {});
    var els = typeof sel === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(sel))
      : (sel && sel.length !== undefined && !(sel instanceof Element) ? Array.prototype.slice.call(sel) : [sel]);
    els.forEach(function (el) {
      if (!el) return;
      var box = (typeof o.box === 'string' ? el.closest(o.box) : o.box) || el.parentElement;
      if (!box) return;
      el.style.fontSize = o.max + 'px';
      el.style.transform = 'none';
      var avail = (o.axis === 'y' ? box.clientHeight : box.clientWidth);
      var natural = (o.axis === 'y' ? el.scrollHeight : el.scrollWidth);
      if (!avail || !natural || natural <= avail) return;
      var k = avail / natural;
      var size = Math.max(o.min, Math.floor(o.max * k));
      el.style.fontSize = size + 'px';
      // 二次收口：字号取整后仍可能差一点，再量一次
      natural = (o.axis === 'y' ? el.scrollHeight : el.scrollWidth);
      if (natural > avail && natural > 0) {
        el.style.fontSize = Math.max(o.min, Math.floor(size * (avail / natural))) + 'px';
      }
      el.setAttribute('data-fit', el.style.fontSize);
    });
    return els.length;
  };

  /* 一次性把整页所有声明了 data-fit-max 的元素收口。
     模板里写：<h1 data-fit-max="96" data-fit-min="28">…</h1>
     收工前调一次 BB.fitAll()，全站不会再有溢出。 */
  BB.fitAll = function () {
    var n = 0;
    document.querySelectorAll('[data-fit-max]').forEach(function (el) {
      BB.fit(el, {
        max: parseFloat(el.getAttribute('data-fit-max')) || 96,
        min: parseFloat(el.getAttribute('data-fit-min')) || 18,
        axis: el.getAttribute('data-fit-axis') || 'x',
      });
      n++;
    });
    return n;
  };

  /* ---------- 画布基座 ----------
     统一舞台尺寸与安全区。所有模板都用它建根节点，避免各自写 body 尺寸写错。 */
  BB.stage = function (id, w, h, cls) {
    var el = document.getElementById(id);
    if (!el) return null;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    if (cls) el.className = cls;
    // 告诉外层宿主真实尺寸（合成页据此等比缩放到画布）
    var m = document.createElement('meta');
    m.name = 'viewport';
    m.content = 'width=' + w + ', height=' + h;
    document.head.appendChild(m);
    return el;
  };

  /* ---------- 数字滚动 ----------
     必须早收尾、留静止尾巴。原因：云渲染 settle 取的是「可见面积最大」的那一帧，
     数字一位一位变长会让面积跟着抖，最大值可能落在滚动中途——
     blk-punch-counter 就是这样，预览图上写 102 而不是 128。
     让它在 hold 之前就滚完，后面全程静止，最大面积就落在终值那一帧。 */
  BB.countUp = function (tl, sel, to, at, dur, o) {
    o = o || {};
    var el = (typeof sel === 'string' ? document.querySelector(sel) : sel);
    if (!el) return tl;
    var dec = o.decimals || 0;
    var pre = o.prefix || '', suf = o.suffix || '';
    var target = Number(to) || 0;
    el.textContent = pre + (0).toFixed(dec) + suf;
    return tl.to(el, {
      duration: o.d || dur || 1.0,
      ease: o.ease || 'power2.out',
      onUpdate: function () {
        var p = this.progress();
        var n = pre ? parseFloat(String(pre).replace(/[^\d.-]/g, '')) || 0 : 0;
        el.textContent = pre + (n + (target - n) * p).toFixed(dec) + suf;
      },
      onComplete: function () { el.textContent = pre + target.toFixed(dec) + suf; }
    }, at || 0);
  };

  /* ---------- 语义缓动（2026-10-16 方向 A）----------
     动机：全库 ease: 调用 8308 次，取值 95 种全是 GSAP 枚举；而
     CustomEase.min.js 早在 _lib/ 里躺着，1456 个素材却一次都没调用过。
     这里把那项已有能力接通，对外换成「说手感」而不是「说参数」的接口。

     【为什么必须降级】blocks.js 是所有模板的公共依赖，而绝大多数模板没引
     CustomEase 插件。所以：插件在 → 注册真正的自定义曲线；不在 → 用手感最接近的
     枚举顶上。宁可降级，也绝不让某条素材因为缺插件直接报错。

     【族白名单】积木风规范明令禁止 back / elastic / bounce，所以给它们
     commit()——起手狠→压下去→顶上来，力度接近过冲但 y 恒 ≤ 1。 */
  BB.easing = (function () {
    var CURVES = {
      /* 真过冲，只给允许 overshoot 的族（pop / mix / cog） */
      slam:      { over: true,  path: 'M0,0 C0.04,0.62 0.11,1.09 0.26,1.045 C0.42,1.01 0.58,1 0.74,1 L1,1',            fb: 'back.out(2.2)' },
      /* 积木风落定：双相形态换力度，数值不越界 */
      commit:    { over: false, path: 'M0,0 C0.13,0.55 0.22,0.92 0.36,0.86 C0.52,0.79 0.60,0.99 0.76,1 L1,1',  fb: 'power3.out' },
      breathe:   { over: false, path: 'M0,0 C0.34,0 0.44,1 1,1',                                          fb: 'sine.inOut' },
      jitter:    { over: true,  path: 'M0,0 C0.04,1.06 0.10,-0.06 0.18,1.03 C0.26,-0.04 0.33,0.97 0.41,1.01 C0.55,1.02 0.72,1 1,1', fb: 'elastic.out(1, 0.4)' },
      settleOut: { over: false, path: 'M0,0 C0.22,0.58 0.44,0.86 0.72,0.97 L1,1',                           fb: 'power2.out' },
      pop:       { over: true,  path: 'M0,0 C0.06,0.86 0.18,1.10 0.34,1.05 C0.55,0.99 0.72,1 1,1',            fb: 'back.out(2.8)' },
      wipe:      { over: false, path: 'M0,0 L0,1 L0.48,1 C0.72,1 0.88,1 1,1',                             fb: 'power3.inOut' }
    };

    /* 族 → 允不允许过冲。积木风七族 + blk 走零过冲，手绘原子动效族走真过冲。 */
    var LIBRARY = {
      kb: false, ent: false, ec: false, hook: false, wall: false,
      dq: false, lt: false, blk: false,
      pop: true, mix: true, cog: true,
      cogni: false, docu: false, cream: false, samp: false
    };

    var reg = {};

    function name(n) { return 'sce' + n; }

    function ensure(n) {
      if (reg[n]) return true;
      var c = CURVES[n];
      if (!c) return false;
      if (!global.CustomEase) { reg[n] = false; return false; }
      try {
        global.CustomEase.create(name(n), c.path);
        reg[n] = true;
      } catch (e) {
        reg[n] = false;
      }
      return reg[n];
    }

    function get(n) {
      return ensure(n) ? name(n) : CURVES[n].fb;
    }

    return {
      slam:      function () { return get('slam'); },
      commit:    function () { return get('commit'); },
      breathe:   function () { return get('breathe'); },
      jitter:    function () { return get('jitter'); },
      settleOut: function () { return get('settleOut'); },
      pop:       function () { return get('pop'); },
      wipe:      function () { return get('wipe'); },

      /** 按族自动选：true/族名 → slam，false → commit（零过冲） */
      for: function (allowOrFamily) {
        var allow = allowOrFamily;
        if (typeof allow === 'string') allow = LIBRARY[allow];
        return allow ? get('slam') : get('commit');
      },

      has:     function (n) { return !!CURVES[n]; },
      doc:     function (n) { return (CURVES[n] || {}).doc || '(无文档)'; },
      path:    function (n) { return (CURVES[n] || {}).path || ''; },
      over:    function (n) { return !!(CURVES[n] || {}).over; },
      /* 降级信息：审查时想知道哪些素材实际没用上自定义曲线 */
      degraded: function (n) { return !ensure(n); },
      list:    function () { return Object.keys(CURVES); },
      LIBRARY: LIBRARY
    };
  })();

  /* ---------- 收尾 ----------
     批量产出里每张的最后一拍统一用它。存在理由很具体：
     settle 取的是「可见面积最大」的一帧，而按压/回弹这类动画会让面积
     先缩后弹，中途就出现过一次局部最大值——settle 就会停在那儿，
     于是数字还停在滚动中途（预视图上写 1081 而不是 1130）。
     角标是**只增不减**的：它一出现，后面就只剩静止帧，
     面积最大值必然落在时间轴末端——那时所有数字都已经滚完。
     所以规矩是：所有 countUp 必须早于 B.finish() 收尾。 */
  BB.finish = function (tl, at) {
    var cs = document.querySelectorAll('.blk-corner');
    if (!cs.length) return tl;
    return tl.fromTo(cs,
      { scale: 0, opacity: 0, transformOrigin: 'center' },
      { scale: 1, opacity: 1, duration: 0.26, ease: 'back.out(2.6)', stagger: 0.04 },
      /* 必须排在所有动画之后。原来这里写的是 max(1.2, duration-0.35)，
         在 heavy 节奏下会比最后一张卡的落定还早 0.3s，于是「收尾」变成了
         「插队」——settle 挑中的成品帧反而没有收尾动作。 */
      at == null ? tl.duration() + 0.05 : at);
  };

  /* 时间轴尾部留一段静止，保证 settle 落在成品状态 */
  BB.hold = function (tl, at, d) {
    return tl.to({}, { duration: d == null ? 0.5 : d }, at == null ? tl.duration() : at);
  };

  /* ---------- 常用动画预设：统一节奏，批量产出才有family感 ---------- */
  BB.in = {
    /* 积木落位：从上方带旋转砸下来，落地瞬间硬阴影缩一下 */
    drop: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { y: -(o.dist || 160), rotate: (o.rot || -8), opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, duration: o.d || 0.55, ease: 'back.out(1.8)' }, at);
    },
    /* 积木弹出：back.out 过冲，积木感的关键。
       ⚠️ 大面积元素别用默认过冲。back.out(2.2) 的峰值比落定后大 10%，
       面积跟着涨 20%——settle 取的是「面积最大」那一帧，于是会挑中过冲峰，
       预览上是一张「还弹在半空、边缘已经出框」的图（blk-grid-* 122 个模板全中）。
       卡片这种大块请传 {ease:'power3.out', from:.86}：起始值缩到 0.86 照样有
       弹出的观感，面积单调涨到末帧，严格最大自然落在成品帧。 */
    pop: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { scale: o.from || 0.55, opacity: 0 },
        { scale: 1, opacity: 1, duration: o.d || 0.45,
          ease: o.ease || 'back.out(2.2)' }, at);
    },
    /* 逐字弹入 */
    letters: function (tl, sel, at, o) {
      o = o || {};
      var els = document.querySelectorAll(sel);
      return tl.fromTo(els,
        { y: 18, opacity: 0, rotate: -4 },
        { y: 0, opacity: 1, rotate: 0, duration: o.d || 0.4,
          ease: 'back.out(2.6)', stagger: o.s || 0.035 }, at);
    },
    /* 硬阴影按压：像真的被手指点了一下 */
    press: function (tl, sel, at, o) {
      o = o || {};
      return tl.to(sel, { boxShadow: '2px 2px 0 var(--ink)', duration: 0.08, ease: 'none' }, at)
        .to(sel, { boxShadow: o.sh || '6px 6px 0 var(--ink)', duration: 0.22, ease: 'back.out(3)' },
            at + 0.08);
    },
    /* 从侧边滑入贴边（列表行、进度条分段用） */
    slideX: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { x: o.from != null ? o.from : -60, opacity: 0 },
        { x: 0, opacity: 1, duration: o.d || 0.45, ease: o.ease || 'back.out(1.6)' }, at);
    },
    /* 盖章：从大砸小并压一下，认证/徽章类用 */
    stamp: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { scale: o.from || 2.4, rotate: (o.rot == null ? -14 : o.rot), opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.16, ease: 'power4.in' }, at)
        .to(sel, { scale: 1.14, duration: 0.09, ease: 'power2.out' }, at + 0.16)
        .to(sel, { scale: 1, duration: 0.26, ease: 'back.out(3)' }, at + 0.25);
    },
    /* 擦出：clip-path 从一边推开，适合已经铺满宽度的条（分隔带、遮罩） */
    wipe: function (tl, sel, at, o) {
      o = o || {};
      var dir = o.dir || 'left';
      var from = { left: dir === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' };
      return tl.fromTo(sel, from,
        { clipPath: 'inset(0 0% 0 0%)', duration: o.d || 0.5, ease: o.ease || 'power3.out' }, at);
    },
    /* 长宽：给 width:0 的填充条用。
       注意别拿 wipe() 去动 width:0 的元素——clip-path 改了但元素本身没宽度，
       结果就是条子压根不显示，而所有指标都判它正常（这个坑踩过）。 */
    grow: function (tl, sel, to, at, o) {
      o = o || {};
      return tl.fromTo(sel, { width: o.from || '0%' },
        { width: to, duration: o.d || 0.5, ease: o.ease || 'power3.out' }, at);
    },
    /* 翻牌：Y 轴旋转，榜单/数字切换用 */
    flip: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { rotateX: -90, opacity: 0, transformOrigin: 'center center' },
        { rotateX: 0, opacity: 1, duration: o.d || 0.5, ease: 'back.out(1.8)' }, at);
    },
    /* 逐字打出（配 steps 缓动，像终端） */
    typeOn: function (tl, sel, at, o) {
      o = o || {};
      var el = (typeof sel === 'string' ? document.querySelector(sel) : sel);
      if (!el) return tl;
      var full = el.getAttribute('data-full') || el.textContent;
      el.setAttribute('data-full', full);
      el.textContent = '';
      var o2 = { d: o.d || 0.9, s: o.s || 0.035 };
      return tl.to(el, {
        duration: o2.d, ease: 'steps(' + String(full.length) + ')',
        onUpdate: function () {
          var n = Math.round(this.progress() * full.length);
          el.textContent = full.slice(0, n);
        },
        onComplete: function () { el.textContent = full; }
      }, at || 0);
    },
    /* 抖动：警示、错误态 */
    shake: function (tl, sel, at, o) {
      o = o || {};
      return tl.fromTo(sel,
        { x: 0 }, { x: o.d || 0, duration: 0.07, repeat: 5, yoyo: true, ease: 'none' }, at);
    },
  };

  global.BBlocks = BB;
})(window);
