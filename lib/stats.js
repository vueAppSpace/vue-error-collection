(function (m) {
  m.MtaH5 = m.MtaH5 || {};
  MtaH5.hack = function () {
    var u = document.getElementsByName("MTAH5"),
      r = {
        conf: { autoReport: 1, senseHash: 1, senseQuery: 0, userReport: 0 },
        user: { user_id: "" },
        version: "2.0.18"
      };
    if (0 == u.length)
      for (var w = document.getElementsByTagName("script"), v = 0; v < w.length; v++)
        if ("undefined" !== typeof w[v].attributes.name && "MTAH5" == w[v].attributes.name.nodeValue) {
          u = [];
          u.push(w[v]);
          break;
        }
    0 < u.length &&
      (function () {
        "undefined" !== typeof u[0].attributes.sid && (r.conf.sid = u[0].attributes.sid.nodeValue);
        "undefined" !== typeof u[0].attributes.cid && (r.conf.cid = u[0].attributes.cid.nodeValue);
        "object" === typeof _mtac &&
          (function () {
            for (var n in _mtac)
              if ("ignoreParams" == n) {
                if ("string" == typeof _mtac[n] && /\w(,?)\w+/.test(_mtac[n])) {
                  var x = _mtac[n].split(",");
                  _mtac.hasOwnProperty(n) && (r.conf[n] = x);
                }
                "object" == typeof _mtac[n] && 0 < _mtac[n].length && _mtac.hasOwnProperty(n) && (r.conf[n] = _mtac[n]);
              } else _mtac.hasOwnProperty(n) && (r.conf[n] = _mtac[n]);
          })();
        "object" === typeof _user &&
          (function () {
            for (var n in _user) r.user.hasOwnProperty(n) && (r.user[n] = _user[n]);
          })();
      })();
    r.conf.user = r.user;
    r.conf.version = r.version;
    return r;
  };
})(this);
(function (m, u) {
  function r(a) {
    a = window.localStorage
      ? localStorage.getItem(a) || sessionStorage.getItem(a)
      : (a = document.cookie.match(new RegExp("(?:^|;\\s)" + a + "=(.*?)(?:;\\s|$)")))
      ? a[1]
      : "";
    return a;
  }
  function w(a, c, e) {
    if (window.localStorage)
      try {
        e ? localStorage.setItem(a, c) : sessionStorage.setItem(a, c);
      } catch (d) {}
    else {
      var b = window.location.host,
        t = { "com.cn": 1, "js.cn": 1, "net.cn": 1, "gov.cn": 1, "com.hk": 1, "co.nz": 1 },
        k = b.split(".");
      2 < k.length && (b = (t[k.slice(-2).join(".")] ? k.slice(-3) : k.slice(-2)).join("."));
      document.cookie = a + "=" + c + ";path=/;domain=" + b + (e ? ";expires=" + e : "");
    }
  }
  function v(a) {
    var c = {},
      e;
    if (void 0 === a) {
      var b = window.location;
      a = b.host;
      var t = b.pathname;
      var k = b.search.substr(1);
      var d = b.hash;
    } else
      (b = a.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?::\d+)?(\/[^\?\\"'\|:<>]*)?(?:\?([^'"\\<>#]*))?(?:#(\w+))?/i) || []),
        (a = b[1]),
        (t = b[2]),
        (k = b[3]),
        (d = b[4]);
    void 0 !== d && (d = d.replace(/"|'|<|>/gi, "M"));
    k &&
      (function () {
        for (var f = k.split("&"), l = 0, h = f.length; l < h; l++)
          if (-1 != f[l].indexOf("=")) {
            var g = f[l].indexOf("="),
              p = f[l].slice(0, g);
            g = f[l].slice(g + 1);
            c[p] = g;
          }
      })();
    k = (function () {
      if ("undefined" === typeof k) return k;
      for (var f = k.split("&"), l = [], h = 0, g = f.length; h < g; h++)
        if (-1 != f[h].indexOf("=")) {
          var p = f[h].indexOf("="),
            q = f[h].slice(0, p);
          p = f[h].slice(p + 1);
          (m.ignoreParams && -1 != m.ignoreParams.indexOf(q)) || l.push(q + "=" + p);
        }
      return l.join("&");
    })();
    d &&
      (function () {
        for (var f = 0 == d.indexOf("#") ? d.substr(1).split("&") : d.split("&"), l = 0, h = f.length; l < h; l++)
          if (-1 != f[l].indexOf("=")) {
            var g = f[l].indexOf("="),
              p = f[l].slice(0, g);
            g = f[l].slice(g + 1);
            if ("adtag" === p.toLowerCase()) {
              e = g;
              break;
            }
          }
      })();
    return { host: a, path: t, search: k, hash: d, param: c, adtag: e };
  }
  function n(a) {
    for (var c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], e = 10; 1 < e; e--) {
      var b = Math.floor(10 * Math.random()),
        t = c[b];
      c[b] = c[e - 1];
      c[e - 1] = t;
    }
    for (e = b = 0; 5 > e; e++) b = 10 * b + c[e];
    return (a || "") + (b + "" + +new Date());
  }
  function x() {
    var a = v(),
      c = { dm: a.host, pvi: "", si: "", url: a.path, arg: encodeURIComponent(a.search || "").substr(0, 512), ty: 0 };
    c.pvi = (function () {
      var e = new Date(new Date().getTime() + 63072e6).toGMTString();
      if (m.userReport) {
        var b = r("pgv_uid");
        (b && b == m.user.user_id) || ((c.ty = 1), w("pgv_uid", m.user.user_id, e));
        b = m.user.user_id;
      } else (b = r("pgv_pvi")), b || ((c.ty = 1), (b = n(void 0)), w("pgv_pvi", b, e));
      return b;
    })();
    c.si = (function () {
      var e = r("pgv_si");
      e || ((e = n("s")), w("pgv_si", e));
      return e;
    })();
    c.url = (function () {
      var e = a.path;
      m.senseQuery && (e += a.search ? "?" + encodeURIComponent(a.search || "").substr(0, 512) : "");
      m.senseHash && (e += a.hash ? encodeURIComponent(a.hash) : "");
      return e;
    })();
    return c;
  }
  function A() {
    var a = v(document.referrer),
      c = v();
    return {
      rdm: a.host,
      rurl: a.path,
      rarg: encodeURIComponent(a.search || "").substr(0, 512),
      adt: c.param.ADTAG || c.param.adtag || c.param.CKTAG || c.param.cktag || c.param.PTAG || c.param.ptag || c.adtag
    };
  }
  function y() {
    try {
      var a = navigator,
        c = screen || { width: "", height: "", colorDepth: "" },
        e = {
          scr: c.width + "x" + c.height,
          scl: c.colorDepth + "-bit",
          lg: (a.language || a.userLanguage).toLowerCase(),
          tz: new Date().getTimezoneOffset() / 60
        };
    } catch (b) {
      return {};
    }
    return e;
  }
  function z(a) {
    arr = {};
    if (a) {
      var c = arr,
        e = [],
        b;
      for (b in a) a.hasOwnProperty(b) && e.push(encodeURIComponent(b) + "=" + encodeURIComponent(a[b]));
      a = e.join(";");
      c.ext = a;
    }
    return arr;
  }
  function B(a) {
    a = a || {};
    for (var c in a) a.hasOwnProperty(c) && (m[c] = a[c]);
    if (m.sid)
      if (!m.userReport || (m.user.user_id && !parseInt(m.user.user_id, 10) !== m.user.user_id)) {
        a = [];
        for (
          var e = 0,
            b = [x(), A(), { r2: m.sid }, y(), z({ version: m.version }), { random: +new Date() }],
            t = b.length;
          e < t;
          e++
        )
          for (c in b[e]) b[e].hasOwnProperty(c) && a.push(c + "=" + ("undefined" == typeof b[e][c] ? "" : b[e][c]));
        var k = function (d) {
          console.log("d", d);
          d = Ta.src = "https://pingtas.qq.com/webview/pingd?" + d.join("&").toLowerCase();
          var f = new Image();
          Ta[m.sid] = f;
          f.onload =
            f.onerror =
            f.onabort =
              function () {
                f = f.onload = f.onerror = f.onabort = null;
                Ta[m.sid] = !0;
              };
          f.src = d;
        };
        k(a);
        m.performanceMonitor &&
          ((c = function () {
            if (window.performance) {
              var d = window.performance.timing;
              var f = { value: d.domainLookupEnd - d.domainLookupStart };
              var l = { value: d.connectEnd - d.connectStart },
                h = { value: d.responseStart - (d.requestStart || d.responseStart + 1) },
                g = d.responseEnd - d.responseStart;
              d.domContentLoadedEventStart ? 0 > g && (g = 0) : (g = -1);
              d = {
                domainLookupTime: f,
                connectTime: l,
                requestTime: h,
                resourcesLoadedTime: { value: g },
                domParsingTime: { value: d.domContentLoadedEventStart ? d.domInteractive - d.domLoading : -1 },
                domContentLoadedTime: {
                  value: d.domContentLoadedEventStart ? d.domContentLoadedEventStart - d.fetchStart : -1
                }
              };
            } else d = "";
            f = d;
            l = [];
            d = [];
            h = 0;
            g = [x(), { r2: m.cid }, y(), { random: +new Date() }];
            for (var p = g.length; h < p; h++)
              for (var q in g[h])
                g[h].hasOwnProperty(q) && d.push(q + "=" + ("undefined" == typeof g[h][q] ? "" : g[h][q]));
            for (q in f)
              f.hasOwnProperty(q) && ("domContentLoadedTime" == q ? d.push("r3=" + f[q].value) : l.push(f[q].value));
            q = z({ pfm: l.join("_"), version: m.version });
            d.push("ext=" + q.ext);
            k(d);
          }),
          "undefined" !== typeof window.performance &&
          "undefined" !== typeof window.performance.timing &&
          0 != window.performance.timing.loadEventEnd
            ? c()
            : window.attachEvent
            ? window.attachEvent("onload", c)
            : window.addEventListener && window.addEventListener("load", c, !1));
      } else
        console.log(
          "MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u9009\u62e9\u4e86\u7528\u6237\u7edf\u8ba1uv\uff0c\u8bf7\u8bbe\u7f6e\u4e1a\u52a1\u7684user_id\uff0c\u9700\u4e3aint\u7c7b\u578b"
        );
    else console.log("MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u6ca1\u6709\u8bbe\u7f6esid");
  }
  u.MtaH5 = u.MtaH5 || {};
  u.Ta = u.Ta || {};
  MtaH5.pgv = B;
  Ta.clickStat = MtaH5.clickStat = function (a, c) {
    console.log(1111111111);
    var e = MtaH5.hack ? MtaH5.hack() : "",
      b = {};
    e.conf &&
      (function () {
        var g = e.conf,
          p;
        for (p in g) g.hasOwnProperty(p) && (b[p] = g[p]);
      })();
    // if (b.cid) {
    var t = [],
      k = x(),
      d = { r2: m.sid };
    k.dm = "taclick";
    k.url = a.toString().toLowerCase();
    d.r2 = b.cid;
    d.r5 = (function (g) {
      g = "undefined" === typeof g ? {} : g;
      var p = [],
        q;
      for (q in g) g.hasOwnProperty(q) && p.push(q + "=" + encodeURIComponent(g[q]));
      return p.join(";");
    })(c);
    var f = 0;
    k = [k, A(), d, y(), z({ version: b.version }), { random: +new Date() }];
    for (d = k.length; f < d; f++)
      for (var l in k[f]) k[f].hasOwnProperty(l) && t.push(l + "=" + ("undefined" == typeof k[f][l] ? "" : k[f][l]));
    t = MtaH5.src = "https://pingtas.qq.com/webview/pingd?" + t.join("&");
    var h = new Image();
    MtaH5["click_" + b.sid] = h;
    h.onload =
      h.onerror =
      h.onabort =
        function () {
          h = h.onload = h.onerror = h.onabort = null;
          MtaH5[b.sid] = !0;
        };
    h.src = t;
    // } else
    //   console.log(
    //     "MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u6ca1\u6709\u8bbe\u7f6ecid,\u8bf7\u5230\u7ba1\u7406\u53f0\u5f00\u901a\u81ea\u5b9a\u4e49\u4e8b\u4ef6\u5e76\u66f4\u65b0\u7edf\u8ba1\u4ee3\u7801"
    //   );
  };
  Ta.clickShare = MtaH5.clickShare = function (a) {
    var c = MtaH5.hack ? MtaH5.hack() : "",
      e = {},
      b = v();
    b = b.param.CKTAG || b.param.ckatg;
    var t = "undefined" === typeof b ? [] : b.split(".");
    c.conf &&
      (function () {
        var h = c.conf,
          g;
        for (g in h) h.hasOwnProperty(g) && (e[g] = h[g]);
      })();
    if (e.cid) {
      b = [];
      var k = x(),
        d = { r2: m.sid };
      k.dm = "taclick_share";
      k.url = "mtah5-share-" + a;
      d.r2 = e.cid;
      d.r5 = (function (h, g) {
        var p = [];
        2 === h.length && h[0] == g && p.push(h[0] + "=" + h[1]);
        return p.join(";");
      })(t, "mtah5_share");
      a = 0;
      k = [k, A(), d, y(), z({ version: e.version }), { random: +new Date() }];
      for (d = k.length; a < d; a++)
        for (var f in k[a]) k[a].hasOwnProperty(f) && b.push(f + "=" + ("undefined" == typeof k[a][f] ? "" : k[a][f]));
      f = MtaH5.src = "https://pingtas.qq.com/webview/pingd?" + b.join("&").toLowerCase();
      var l = new Image();
      MtaH5["click_" + e.sid] = l;
      l.onload =
        l.onerror =
        l.onabort =
          function () {
            l = l.onload = l.onerror = l.onabort = null;
            MtaH5[e.sid] = !0;
          };
      l.src = f;
    }
  };
  var C = MtaH5.hack ? MtaH5.hack() : {};
  C.conf &&
    (function () {
      var a = C.conf,
        c;
      for (c in a) a.hasOwnProperty(c) && (m[c] = a[c]);
    })();
  m.autoReport && B();
})({}, this);
