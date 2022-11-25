!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(require("@firebase/app-compat"), require("@firebase/app"))
    : "function" == typeof define && define.amd
    ? define(["@firebase/app-compat", "@firebase/app"], t)
    : t(
        (e = "undefined" != typeof globalThis ? globalThis : e || self)
          .firebase,
        e.firebase.INTERNAL.modularAPIs
      );
})(this, function (qt, Lt) {
  "use strict";
  try {
    !function () {
      function e(e) {
        return e && "object" == typeof e && "default" in e ? e : { default: e };
      }
      var t = e(qt);
      function n() {
        return "object" == typeof indexedDB;
      }
      class o extends Error {
        constructor(e, t, n) {
          super(t),
            (this.code = e),
            (this.customData = n),
            (this.name = "FirebaseError"),
            Object.setPrototypeOf(this, o.prototype),
            Error.captureStackTrace &&
              Error.captureStackTrace(this, i.prototype.create);
        }
      }
      class i {
        constructor(e, t, n) {
          (this.service = e), (this.serviceName = t), (this.errors = n);
        }
        create(e, ...t) {
          var i,
            n = t[0] || {},
            a = `${this.service}/${e}`,
            r = this.errors[e],
            r = r
              ? ((i = n),
                r.replace(s, (e, t) => {
                  var n = i[t];
                  return null != n ? String(n) : `<${t}?>`;
                }))
              : "Error",
            r = `${this.serviceName}: ${r} (${a}).`;
          return new o(a, r, n);
        }
      }
      const s = /\{\$([^}]+)}/g;
      function a(e) {
        return e && e._delegate ? e._delegate : e;
      }
      var r =
        ((c.prototype.setInstantiationMode = function (e) {
          return (this.instantiationMode = e), this;
        }),
        (c.prototype.setMultipleInstances = function (e) {
          return (this.multipleInstances = e), this;
        }),
        (c.prototype.setServiceProps = function (e) {
          return (this.serviceProps = e), this;
        }),
        (c.prototype.setInstanceCreatedCallback = function (e) {
          return (this.onInstanceCreated = e), this;
        }),
        c);
      function c(e, t, n) {
        (this.name = e),
          (this.instanceFactory = t),
          (this.type = n),
          (this.multipleInstances = !1),
          (this.serviceProps = {}),
          (this.instantiationMode = "LAZY"),
          (this.onInstanceCreated = null);
      }
      function u(n) {
        return new Promise(function (e, t) {
          (n.onsuccess = function () {
            e(n.result);
          }),
            (n.onerror = function () {
              t(n.error);
            });
        });
      }
      function p(n, i, a) {
        var r,
          e = new Promise(function (e, t) {
            u((r = n[i].apply(n, a))).then(e, t);
          });
        return (e.request = r), e;
      }
      function d(e, n, t) {
        t.forEach(function (t) {
          Object.defineProperty(e.prototype, t, {
            get: function () {
              return this[n][t];
            },
            set: function (e) {
              this[n][t] = e;
            },
          });
        });
      }
      function l(t, n, i, e) {
        e.forEach(function (e) {
          e in i.prototype &&
            (t.prototype[e] = function () {
              return p(this[n], e, arguments);
            });
        });
      }
      function f(t, n, i, e) {
        e.forEach(function (e) {
          e in i.prototype &&
            (t.prototype[e] = function () {
              return this[n][e].apply(this[n], arguments);
            });
        });
      }
      function g(e, i, t, n) {
        n.forEach(function (n) {
          n in t.prototype &&
            (e.prototype[n] = function () {
              return (
                (e = this[i]),
                (t = p(e, n, arguments)).then(function (e) {
                  if (e) return new w(e, t.request);
                })
              );
              var e, t;
            });
        });
      }
      function h(e) {
        this._index = e;
      }
      function w(e, t) {
        (this._cursor = e), (this._request = t);
      }
      function m(e) {
        this._store = e;
      }
      function y(n) {
        (this._tx = n),
          (this.complete = new Promise(function (e, t) {
            (n.oncomplete = function () {
              e();
            }),
              (n.onerror = function () {
                t(n.error);
              }),
              (n.onabort = function () {
                t(n.error);
              });
          }));
      }
      function b(e, t, n) {
        (this._db = e), (this.oldVersion = t), (this.transaction = new y(n));
      }
      function v(e) {
        this._db = e;
      }
      function k(e, t, n) {
        var i = p(indexedDB, "open", [e, t]),
          a = i.request;
        return (
          a &&
            (a.onupgradeneeded = function (e) {
              n && n(new b(a.result, e.oldVersion, a.transaction));
            }),
          i.then(function (e) {
            return new v(e);
          })
        );
      }
      function I(e) {
        return p(indexedDB, "deleteDatabase", [e]);
      }
      d(h, "_index", ["name", "keyPath", "multiEntry", "unique"]),
        l(h, "_index", IDBIndex, [
          "get",
          "getKey",
          "getAll",
          "getAllKeys",
          "count",
        ]),
        g(h, "_index", IDBIndex, ["openCursor", "openKeyCursor"]),
        d(w, "_cursor", ["direction", "key", "primaryKey", "value"]),
        l(w, "_cursor", IDBCursor, ["update", "delete"]),
        ["advance", "continue", "continuePrimaryKey"].forEach(function (n) {
          n in IDBCursor.prototype &&
            (w.prototype[n] = function () {
              var t = this,
                e = arguments;
              return Promise.resolve().then(function () {
                return (
                  t._cursor[n].apply(t._cursor, e),
                  u(t._request).then(function (e) {
                    if (e) return new w(e, t._request);
                  })
                );
              });
            });
        }),
        (m.prototype.createIndex = function () {
          return new h(this._store.createIndex.apply(this._store, arguments));
        }),
        (m.prototype.index = function () {
          return new h(this._store.index.apply(this._store, arguments));
        }),
        d(m, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]),
        l(m, "_store", IDBObjectStore, [
          "put",
          "add",
          "delete",
          "clear",
          "get",
          "getAll",
          "getKey",
          "getAllKeys",
          "count",
        ]),
        g(m, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]),
        f(m, "_store", IDBObjectStore, ["deleteIndex"]),
        (y.prototype.objectStore = function () {
          return new m(this._tx.objectStore.apply(this._tx, arguments));
        }),
        d(y, "_tx", ["objectStoreNames", "mode"]),
        f(y, "_tx", IDBTransaction, ["abort"]),
        (b.prototype.createObjectStore = function () {
          return new m(this._db.createObjectStore.apply(this._db, arguments));
        }),
        d(b, "_db", ["name", "version", "objectStoreNames"]),
        f(b, "_db", IDBDatabase, ["deleteObjectStore", "close"]),
        (v.prototype.transaction = function () {
          return new y(this._db.transaction.apply(this._db, arguments));
        }),
        d(v, "_db", ["name", "version", "objectStoreNames"]),
        f(v, "_db", IDBDatabase, ["close"]),
        ["openCursor", "openKeyCursor"].forEach(function (r) {
          [m, h].forEach(function (e) {
            r in e.prototype &&
              (e.prototype[r.replace("open", "iterate")] = function () {
                var e,
                  t = ((e = arguments), Array.prototype.slice.call(e)),
                  n = t[t.length - 1],
                  i = this._store || this._index,
                  a = i[r].apply(i, t.slice(0, -1));
                a.onsuccess = function () {
                  n(a.result);
                };
              });
          });
        }),
        [h, m].forEach(function (e) {
          e.prototype.getAll ||
            (e.prototype.getAll = function (e, n) {
              var i = this,
                a = [];
              return new Promise(function (t) {
                i.iterateCursor(e, function (e) {
                  e
                    ? (a.push(e.value),
                      void 0 === n || a.length != n ? e.continue() : t(a))
                    : t(a);
                });
              });
            });
        });
      var S = "@firebase/installations",
        T = "0.5.2";
      const _ = 1e4,
        C = `w:${T}`,
        j = "FIS_v2",
        O = "https://firebaseinstallations.googleapis.com/v1",
        D = 36e5;
      var P, A, E, K, M;
      const N = new i("installations", "Installations", {
        "missing-app-config-values":
          'Missing App configuration value: "{$valueName}"',
        "not-registered": "Firebase Installation is not registered.",
        "installation-not-found": "Firebase Installation not found.",
        "request-failed":
          '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
        "app-offline": "Could not process request. Application offline.",
        "delete-pending-registration":
          "Can't delete installation while there is a pending registration request.",
      });
      function x(e) {
        return e instanceof o && e.code.includes("request-failed");
      }
      function $({ projectId: e }) {
        return `${O}/projects/${e}/installations`;
      }
      function F(e) {
        return {
          token: e.token,
          requestStatus: 2,
          expiresIn: ((e = e.expiresIn), Number(e.replace("s", "000"))),
          creationTime: Date.now(),
        };
      }
      async function B(e, t) {
        var n = (await t.json()).error;
        return N.create("request-failed", {
          requestName: e,
          serverCode: n.code,
          serverMessage: n.message,
          serverStatus: n.status,
        });
      }
      function q({ apiKey: e }) {
        return new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-goog-api-key": e,
        });
      }
      function L(e, { refreshToken: t }) {
        const n = q(e);
        return n.append("Authorization", ((t = t), `${j} ${t}`)), n;
      }
      async function V(e) {
        var t = await e();
        return 500 <= t.status && t.status < 600 ? e() : t;
      }
      function R(t) {
        return new Promise((e) => {
          setTimeout(e, t);
        });
      }
      const H = /^[cdef][\w-]{21}$/,
        W = "";
      function U() {
        try {
          const t = new Uint8Array(17),
            n = self.crypto || self.msCrypto;
          n.getRandomValues(t), (t[0] = 112 + (t[0] % 16));
          var e = (function (e) {
            const t = (function (e) {
              const t = btoa(String.fromCharCode(...e));
              return t.replace(/\+/g, "-").replace(/\//g, "_");
            })(e);
            return t.substr(0, 22);
          })(t);
          return H.test(e) ? e : W;
        } catch (e) {
          return W;
        }
      }
      function G(e) {
        return `${e.appName}!${e.appId}`;
      }
      const J = new Map();
      function z(e, t) {
        var n = G(e);
        Y(n, t),
          (function (e, t) {
            const n = (function () {
              !Q &&
                "BroadcastChannel" in self &&
                ((Q = new BroadcastChannel("[Firebase] FID Change")),
                (Q.onmessage = (e) => {
                  Y(e.data.key, e.data.fid);
                }));
              return Q;
            })();
            n && n.postMessage({ key: e, fid: t });
            0 === J.size && Q && (Q.close(), (Q = null));
          })(n, t);
      }
      function Y(e, t) {
        var n = J.get(e);
        if (n) for (const i of n) i(t);
      }
      let Q = null;
      const Z = "firebase-installations-store";
      let X = null;
      function ee() {
        return (
          (X =
            X ||
            k("firebase-installations-database", 1, (e) => {
              0 === e.oldVersion && e.createObjectStore(Z);
            })),
          X
        );
      }
      async function te(e, t) {
        var n = G(e);
        const i = await ee(),
          a = i.transaction(Z, "readwrite"),
          r = a.objectStore(Z);
        var o = await r.get(n);
        return (
          await r.put(t, n),
          await a.complete,
          (o && o.fid === t.fid) || z(e, t.fid),
          t
        );
      }
      async function ne(e) {
        var t = G(e);
        const n = await ee(),
          i = n.transaction(Z, "readwrite");
        await i.objectStore(Z).delete(t), await i.complete;
      }
      async function ie(e, t) {
        var n = G(e);
        const i = await ee(),
          a = i.transaction(Z, "readwrite"),
          r = a.objectStore(Z);
        var o = await r.get(n),
          s = t(o);
        return (
          void 0 === s ? await r.delete(n) : await r.put(s, n),
          await a.complete,
          !s || (o && o.fid === s.fid) || z(e, s.fid),
          s
        );
      }
      async function ae(n) {
        let i;
        var e = await ie(n, (e) => {
          var t = oe(e || { fid: U(), registrationStatus: 0 }),
            t = (function (e, t) {
              {
                if (0 !== t.registrationStatus)
                  return 1 === t.registrationStatus
                    ? {
                        installationEntry: t,
                        registrationPromise: (async function (e) {
                          let t = await re(e);
                          for (; 1 === t.registrationStatus; )
                            await R(100), (t = await re(e));
                          if (0 !== t.registrationStatus) return t;
                          {
                            var {
                              installationEntry: n,
                              registrationPromise: i,
                            } = await ae(e);
                            return i || n;
                          }
                        })(e),
                      }
                    : { installationEntry: t };
                if (!navigator.onLine) {
                  var n = Promise.reject(N.create("app-offline"));
                  return { installationEntry: t, registrationPromise: n };
                }
                var i = {
                    fid: t.fid,
                    registrationStatus: 1,
                    registrationTime: Date.now(),
                  },
                  n = (async function (t, n) {
                    try {
                      var e = await (async function (e, { fid: t }) {
                        const n = $(e);
                        var i = q(e),
                          a = {
                            fid: t,
                            authVersion: j,
                            appId: e.appId,
                            sdkVersion: C,
                          };
                        const r = {
                            method: "POST",
                            headers: i,
                            body: JSON.stringify(a),
                          },
                          o = await V(() => fetch(n, r));
                        if (o.ok) {
                          a = await o.json();
                          return {
                            fid: a.fid || t,
                            registrationStatus: 2,
                            refreshToken: a.refreshToken,
                            authToken: F(a.authToken),
                          };
                        }
                        throw await B("Create Installation", o);
                      })(t, n);
                      return te(t, e);
                    } catch (e) {
                      throw (
                        (x(e) && 409 === e.customData.serverCode
                          ? await ne(t)
                          : await te(t, { fid: n.fid, registrationStatus: 0 }),
                        e)
                      );
                    }
                  })(e, i);
                return { installationEntry: i, registrationPromise: n };
              }
            })(n, t);
          return (i = t.registrationPromise), t.installationEntry;
        });
        return e.fid === W
          ? { installationEntry: await i }
          : { installationEntry: e, registrationPromise: i };
      }
      function re(e) {
        return ie(e, (e) => {
          if (!e) throw N.create("installation-not-found");
          return oe(e);
        });
      }
      function oe(e) {
        return 1 === (t = e).registrationStatus &&
          t.registrationTime + _ < Date.now()
          ? { fid: e.fid, registrationStatus: 0 }
          : e;
        var t;
      }
      async function se({ appConfig: e, platformLoggerProvider: t }, n) {
        const i =
          (([a, r] = [e, n["fid"]]), `${$(a)}/${r}/authTokens:generate`);
        var a, r;
        const o = L(e, n),
          s = t.getImmediate({ optional: !0 });
        s && o.append("x-firebase-client", s.getPlatformInfoString());
        var c = { installation: { sdkVersion: C } };
        const u = { method: "POST", headers: o, body: JSON.stringify(c) },
          p = await V(() => fetch(i, u));
        if (p.ok) return F(await p.json());
        throw await B("Generate Auth Token", p);
      }
      async function ce(i, a = !1) {
        let r;
        var e = await ie(i.appConfig, (e) => {
          if (!pe(e)) throw N.create("not-registered");
          var t,
            n = e.authToken;
          if (
            a ||
            2 !== (t = n).requestStatus ||
            (function (e) {
              var t = Date.now();
              return t < e.creationTime || e.creationTime + e.expiresIn < t + D;
            })(t)
          ) {
            if (1 === n.requestStatus)
              return (
                (r = (async function (e, t) {
                  let n = await ue(e.appConfig);
                  for (; 1 === n.authToken.requestStatus; )
                    await R(100), (n = await ue(e.appConfig));
                  var i = n.authToken;
                  return 0 === i.requestStatus ? ce(e, t) : i;
                })(i, a)),
                e
              );
            if (!navigator.onLine) throw N.create("app-offline");
            n =
              ((t = e),
              (n = { requestStatus: 1, requestTime: Date.now() }),
              Object.assign(Object.assign({}, t), { authToken: n }));
            return (
              (r = (async function (t, n) {
                try {
                  var i = await se(t, n),
                    e = Object.assign(Object.assign({}, n), { authToken: i });
                  return await te(t.appConfig, e), i;
                } catch (e) {
                  throw (
                    (!x(e) ||
                    (401 !== e.customData.serverCode &&
                      404 !== e.customData.serverCode)
                      ? ((i = Object.assign(Object.assign({}, n), {
                          authToken: { requestStatus: 0 },
                        })),
                        await te(t.appConfig, i))
                      : await ne(t.appConfig),
                    e)
                  );
                }
              })(i, n)),
              n
            );
          }
          return e;
        });
        return r ? await r : e.authToken;
      }
      function ue(e) {
        return ie(e, (e) => {
          if (!pe(e)) throw N.create("not-registered");
          var t,
            n = e.authToken;
          return 1 === (t = n).requestStatus && t.requestTime + _ < Date.now()
            ? Object.assign(Object.assign({}, e), {
                authToken: { requestStatus: 0 },
              })
            : e;
        });
      }
      function pe(e) {
        return void 0 !== e && 2 === e.registrationStatus;
      }
      async function de(e, t = !1) {
        var n,
          i = e;
        return (
          (e = i.appConfig),
          await ((n = (await ae(e)).registrationPromise) && (await n)),
          (await ce(i, t)).token
        );
      }
      function le(e) {
        return N.create("missing-app-config-values", { valueName: e });
      }
      const fe = "installations",
        ge = (e) => {
          var t = e.getProvider("app").getImmediate();
          return {
            app: t,
            appConfig: (function (e) {
              if (!e || !e.options) throw le("App Configuration");
              if (!e.name) throw le("App Name");
              for (const t of ["projectId", "apiKey", "appId"])
                if (!e.options[t]) throw le(t);
              return {
                appName: e.name,
                projectId: e.options.projectId,
                apiKey: e.options.apiKey,
                appId: e.options.appId,
              };
            })(t),
            platformLoggerProvider: Lt._getProvider(t, "platform-logger"),
            _delete: () => Promise.resolve(),
          };
        },
        he = (e) => {
          var t = e.getProvider("app").getImmediate();
          const n = Lt._getProvider(t, fe).getImmediate();
          return {
            getId: () =>
              (async function (e) {
                var t = e;
                const { installationEntry: n, registrationPromise: i } =
                  await ae(t.appConfig);
                return (i || ce(t)).catch(console.error), n.fid;
              })(n),
            getToken: (e) => de(n, e),
          };
        };
      Lt._registerComponent(new r(fe, ge, "PUBLIC")),
        Lt._registerComponent(new r("installations-internal", he, "PRIVATE")),
        Lt.registerVersion(S, T),
        Lt.registerVersion(S, T, "esm2017");
      const we =  "/apps/bik/firebase-messaging-sw.js",
        me = "/",
        ye =
          "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
        be = "https://fcmregistrations.googleapis.com/v1",
        ve = "google.c.a.c_id",
        ke = "google.c.a.e";
      function Ie(e) {
        var t = new Uint8Array(e);
        const n = btoa(String.fromCharCode(...t));
        return n.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      ((P = M = M || {})[(P.DATA_MESSAGE = 1)] = "DATA_MESSAGE"),
        (P[(P.DISPLAY_NOTIFICATION = 3)] = "DISPLAY_NOTIFICATION"),
        ((M = A = A || {}).PUSH_RECEIVED = "push-received"),
        (M.NOTIFICATION_CLICKED = "notification-clicked");
      const Se = "fcm_token_details_db",
        Te = "fcm_token_object_Store";
      async function _e(r) {
        if ("databases" in indexedDB) {
          const t = await indexedDB.databases(),
            n = t.map((e) => e.name);
          if (!n.includes(Se)) return null;
        }
        let o = null;
        const e = await k(Se, 5, async (e) => {
          var t;
          if (!(e.oldVersion < 2) && e.objectStoreNames.contains(Te)) {
            const a = e.transaction.objectStore(Te);
            var n,
              i = await a.index("fcmSenderId").get(r);
            await a.clear(),
              i &&
                (2 === e.oldVersion
                  ? (n = i).auth &&
                    n.p256dh &&
                    n.endpoint &&
                    (o = {
                      token: n.fcmToken,
                      createTime:
                        null !== (t = n.createTime) && void 0 !== t
                          ? t
                          : Date.now(),
                      subscriptionOptions: {
                        auth: n.auth,
                        p256dh: n.p256dh,
                        endpoint: n.endpoint,
                        swScope: n.swScope,
                        vapidKey:
                          "string" == typeof n.vapidKey
                            ? n.vapidKey
                            : Ie(n.vapidKey),
                      },
                    })
                  : 3 === e.oldVersion
                  ? ((n = i),
                    (o = {
                      token: n.fcmToken,
                      createTime: n.createTime,
                      subscriptionOptions: {
                        auth: Ie(n.auth),
                        p256dh: Ie(n.p256dh),
                        endpoint: n.endpoint,
                        swScope: n.swScope,
                        vapidKey: Ie(n.vapidKey),
                      },
                    }))
                  : 4 === e.oldVersion &&
                    ((i = i),
                    (o = {
                      token: i.fcmToken,
                      createTime: i.createTime,
                      subscriptionOptions: {
                        auth: Ie(i.auth),
                        p256dh: Ie(i.p256dh),
                        endpoint: i.endpoint,
                        swScope: i.swScope,
                        vapidKey: Ie(i.vapidKey),
                      },
                    })));
          }
        });
        return (
          e.close(),
          await I(Se),
          await I("fcm_vapid_details_db"),
          await I("undefined"),
          (function (e) {
            if (!e || !e.subscriptionOptions) return !1;
            var t = e["subscriptionOptions"];
            return (
              "number" == typeof e.createTime &&
              0 < e.createTime &&
              "string" == typeof e.token &&
              0 < e.token.length &&
              "string" == typeof t.auth &&
              0 < t.auth.length &&
              "string" == typeof t.p256dh &&
              0 < t.p256dh.length &&
              "string" == typeof t.endpoint &&
              0 < t.endpoint.length &&
              "string" == typeof t.swScope &&
              0 < t.swScope.length &&
              "string" == typeof t.vapidKey &&
              0 < t.vapidKey.length
            );
          })(o)
            ? o
            : null
        );
      }
      const Ce = "firebase-messaging-database",
        je = 1,
        Oe = "firebase-messaging-store";
      let De = null;
      function Pe() {
        return (
          (De =
            De ||
            k(Ce, je, (e) => {
              0 === e.oldVersion && e.createObjectStore(Oe);
            })),
          De
        );
      }
      async function Ae(e) {
        var t = Ke(e);
        const n = await Pe();
        t = await n.transaction(Oe).objectStore(Oe).get(t);
        if (t) return t;
        t = await _e(e.appConfig.senderId);
        return t ? (await Ee(e, t), t) : void 0;
      }
      async function Ee(e, t) {
        var n = Ke(e);
        const i = await Pe(),
          a = i.transaction(Oe, "readwrite");
        return await a.objectStore(Oe).put(t, n), await a.complete, t;
      }
      function Ke({ appConfig: e }) {
        return e.appId;
      }
      const Me = new i("messaging", "Messaging", {
        "missing-app-config-values":
          'Missing App configuration value: "{$valueName}"',
        "only-available-in-window":
          "This method is available in a Window context.",
        "only-available-in-sw":
          "This method is available in a service worker context.",
        "permission-default":
          "The notification permission was not granted and dismissed instead.",
        "permission-blocked":
          "The notification permission was not granted and blocked instead.",
        "unsupported-browser":
          "This browser doesn't support the API's required to use the Firebase SDK.",
        "indexed-db-unsupported":
          "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
        "failed-service-worker-registration":
          "We are unable to register the default service worker. {$browserErrorMessage}",
        "token-subscribe-failed":
          "A problem occurred while subscribing the user to FCM: {$errorInfo}",
        "token-subscribe-no-token":
          "FCM returned no token when subscribing the user to push.",
        "token-unsubscribe-failed":
          "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
        "token-update-failed":
          "A problem occurred while updating the user from FCM: {$errorInfo}",
        "token-update-no-token":
          "FCM returned no token when updating the user to push.",
        "use-sw-after-get-token":
          "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
        "invalid-sw-registration":
          "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
        "invalid-bg-handler":
          "The input to setBackgroundMessageHandler() must be a function.",
        "invalid-vapid-key": "The public VAPID key must be a string.",
        "use-vapid-key-after-get-token":
          "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",
      });
      async function Ne(e, t) {
        var n = { method: "DELETE", headers: await $e(e) };
        try {
          const r = await fetch(`${xe(e.appConfig)}/${t}`, n);
          var i = await r.json();
          if (i.error) {
            var a = i.error.message;
            throw Me.create("token-unsubscribe-failed", { errorInfo: a });
          }
        } catch (e) {
          throw Me.create("token-unsubscribe-failed", { errorInfo: e });
        }
      }
      function xe({ projectId: e }) {
        return `${be}/projects/${e}/registrations`;
      }
      async function $e({ appConfig: e, installations: t }) {
        var n = await t.getToken();
        return new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-goog-api-key": e.apiKey,
          "x-goog-firebase-installations-auth": `FIS ${n}`,
        });
      }
      function Fe({ p256dh: e, auth: t, endpoint: n, vapidKey: i }) {
        const a = { web: { endpoint: n, auth: t, p256dh: e } };
        return i !== ye && (a.web.applicationPubKey = i), a;
      }
      const Be = 6048e5;
      async function qe(e) {
        const t = await (async function (e, t) {
          var n = await e.pushManager.getSubscription();
          if (n) return n;
          return e.pushManager.subscribe({
            userVisibleOnly: !0,
            applicationServerKey: (function (e) {
              var t = (e + "=".repeat((4 - (e.length % 4)) % 4))
                .replace(/\-/g, "+")
                .replace(/_/g, "/");
              const n = atob(t),
                i = new Uint8Array(n.length);
              for (let a = 0; a < n.length; ++a) i[a] = n.charCodeAt(a);
              return i;
            })(t),
          });
        })(e.swRegistration, e.vapidKey);
        var n,
          i,
          a,
          r,
          o,
          s = {
            vapidKey: e.vapidKey,
            swScope: e.swRegistration.scope,
            endpoint: t.endpoint,
            auth: Ie(t.getKey("auth")),
            p256dh: Ie(t.getKey("p256dh")),
          },
          c = await Ae(e.firebaseDependencies);
        if (c) {
          if (
            ((n = c.subscriptionOptions),
            (i = s.vapidKey === n.vapidKey),
            (a = s.endpoint === n.endpoint),
            (r = s.auth === n.auth),
            (o = s.p256dh === n.p256dh),
            i && a && r && o)
          )
            return Date.now() >= c.createTime + Be
              ? (async function (t, e) {
                  try {
                    var n = await (async function (e, t) {
                        var n = await $e(e),
                          i = Fe(t.subscriptionOptions),
                          i = {
                            method: "PATCH",
                            headers: n,
                            body: JSON.stringify(i),
                          };
                        let a;
                        try {
                          const r = await fetch(
                            `${xe(e.appConfig)}/${t.token}`,
                            i
                          );
                          a = await r.json();
                        } catch (e) {
                          throw Me.create("token-update-failed", {
                            errorInfo: e,
                          });
                        }
                        if (a.error) {
                          i = a.error.message;
                          throw Me.create("token-update-failed", {
                            errorInfo: i,
                          });
                        }
                        if (!a.token) throw Me.create("token-update-no-token");
                        return a.token;
                      })(t.firebaseDependencies, e),
                      i = Object.assign(Object.assign({}, e), {
                        token: n,
                        createTime: Date.now(),
                      });
                    return await Ee(t.firebaseDependencies, i), n;
                  } catch (e) {
                    throw (await Le(t), e);
                  }
                })(e, {
                  token: c.token,
                  createTime: Date.now(),
                  subscriptionOptions: s,
                })
              : c.token;
          try {
            await Ne(e.firebaseDependencies, c.token);
          } catch (e) {
            console.warn(e);
          }
          return Ve(e.firebaseDependencies, s);
        }
        return Ve(e.firebaseDependencies, s);
      }
      async function Le(e) {
        var t = await Ae(e.firebaseDependencies);
        t &&
          (await Ne(e.firebaseDependencies, t.token),
          await (async function (e) {
            var t = Ke(e);
            const n = await Pe(),
              i = n.transaction(Oe, "readwrite");
            await i.objectStore(Oe).delete(t), await i.complete;
          })(e.firebaseDependencies));
        const n = await e.swRegistration.pushManager.getSubscription();
        return !n || n.unsubscribe();
      }
      async function Ve(e, t) {
        var n = {
          token: await (async function (e, t) {
            var n = await $e(e),
              i = Fe(t),
              i = { method: "POST", headers: n, body: JSON.stringify(i) };
            let a;
            try {
              const r = await fetch(xe(e.appConfig), i);
              a = await r.json();
            } catch (e) {
              throw Me.create("token-subscribe-failed", { errorInfo: e });
            }
            if (a.error) {
              i = a.error.message;
              throw Me.create("token-subscribe-failed", { errorInfo: i });
            }
            if (!a.token) throw Me.create("token-subscribe-no-token");
            return a.token;
          })(e, t),
          createTime: Date.now(),
          subscriptionOptions: t,
        };
        return await Ee(e, n), n.token;
      }
      function Re(e) {
        var t,
          n,
          i,
          a = {
            from: e.from,
            collapseKey: e.collapse_key,
            messageId: e.fcm_message_id,
          };
        return (
          (n = a),
          (t = e).notification &&
            ((n.notification = {}),
            (i = t.notification.title) && (n.notification.title = i),
            (i = t.notification.body) && (n.notification.body = i),
            (i = t.notification.image) && (n.notification.image = i)),
          (t = a),
          (n = e).data && (t.data = n.data),
          (n = a),
          (e = e).fcmOptions &&
            ((n.fcmOptions = {}),
            (i = e.fcmOptions.link) && (n.fcmOptions.link = i),
            (i = e.fcmOptions.analytics_label) &&
              (n.fcmOptions.analyticsLabel = i)),
          a
        );
      }
      function He(e, t) {
        const n = [];
        for (let i = 0; i < e.length; i++)
          n.push(e.charAt(i)), i < t.length && n.push(t.charAt(i));
        return n.join("");
      }
      function We(e) {
        return Me.create("missing-app-config-values", { valueName: e });
      }
      He("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o"),
        He("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
      class Ue {
        constructor(e, t, n) {
          (this.deliveryMetricsExportedToBigQueryEnabled = !1),
            (this.onBackgroundMessageHandler = null),
            (this.onMessageHandler = null),
            (this.logEvents = []),
            (this.isLogServiceStarted = !1);
          var i = (function (e) {
            if (!e || !e.options) throw We("App Configuration Object");
            if (!e.name) throw We("App Name");
            var t = e["options"];
            for (const n of [
              "projectId",
              "apiKey",
              "appId",
              "messagingSenderId",
            ])
              if (!t[n]) throw We(n);
            return {
              appName: e.name,
              projectId: t.projectId,
              apiKey: t.apiKey,
              appId: t.appId,
              senderId: t.messagingSenderId,
            };
          })(e);
          this.firebaseDependencies = {
            app: e,
            appConfig: i,
            installations: t,
            analyticsProvider: n,
          };
        }
        _delete() {
          return Promise.resolve();
        }
      }
      async function Ge(e) {
        try {
          (e.swRegistration = await navigator.serviceWorker.register(we, {
            scope: me,
          })),
            e.swRegistration.update().catch(() => {});
        } catch (e) {
          throw Me.create("failed-service-worker-registration", {
            browserErrorMessage: e.message,
          });
        }
      }
      async function Je(e, t) {
        if (!navigator) throw Me.create("only-available-in-window");
        if (
          ("default" === Notification.permission &&
            (await Notification.requestPermission()),
          "granted" !== Notification.permission)
        )
          throw Me.create("permission-blocked");
        var n, i;
        return (
          (n = e),
          await ((i = null == t ? void 0 : t.vapidKey)
            ? (n.vapidKey = i)
            : n.vapidKey || (n.vapidKey = ye)),
          await (async function (e, t) {
            if (
              (t || e.swRegistration || (await Ge(e)), t || !e.swRegistration)
            ) {
              if (!(t instanceof ServiceWorkerRegistration))
                throw Me.create("invalid-sw-registration");
              e.swRegistration = t;
            }
          })(e, null == t ? void 0 : t.serviceWorkerRegistration),
          qe(e)
        );
      }
      async function ze(e, t, n) {
        var i = (function (e) {
          switch (e) {
            case A.NOTIFICATION_CLICKED:
              return "notification_open";
            case A.PUSH_RECEIVED:
              return "notification_foreground";
            default:
              throw new Error();
          }
        })(t);
        const a = await e.firebaseDependencies.analyticsProvider.get();
        a.logEvent(i, {
          message_id: n[ve],
          message_name: n["google.c.a.c_l"],
          message_time: n["google.c.a.ts"],
          message_device_time: Math.floor(Date.now() / 1e3),
        });
      }
      async function Ye(e, t) {
        var n,
          i = t.data;
        i.isFirebaseMessaging &&
          (e.onMessageHandler &&
            i.messageType === A.PUSH_RECEIVED &&
            ("function" == typeof e.onMessageHandler
              ? e.onMessageHandler(Re(i))
              : e.onMessageHandler.next(Re(i))),
          (n = i.data),
          "object" == typeof (t = n) &&
            t &&
            ve in t &&
            "1" === n[ke] &&
            (await ze(e, i.messageType, n)));
      }
      const Qe = "@firebase/messaging",
        Ze = (e) => {
          const t = new Ue(
            e.getProvider("app").getImmediate(),
            e.getProvider("installations-internal").getImmediate(),
            e.getProvider("analytics-internal")
          );
          return (
            navigator.serviceWorker.addEventListener("message", (e) =>
              Ye(t, e)
            ),
            t
          );
        },
        Xe = (e) => {
          const t = e.getProvider("messaging").getImmediate();
          return { getToken: (e) => Je(t, e) };
        };
      function et(e) {
        return (async function (e) {
          if (!navigator) throw Me.create("only-available-in-window");
          return e.swRegistration || (await Ge(e)), Le(e);
        })((e = a(e)));
      }
      function tt(e, t) {
        return (function (e, t) {
          if (!navigator) throw Me.create("only-available-in-window");
          return (
            (e.onMessageHandler = t),
            () => {
              e.onMessageHandler = null;
            }
          );
        })((e = a(e)), t);
      }
      Lt._registerComponent(new r("messaging", Ze, "PUBLIC")),
        Lt._registerComponent(new r("messaging-internal", Xe, "PRIVATE")),
        Lt.registerVersion(Qe, "0.9.2"),
        Lt.registerVersion(Qe, "0.9.2", "esm2017");
      const nt =
          "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
        it = "https://fcmregistrations.googleapis.com/v1",
        at = "FCM_MSG",
        rt = "google.c.a.c_id",
        ot = 3,
        st = 1;
      function ct(e) {
        var t = new Uint8Array(e);
        const n = btoa(String.fromCharCode(...t));
        return n.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      ((M = E = E || {})[(M.DATA_MESSAGE = 1)] = "DATA_MESSAGE"),
        (M[(M.DISPLAY_NOTIFICATION = 3)] = "DISPLAY_NOTIFICATION"),
        ((M = K = K || {}).PUSH_RECEIVED = "push-received"),
        (M.NOTIFICATION_CLICKED = "notification-clicked");
      const ut = "fcm_token_details_db",
        pt = "fcm_token_object_Store";
      async function dt(r) {
        if ("databases" in indexedDB) {
          const t = await indexedDB.databases(),
            n = t.map((e) => e.name);
          if (!n.includes(ut)) return null;
        }
        let o = null;
        const e = await k(ut, 5, async (e) => {
          var t;
          if (!(e.oldVersion < 2) && e.objectStoreNames.contains(pt)) {
            const a = e.transaction.objectStore(pt);
            var n,
              i = await a.index("fcmSenderId").get(r);
            await a.clear(),
              i &&
                (2 === e.oldVersion
                  ? (n = i).auth &&
                    n.p256dh &&
                    n.endpoint &&
                    (o = {
                      token: n.fcmToken,
                      createTime:
                        null !== (t = n.createTime) && void 0 !== t
                          ? t
                          : Date.now(),
                      subscriptionOptions: {
                        auth: n.auth,
                        p256dh: n.p256dh,
                        endpoint: n.endpoint,
                        swScope: n.swScope,
                        vapidKey:
                          "string" == typeof n.vapidKey
                            ? n.vapidKey
                            : ct(n.vapidKey),
                      },
                    })
                  : 3 === e.oldVersion
                  ? ((n = i),
                    (o = {
                      token: n.fcmToken,
                      createTime: n.createTime,
                      subscriptionOptions: {
                        auth: ct(n.auth),
                        p256dh: ct(n.p256dh),
                        endpoint: n.endpoint,
                        swScope: n.swScope,
                        vapidKey: ct(n.vapidKey),
                      },
                    }))
                  : 4 === e.oldVersion &&
                    ((i = i),
                    (o = {
                      token: i.fcmToken,
                      createTime: i.createTime,
                      subscriptionOptions: {
                        auth: ct(i.auth),
                        p256dh: ct(i.p256dh),
                        endpoint: i.endpoint,
                        swScope: i.swScope,
                        vapidKey: ct(i.vapidKey),
                      },
                    })));
          }
        });
        return (
          e.close(),
          await I(ut),
          await I("fcm_vapid_details_db"),
          await I("undefined"),
          (function (e) {
            if (!e || !e.subscriptionOptions) return !1;
            var t = e["subscriptionOptions"];
            return (
              "number" == typeof e.createTime &&
              0 < e.createTime &&
              "string" == typeof e.token &&
              0 < e.token.length &&
              "string" == typeof t.auth &&
              0 < t.auth.length &&
              "string" == typeof t.p256dh &&
              0 < t.p256dh.length &&
              "string" == typeof t.endpoint &&
              0 < t.endpoint.length &&
              "string" == typeof t.swScope &&
              0 < t.swScope.length &&
              "string" == typeof t.vapidKey &&
              0 < t.vapidKey.length
            );
          })(o)
            ? o
            : null
        );
      }
      const lt = "firebase-messaging-database",
        ft = 1,
        gt = "firebase-messaging-store";
      let ht = null;
      function wt() {
        return (
          (ht =
            ht ||
            k(lt, ft, (e) => {
              0 === e.oldVersion && e.createObjectStore(gt);
            })),
          ht
        );
      }
      async function mt(e) {
        var t = bt(e);
        const n = await wt();
        t = await n.transaction(gt).objectStore(gt).get(t);
        if (t) return t;
        t = await dt(e.appConfig.senderId);
        return t ? (await yt(e, t), t) : void 0;
      }
      async function yt(e, t) {
        var n = bt(e);
        const i = await wt(),
          a = i.transaction(gt, "readwrite");
        return await a.objectStore(gt).put(t, n), await a.complete, t;
      }
      function bt({ appConfig: e }) {
        return e.appId;
      }
      const vt = new i("messaging", "Messaging", {
        "missing-app-config-values":
          'Missing App configuration value: "{$valueName}"',
        "only-available-in-window":
          "This method is available in a Window context.",
        "only-available-in-sw":
          "This method is available in a service worker context.",
        "permission-default":
          "The notification permission was not granted and dismissed instead.",
        "permission-blocked":
          "The notification permission was not granted and blocked instead.",
        "unsupported-browser":
          "This browser doesn't support the API's required to use the Firebase SDK.",
        "indexed-db-unsupported":
          "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
        "failed-service-worker-registration":
          "We are unable to register the default service worker. {$browserErrorMessage}",
        "token-subscribe-failed":
          "A problem occurred while subscribing the user to FCM: {$errorInfo}",
        "token-subscribe-no-token":
          "FCM returned no token when subscribing the user to push.",
        "token-unsubscribe-failed":
          "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
        "token-update-failed":
          "A problem occurred while updating the user from FCM: {$errorInfo}",
        "token-update-no-token":
          "FCM returned no token when updating the user to push.",
        "use-sw-after-get-token":
          "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
        "invalid-sw-registration":
          "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
        "invalid-bg-handler":
          "The input to setBackgroundMessageHandler() must be a function.",
        "invalid-vapid-key": "The public VAPID key must be a string.",
        "use-vapid-key-after-get-token":
          "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",
      });
      async function kt(e, t) {
        var n = { method: "DELETE", headers: await St(e) };
        try {
          const r = await fetch(`${It(e.appConfig)}/${t}`, n);
          var i = await r.json();
          if (i.error) {
            var a = i.error.message;
            throw vt.create("token-unsubscribe-failed", { errorInfo: a });
          }
        } catch (e) {
          throw vt.create("token-unsubscribe-failed", { errorInfo: e });
        }
      }
      function It({ projectId: e }) {
        return `${it}/projects/${e}/registrations`;
      }
      async function St({ appConfig: e, installations: t }) {
        var n = await t.getToken();
        return new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-goog-api-key": e.apiKey,
          "x-goog-firebase-installations-auth": `FIS ${n}`,
        });
      }
      function Tt({ p256dh: e, auth: t, endpoint: n, vapidKey: i }) {
        const a = { web: { endpoint: n, auth: t, p256dh: e } };
        return i !== nt && (a.web.applicationPubKey = i), a;
      }
      async function _t(e) {
        const t = await (async function (e, t) {
          var n = await e.pushManager.getSubscription();
          if (n) return n;
          return e.pushManager.subscribe({
            userVisibleOnly: !0,
            applicationServerKey: (function (e) {
              var t = (e + "=".repeat((4 - (e.length % 4)) % 4))
                .replace(/\-/g, "+")
                .replace(/_/g, "/");
              const n = atob(t),
                i = new Uint8Array(n.length);
              for (let a = 0; a < n.length; ++a) i[a] = n.charCodeAt(a);
              return i;
            })(t),
          });
        })(e.swRegistration, e.vapidKey);
        var n,
          i,
          a,
          r,
          o,
          s = {
            vapidKey: e.vapidKey,
            swScope: e.swRegistration.scope,
            endpoint: t.endpoint,
            auth: ct(t.getKey("auth")),
            p256dh: ct(t.getKey("p256dh")),
          },
          c = await mt(e.firebaseDependencies);
        if (c) {
          if (
            ((n = c.subscriptionOptions),
            (i = s.vapidKey === n.vapidKey),
            (a = s.endpoint === n.endpoint),
            (r = s.auth === n.auth),
            (o = s.p256dh === n.p256dh),
            i && a && r && o)
          )
            return Date.now() >= c.createTime + 6048e5
              ? (async function (t, e) {
                  try {
                    var n = await (async function (e, t) {
                        var n = await St(e),
                          i = Tt(t.subscriptionOptions),
                          i = {
                            method: "PATCH",
                            headers: n,
                            body: JSON.stringify(i),
                          };
                        let a;
                        try {
                          const r = await fetch(
                            `${It(e.appConfig)}/${t.token}`,
                            i
                          );
                          a = await r.json();
                        } catch (e) {
                          throw vt.create("token-update-failed", {
                            errorInfo: e,
                          });
                        }
                        if (a.error) {
                          i = a.error.message;
                          throw vt.create("token-update-failed", {
                            errorInfo: i,
                          });
                        }
                        if (!a.token) throw vt.create("token-update-no-token");
                        return a.token;
                      })(t.firebaseDependencies, e),
                      i = Object.assign(Object.assign({}, e), {
                        token: n,
                        createTime: Date.now(),
                      });
                    return await yt(t.firebaseDependencies, i), n;
                  } catch (e) {
                    throw (await Ct(t), e);
                  }
                })(e, {
                  token: c.token,
                  createTime: Date.now(),
                  subscriptionOptions: s,
                })
              : c.token;
          try {
            await kt(e.firebaseDependencies, c.token);
          } catch (e) {
            console.warn(e);
          }
          return jt(e.firebaseDependencies, s);
        }
        return jt(e.firebaseDependencies, s);
      }
      async function Ct(e) {
        var t = await mt(e.firebaseDependencies);
        t &&
          (await kt(e.firebaseDependencies, t.token),
          await (async function (e) {
            var t = bt(e);
            const n = await wt(),
              i = n.transaction(gt, "readwrite");
            await i.objectStore(gt).delete(t), await i.complete;
          })(e.firebaseDependencies));
        const n = await e.swRegistration.pushManager.getSubscription();
        return !n || n.unsubscribe();
      }
      async function jt(e, t) {
        var n = {
          token: await (async function (e, t) {
            var n = await St(e),
              i = Tt(t),
              i = { method: "POST", headers: n, body: JSON.stringify(i) };
            let a;
            try {
              const r = await fetch(It(e.appConfig), i);
              a = await r.json();
            } catch (e) {
              throw vt.create("token-subscribe-failed", { errorInfo: e });
            }
            if (a.error) {
              i = a.error.message;
              throw vt.create("token-subscribe-failed", { errorInfo: i });
            }
            if (!a.token) throw vt.create("token-subscribe-no-token");
            return a.token;
          })(e, t),
          createTime: Date.now(),
          subscriptionOptions: t,
        };
        return await yt(e, n), n.token;
      }
      async function Ot(e, t) {
        var n = (function (e, t) {
          var n;
          const i = {};
          e.from && (i.project_number = e.from);
          e.fcm_message_id && (i.message_id = e.fcm_message_id);
          (i.instance_id = t),
            e.notification
              ? (i.message_type = E.DISPLAY_NOTIFICATION.toString())
              : (i.message_type = E.DATA_MESSAGE.toString());
          (i.sdk_platform = ot.toString()),
            (i.package_name = self.origin.replace(/(^\w+:|^)\/\//, "")),
            e.collapse_key && (i.collapse_key = e.collapse_key);
          (i.event = st.toString()),
            null !== (n = e.fcmOptions) &&
              void 0 !== n &&
              n.analytics_label &&
              (i.analytics_label =
                null === (n = e.fcmOptions) || void 0 === n
                  ? void 0
                  : n.analytics_label);
          return i;
        })(t, await e.firebaseDependencies.installations.getId());
        !(function (e, t) {
          const n = {};
          (n.event_time_ms = Math.floor(Date.now()).toString()),
            (n.source_extension_json_proto3 = JSON.stringify(t)),
            e.logEvents.push(n);
        })(e, n);
      }
      function Dt(e, t) {
        const n = [];
        for (let i = 0; i < e.length; i++)
          n.push(e.charAt(i)), i < t.length && n.push(t.charAt(i));
        return n.join("");
      }
      async function Pt(e, t) {
        var n = (function ({ data: e }) {
          if (!e) return null;
          try {
            return e.json();
          } catch (e) {
            return null;
          }
        })(e);
        if (n) {
          t.deliveryMetricsExportedToBigQueryEnabled && (await Ot(t, n));
          var i,
            a,
            r = await Et();
          if (
            r.some(
              (e) =>
                "visible" === e.visibilityState &&
                !e.url.startsWith("chrome-extension://")
            )
          )
            return (function (e, t) {
              (t.isFirebaseMessaging = !0), (t.messageType = K.PUSH_RECEIVED);
              for (const n of e) n.postMessage(t);
            })(r, n);
          n.notification &&
            (await (function (e) {
              var t = e["actions"],
                n = Notification["maxActions"];
              t &&
                n &&
                t.length > n &&
                console.warn(
                  `This browser only supports ${n} actions. The remaining actions will not be displayed.`
                );
              return self.registration.showNotification(
                null !== (n = e.title) && void 0 !== n ? n : "",
                e
              );
            })(
              (function (e) {
                const t = Object.assign({}, e.notification);
                return (t.data = { [at]: e }), t;
              })(n)
            )),
            t &&
              t.onBackgroundMessageHandler &&
              ((r = {
                from: (i = n).from,
                collapseKey: i.collapse_key,
                messageId: i.fcm_message_id,
              }),
              (n = r),
              (e = i).notification &&
                ((n.notification = {}),
                (a = e.notification.title) && (n.notification.title = a),
                (a = e.notification.body) && (n.notification.body = a),
                (a = e.notification.image) && (n.notification.image = a)),
              (e = r),
              (n = i).data && (e.data = n.data),
              (n = r),
              (i = i).fcmOptions &&
                ((n.fcmOptions = {}),
                (a = i.fcmOptions.link) && (n.fcmOptions.link = a),
                (a = i.fcmOptions.analytics_label) &&
                  (n.fcmOptions.analyticsLabel = a)),
              (r = r),
              "function" == typeof t.onBackgroundMessageHandler
                ? t.onBackgroundMessageHandler(r)
                : t.onBackgroundMessageHandler.next(r));
        }
      }
      async function At(e) {
        const t =
          null ===
            (r =
              null === (a = e.notification) || void 0 === a
                ? void 0
                : a.data) || void 0 === r
            ? void 0
            : r[at];
        if (t && !e.action) {
          e.stopImmediatePropagation(), e.notification.close();
          var n = (function (e) {
            var t;
            var n =
              null !==
                (t =
                  null === (t = e.fcmOptions) || void 0 === t
                    ? void 0
                    : t.link) && void 0 !== t
                ? t
                : null === (n = e.notification) || void 0 === n
                ? void 0
                : n.click_action;
            if (n) return n;
            return (function (e) {
              return "object" == typeof e && e && rt in e;
            })(e.data)
              ? self.location.origin
              : null;
          })(t);
          if (n) {
            var i,
              a = new URL(n, self.location.href),
              r = new URL(self.location.origin);
            if (a.host === r.host) {
              let e = await (async function (e) {
                var t = await Et();
                for (const i of t) {
                  var n = new URL(i.url, self.location.href);
                  if (e.host === n.host) return i;
                }
                return null;
              })(a);
              if (
                (e
                  ? (e = await e.focus())
                  : ((e = await self.clients.openWindow(n)),
                    (i = 3e3),
                    await new Promise((e) => {
                      setTimeout(e, i);
                    })),
                e)
              )
                return (
                  (t.messageType = K.NOTIFICATION_CLICKED),
                  (t.isFirebaseMessaging = !0),
                  e.postMessage(t)
                );
            }
          }
        }
      }
      function Et() {
        return self.clients.matchAll({
          type: "window",
          includeUncontrolled: !0,
        });
      }
      function Kt(e) {
        return vt.create("missing-app-config-values", { valueName: e });
      }
      Dt("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o"),
        Dt("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
      class Mt {
        constructor(e, t, n) {
          (this.deliveryMetricsExportedToBigQueryEnabled = !1),
            (this.onBackgroundMessageHandler = null),
            (this.onMessageHandler = null),
            (this.logEvents = []),
            (this.isLogServiceStarted = !1);
          var i = (function (e) {
            if (!e || !e.options) throw Kt("App Configuration Object");
            if (!e.name) throw Kt("App Name");
            var t = e["options"];
            for (const n of [
              "projectId",
              "apiKey",
              "appId",
              "messagingSenderId",
            ])
              if (!t[n]) throw Kt(n);
            return {
              appName: e.name,
              projectId: t.projectId,
              apiKey: t.apiKey,
              appId: t.appId,
              senderId: t.messagingSenderId,
            };
          })(e);
          this.firebaseDependencies = {
            app: e,
            appConfig: i,
            installations: t,
            analyticsProvider: n,
          };
        }
        _delete() {
          return Promise.resolve();
        }
      }
      const Nt = (e) => {
        const t = new Mt(
          e.getProvider("app").getImmediate(),
          e.getProvider("installations-internal").getImmediate(),
          e.getProvider("analytics-internal")
        );
        return (
          self.addEventListener("push", (e) => {
            e.waitUntil(Pt(e, t));
          }),
          self.addEventListener("pushsubscriptionchange", (e) => {
            e.waitUntil(
              (async function (e, t) {
                var n;
                (n = e["newSubscription"])
                  ? ((n = await mt(t.firebaseDependencies)),
                    await Ct(t),
                    (t.vapidKey =
                      null !==
                        (n =
                          null ===
                            (n = null == n ? void 0 : n.subscriptionOptions) ||
                          void 0 === n
                            ? void 0
                            : n.vapidKey) && void 0 !== n
                        ? n
                        : nt),
                    await _t(t))
                  : await Ct(t);
              })(e, t)
            );
          }),
          self.addEventListener("notificationclick", (e) => {
            e.waitUntil(At(e));
          }),
          t
        );
      };
      function xt(e, t) {
        return (function (e, t) {
          if (void 0 !== self.document) throw vt.create("only-available-in-sw");
          return (
            (e.onBackgroundMessageHandler = t),
            () => {
              e.onBackgroundMessageHandler = null;
            }
          );
        })((e = a(e)), t);
      }
      Lt._registerComponent(new r("messaging-sw", Nt, "PUBLIC"));
      class $t {
        constructor(e, t) {
          (this.app = e),
            (this._delegate = t),
            (this.app = e),
            (this._delegate = t);
        }
        async getToken(e) {
          return (async function (e, t) {
            return Je((e = a(e)), t);
          })(this._delegate, e);
        }
        async deleteToken() {
          return et(this._delegate);
        }
        onMessage(e) {
          return tt(this._delegate, e);
        }
        onBackgroundMessage(e) {
          return xt(this._delegate, e);
        }
      }
      const Ft = (e) =>
          self && "ServiceWorkerGlobalScope" in self
            ? new $t(
                e.getProvider("app-compat").getImmediate(),
                e.getProvider("messaging-sw").getImmediate()
              )
            : new $t(
                e.getProvider("app-compat").getImmediate(),
                e.getProvider("messaging").getImmediate()
              ),
        Bt = {
          isSupported: function () {
            return self && "ServiceWorkerGlobalScope" in self
              ? n() &&
                  "PushManager" in self &&
                  "Notification" in self &&
                  ServiceWorkerRegistration.prototype.hasOwnProperty(
                    "showNotification"
                  ) &&
                  PushSubscription.prototype.hasOwnProperty("getKey")
              : "undefined" != typeof window &&
                  n() &&
                  !(
                    "undefined" == typeof navigator || !navigator.cookieEnabled
                  ) &&
                  "serviceWorker" in navigator &&
                  "PushManager" in window &&
                  "Notification" in window &&
                  "fetch" in window &&
                  ServiceWorkerRegistration.prototype.hasOwnProperty(
                    "showNotification"
                  ) &&
                  PushSubscription.prototype.hasOwnProperty("getKey");
          },
        };
      t.default.INTERNAL.registerComponent(
        new r("messaging-compat", Ft, "PUBLIC").setServiceProps(Bt)
      ),
        t.default.registerVersion("@firebase/messaging-compat", "0.1.2");
    }.apply(this, arguments);
  } catch (e) {
    throw (
      (console.error(e),
      new Error(
        "Cannot instantiate firebase-messaging-compat.js - be sure to load firebase-app.js first."
      ))
    );
  }
});
//# sourceMappingURL=firebase-messaging-compat.js.map
