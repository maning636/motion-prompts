/* ── 规格包 · 应用器 ────────────────────────────────────────────────
   一行代码把整族模板切到另一套规格：
     BB.pack('cream');
   必须在模板建任何元素之前调用——CSS 自定义属性是继承的，
   建完元素再设 data-pack 也会生效（同一棵树上），
   但如果模板在 JS 里读 getComputedStyle 取色，就必须先设。

   为什么单独一个文件而不是并进 blocks.js：
   组件（components/*.html）是独立单文件、不引 blocks.js，
   它们只引 _lib/gsap.min.js。要让组件也能用包，
   这里导出的是一个纯函数字符串，模板可以内联它，不必引第二个脚本。 ── */

(function (global) {
  'use strict';
  var BB = global.BBlocks = global.BBlocks || {};

  /* 可用包名。模板的 pack 变量 options 应当与此一致 */
  BB.PACKS = ['dark', 'cream', 'mono', 'night'];
  var DEFAULT_PACK = 'dark';

  /* 挂上 data-pack。非法值静默退回默认——
     宁可看起来"用了默认风格"，也不要抛错把整个时间轴打断。 */
  BB.pack = function (name) {
    var n = BB.PACKS.indexOf(name) >= 0 ? name : DEFAULT_PACK;
    document.documentElement.setAttribute('data-pack', n);
    return n;
  };

  /* 读包里的某个值。模板里偶尔需要拿准确色值做 canvas 绘制
     （CSS 变量在 canvas 里取不到，必须解析成实际颜色）。 */
  BB.packVar = function (name, fallback) {
    var v = getComputedStyle(document.documentElement)
      .getPropertyValue('--pk-' + name).trim();
    return v || fallback || '';
  };

  /* 供组件内联：把 applyPack 变成一个自包含函数，
     组件里写  const applyPack = BB_packSrc();  然后 applyPack('cream') */
  BB.packSrc = function () {
    return BB.pack.toString().replace(/^function[\s\S]*?\{/, 'function (name) {');
  };
})(window);
