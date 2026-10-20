(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x2)(function(x2) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x2 + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/tweetnacl/nacl-fast.js
  var require_nacl_fast = __commonJS({
    "node_modules/tweetnacl/nacl-fast.js"(exports, module) {
      (function(nacl2) {
        "use strict";
        var gf = function(init) {
          var i2, r = new Float64Array(16);
          if (init) for (i2 = 0; i2 < init.length; i2++) r[i2] = init[i2];
          return r;
        };
        var randombytes = function() {
          throw new Error("no PRNG");
        };
        var _0 = new Uint8Array(16);
        var _9 = new Uint8Array(32);
        _9[0] = 9;
        var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
        function ts64(x2, i2, h, l) {
          x2[i2] = h >> 24 & 255;
          x2[i2 + 1] = h >> 16 & 255;
          x2[i2 + 2] = h >> 8 & 255;
          x2[i2 + 3] = h & 255;
          x2[i2 + 4] = l >> 24 & 255;
          x2[i2 + 5] = l >> 16 & 255;
          x2[i2 + 6] = l >> 8 & 255;
          x2[i2 + 7] = l & 255;
        }
        function vn(x2, xi, y, yi, n) {
          var i2, d = 0;
          for (i2 = 0; i2 < n; i2++) d |= x2[xi + i2] ^ y[yi + i2];
          return (1 & d - 1 >>> 8) - 1;
        }
        function crypto_verify_16(x2, xi, y, yi) {
          return vn(x2, xi, y, yi, 16);
        }
        function crypto_verify_32(x2, xi, y, yi) {
          return vn(x2, xi, y, yi, 32);
        }
        function core_salsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i2 = 0; i2 < 20; i2 += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          x0 = x0 + j0 | 0;
          x1 = x1 + j1 | 0;
          x2 = x2 + j2 | 0;
          x3 = x3 + j3 | 0;
          x4 = x4 + j4 | 0;
          x5 = x5 + j5 | 0;
          x6 = x6 + j6 | 0;
          x7 = x7 + j7 | 0;
          x8 = x8 + j8 | 0;
          x9 = x9 + j9 | 0;
          x10 = x10 + j10 | 0;
          x11 = x11 + j11 | 0;
          x12 = x12 + j12 | 0;
          x13 = x13 + j13 | 0;
          x14 = x14 + j14 | 0;
          x15 = x15 + j15 | 0;
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x1 >>> 0 & 255;
          o[5] = x1 >>> 8 & 255;
          o[6] = x1 >>> 16 & 255;
          o[7] = x1 >>> 24 & 255;
          o[8] = x2 >>> 0 & 255;
          o[9] = x2 >>> 8 & 255;
          o[10] = x2 >>> 16 & 255;
          o[11] = x2 >>> 24 & 255;
          o[12] = x3 >>> 0 & 255;
          o[13] = x3 >>> 8 & 255;
          o[14] = x3 >>> 16 & 255;
          o[15] = x3 >>> 24 & 255;
          o[16] = x4 >>> 0 & 255;
          o[17] = x4 >>> 8 & 255;
          o[18] = x4 >>> 16 & 255;
          o[19] = x4 >>> 24 & 255;
          o[20] = x5 >>> 0 & 255;
          o[21] = x5 >>> 8 & 255;
          o[22] = x5 >>> 16 & 255;
          o[23] = x5 >>> 24 & 255;
          o[24] = x6 >>> 0 & 255;
          o[25] = x6 >>> 8 & 255;
          o[26] = x6 >>> 16 & 255;
          o[27] = x6 >>> 24 & 255;
          o[28] = x7 >>> 0 & 255;
          o[29] = x7 >>> 8 & 255;
          o[30] = x7 >>> 16 & 255;
          o[31] = x7 >>> 24 & 255;
          o[32] = x8 >>> 0 & 255;
          o[33] = x8 >>> 8 & 255;
          o[34] = x8 >>> 16 & 255;
          o[35] = x8 >>> 24 & 255;
          o[36] = x9 >>> 0 & 255;
          o[37] = x9 >>> 8 & 255;
          o[38] = x9 >>> 16 & 255;
          o[39] = x9 >>> 24 & 255;
          o[40] = x10 >>> 0 & 255;
          o[41] = x10 >>> 8 & 255;
          o[42] = x10 >>> 16 & 255;
          o[43] = x10 >>> 24 & 255;
          o[44] = x11 >>> 0 & 255;
          o[45] = x11 >>> 8 & 255;
          o[46] = x11 >>> 16 & 255;
          o[47] = x11 >>> 24 & 255;
          o[48] = x12 >>> 0 & 255;
          o[49] = x12 >>> 8 & 255;
          o[50] = x12 >>> 16 & 255;
          o[51] = x12 >>> 24 & 255;
          o[52] = x13 >>> 0 & 255;
          o[53] = x13 >>> 8 & 255;
          o[54] = x13 >>> 16 & 255;
          o[55] = x13 >>> 24 & 255;
          o[56] = x14 >>> 0 & 255;
          o[57] = x14 >>> 8 & 255;
          o[58] = x14 >>> 16 & 255;
          o[59] = x14 >>> 24 & 255;
          o[60] = x15 >>> 0 & 255;
          o[61] = x15 >>> 8 & 255;
          o[62] = x15 >>> 16 & 255;
          o[63] = x15 >>> 24 & 255;
        }
        function core_hsalsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i2 = 0; i2 < 20; i2 += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x5 >>> 0 & 255;
          o[5] = x5 >>> 8 & 255;
          o[6] = x5 >>> 16 & 255;
          o[7] = x5 >>> 24 & 255;
          o[8] = x10 >>> 0 & 255;
          o[9] = x10 >>> 8 & 255;
          o[10] = x10 >>> 16 & 255;
          o[11] = x10 >>> 24 & 255;
          o[12] = x15 >>> 0 & 255;
          o[13] = x15 >>> 8 & 255;
          o[14] = x15 >>> 16 & 255;
          o[15] = x15 >>> 24 & 255;
          o[16] = x6 >>> 0 & 255;
          o[17] = x6 >>> 8 & 255;
          o[18] = x6 >>> 16 & 255;
          o[19] = x6 >>> 24 & 255;
          o[20] = x7 >>> 0 & 255;
          o[21] = x7 >>> 8 & 255;
          o[22] = x7 >>> 16 & 255;
          o[23] = x7 >>> 24 & 255;
          o[24] = x8 >>> 0 & 255;
          o[25] = x8 >>> 8 & 255;
          o[26] = x8 >>> 16 & 255;
          o[27] = x8 >>> 24 & 255;
          o[28] = x9 >>> 0 & 255;
          o[29] = x9 >>> 8 & 255;
          o[30] = x9 >>> 16 & 255;
          o[31] = x9 >>> 24 & 255;
        }
        function crypto_core_salsa20(out, inp, k, c) {
          core_salsa20(out, inp, k, c);
        }
        function crypto_core_hsalsa20(out, inp, k, c) {
          core_hsalsa20(out, inp, k, c);
        }
        var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
        function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
          var z = new Uint8Array(16), x2 = new Uint8Array(64);
          var u, i2;
          for (i2 = 0; i2 < 16; i2++) z[i2] = 0;
          for (i2 = 0; i2 < 8; i2++) z[i2] = n[i2];
          while (b >= 64) {
            crypto_core_salsa20(x2, z, k, sigma);
            for (i2 = 0; i2 < 64; i2++) c[cpos + i2] = m[mpos + i2] ^ x2[i2];
            u = 1;
            for (i2 = 8; i2 < 16; i2++) {
              u = u + (z[i2] & 255) | 0;
              z[i2] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
            mpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x2, z, k, sigma);
            for (i2 = 0; i2 < b; i2++) c[cpos + i2] = m[mpos + i2] ^ x2[i2];
          }
          return 0;
        }
        function crypto_stream_salsa20(c, cpos, b, n, k) {
          var z = new Uint8Array(16), x2 = new Uint8Array(64);
          var u, i2;
          for (i2 = 0; i2 < 16; i2++) z[i2] = 0;
          for (i2 = 0; i2 < 8; i2++) z[i2] = n[i2];
          while (b >= 64) {
            crypto_core_salsa20(x2, z, k, sigma);
            for (i2 = 0; i2 < 64; i2++) c[cpos + i2] = x2[i2];
            u = 1;
            for (i2 = 8; i2 < 16; i2++) {
              u = u + (z[i2] & 255) | 0;
              z[i2] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x2, z, k, sigma);
            for (i2 = 0; i2 < b; i2++) c[cpos + i2] = x2[i2];
          }
          return 0;
        }
        function crypto_stream(c, cpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i2 = 0; i2 < 8; i2++) sn[i2] = n[i2 + 16];
          return crypto_stream_salsa20(c, cpos, d, sn, s);
        }
        function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i2 = 0; i2 < 8; i2++) sn[i2] = n[i2 + 16];
          return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
        }
        var poly1305 = function(key) {
          this.buffer = new Uint8Array(16);
          this.r = new Uint16Array(10);
          this.h = new Uint16Array(10);
          this.pad = new Uint16Array(8);
          this.leftover = 0;
          this.fin = 0;
          var t0, t1, t2, t3, t4, t5, t6, t7;
          t0 = key[0] & 255 | (key[1] & 255) << 8;
          this.r[0] = t0 & 8191;
          t1 = key[2] & 255 | (key[3] & 255) << 8;
          this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
          t2 = key[4] & 255 | (key[5] & 255) << 8;
          this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
          t3 = key[6] & 255 | (key[7] & 255) << 8;
          this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
          t4 = key[8] & 255 | (key[9] & 255) << 8;
          this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
          this.r[5] = t4 >>> 1 & 8190;
          t5 = key[10] & 255 | (key[11] & 255) << 8;
          this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
          t6 = key[12] & 255 | (key[13] & 255) << 8;
          this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
          t7 = key[14] & 255 | (key[15] & 255) << 8;
          this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
          this.r[9] = t7 >>> 5 & 127;
          this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
          this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
          this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
          this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
          this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
          this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
          this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
          this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
        };
        poly1305.prototype.blocks = function(m, mpos, bytes) {
          var hibit = this.fin ? 0 : 1 << 11;
          var t0, t1, t2, t3, t4, t5, t6, t7, c;
          var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
          var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
          var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
          while (bytes >= 16) {
            t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
            h0 += t0 & 8191;
            t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
            h1 += (t0 >>> 13 | t1 << 3) & 8191;
            t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
            h2 += (t1 >>> 10 | t2 << 6) & 8191;
            t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
            h3 += (t2 >>> 7 | t3 << 9) & 8191;
            t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
            h4 += (t3 >>> 4 | t4 << 12) & 8191;
            h5 += t4 >>> 1 & 8191;
            t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
            h6 += (t4 >>> 14 | t5 << 2) & 8191;
            t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
            h7 += (t5 >>> 11 | t6 << 5) & 8191;
            t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
            h8 += (t6 >>> 8 | t7 << 8) & 8191;
            h9 += t7 >>> 5 | hibit;
            c = 0;
            d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h3 * (5 * r7);
            d0 += h4 * (5 * r6);
            c = d0 >>> 13;
            d0 &= 8191;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += d0 >>> 13;
            d0 &= 8191;
            d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h3 * (5 * r8);
            d1 += h4 * (5 * r7);
            c = d1 >>> 13;
            d1 &= 8191;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += d1 >>> 13;
            d1 &= 8191;
            d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h3 * (5 * r9);
            d2 += h4 * (5 * r8);
            c = d2 >>> 13;
            d2 &= 8191;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += d2 >>> 13;
            d2 &= 8191;
            d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h3 * r0;
            d3 += h4 * (5 * r9);
            c = d3 >>> 13;
            d3 &= 8191;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += d3 >>> 13;
            d3 &= 8191;
            d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h3 * r1;
            d4 += h4 * r0;
            c = d4 >>> 13;
            d4 &= 8191;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += d4 >>> 13;
            d4 &= 8191;
            d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h3 * r2;
            d5 += h4 * r1;
            c = d5 >>> 13;
            d5 &= 8191;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += d5 >>> 13;
            d5 &= 8191;
            d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h3 * r3;
            d6 += h4 * r2;
            c = d6 >>> 13;
            d6 &= 8191;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += d6 >>> 13;
            d6 &= 8191;
            d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h3 * r4;
            d7 += h4 * r3;
            c = d7 >>> 13;
            d7 &= 8191;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += d7 >>> 13;
            d7 &= 8191;
            d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h3 * r5;
            d8 += h4 * r4;
            c = d8 >>> 13;
            d8 &= 8191;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += d8 >>> 13;
            d8 &= 8191;
            d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h3 * r6;
            d9 += h4 * r5;
            c = d9 >>> 13;
            d9 &= 8191;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += d9 >>> 13;
            d9 &= 8191;
            c = (c << 2) + c | 0;
            c = c + d0 | 0;
            d0 = c & 8191;
            c = c >>> 13;
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h3 = d3;
            h4 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes -= 16;
          }
          this.h[0] = h0;
          this.h[1] = h1;
          this.h[2] = h2;
          this.h[3] = h3;
          this.h[4] = h4;
          this.h[5] = h5;
          this.h[6] = h6;
          this.h[7] = h7;
          this.h[8] = h8;
          this.h[9] = h9;
        };
        poly1305.prototype.finish = function(mac, macpos) {
          var g = new Uint16Array(10);
          var c, mask, f, i2;
          if (this.leftover) {
            i2 = this.leftover;
            this.buffer[i2++] = 1;
            for (; i2 < 16; i2++) this.buffer[i2] = 0;
            this.fin = 1;
            this.blocks(this.buffer, 0, 16);
          }
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          for (i2 = 2; i2 < 10; i2++) {
            this.h[i2] += c;
            c = this.h[i2] >>> 13;
            this.h[i2] &= 8191;
          }
          this.h[0] += c * 5;
          c = this.h[0] >>> 13;
          this.h[0] &= 8191;
          this.h[1] += c;
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          this.h[2] += c;
          g[0] = this.h[0] + 5;
          c = g[0] >>> 13;
          g[0] &= 8191;
          for (i2 = 1; i2 < 10; i2++) {
            g[i2] = this.h[i2] + c;
            c = g[i2] >>> 13;
            g[i2] &= 8191;
          }
          g[9] -= 1 << 13;
          mask = (c ^ 1) - 1;
          for (i2 = 0; i2 < 10; i2++) g[i2] &= mask;
          mask = ~mask;
          for (i2 = 0; i2 < 10; i2++) this.h[i2] = this.h[i2] & mask | g[i2];
          this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
          this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
          this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
          this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
          this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
          this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
          this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
          this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
          f = this.h[0] + this.pad[0];
          this.h[0] = f & 65535;
          for (i2 = 1; i2 < 8; i2++) {
            f = (this.h[i2] + this.pad[i2] | 0) + (f >>> 16) | 0;
            this.h[i2] = f & 65535;
          }
          mac[macpos + 0] = this.h[0] >>> 0 & 255;
          mac[macpos + 1] = this.h[0] >>> 8 & 255;
          mac[macpos + 2] = this.h[1] >>> 0 & 255;
          mac[macpos + 3] = this.h[1] >>> 8 & 255;
          mac[macpos + 4] = this.h[2] >>> 0 & 255;
          mac[macpos + 5] = this.h[2] >>> 8 & 255;
          mac[macpos + 6] = this.h[3] >>> 0 & 255;
          mac[macpos + 7] = this.h[3] >>> 8 & 255;
          mac[macpos + 8] = this.h[4] >>> 0 & 255;
          mac[macpos + 9] = this.h[4] >>> 8 & 255;
          mac[macpos + 10] = this.h[5] >>> 0 & 255;
          mac[macpos + 11] = this.h[5] >>> 8 & 255;
          mac[macpos + 12] = this.h[6] >>> 0 & 255;
          mac[macpos + 13] = this.h[6] >>> 8 & 255;
          mac[macpos + 14] = this.h[7] >>> 0 & 255;
          mac[macpos + 15] = this.h[7] >>> 8 & 255;
        };
        poly1305.prototype.update = function(m, mpos, bytes) {
          var i2, want;
          if (this.leftover) {
            want = 16 - this.leftover;
            if (want > bytes)
              want = bytes;
            for (i2 = 0; i2 < want; i2++)
              this.buffer[this.leftover + i2] = m[mpos + i2];
            bytes -= want;
            mpos += want;
            this.leftover += want;
            if (this.leftover < 16)
              return;
            this.blocks(this.buffer, 0, 16);
            this.leftover = 0;
          }
          if (bytes >= 16) {
            want = bytes - bytes % 16;
            this.blocks(m, mpos, want);
            mpos += want;
            bytes -= want;
          }
          if (bytes) {
            for (i2 = 0; i2 < bytes; i2++)
              this.buffer[this.leftover + i2] = m[mpos + i2];
            this.leftover += bytes;
          }
        };
        function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
          var s = new poly1305(k);
          s.update(m, mpos, n);
          s.finish(out, outpos);
          return 0;
        }
        function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
          var x2 = new Uint8Array(16);
          crypto_onetimeauth(x2, 0, m, mpos, n, k);
          return crypto_verify_16(h, hpos, x2, 0);
        }
        function crypto_secretbox(c, m, d, n, k) {
          var i2;
          if (d < 32) return -1;
          crypto_stream_xor(c, 0, m, 0, d, n, k);
          crypto_onetimeauth(c, 16, c, 32, d - 32, c);
          for (i2 = 0; i2 < 16; i2++) c[i2] = 0;
          return 0;
        }
        function crypto_secretbox_open(m, c, d, n, k) {
          var i2;
          var x2 = new Uint8Array(32);
          if (d < 32) return -1;
          crypto_stream(x2, 0, 32, n, k);
          if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x2) !== 0) return -1;
          crypto_stream_xor(m, 0, c, 0, d, n, k);
          for (i2 = 0; i2 < 32; i2++) m[i2] = 0;
          return 0;
        }
        function set25519(r, a) {
          var i2;
          for (i2 = 0; i2 < 16; i2++) r[i2] = a[i2] | 0;
        }
        function car25519(o) {
          var i2, v, c = 1;
          for (i2 = 0; i2 < 16; i2++) {
            v = o[i2] + c + 65535;
            c = Math.floor(v / 65536);
            o[i2] = v - c * 65536;
          }
          o[0] += c - 1 + 37 * (c - 1);
        }
        function sel25519(p, q, b) {
          var t, c = ~(b - 1);
          for (var i2 = 0; i2 < 16; i2++) {
            t = c & (p[i2] ^ q[i2]);
            p[i2] ^= t;
            q[i2] ^= t;
          }
        }
        function pack25519(o, n) {
          var i2, j, b;
          var m = gf(), t = gf();
          for (i2 = 0; i2 < 16; i2++) t[i2] = n[i2];
          car25519(t);
          car25519(t);
          car25519(t);
          for (j = 0; j < 2; j++) {
            m[0] = t[0] - 65517;
            for (i2 = 1; i2 < 15; i2++) {
              m[i2] = t[i2] - 65535 - (m[i2 - 1] >> 16 & 1);
              m[i2 - 1] &= 65535;
            }
            m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
            b = m[15] >> 16 & 1;
            m[14] &= 65535;
            sel25519(t, m, 1 - b);
          }
          for (i2 = 0; i2 < 16; i2++) {
            o[2 * i2] = t[i2] & 255;
            o[2 * i2 + 1] = t[i2] >> 8;
          }
        }
        function neq25519(a, b) {
          var c = new Uint8Array(32), d = new Uint8Array(32);
          pack25519(c, a);
          pack25519(d, b);
          return crypto_verify_32(c, 0, d, 0);
        }
        function par25519(a) {
          var d = new Uint8Array(32);
          pack25519(d, a);
          return d[0] & 1;
        }
        function unpack25519(o, n) {
          var i2;
          for (i2 = 0; i2 < 16; i2++) o[i2] = n[2 * i2] + (n[2 * i2 + 1] << 8);
          o[15] &= 32767;
        }
        function A(o, a, b) {
          for (var i2 = 0; i2 < 16; i2++) o[i2] = a[i2] + b[i2];
        }
        function Z(o, a, b) {
          for (var i2 = 0; i2 < 16; i2++) o[i2] = a[i2] - b[i2];
        }
        function M(o, a, b) {
          var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
          v = a[0];
          t0 += v * b0;
          t1 += v * b1;
          t2 += v * b2;
          t3 += v * b3;
          t4 += v * b4;
          t5 += v * b5;
          t6 += v * b6;
          t7 += v * b7;
          t8 += v * b8;
          t9 += v * b9;
          t10 += v * b10;
          t11 += v * b11;
          t12 += v * b12;
          t13 += v * b13;
          t14 += v * b14;
          t15 += v * b15;
          v = a[1];
          t1 += v * b0;
          t2 += v * b1;
          t3 += v * b2;
          t4 += v * b3;
          t5 += v * b4;
          t6 += v * b5;
          t7 += v * b6;
          t8 += v * b7;
          t9 += v * b8;
          t10 += v * b9;
          t11 += v * b10;
          t12 += v * b11;
          t13 += v * b12;
          t14 += v * b13;
          t15 += v * b14;
          t16 += v * b15;
          v = a[2];
          t2 += v * b0;
          t3 += v * b1;
          t4 += v * b2;
          t5 += v * b3;
          t6 += v * b4;
          t7 += v * b5;
          t8 += v * b6;
          t9 += v * b7;
          t10 += v * b8;
          t11 += v * b9;
          t12 += v * b10;
          t13 += v * b11;
          t14 += v * b12;
          t15 += v * b13;
          t16 += v * b14;
          t17 += v * b15;
          v = a[3];
          t3 += v * b0;
          t4 += v * b1;
          t5 += v * b2;
          t6 += v * b3;
          t7 += v * b4;
          t8 += v * b5;
          t9 += v * b6;
          t10 += v * b7;
          t11 += v * b8;
          t12 += v * b9;
          t13 += v * b10;
          t14 += v * b11;
          t15 += v * b12;
          t16 += v * b13;
          t17 += v * b14;
          t18 += v * b15;
          v = a[4];
          t4 += v * b0;
          t5 += v * b1;
          t6 += v * b2;
          t7 += v * b3;
          t8 += v * b4;
          t9 += v * b5;
          t10 += v * b6;
          t11 += v * b7;
          t12 += v * b8;
          t13 += v * b9;
          t14 += v * b10;
          t15 += v * b11;
          t16 += v * b12;
          t17 += v * b13;
          t18 += v * b14;
          t19 += v * b15;
          v = a[5];
          t5 += v * b0;
          t6 += v * b1;
          t7 += v * b2;
          t8 += v * b3;
          t9 += v * b4;
          t10 += v * b5;
          t11 += v * b6;
          t12 += v * b7;
          t13 += v * b8;
          t14 += v * b9;
          t15 += v * b10;
          t16 += v * b11;
          t17 += v * b12;
          t18 += v * b13;
          t19 += v * b14;
          t20 += v * b15;
          v = a[6];
          t6 += v * b0;
          t7 += v * b1;
          t8 += v * b2;
          t9 += v * b3;
          t10 += v * b4;
          t11 += v * b5;
          t12 += v * b6;
          t13 += v * b7;
          t14 += v * b8;
          t15 += v * b9;
          t16 += v * b10;
          t17 += v * b11;
          t18 += v * b12;
          t19 += v * b13;
          t20 += v * b14;
          t21 += v * b15;
          v = a[7];
          t7 += v * b0;
          t8 += v * b1;
          t9 += v * b2;
          t10 += v * b3;
          t11 += v * b4;
          t12 += v * b5;
          t13 += v * b6;
          t14 += v * b7;
          t15 += v * b8;
          t16 += v * b9;
          t17 += v * b10;
          t18 += v * b11;
          t19 += v * b12;
          t20 += v * b13;
          t21 += v * b14;
          t22 += v * b15;
          v = a[8];
          t8 += v * b0;
          t9 += v * b1;
          t10 += v * b2;
          t11 += v * b3;
          t12 += v * b4;
          t13 += v * b5;
          t14 += v * b6;
          t15 += v * b7;
          t16 += v * b8;
          t17 += v * b9;
          t18 += v * b10;
          t19 += v * b11;
          t20 += v * b12;
          t21 += v * b13;
          t22 += v * b14;
          t23 += v * b15;
          v = a[9];
          t9 += v * b0;
          t10 += v * b1;
          t11 += v * b2;
          t12 += v * b3;
          t13 += v * b4;
          t14 += v * b5;
          t15 += v * b6;
          t16 += v * b7;
          t17 += v * b8;
          t18 += v * b9;
          t19 += v * b10;
          t20 += v * b11;
          t21 += v * b12;
          t22 += v * b13;
          t23 += v * b14;
          t24 += v * b15;
          v = a[10];
          t10 += v * b0;
          t11 += v * b1;
          t12 += v * b2;
          t13 += v * b3;
          t14 += v * b4;
          t15 += v * b5;
          t16 += v * b6;
          t17 += v * b7;
          t18 += v * b8;
          t19 += v * b9;
          t20 += v * b10;
          t21 += v * b11;
          t22 += v * b12;
          t23 += v * b13;
          t24 += v * b14;
          t25 += v * b15;
          v = a[11];
          t11 += v * b0;
          t12 += v * b1;
          t13 += v * b2;
          t14 += v * b3;
          t15 += v * b4;
          t16 += v * b5;
          t17 += v * b6;
          t18 += v * b7;
          t19 += v * b8;
          t20 += v * b9;
          t21 += v * b10;
          t22 += v * b11;
          t23 += v * b12;
          t24 += v * b13;
          t25 += v * b14;
          t26 += v * b15;
          v = a[12];
          t12 += v * b0;
          t13 += v * b1;
          t14 += v * b2;
          t15 += v * b3;
          t16 += v * b4;
          t17 += v * b5;
          t18 += v * b6;
          t19 += v * b7;
          t20 += v * b8;
          t21 += v * b9;
          t22 += v * b10;
          t23 += v * b11;
          t24 += v * b12;
          t25 += v * b13;
          t26 += v * b14;
          t27 += v * b15;
          v = a[13];
          t13 += v * b0;
          t14 += v * b1;
          t15 += v * b2;
          t16 += v * b3;
          t17 += v * b4;
          t18 += v * b5;
          t19 += v * b6;
          t20 += v * b7;
          t21 += v * b8;
          t22 += v * b9;
          t23 += v * b10;
          t24 += v * b11;
          t25 += v * b12;
          t26 += v * b13;
          t27 += v * b14;
          t28 += v * b15;
          v = a[14];
          t14 += v * b0;
          t15 += v * b1;
          t16 += v * b2;
          t17 += v * b3;
          t18 += v * b4;
          t19 += v * b5;
          t20 += v * b6;
          t21 += v * b7;
          t22 += v * b8;
          t23 += v * b9;
          t24 += v * b10;
          t25 += v * b11;
          t26 += v * b12;
          t27 += v * b13;
          t28 += v * b14;
          t29 += v * b15;
          v = a[15];
          t15 += v * b0;
          t16 += v * b1;
          t17 += v * b2;
          t18 += v * b3;
          t19 += v * b4;
          t20 += v * b5;
          t21 += v * b6;
          t22 += v * b7;
          t23 += v * b8;
          t24 += v * b9;
          t25 += v * b10;
          t26 += v * b11;
          t27 += v * b12;
          t28 += v * b13;
          t29 += v * b14;
          t30 += v * b15;
          t0 += 38 * t16;
          t1 += 38 * t17;
          t2 += 38 * t18;
          t3 += 38 * t19;
          t4 += 38 * t20;
          t5 += 38 * t21;
          t6 += 38 * t22;
          t7 += 38 * t23;
          t8 += 38 * t24;
          t9 += 38 * t25;
          t10 += 38 * t26;
          t11 += 38 * t27;
          t12 += 38 * t28;
          t13 += 38 * t29;
          t14 += 38 * t30;
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          o[0] = t0;
          o[1] = t1;
          o[2] = t2;
          o[3] = t3;
          o[4] = t4;
          o[5] = t5;
          o[6] = t6;
          o[7] = t7;
          o[8] = t8;
          o[9] = t9;
          o[10] = t10;
          o[11] = t11;
          o[12] = t12;
          o[13] = t13;
          o[14] = t14;
          o[15] = t15;
        }
        function S(o, a) {
          M(o, a, a);
        }
        function inv25519(o, i2) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++) c[a] = i2[a];
          for (a = 253; a >= 0; a--) {
            S(c, c);
            if (a !== 2 && a !== 4) M(c, c, i2);
          }
          for (a = 0; a < 16; a++) o[a] = c[a];
        }
        function pow2523(o, i2) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++) c[a] = i2[a];
          for (a = 250; a >= 0; a--) {
            S(c, c);
            if (a !== 1) M(c, c, i2);
          }
          for (a = 0; a < 16; a++) o[a] = c[a];
        }
        function crypto_scalarmult(q, n, p) {
          var z = new Uint8Array(32);
          var x2 = new Float64Array(80), r, i2;
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
          for (i2 = 0; i2 < 31; i2++) z[i2] = n[i2];
          z[31] = n[31] & 127 | 64;
          z[0] &= 248;
          unpack25519(x2, p);
          for (i2 = 0; i2 < 16; i2++) {
            b[i2] = x2[i2];
            d[i2] = a[i2] = c[i2] = 0;
          }
          a[0] = d[0] = 1;
          for (i2 = 254; i2 >= 0; --i2) {
            r = z[i2 >>> 3] >>> (i2 & 7) & 1;
            sel25519(a, b, r);
            sel25519(c, d, r);
            A(e, a, c);
            Z(a, a, c);
            A(c, b, d);
            Z(b, b, d);
            S(d, e);
            S(f, a);
            M(a, c, a);
            M(c, b, e);
            A(e, a, c);
            Z(a, a, c);
            S(b, a);
            Z(c, d, f);
            M(a, c, _121665);
            A(a, a, d);
            M(c, c, a);
            M(a, d, f);
            M(d, b, x2);
            S(b, e);
            sel25519(a, b, r);
            sel25519(c, d, r);
          }
          for (i2 = 0; i2 < 16; i2++) {
            x2[i2 + 16] = a[i2];
            x2[i2 + 32] = c[i2];
            x2[i2 + 48] = b[i2];
            x2[i2 + 64] = d[i2];
          }
          var x32 = x2.subarray(32);
          var x16 = x2.subarray(16);
          inv25519(x32, x32);
          M(x16, x16, x32);
          pack25519(q, x16);
          return 0;
        }
        function crypto_scalarmult_base(q, n) {
          return crypto_scalarmult(q, n, _9);
        }
        function crypto_box_keypair(y, x2) {
          randombytes(x2, 32);
          return crypto_scalarmult_base(y, x2);
        }
        function crypto_box_beforenm(k, y, x2) {
          var s = new Uint8Array(32);
          crypto_scalarmult(s, x2, y);
          return crypto_core_hsalsa20(k, _0, s, sigma);
        }
        var crypto_box_afternm = crypto_secretbox;
        var crypto_box_open_afternm = crypto_secretbox_open;
        function crypto_box(c, m, d, n, y, x2) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x2);
          return crypto_box_afternm(c, m, d, n, k);
        }
        function crypto_box_open(m, c, d, n, y, x2) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x2);
          return crypto_box_open_afternm(m, c, d, n, k);
        }
        var K = [
          1116352408,
          3609767458,
          1899447441,
          602891725,
          3049323471,
          3964484399,
          3921009573,
          2173295548,
          961987163,
          4081628472,
          1508970993,
          3053834265,
          2453635748,
          2937671579,
          2870763221,
          3664609560,
          3624381080,
          2734883394,
          310598401,
          1164996542,
          607225278,
          1323610764,
          1426881987,
          3590304994,
          1925078388,
          4068182383,
          2162078206,
          991336113,
          2614888103,
          633803317,
          3248222580,
          3479774868,
          3835390401,
          2666613458,
          4022224774,
          944711139,
          264347078,
          2341262773,
          604807628,
          2007800933,
          770255983,
          1495990901,
          1249150122,
          1856431235,
          1555081692,
          3175218132,
          1996064986,
          2198950837,
          2554220882,
          3999719339,
          2821834349,
          766784016,
          2952996808,
          2566594879,
          3210313671,
          3203337956,
          3336571891,
          1034457026,
          3584528711,
          2466948901,
          113926993,
          3758326383,
          338241895,
          168717936,
          666307205,
          1188179964,
          773529912,
          1546045734,
          1294757372,
          1522805485,
          1396182291,
          2643833823,
          1695183700,
          2343527390,
          1986661051,
          1014477480,
          2177026350,
          1206759142,
          2456956037,
          344077627,
          2730485921,
          1290863460,
          2820302411,
          3158454273,
          3259730800,
          3505952657,
          3345764771,
          106217008,
          3516065817,
          3606008344,
          3600352804,
          1432725776,
          4094571909,
          1467031594,
          275423344,
          851169720,
          430227734,
          3100823752,
          506948616,
          1363258195,
          659060556,
          3750685593,
          883997877,
          3785050280,
          958139571,
          3318307427,
          1322822218,
          3812723403,
          1537002063,
          2003034995,
          1747873779,
          3602036899,
          1955562222,
          1575990012,
          2024104815,
          1125592928,
          2227730452,
          2716904306,
          2361852424,
          442776044,
          2428436474,
          593698344,
          2756734187,
          3733110249,
          3204031479,
          2999351573,
          3329325298,
          3815920427,
          3391569614,
          3928383900,
          3515267271,
          566280711,
          3940187606,
          3454069534,
          4118630271,
          4000239992,
          116418474,
          1914138554,
          174292421,
          2731055270,
          289380356,
          3203993006,
          460393269,
          320620315,
          685471733,
          587496836,
          852142971,
          1086792851,
          1017036298,
          365543100,
          1126000580,
          2618297676,
          1288033470,
          3409855158,
          1501505948,
          4234509866,
          1607167915,
          987167468,
          1816402316,
          1246189591
        ];
        function crypto_hashblocks_hl(hh, hl, m, n) {
          var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i2, j, h, l, a, b, c, d;
          var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
          var pos = 0;
          while (n >= 128) {
            for (i2 = 0; i2 < 16; i2++) {
              j = 8 * i2 + pos;
              wh[i2] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
              wl[i2] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
            }
            for (i2 = 0; i2 < 80; i2++) {
              bh0 = ah0;
              bh1 = ah1;
              bh2 = ah2;
              bh3 = ah3;
              bh4 = ah4;
              bh5 = ah5;
              bh6 = ah6;
              bh7 = ah7;
              bl0 = al0;
              bl1 = al1;
              bl2 = al2;
              bl3 = al3;
              bl4 = al4;
              bl5 = al5;
              bl6 = al6;
              bl7 = al7;
              h = ah7;
              l = al7;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
              l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah4 & ah5 ^ ~ah4 & ah6;
              l = al4 & al5 ^ ~al4 & al6;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = K[i2 * 2];
              l = K[i2 * 2 + 1];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = wh[i2 % 16];
              l = wl[i2 % 16];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              th = c & 65535 | d << 16;
              tl = a & 65535 | b << 16;
              h = th;
              l = tl;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
              l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
              l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh7 = c & 65535 | d << 16;
              bl7 = a & 65535 | b << 16;
              h = bh3;
              l = bl3;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = th;
              l = tl;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh3 = c & 65535 | d << 16;
              bl3 = a & 65535 | b << 16;
              ah1 = bh0;
              ah2 = bh1;
              ah3 = bh2;
              ah4 = bh3;
              ah5 = bh4;
              ah6 = bh5;
              ah7 = bh6;
              ah0 = bh7;
              al1 = bl0;
              al2 = bl1;
              al3 = bl2;
              al4 = bl3;
              al5 = bl4;
              al6 = bl5;
              al7 = bl6;
              al0 = bl7;
              if (i2 % 16 === 15) {
                for (j = 0; j < 16; j++) {
                  h = wh[j];
                  l = wl[j];
                  a = l & 65535;
                  b = l >>> 16;
                  c = h & 65535;
                  d = h >>> 16;
                  h = wh[(j + 9) % 16];
                  l = wl[(j + 9) % 16];
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 1) % 16];
                  tl = wl[(j + 1) % 16];
                  h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                  l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 14) % 16];
                  tl = wl[(j + 14) % 16];
                  h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                  l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  b += a >>> 16;
                  c += b >>> 16;
                  d += c >>> 16;
                  wh[j] = c & 65535 | d << 16;
                  wl[j] = a & 65535 | b << 16;
                }
              }
            }
            h = ah0;
            l = al0;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[0];
            l = hl[0];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[0] = ah0 = c & 65535 | d << 16;
            hl[0] = al0 = a & 65535 | b << 16;
            h = ah1;
            l = al1;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[1];
            l = hl[1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[1] = ah1 = c & 65535 | d << 16;
            hl[1] = al1 = a & 65535 | b << 16;
            h = ah2;
            l = al2;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[2];
            l = hl[2];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[2] = ah2 = c & 65535 | d << 16;
            hl[2] = al2 = a & 65535 | b << 16;
            h = ah3;
            l = al3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[3];
            l = hl[3];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[3] = ah3 = c & 65535 | d << 16;
            hl[3] = al3 = a & 65535 | b << 16;
            h = ah4;
            l = al4;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[4];
            l = hl[4];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[4] = ah4 = c & 65535 | d << 16;
            hl[4] = al4 = a & 65535 | b << 16;
            h = ah5;
            l = al5;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[5];
            l = hl[5];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[5] = ah5 = c & 65535 | d << 16;
            hl[5] = al5 = a & 65535 | b << 16;
            h = ah6;
            l = al6;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[6];
            l = hl[6];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[6] = ah6 = c & 65535 | d << 16;
            hl[6] = al6 = a & 65535 | b << 16;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[7];
            l = hl[7];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[7] = ah7 = c & 65535 | d << 16;
            hl[7] = al7 = a & 65535 | b << 16;
            pos += 128;
            n -= 128;
          }
          return n;
        }
        function crypto_hash(out, m, n) {
          var hh = new Int32Array(8), hl = new Int32Array(8), x2 = new Uint8Array(256), i2, b = n;
          hh[0] = 1779033703;
          hh[1] = 3144134277;
          hh[2] = 1013904242;
          hh[3] = 2773480762;
          hh[4] = 1359893119;
          hh[5] = 2600822924;
          hh[6] = 528734635;
          hh[7] = 1541459225;
          hl[0] = 4089235720;
          hl[1] = 2227873595;
          hl[2] = 4271175723;
          hl[3] = 1595750129;
          hl[4] = 2917565137;
          hl[5] = 725511199;
          hl[6] = 4215389547;
          hl[7] = 327033209;
          crypto_hashblocks_hl(hh, hl, m, n);
          n %= 128;
          for (i2 = 0; i2 < n; i2++) x2[i2] = m[b - n + i2];
          x2[n] = 128;
          n = 256 - 128 * (n < 112 ? 1 : 0);
          x2[n - 9] = 0;
          ts64(x2, n - 8, b / 536870912 | 0, b << 3);
          crypto_hashblocks_hl(hh, hl, x2, n);
          for (i2 = 0; i2 < 8; i2++) ts64(out, 8 * i2, hh[i2], hl[i2]);
          return 0;
        }
        function add(p, q) {
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
          Z(a, p[1], p[0]);
          Z(t, q[1], q[0]);
          M(a, a, t);
          A(b, p[0], p[1]);
          A(t, q[0], q[1]);
          M(b, b, t);
          M(c, p[3], q[3]);
          M(c, c, D2);
          M(d, p[2], q[2]);
          A(d, d, d);
          Z(e, b, a);
          Z(f, d, c);
          A(g, d, c);
          A(h, b, a);
          M(p[0], e, f);
          M(p[1], h, g);
          M(p[2], g, f);
          M(p[3], e, h);
        }
        function cswap(p, q, b) {
          var i2;
          for (i2 = 0; i2 < 4; i2++) {
            sel25519(p[i2], q[i2], b);
          }
        }
        function pack(r, p) {
          var tx = gf(), ty = gf(), zi = gf();
          inv25519(zi, p[2]);
          M(tx, p[0], zi);
          M(ty, p[1], zi);
          pack25519(r, ty);
          r[31] ^= par25519(tx) << 7;
        }
        function scalarmult(p, q, s) {
          var b, i2;
          set25519(p[0], gf0);
          set25519(p[1], gf1);
          set25519(p[2], gf1);
          set25519(p[3], gf0);
          for (i2 = 255; i2 >= 0; --i2) {
            b = s[i2 / 8 | 0] >> (i2 & 7) & 1;
            cswap(p, q, b);
            add(q, p);
            add(p, p);
            cswap(p, q, b);
          }
        }
        function scalarbase(p, s) {
          var q = [gf(), gf(), gf(), gf()];
          set25519(q[0], X);
          set25519(q[1], Y);
          set25519(q[2], gf1);
          M(q[3], X, Y);
          scalarmult(p, q, s);
        }
        function crypto_sign_keypair(pk, sk, seeded) {
          var d = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()];
          var i2;
          if (!seeded) randombytes(sk, 32);
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          scalarbase(p, d);
          pack(pk, p);
          for (i2 = 0; i2 < 32; i2++) sk[i2 + 32] = pk[i2];
          return 0;
        }
        var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
        function modL(r, x2) {
          var carry, i2, j, k;
          for (i2 = 63; i2 >= 32; --i2) {
            carry = 0;
            for (j = i2 - 32, k = i2 - 12; j < k; ++j) {
              x2[j] += carry - 16 * x2[i2] * L[j - (i2 - 32)];
              carry = Math.floor((x2[j] + 128) / 256);
              x2[j] -= carry * 256;
            }
            x2[j] += carry;
            x2[i2] = 0;
          }
          carry = 0;
          for (j = 0; j < 32; j++) {
            x2[j] += carry - (x2[31] >> 4) * L[j];
            carry = x2[j] >> 8;
            x2[j] &= 255;
          }
          for (j = 0; j < 32; j++) x2[j] -= carry * L[j];
          for (i2 = 0; i2 < 32; i2++) {
            x2[i2 + 1] += x2[i2] >> 8;
            r[i2] = x2[i2] & 255;
          }
        }
        function reduce(r) {
          var x2 = new Float64Array(64), i2;
          for (i2 = 0; i2 < 64; i2++) x2[i2] = r[i2];
          for (i2 = 0; i2 < 64; i2++) r[i2] = 0;
          modL(r, x2);
        }
        function crypto_sign(sm, m, n, sk) {
          var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
          var i2, j, x2 = new Float64Array(64);
          var p = [gf(), gf(), gf(), gf()];
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          var smlen = n + 64;
          for (i2 = 0; i2 < n; i2++) sm[64 + i2] = m[i2];
          for (i2 = 0; i2 < 32; i2++) sm[32 + i2] = d[32 + i2];
          crypto_hash(r, sm.subarray(32), n + 32);
          reduce(r);
          scalarbase(p, r);
          pack(sm, p);
          for (i2 = 32; i2 < 64; i2++) sm[i2] = sk[i2];
          crypto_hash(h, sm, n + 64);
          reduce(h);
          for (i2 = 0; i2 < 64; i2++) x2[i2] = 0;
          for (i2 = 0; i2 < 32; i2++) x2[i2] = r[i2];
          for (i2 = 0; i2 < 32; i2++) {
            for (j = 0; j < 32; j++) {
              x2[i2 + j] += h[i2] * d[j];
            }
          }
          modL(sm.subarray(32), x2);
          return smlen;
        }
        function unpackneg(r, p) {
          var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
          set25519(r[2], gf1);
          unpack25519(r[1], p);
          S(num, r[1]);
          M(den, num, D);
          Z(num, num, r[2]);
          A(den, r[2], den);
          S(den2, den);
          S(den4, den2);
          M(den6, den4, den2);
          M(t, den6, num);
          M(t, t, den);
          pow2523(t, t);
          M(t, t, num);
          M(t, t, den);
          M(t, t, den);
          M(r[0], t, den);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num)) M(r[0], r[0], I);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num)) return -1;
          if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
          M(r[3], r[0], r[1]);
          return 0;
        }
        function crypto_sign_open(m, sm, n, pk) {
          var i2;
          var t = new Uint8Array(32), h = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
          if (n < 64) return -1;
          if (unpackneg(q, pk)) return -1;
          for (i2 = 0; i2 < n; i2++) m[i2] = sm[i2];
          for (i2 = 0; i2 < 32; i2++) m[i2 + 32] = pk[i2];
          crypto_hash(h, m, n);
          reduce(h);
          scalarmult(p, q, h);
          scalarbase(q, sm.subarray(32));
          add(p, q);
          pack(t, p);
          n -= 64;
          if (crypto_verify_32(sm, 0, t, 0)) {
            for (i2 = 0; i2 < n; i2++) m[i2] = 0;
            return -1;
          }
          for (i2 = 0; i2 < n; i2++) m[i2] = sm[i2 + 64];
          return n;
        }
        var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
        nacl2.lowlevel = {
          crypto_core_hsalsa20,
          crypto_stream_xor,
          crypto_stream,
          crypto_stream_salsa20_xor,
          crypto_stream_salsa20,
          crypto_onetimeauth,
          crypto_onetimeauth_verify,
          crypto_verify_16,
          crypto_verify_32,
          crypto_secretbox,
          crypto_secretbox_open,
          crypto_scalarmult,
          crypto_scalarmult_base,
          crypto_box_beforenm,
          crypto_box_afternm,
          crypto_box,
          crypto_box_open,
          crypto_box_keypair,
          crypto_hash,
          crypto_sign,
          crypto_sign_keypair,
          crypto_sign_open,
          crypto_secretbox_KEYBYTES,
          crypto_secretbox_NONCEBYTES,
          crypto_secretbox_ZEROBYTES,
          crypto_secretbox_BOXZEROBYTES,
          crypto_scalarmult_BYTES,
          crypto_scalarmult_SCALARBYTES,
          crypto_box_PUBLICKEYBYTES,
          crypto_box_SECRETKEYBYTES,
          crypto_box_BEFORENMBYTES,
          crypto_box_NONCEBYTES,
          crypto_box_ZEROBYTES,
          crypto_box_BOXZEROBYTES,
          crypto_sign_BYTES,
          crypto_sign_PUBLICKEYBYTES,
          crypto_sign_SECRETKEYBYTES,
          crypto_sign_SEEDBYTES,
          crypto_hash_BYTES,
          gf,
          D,
          L,
          pack25519,
          unpack25519,
          M,
          A,
          S,
          Z,
          pow2523,
          add,
          set25519,
          modL,
          scalarmult,
          scalarbase
        };
        function checkLengths(k, n) {
          if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
          if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
        }
        function checkBoxLengths(pk, sk) {
          if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
          if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
        }
        function checkArrayTypes() {
          for (var i2 = 0; i2 < arguments.length; i2++) {
            if (!(arguments[i2] instanceof Uint8Array))
              throw new TypeError("unexpected type, use Uint8Array");
          }
        }
        function cleanup(arr) {
          for (var i2 = 0; i2 < arr.length; i2++) arr[i2] = 0;
        }
        nacl2.randomBytes = function(n) {
          var b = new Uint8Array(n);
          randombytes(b, n);
          return b;
        };
        nacl2.secretbox = function(msg, nonce, key) {
          checkArrayTypes(msg, nonce, key);
          checkLengths(key, nonce);
          var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
          var c = new Uint8Array(m.length);
          for (var i2 = 0; i2 < msg.length; i2++) m[i2 + crypto_secretbox_ZEROBYTES] = msg[i2];
          crypto_secretbox(c, m, m.length, nonce, key);
          return c.subarray(crypto_secretbox_BOXZEROBYTES);
        };
        nacl2.secretbox.open = function(box, nonce, key) {
          checkArrayTypes(box, nonce, key);
          checkLengths(key, nonce);
          var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
          var m = new Uint8Array(c.length);
          for (var i2 = 0; i2 < box.length; i2++) c[i2 + crypto_secretbox_BOXZEROBYTES] = box[i2];
          if (c.length < 32) return null;
          if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
          return m.subarray(crypto_secretbox_ZEROBYTES);
        };
        nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
        nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
        nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
        nacl2.scalarMult = function(n, p) {
          checkArrayTypes(n, p);
          if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
          if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult(q, n, p);
          return q;
        };
        nacl2.scalarMult.base = function(n) {
          checkArrayTypes(n);
          if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult_base(q, n);
          return q;
        };
        nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
        nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
        nacl2.box = function(msg, nonce, publicKey, secretKey) {
          var k = nacl2.box.before(publicKey, secretKey);
          return nacl2.secretbox(msg, nonce, k);
        };
        nacl2.box.before = function(publicKey, secretKey) {
          checkArrayTypes(publicKey, secretKey);
          checkBoxLengths(publicKey, secretKey);
          var k = new Uint8Array(crypto_box_BEFORENMBYTES);
          crypto_box_beforenm(k, publicKey, secretKey);
          return k;
        };
        nacl2.box.after = nacl2.secretbox;
        nacl2.box.open = function(msg, nonce, publicKey, secretKey) {
          var k = nacl2.box.before(publicKey, secretKey);
          return nacl2.secretbox.open(msg, nonce, k);
        };
        nacl2.box.open.after = nacl2.secretbox.open;
        nacl2.box.keyPair = function() {
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
          crypto_box_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl2.box.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_box_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          crypto_scalarmult_base(pk, secretKey);
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
        nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
        nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
        nacl2.box.nonceLength = crypto_box_NONCEBYTES;
        nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
        nacl2.sign = function(msg, secretKey) {
          checkArrayTypes(msg, secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
          crypto_sign(signedMsg, msg, msg.length, secretKey);
          return signedMsg;
        };
        nacl2.sign.open = function(signedMsg, publicKey) {
          checkArrayTypes(signedMsg, publicKey);
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var tmp = new Uint8Array(signedMsg.length);
          var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
          if (mlen < 0) return null;
          var m = new Uint8Array(mlen);
          for (var i2 = 0; i2 < m.length; i2++) m[i2] = tmp[i2];
          return m;
        };
        nacl2.sign.detached = function(msg, secretKey) {
          var signedMsg = nacl2.sign(msg, secretKey);
          var sig = new Uint8Array(crypto_sign_BYTES);
          for (var i2 = 0; i2 < sig.length; i2++) sig[i2] = signedMsg[i2];
          return sig;
        };
        nacl2.sign.detached.verify = function(msg, sig, publicKey) {
          checkArrayTypes(msg, sig, publicKey);
          if (sig.length !== crypto_sign_BYTES)
            throw new Error("bad signature size");
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
          var m = new Uint8Array(crypto_sign_BYTES + msg.length);
          var i2;
          for (i2 = 0; i2 < crypto_sign_BYTES; i2++) sm[i2] = sig[i2];
          for (i2 = 0; i2 < msg.length; i2++) sm[i2 + crypto_sign_BYTES] = msg[i2];
          return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
        };
        nacl2.sign.keyPair = function() {
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          crypto_sign_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          for (var i2 = 0; i2 < pk.length; i2++) pk[i2] = secretKey[32 + i2];
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl2.sign.keyPair.fromSeed = function(seed) {
          checkArrayTypes(seed);
          if (seed.length !== crypto_sign_SEEDBYTES)
            throw new Error("bad seed size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          for (var i2 = 0; i2 < 32; i2++) sk[i2] = seed[i2];
          crypto_sign_keypair(pk, sk, true);
          return { publicKey: pk, secretKey: sk };
        };
        nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
        nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
        nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
        nacl2.sign.signatureLength = crypto_sign_BYTES;
        nacl2.hash = function(msg) {
          checkArrayTypes(msg);
          var h = new Uint8Array(crypto_hash_BYTES);
          crypto_hash(h, msg, msg.length);
          return h;
        };
        nacl2.hash.hashLength = crypto_hash_BYTES;
        nacl2.verify = function(x2, y) {
          checkArrayTypes(x2, y);
          if (x2.length === 0 || y.length === 0) return false;
          if (x2.length !== y.length) return false;
          return vn(x2, 0, y, 0, x2.length) === 0 ? true : false;
        };
        nacl2.setPRNG = function(fn) {
          randombytes = fn;
        };
        (function() {
          var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
          if (crypto && crypto.getRandomValues) {
            var QUOTA = 65536;
            nacl2.setPRNG(function(x2, n) {
              var i2, v = new Uint8Array(n);
              for (i2 = 0; i2 < n; i2 += QUOTA) {
                crypto.getRandomValues(v.subarray(i2, i2 + Math.min(n - i2, QUOTA)));
              }
              for (i2 = 0; i2 < n; i2++) x2[i2] = v[i2];
              cleanup(v);
            });
          } else if (typeof __require !== "undefined") {
            crypto = __require("crypto");
            if (crypto && crypto.randomBytes) {
              nacl2.setPRNG(function(x2, n) {
                var i2, v = crypto.randomBytes(n);
                for (i2 = 0; i2 < n; i2++) x2[i2] = v[i2];
                cleanup(v);
              });
            }
          }
        })();
      })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
    }
  });

  // js/db.js
  var DB_NAME = "novel-reader";
  var DB_VERSION = 1;
  var dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("books")) db.createObjectStore("books", { keyPath: "id" });
        if (!db.objectStoreNames.contains("contents")) db.createObjectStore("contents", { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    dbPromise.catch(() => {
      dbPromise = null;
    });
    return dbPromise;
  }
  function promisify(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  function withStore(names, mode, fn) {
    return __async(this, null, function* () {
      const db = yield openDb();
      const tx = db.transaction(names, mode);
      const done = new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error("\u4EA4\u6613\u4E2D\u6B62"));
      });
      done.catch(() => {
      });
      const result = yield fn(tx);
      yield done;
      return result;
    });
  }
  var chunkKey = (bookId, k) => "".concat(bookId, "#").concat(k);
  var chunkRange = (bookId) => IDBKeyRange.bound("".concat(bookId, "#"), "".concat(bookId, "#\uFFFF"));
  function listBooks() {
    return __async(this, null, function* () {
      const books = yield withStore(["books"], "readonly", (tx) => new Promise((resolve, reject) => {
        const out = [];
        const req = tx.objectStore("books").openCursor();
        req.onsuccess = () => {
          const cursor = req.result;
          if (!cursor) return resolve(out);
          out.push(cursor.value);
          cursor.continue();
        };
        req.onerror = () => reject(req.error);
      }));
      return books.sort((a, b) => (b.lastReadAt || b.addedAt) - (a.lastReadAt || a.addedAt));
    });
  }
  function getBook(id) {
    return withStore(["books"], "readonly", (tx) => promisify(tx.objectStore("books").get(id)));
  }
  function patchBook(store, id, fn, resolve, reject) {
    const req = store.get(id);
    req.onsuccess = () => {
      if (!req.result) return resolve(null);
      const next = fn(req.result);
      store.put(next);
      resolve(next);
    };
    req.onerror = () => reject(req.error);
  }
  function updateBook(id, fn) {
    return withStore(["books"], "readwrite", (tx) => new Promise((resolve, reject) => {
      patchBook(tx.objectStore("books"), id, fn, resolve, reject);
    }));
  }
  function storeChunk(bookId, k, texts) {
    return withStore(["books", "contents"], "readwrite", (tx) => new Promise((resolve, reject) => {
      const books = tx.objectStore("books");
      const req = books.get(bookId);
      req.onsuccess = () => {
        const book = req.result;
        if (!book) {
          tx.abort();
          return reject(new Error("\u66F8\u5DF2\u88AB\u522A\u9664"));
        }
        const ready = (book.ready || []).slice();
        ready[k] = true;
        books.put(Object.assign({}, book, { ready }));
        tx.objectStore("contents").put({ id: chunkKey(bookId, k), texts });
        resolve();
      };
      req.onerror = () => reject(req.error);
    }));
  }
  function getChunk(bookId, k) {
    return __async(this, null, function* () {
      const record = yield withStore(["contents"], "readonly", (tx) => promisify(tx.objectStore("contents").get(chunkKey(bookId, k))));
      return record ? record.texts : null;
    });
  }
  function putBook(meta, chunks = {}) {
    return withStore(["books", "contents"], "readwrite", (tx) => {
      tx.objectStore("books").put(meta);
      Object.keys(chunks).forEach((k) => {
        tx.objectStore("contents").put({ id: chunkKey(meta.id, k), texts: chunks[k] });
      });
    });
  }
  function deleteBook(id) {
    return withStore(["books", "contents"], "readwrite", (tx) => {
      tx.objectStore("books").delete(id);
      tx.objectStore("contents").delete(id);
      tx.objectStore("contents").delete(chunkRange(id));
    });
  }
  function getLegacyContent(id) {
    return withStore(["contents"], "readonly", (tx) => promisify(tx.objectStore("contents").get(id)));
  }
  function deleteLegacyContent(id) {
    return withStore(["contents"], "readwrite", (tx) => {
      tx.objectStore("contents").delete(id);
    });
  }

  // js/parser.js
  var COMMON_CHARS = new Set(
    "\u7684\u4E00\u662F\u4E86\u6211\u4E0D\u4EBA\u5728\u4ED6\u6709\u8FD9\u4E2A\u4E0A\u4EEC\u6765\u5230\u65F6\u5927\u5730\u4E3A\u5B50\u4E2D\u4F60\u8BF4\u751F\u56FD\u5E74\u7740\u5C31\u90A3\u548C\u8981\u5979\u51FA\u4E5F\u5F97\u91CC\u540E\u81EA\u4EE5\u4F1A\u5BB6\u53EF\u4E0B\u800C\u8FC7\u5929\u53BB\u80FD\u5BF9\u5C0F\u591A\u7136\u4E8E\u5FC3\u5B66\u4E48\u4E4B\u90FD\u597D\u770B\u8D77\u53D1\u5F53\u6CA1\u6210\u53EA\u5982\u4E8B\u628A\u8FD8\u7528\u7B2C\u6837\u9053\u60F3\u4F5C\u79CD\u5F00\u7F8E\u603B\u4ECE\u65E0\u60C5\u5DF1\u9762\u6700\u5973\u4F46\u73B0\u524D\u4E9B\u6240\u540C\u65E5\u624B\u53C8\u884C\u610F\u52A8\u65B9\u5B83\u5934\u7ECF\u957F\u513F\u56DE\u4F4D\u5206\u8001\u56E0\u5F88\u7ED9\u540D\u6CD5\u95F4\u77E5\u4E16\u4EC0\u4E24\u6B21\u4F7F\u8EAB\u8005\u88AB\u9AD8\u5DF2\u4EB2\u5176\u8FDB\u6B64\u8BDD\u5E38\u4E0E\u6D3B\u6B63\u611F\u9019\u500B\u5011\u4F86\u6642\u70BA\u8AAA\u570B\u8457\u904E\u6703\u5C0D\u5B78\u9EBC\u767C\u7576\u6C92\u5F9E\u7121\u7A2E\u958B\u7E3D\u73FE\u52D5\u982D\u7D93\u9577\u5152\u9593\u7D66\u89AA\u9032\u8A71\u8207\u9084\u898B\u554F\u6A23\u9EDE\u6C23\u8072"
  );
  var FALLBACK_ENCODINGS = ["gb18030", "big5"];
  function scoreText(text) {
    let common = 0;
    let bad = 0;
    const len = Math.min(text.length, 2e4);
    for (let i2 = 0; i2 < len; i2++) {
      const ch = text[i2];
      if (ch === "\uFFFD") bad++;
      else if (COMMON_CHARS.has(ch)) common++;
    }
    return common - bad * 10;
  }
  function decodeText(bytes) {
    const u82 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (u82[0] === 239 && u82[1] === 187 && u82[2] === 191) {
      return new TextDecoder("utf-8").decode(u82.subarray(3));
    }
    if (u82[0] === 255 && u82[1] === 254) return new TextDecoder("utf-16le").decode(u82.subarray(2));
    if (u82[0] === 254 && u82[1] === 255) return new TextDecoder("utf-16be").decode(u82.subarray(2));
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(u82);
    } catch (e) {
    }
    let best = null;
    for (const enc of FALLBACK_ENCODINGS) {
      let text;
      try {
        text = new TextDecoder(enc).decode(u82);
      } catch (e) {
        continue;
      }
      const score = scoreText(text);
      if (!best || score > best.score) best = { text, score };
    }
    return best ? best.text : new TextDecoder("utf-8").decode(u82);
  }
  var NUM = "0-9\uFF10-\uFF19\u96F6\u3007\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07\u842C\u4E24\u5169";
  var CHAPTER_RE = new RegExp(
    "^(?:" + "\u7B2C[".concat(NUM, "]+[\u7AE0\u56DE\u8282\u7BC0\u5377\u96C6\u90E8\u7BC7\u8BDD\u8A71].*") + "|(?:chapter|CHAPTER|Chapter)\\s*\\d+.*|(?:\u5E8F\u7AE0|\u5E8F\u8A00|\u5E8F|\u6954\u5B50|\u5F15\u5B50|\u524D\u8A00|\u5C3E\u58F0|\u5C3E\u8072|\u540E\u8BB0|\u5F8C\u8A18|\u7EC8\u7AE0|\u7D42\u7AE0|\u756A\u5916)(?:\\s.*|[\uFF1A:\u3001].*)?)$"
  );
  var MAX_TITLE_LEN = 40;
  var SENTENCE_END_RE = /[。！？!?…」”"]$/;
  var NUMBERED_RE = new RegExp("^\u7B2C[".concat(NUM, "]+[\u7AE0\u56DE]"));
  var NUMBERED_END_RE = /[。…」”"]$/;
  var CHUNK_SIZE = 8e3;
  function isChapterTitle(line) {
    if (line.length === 0 || line.length > MAX_TITLE_LEN || !CHAPTER_RE.test(line)) return false;
    return NUMBERED_RE.test(line) ? !NUMBERED_END_RE.test(line) : !SENTENCE_END_RE.test(line);
  }
  function chunkByLength(text) {
    const chapters = [];
    let start2 = 0;
    while (start2 < text.length) {
      let end = Math.min(start2 + CHUNK_SIZE, text.length);
      if (end < text.length) {
        const nl = text.indexOf("\n", end);
        end = nl === -1 ? text.length : nl + 1;
      }
      chapters.push({ title: "\u7B2C ".concat(chapters.length + 1, " \u6BB5"), text: text.slice(start2, end).trim() });
      start2 = end;
    }
    return chapters.filter((c) => c.text.length > 0);
  }
  function splitChapters(rawText) {
    const text = rawText.replace(/\r\n?/g, "\n");
    const lines = text.split("\n");
    const chapters = [];
    let current = { title: "\u524D\u8A00", lines: [] };
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (isChapterTitle(line)) {
        chapters.push(current);
        current = { title: line, lines: [] };
      } else {
        current.lines.push(rawLine);
      }
    }
    chapters.push(current);
    const result = chapters.map((c) => ({ title: c.title, text: c.lines.join("\n").trim() })).filter((c, i2) => !(i2 === 0 && c.text.length === 0));
    const hasRealChapters = result.length > 1 || result.length === 1 && result[0].title !== "\u524D\u8A00";
    if (!hasRealChapters) return chunkByLength(text.trim());
    return result;
  }
  function chunkStartsFor(lens, maxChars) {
    const starts = [];
    let size = 0;
    lens.forEach((len, i2) => {
      if (i2 === 0 || size + len > maxChars) {
        starts.push(i2);
        size = 0;
      }
      size += len;
    });
    return starts;
  }
  function titleFromFilename(name) {
    const base = name.replace(/\.txt$/i, "").trim();
    const m = base.match(/《(.+?)》/);
    return (m ? m[1] : base) || "\u672A\u547D\u540D";
  }
  function parseBook(bytes, filename) {
    const text = decodeText(bytes);
    const chapters = splitChapters(text);
    return { title: titleFromFilename(filename), chapters };
  }

  // js/book.js
  var CHUNK_CHARS = 15e4;
  function buildBook(base, chapters) {
    const lens = chapters.map((c) => c.text.length);
    const chunkStarts = chunkStartsFor(lens, CHUNK_CHARS);
    const chunks = {};
    chunkStarts.forEach((start2, k) => {
      const end = k + 1 < chunkStarts.length ? chunkStarts[k + 1] : chapters.length;
      chunks[k] = chapters.slice(start2, end).map((c) => c.text);
    });
    const meta = Object.assign(describeChapters(chapters.map((c) => c.title), lens, chunkStarts), base);
    meta.ready = chunkStarts.map(() => true);
    return { meta, chunks };
  }
  function describeChapters(titles, lens, chunkStarts) {
    return {
      titles,
      lens,
      chunkStarts,
      chapterCount: titles.length,
      totalChars: lens.reduce((n, len) => n + len, 0),
      ready: chunkStarts.map(() => false),
      addedAt: Date.now(),
      lastReadAt: 0,
      percent: 0,
      progress: { chapter: 0, block: 0, offset: 0, chapterTitle: titles[0] }
    };
  }
  function chunkOf(chunkStarts, index) {
    let lo = 0;
    let hi = chunkStarts.length - 1;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (chunkStarts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }
  function readyCount(meta) {
    return (meta.ready || []).filter(Boolean).length;
  }

  // js/bookpack.js
  var import_tweetnacl = __toESM(require_nacl_fast(), 1);

  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start2) {
    var b = new u16(31);
    for (var i2 = 0; i2 < 31; ++i2) {
      b[i2] = start2 += 1 << eb[i2 - 1];
    }
    var r = new i32(b[30]);
    for (var i2 = 1; i2 < 30; ++i2) {
      for (var j = b[i2]; j < b[i2 + 1]; ++j) {
        r[j] = j - b[i2] << 5 | i2;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = (function(cd, mb, r) {
    var s = cd.length;
    var i2 = 0;
    var l = new u16(mb);
    for (; i2 < s; ++i2) {
      if (cd[i2])
        ++l[cd[i2] - 1];
    }
    var le = new u16(mb);
    for (i2 = 1; i2 < mb; ++i2) {
      le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          var sv = i2 << 4 | cd[i2];
          var r_1 = mb - cd[i2];
          var v = le[cd[i2] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
        }
      }
    }
    return co;
  });
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i2 = 1; i2 < a.length; ++i2) {
      if (a[i2] > m)
        m = a[i2];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    return new u8(v.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i2 = 0; i2 < hcLen; ++i2) {
            clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i2 = 0; i2 < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i2++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i2++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i2 = sym - 257, b = fleb[i2];
            add = bits(dat, pos, (1 << b) - 1) + fl[i2];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var dutf8 = function(d) {
    for (var r = "", i2 = 0; ; ) {
      var c = d[i2++];
      var eb = (c > 127) + (c > 223) + (c > 239);
      if (i2 + eb > d.length)
        return { s: r, r: slc(d, i2 - 1) };
      if (!eb)
        r += String.fromCharCode(c);
      else if (eb == 3) {
        c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
      } else if (eb & 1)
        r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
      else
        r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
    }
  };
  function strToU8(str, latin1) {
    if (latin1) {
      var ar_1 = new u8(str.length);
      for (var i2 = 0; i2 < str.length; ++i2)
        ar_1[i2] = str.charCodeAt(i2);
      return ar_1;
    }
    if (te)
      return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function(v) {
      ar[ai++] = v;
    };
    for (var i2 = 0; i2 < l; ++i2) {
      if (ai + 5 > ar.length) {
        var n = new u8(ai + 8 + (l - i2 << 1));
        n.set(ar);
        ar = n;
      }
      var c = str.charCodeAt(i2);
      if (c < 128 || latin1)
        w(c);
      else if (c < 2048)
        w(192 | c >> 6), w(128 | c & 63);
      else if (c > 55295 && c < 57344)
        c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
      else
        w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
    }
    return slc(ar, 0, ai);
  }
  function strFromU8(dat, latin1) {
    if (latin1) {
      var r = "";
      for (var i2 = 0; i2 < dat.length; i2 += 16384)
        r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
      return r;
    } else if (td) {
      return td.decode(dat);
    } else {
      var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
      if (r.length)
        err(8);
      return s;
    }
  }

  // js/bookpack.js
  var KEY_BYTES = import_tweetnacl.default.secretbox.keyLength;
  var NONCE_BYTES = import_tweetnacl.default.secretbox.nonceLength;
  var WrongKeyError = class extends Error {
    constructor() {
      super("\u5BC6\u78BC\u932F\u8AA4");
      this.name = "WrongKeyError";
    }
  };
  function concat(a, b) {
    const out = new Uint8Array(a.length + b.length);
    out.set(a, 0);
    out.set(b, a.length);
    return out;
  }
  function deriveKey(password, salt, iterations) {
    let h = import_tweetnacl.default.hash(concat(salt, strToU8(password)));
    for (let i2 = 0; i2 < iterations; i2++) h = import_tweetnacl.default.hash(h);
    return h.subarray(0, KEY_BYTES);
  }
  function open(bytes, key) {
    const u82 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const plain = import_tweetnacl.default.secretbox.open(u82.subarray(NONCE_BYTES), u82.subarray(0, NONCE_BYTES), key);
    if (!plain) throw new WrongKeyError();
    return JSON.parse(strFromU8(inflateSync(plain)));
  }
  function toHex(bytes) {
    return Array.prototype.map.call(bytes, (b) => (b < 16 ? "0" : "") + b.toString(16)).join("");
  }
  function fromHex(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i2 = 0; i2 < out.length; i2++) out[i2] = parseInt(hex.substr(i2 * 2, 2), 16);
    return out;
  }

  // js/builtin.js
  var BASE = "books/";
  var KEY_PREFIX = "novel-reader:key:";
  var inflight = {};
  var builtinBookId = (id) => "builtin-".concat(id);
  function request(path, responseType) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", BASE + path);
      xhr.responseType = responseType;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(new Error("\u4E0B\u8F09\u5931\u6557\uFF08".concat(xhr.status, "\uFF09\uFF1A").concat(path)));
      };
      xhr.onerror = () => reject(new Error("\u7DB2\u8DEF\u932F\u8AA4\uFF1A".concat(path)));
      xhr.send();
    });
  }
  function fetchBytes(path) {
    return __async(this, null, function* () {
      return new Uint8Array(yield request(path, "arraybuffer"));
    });
  }
  function isValidEntry(b) {
    return b && /^[a-z0-9-]+$/.test(b.id) && typeof b.title === "string" && /^[0-9a-f]{32}$/.test(b.salt) && Number(b.iterations) > 0;
  }
  function listBuiltins() {
    return __async(this, null, function* () {
      try {
        const data = JSON.parse(yield request("manifest.json?t=".concat(Date.now()), "text"));
        return Array.isArray(data.books) ? data.books.filter(isValidEntry) : [];
      } catch (err2) {
        console.warn("\u8B80\u4E0D\u5230\u5167\u5EFA\u66F8\u6E05\u55AE", err2);
        return [];
      }
    });
  }
  function saveKey(bookId, key) {
    try {
      localStorage.setItem(KEY_PREFIX + bookId, toHex(key));
    } catch (err2) {
      console.warn("\u7121\u6CD5\u8A18\u4F4F\u5167\u5EFA\u66F8\u5BC6\u78BC", err2);
    }
  }
  function loadKey(bookId) {
    try {
      const hex = localStorage.getItem(KEY_PREFIX + bookId);
      return hex && /^[0-9a-f]{64}$/.test(hex) ? fromHex(hex) : null;
    } catch (e) {
      return null;
    }
  }
  function forgetKey(bookId) {
    try {
      localStorage.removeItem(KEY_PREFIX + bookId);
    } catch (e) {
    }
  }
  function unlockBuiltin(entry, password) {
    return __async(this, null, function* () {
      const key = deriveKey(password, fromHex(entry.salt), Number(entry.iterations));
      const index = open(yield fetchBytes("".concat(entry.id, "/index.bin")), key);
      if (!Array.isArray(index.titles) || !Array.isArray(index.chunkStarts) || index.titles.length === 0) {
        throw new Error("\u5167\u5EFA\u66F8\u8CC7\u6599\u683C\u5F0F\u4E0D\u5C0D");
      }
      const id = builtinBookId(entry.id);
      const meta = Object.assign(describeChapters(index.titles, index.lens, index.chunkStarts), {
        id,
        title: index.title || entry.title,
        builtin: entry.id,
        builtAt: entry.builtAt,
        size: 0
      });
      saveKey(id, key);
      yield putBook(meta);
      return meta;
    });
  }
  function loadBuiltinChunk(book, k) {
    const tag = "".concat(book.id, "#").concat(k);
    if (!inflight[tag]) {
      inflight[tag] = fetchChunk(book, k).then(
        (texts) => {
          delete inflight[tag];
          return texts;
        },
        (err2) => {
          delete inflight[tag];
          throw err2;
        }
      );
    }
    return inflight[tag];
  }
  function fetchChunk(book, k) {
    return __async(this, null, function* () {
      const key = loadKey(book.id);
      if (!key) throw new Error("\u627E\u4E0D\u5230\u5BC6\u78BC\uFF0C\u8ACB\u522A\u9664\u9019\u672C\u66F8\u5F8C\u91CD\u65B0\u89E3\u9396");
      const texts = open(yield fetchBytes("".concat(book.builtin, "/c").concat(k, ".bin")), key);
      const end = k + 1 < book.chunkStarts.length ? book.chunkStarts[k + 1] : book.chapterCount;
      if (!Array.isArray(texts) || texts.length !== end - book.chunkStarts[k]) {
        throw new Error("\u5167\u5EFA\u66F8\u5DF2\u66F4\u65B0\uFF0C\u8ACB\u522A\u9664\u9019\u672C\u66F8\u5F8C\u91CD\u65B0\u89E3\u9396");
      }
      yield storeChunk(book.id, k, texts);
      return texts;
    });
  }
  var RETRY_DELAYS_MS = [2e3, 5e3, 15e3, 3e4];
  var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function loadWithRetry(book, k) {
    return __async(this, null, function* () {
      for (let attempt = 0; ; attempt++) {
        try {
          return yield loadBuiltinChunk(book, k);
        } catch (err2) {
          if (attempt >= RETRY_DELAYS_MS.length) throw err2;
          console.warn("\u7B2C ".concat(k, " \u584A\u4E0B\u8F09\u5931\u6557\uFF0C\u7A0D\u5F8C\u91CD\u8A66"), err2);
          yield sleep(RETRY_DELAYS_MS[attempt]);
        }
      }
    });
  }
  function downloadRemaining(bookId, onProgress) {
    return __async(this, null, function* () {
      const book = yield getBook(bookId);
      if (!book || !book.builtin) return;
      const total = book.chunkStarts.length;
      let done = readyCount(book);
      onProgress(done, total);
      for (let k = 0; k < total; k++) {
        if (book.ready && book.ready[k]) continue;
        yield loadWithRetry(book, k);
        onProgress(++done, total);
      }
    });
  }
  function isFullyDownloaded(book) {
    return readyCount(book) >= book.chunkStarts.length;
  }

  // js/dom.js
  function setChildren(el2, nodes) {
    while (el2.firstChild) el2.removeChild(el2.firstChild);
    nodes.forEach((node) => el2.appendChild(node));
  }

  // js/shelf.js
  var MAX_FILE_BYTES = 200 * 1024 * 1024;
  var COVER_CHARS = 4;
  var list = document.getElementById("book-list");
  var emptyHint = document.getElementById("empty-hint");
  var status = document.getElementById("shelf-status");
  var fileInput = document.getElementById("file-input");
  var openHandler = () => {
  };
  var builtins = [];
  var lockedBuiltins = [];
  function initShelf({ onOpen }) {
    openHandler = onOpen;
    fileInput.addEventListener("change", () => __async(null, null, function* () {
      const files = Array.prototype.slice.call(fileInput.files);
      fileInput.value = "";
      yield importFiles(files);
    }));
    list.addEventListener("click", onListClick);
  }
  function showStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
    status.hidden = !message;
  }
  function refreshShelf() {
    return __async(this, null, function* () {
      let books;
      try {
        books = yield listBooks();
      } catch (err2) {
        console.error("\u8B80\u53D6\u66F8\u67B6\u5931\u6557", err2);
        showStatus("\u8B80\u53D6\u66F8\u67B6\u5931\u6557\uFF0C\u8ACB\u91CD\u65B0\u6574\u7406\u518D\u8A66", true);
        return;
      }
      renderShelf(books);
      builtins = yield listBuiltins();
      renderShelf(books);
    });
  }
  function renderShelf(books) {
    const owned = books.map((b) => b.id);
    lockedBuiltins = builtins.filter((b) => owned.indexOf(builtinBookId(b.id)) === -1);
    setChildren(list, lockedBuiltins.map(renderLocked).concat(books.map(renderBook)));
    emptyHint.hidden = books.length + lockedBuiltins.length > 0;
  }
  function coverColor(title) {
    let hash = 0;
    for (const ch of title) hash = hash * 31 + ch.codePointAt(0) >>> 0;
    return "hsl(".concat(hash % 360, ", 32%, 44%)");
  }
  function describeProgress(book) {
    const chapterCount = book.chapterCount || (book.titles || []).length;
    let text = book.lastReadAt ? "".concat(book.progress && book.progress.chapterTitle || "", " \xB7 ").concat((book.percent || 0).toFixed(1), "%") : "\u672A\u958B\u59CB \xB7 \u5171 ".concat(chapterCount, " \u7AE0");
    const chunks = (book.chunkStarts || []).length;
    if (book.builtin && readyCount(book) < chunks) text += " \xB7 \u5DF2\u4E0B\u8F09 ".concat(readyCount(book), "/").concat(chunks);
    return text;
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== void 0) node.textContent = text;
    return node;
  }
  function renderItem(title, metaText, percent2) {
    const li = el("li", "book-item");
    const cover = el("div", "book-cover", Array.from(title).slice(0, COVER_CHARS).join(""));
    cover.style.background = coverColor(title);
    const info = el("div", "book-info");
    const bar = el("div", "book-progress");
    const fill = el("div", "");
    fill.style.width = "".concat(percent2, "%");
    bar.appendChild(fill);
    info.appendChild(el("div", "book-title", title));
    info.appendChild(el("div", "book-meta", metaText));
    info.appendChild(bar);
    li.appendChild(cover);
    li.appendChild(info);
    return li;
  }
  function renderBook(book) {
    const li = renderItem(book.title, describeProgress(book), book.percent || 0);
    li.dataset.id = book.id;
    const del = el("button", "book-delete", "\u2715");
    del.type = "button";
    del.dataset.action = "delete";
    del.setAttribute("aria-label", "\u522A\u9664\u300A".concat(book.title, "\u300B"));
    li.appendChild(del);
    return li;
  }
  function renderLocked(entry) {
    const li = renderItem(entry.title, "\u5167\u5EFA \xB7 \u9EDE\u4E00\u4E0B\u8F38\u5165\u5BC6\u78BC", 0);
    li.dataset.builtin = entry.id;
    li.classList.add("locked");
    return li;
  }
  function onListClick(e) {
    return __async(this, null, function* () {
      const item = e.target.closest(".book-item");
      if (!item) return;
      if (item.dataset.builtin) return unlock(item.dataset.builtin);
      const id = item.dataset.id;
      if (e.target.closest('[data-action="delete"]')) return removeBook(item, id);
      openHandler(id);
    });
  }
  function removeBook(item, id) {
    return __async(this, null, function* () {
      const title = item.querySelector(".book-title").textContent;
      if (!confirm("\u78BA\u5B9A\u8981\u522A\u9664\u300A".concat(title, "\u300B\u55CE\uFF1F\u95B1\u8B80\u9032\u5EA6\u4E5F\u6703\u4E00\u8D77\u522A\u9664\u3002"))) return;
      try {
        yield deleteBook(id);
        forgetKey(id);
      } catch (err2) {
        console.error("\u522A\u9664\u5931\u6557", err2);
        showStatus("\u522A\u9664\u5931\u6557\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21", true);
      }
      yield refreshShelf();
    });
  }
  function unlock(builtinId) {
    return __async(this, null, function* () {
      const entry = lockedBuiltins.filter((b) => b.id === builtinId)[0];
      if (!entry) return;
      const password = prompt("\u8ACB\u8F38\u5165\u300A".concat(entry.title, "\u300B\u7684\u5BC6\u78BC"));
      if (!password) return;
      showStatus("\u89E3\u9396\u4E2D\u2026");
      yield nextFrame();
      try {
        const meta = yield unlockBuiltin(entry, password.trim());
        showStatus("");
        openHandler(meta.id);
      } catch (err2) {
        if (err2 instanceof WrongKeyError) return showStatus("\u5BC6\u78BC\u932F\u8AA4\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21", true);
        console.error("\u89E3\u9396\u5931\u6557", err2);
        showStatus("\u89E3\u9396\u5931\u6557\uFF0C\u8ACB\u78BA\u8A8D\u7DB2\u8DEF\u9023\u7DDA\u5F8C\u518D\u8A66", true);
      }
    });
  }
  function newId() {
    const c = window.crypto;
    if (c && c.randomUUID) return c.randomUUID();
    return "".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2));
  }
  var nextFrame = () => new Promise((resolve) => setTimeout(resolve, 30));
  function readFile(file) {
    if (file.arrayBuffer) return file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
  function importOne(file, existing) {
    return __async(this, null, function* () {
      if (!/\.txt$/i.test(file.name) && file.type !== "text/plain") {
        throw new UserError("\u300C".concat(file.name, "\u300D\u4E0D\u662F txt \u6A94"));
      }
      if (file.size > MAX_FILE_BYTES) throw new UserError("\u300C".concat(file.name, "\u300D\u592A\u5927\u4E86\uFF08\u8D85\u904E 200 MB\uFF09"));
      if (file.size === 0) throw new UserError("\u300C".concat(file.name, "\u300D\u662F\u7A7A\u6A94\u6848"));
      if (typeof TextDecoder === "undefined") throw new UserError("\u9019\u53F0\u88DD\u7F6E\u7684\u700F\u89BD\u5668\u592A\u820A\uFF0C\u7121\u6CD5\u532F\u5165 TXT");
      const { title, chapters } = parseBook(yield readFile(file), file.name);
      if (existing.some((b) => b.title === title && b.size === file.size)) {
        throw new UserError("\u300A".concat(title, "\u300B\u5DF2\u7D93\u5728\u66F8\u67B6\u4E0A\u4E86"));
      }
      const { meta, chunks } = buildBook({ id: newId(), title, size: file.size }, chapters);
      yield putBook(meta, chunks);
      return meta;
    });
  }
  var UserError = class extends Error {
  };
  function importFiles(files) {
    return __async(this, null, function* () {
      if (files.length === 0) return;
      const messages = [];
      let hasError = false;
      let existing = yield listBooks().catch(() => []);
      for (const file of files) {
        showStatus("\u6B63\u5728\u532F\u5165\u300C".concat(file.name, "\u300D\u2026"));
        yield nextFrame();
        try {
          const meta = yield importOne(file, existing);
          existing = existing.concat(meta);
          messages.push("\u5DF2\u532F\u5165\u300A".concat(meta.title, "\u300B\uFF08").concat(meta.chapterCount, " \u7AE0\uFF09"));
        } catch (err2) {
          hasError = true;
          if (err2 instanceof UserError) messages.push(err2.message);
          else {
            console.error("\u532F\u5165\u5931\u6557", file.name, err2);
            messages.push("\u300C".concat(file.name, "\u300D\u532F\u5165\u5931\u6557\uFF0C\u53EF\u80FD\u662F\u7A7A\u9593\u4E0D\u8DB3\u6216\u6A94\u6848\u640D\u58DE"));
          }
        }
      }
      showStatus(messages.join("\n"), hasError);
      yield refreshShelf();
    });
  }

  // js/reader.js
  var SAVE_DELAY_MS = 400;
  var viewport = document.getElementById("page-viewport");
  var content = document.getElementById("page-content");
  var chapterName = document.getElementById("chapter-name");
  var pageInfo = document.getElementById("page-info");
  var percentInfo = document.getElementById("percent-info");
  var state = {
    book: null,
    chapterStarts: [],
    chapter: 0,
    page: 0,
    pages: 1,
    pageWidth: 0,
    anchor: { block: 0, offset: 0 },
    // 目前頁首的字，翻頁時更新，重新分頁時沿用
    chunk: { k: -1, texts: null },
    loading: false,
    failed: false,
    token: 0
  };
  var saveTimer = null;
  var edgeHandler = () => {
  };
  var changeHandler = () => {
  };
  var chunkLoader = null;
  function onEdge(fn) {
    edgeHandler = fn;
  }
  function onChange(fn) {
    changeHandler = fn;
  }
  function setChunkLoader(fn) {
    chunkLoader = fn;
  }
  function getState() {
    const book = state.book;
    return {
      title: book ? book.title : "",
      chapterTitles: book ? book.titles : [],
      chapter: state.chapter,
      page: state.page,
      pages: state.pages
    };
  }
  var CHAPTER_FIELDS = ["titles", "lens", "chunkStarts", "chapterCount", "totalChars", "ready"];
  function migrateLegacy(book) {
    return __async(this, null, function* () {
      const data = yield getLegacyContent(book.id);
      if (!data || !Array.isArray(data.chapters) || data.chapters.length === 0) return null;
      const built = buildBook({}, data.chapters);
      const meta = Object.assign({}, built.meta, book);
      CHAPTER_FIELDS.forEach((f) => {
        meta[f] = built.meta[f];
      });
      yield putBook(meta, built.chunks);
      yield deleteLegacyContent(book.id);
      return meta;
    });
  }
  function loadBook(id) {
    return __async(this, null, function* () {
      let book = yield getBook(id);
      if (book && !Array.isArray(book.chunkStarts)) book = yield migrateLegacy(book);
      if (!book || !Array.isArray(book.titles) || book.titles.length === 0) {
        throw new Error("\u627E\u4E0D\u5230\u66F8\u672C\u8CC7\u6599\uFF1A".concat(id));
      }
      let sum = 0;
      state.chapterStarts = book.lens.map((len) => {
        const start2 = sum;
        sum += len;
        return start2;
      });
      state.book = book;
      state.chunk = { k: -1, texts: null };
    });
  }
  function start() {
    const progress = state.book.progress || {};
    const chapter = clamp(Number(progress.chapter) || 0, 0, state.book.titles.length - 1);
    return showChapter(chapter, { block: Number(progress.block) || 0, offset: Number(progress.offset) || 0 });
  }
  function close() {
    flushProgress();
    state.token++;
    state.book = null;
    state.chunk = { k: -1, texts: null };
    setChildren(content, []);
  }
  function nextPage() {
    if (state.loading) return;
    if (state.failed) return showChapter(state.chapter, "start");
    if (state.page < state.pages - 1) return setPage(state.page + 1, true);
    if (state.chapter < state.book.titles.length - 1) return showChapter(state.chapter + 1, "start");
    edgeHandler("\u5DF2\u7D93\u662F\u6700\u5F8C\u4E00\u9801\u4E86");
  }
  function prevPage() {
    if (state.loading) return;
    if (state.failed) return showChapter(state.chapter, "start");
    if (state.page > 0) return setPage(state.page - 1, true);
    if (state.chapter > 0) return showChapter(state.chapter - 1, "end");
    edgeHandler("\u5DF2\u7D93\u662F\u7B2C\u4E00\u9801\u4E86");
  }
  function goChapter(index) {
    return showChapter(clamp(index, 0, state.book.titles.length - 1), "start");
  }
  function relayout() {
    if (!state.book || state.loading || state.failed) return;
    const anchor = state.anchor;
    measure();
    setPage(pageOfAnchor(anchor), false, anchor);
  }
  function flushProgress() {
    if (!saveTimer) return;
    clearTimeout(saveTimer);
    saveTimer = null;
    persistProgress();
  }
  function clamp(n, min, max2) {
    return Math.min(max2, Math.max(min, n));
  }
  function textOf(index) {
    return __async(this, null, function* () {
      const book = state.book;
      const k = chunkOf(book.chunkStarts, index);
      if (state.chunk.k !== k) {
        let texts = yield getChunk(book.id, k);
        if (!texts && chunkLoader && book.builtin) texts = yield chunkLoader(book, k);
        if (!texts) throw new Error("\u9019\u672C\u66F8\u7684\u5167\u5BB9\u4E0D\u5B8C\u6574\uFF0C\u8ACB\u522A\u9664\u5F8C\u91CD\u65B0\u532F\u5165");
        if (!state.book || state.book.id !== book.id) return null;
        state.chunk = { k, texts };
      }
      const text = state.chunk.texts[index - book.chunkStarts[k]];
      return typeof text === "string" ? text : "";
    });
  }
  function paragraph(text, className) {
    const p = document.createElement("p");
    if (className) p.className = className;
    p.textContent = text;
    return p;
  }
  function renderChapter(title, text) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    const nodes = [heading];
    text.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) nodes.push(paragraph(trimmed));
    });
    setChildren(content, nodes);
  }
  function renderNotice(title, message) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    setChildren(content, [heading, paragraph(message, "notice")]);
  }
  function setColumns(width, gap) {
    const style = content.style;
    style.width = "".concat(width, "px");
    style.setProperty("-webkit-column-width", "".concat(width, "px"));
    style.setProperty("column-width", "".concat(width, "px"));
    style.setProperty("-webkit-column-gap", "".concat(gap, "px"));
    style.setProperty("column-gap", "".concat(gap, "px"));
  }
  function measure() {
    const width = Math.floor(viewport.getBoundingClientRect().width);
    const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    setColumns(width - pad * 2, pad * 2);
    state.pageWidth = width;
    state.pages = countPages();
  }
  function pageOfRect(rect) {
    const base = content.getBoundingClientRect().left;
    return Math.max(0, Math.floor((rect.left - base + 1) / state.pageWidth));
  }
  function countPages() {
    const last = content.lastElementChild;
    if (!last) return 1;
    const rects = last.getClientRects();
    if (rects.length === 0) return 1;
    return pageOfRect(rects[rects.length - 1]) + 1;
  }
  function pageOfBlock(index) {
    const el2 = content.children[clamp(index, 0, content.children.length - 1)];
    const rects = el2 ? el2.getClientRects() : null;
    if (!rects || rects.length === 0) return 0;
    return clamp(pageOfRect(rects[0]), 0, state.pages - 1);
  }
  function blockAtPage(page) {
    const blocks = content.children;
    for (let i2 = 0; i2 < blocks.length; i2++) {
      const rects = blocks[i2].getClientRects();
      if (rects.length > 0 && pageOfRect(rects[rects.length - 1]) >= page) return i2;
    }
    return Math.max(0, blocks.length - 1);
  }
  var charRange = document.createRange();
  function pageOfChar(node, offset) {
    charRange.setStart(node, offset);
    charRange.setEnd(node, offset + 1);
    const rects = charRange.getClientRects();
    return rects.length > 0 ? pageOfRect(rects[0]) : 0;
  }
  function textNodeOf(block) {
    const el2 = content.children[block];
    return el2 ? el2.firstChild : null;
  }
  function anchorAtPage(page) {
    const block = blockAtPage(page);
    const node = textNodeOf(block);
    if (!node || node.length < 2 || pageOfChar(node, 0) >= page) return { block, offset: 0 };
    let lo = 0;
    let hi = node.length - 1;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (pageOfChar(node, mid) >= page) hi = mid;
      else lo = mid + 1;
    }
    return { block, offset: lo };
  }
  function pageOfAnchor({ block, offset }) {
    const node = textNodeOf(block);
    if (!offset || !node || node.length === 0) return pageOfBlock(block);
    return clamp(pageOfChar(node, Math.min(offset, node.length - 1)), 0, state.pages - 1);
  }
  function resetPosition() {
    content.classList.remove("animate");
    content.style.transform = "translate3d(0, 0, 0)";
    content.style.webkitTransform = "translate3d(0, 0, 0)";
  }
  function showChapter(index, position) {
    return __async(this, null, function* () {
      const token = ++state.token;
      const book = state.book;
      const title = book.titles[index];
      state.chapter = index;
      state.loading = true;
      state.failed = false;
      if (state.chunk.k !== chunkOf(book.chunkStarts, index)) {
        resetPosition();
        renderNotice(title, "\u8F09\u5165\u4E2D\u2026");
      }
      let text;
      try {
        text = yield textOf(index);
      } catch (err2) {
        if (token !== state.token) return;
        console.error("\u8F09\u5165\u7AE0\u7BC0\u5931\u6557", err2);
        state.loading = false;
        state.failed = true;
        resetPosition();
        renderNotice(title, "\u8F09\u5165\u5931\u6557\uFF1A".concat(err2.message, "\n\u8ACB\u9023\u4E0A\u7DB2\u8DEF\u5F8C\u9EDE\u4E00\u4E0B\u756B\u9762\u91CD\u8A66"));
        updateFooter();
        return;
      }
      if (token !== state.token || text === null) return;
      state.loading = false;
      renderChapter(title, text);
      resetPosition();
      measure();
      const anchor = position && typeof position === "object" ? position : null;
      let page = 0;
      if (position === "end") page = state.pages - 1;
      else if (anchor) page = pageOfAnchor(anchor);
      setPage(page, false, anchor);
    });
  }
  function setPage(page, animate, keepAnchor = null) {
    state.page = clamp(page, 0, state.pages - 1);
    state.anchor = keepAnchor || anchorAtPage(state.page);
    content.classList.toggle("animate", animate);
    const transform = "translate3d(".concat(-state.page * state.pageWidth, "px, 0, 0)");
    content.style.webkitTransform = transform;
    content.style.transform = transform;
    updateFooter();
    scheduleSave();
    changeHandler();
  }
  function percent() {
    const book = state.book;
    if (!book.totalChars) return 0;
    const len = book.lens[state.chapter];
    const read = state.chapterStarts[state.chapter] + len * (state.page + 1) / state.pages;
    return Math.min(100, read / book.totalChars * 100);
  }
  function updateFooter() {
    chapterName.textContent = state.book.titles[state.chapter];
    pageInfo.textContent = state.failed ? "" : "".concat(state.page + 1, " / ").concat(state.pages);
    percentInfo.textContent = "".concat(percent().toFixed(1), "%");
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      persistProgress();
    }, SAVE_DELAY_MS);
  }
  function persistProgress() {
    const book = state.book;
    if (!book) return;
    const patch = {
      progress: {
        chapter: state.chapter,
        block: state.anchor.block,
        offset: state.anchor.offset,
        chapterTitle: book.titles[state.chapter]
      },
      percent: Math.round(percent() * 10) / 10,
      lastReadAt: Date.now()
    };
    state.book = Object.assign({}, book, patch);
    updateBook(book.id, (stored) => Object.assign({}, stored, patch)).catch((err2) => console.error("\u5132\u5B58\u9032\u5EA6\u5931\u6557", err2));
  }

  // js/settings.js
  var KEY = "novel-reader:settings";
  var THEMES = {
    light: { label: "\u767D", bg: "#fbfbf8", fg: "#222222", sub: "#8a8a85", panel: "#ffffff", line: "#e4e4e0" },
    sepia: { label: "\u7C73\u9EC3", bg: "#f4ecd8", fg: "#3b3024", sub: "#9a8b73", panel: "#fbf5e6", line: "#e0d4b8" },
    green: { label: "\u8B77\u773C", bg: "#cfe6cf", fg: "#1f3320", sub: "#5f7a60", panel: "#e2f1e2", line: "#b3d1b3" },
    dark: { label: "\u591C\u9593", bg: "#121212", fg: "#a8a8a3", sub: "#5c5c58", panel: "#1e1e1e", line: "#2e2e2e" }
  };
  var FONTS = {
    serif: { label: "\u5B8B\u9AD4", css: '"Songti SC", "Songti TC", "STSong", "Noto Serif CJK SC", serif' },
    sans: { label: "\u9ED1\u9AD4", css: '-apple-system, "PingFang SC", "PingFang TC", "Microsoft YaHei", sans-serif' },
    kai: { label: "\u6977\u9AD4", css: '"Kaiti SC", "Kaiti TC", "STKaiti", "KaiTi", serif' }
  };
  var LIMITS = {
    fontSize: { min: 14, max: 32, step: 1 },
    lineHeight: { min: 1.4, max: 2.4, step: 0.1 }
  };
  var NARROW_SCREEN_PX = 360;
  var DEFAULTS = {
    fontSize: window.innerWidth < NARROW_SCREEN_PX ? 18 : 19,
    lineHeight: 1.8,
    theme: "sepia",
    font: "serif"
  };
  function clamp2(value, { min, max: max2 }) {
    return Math.min(max2, Math.max(min, value));
  }
  function sanitize(raw) {
    const s = __spreadValues(__spreadValues({}, DEFAULTS), raw && typeof raw === "object" ? raw : {});
    return {
      fontSize: clamp2(Number(s.fontSize) || DEFAULTS.fontSize, LIMITS.fontSize),
      lineHeight: Math.round(clamp2(Number(s.lineHeight) || DEFAULTS.lineHeight, LIMITS.lineHeight) * 10) / 10,
      theme: s.theme in THEMES ? s.theme : DEFAULTS.theme,
      font: s.font in FONTS ? s.font : DEFAULTS.font
    };
  }
  function loadSettings() {
    try {
      return sanitize(JSON.parse(localStorage.getItem(KEY)));
    } catch (err2) {
      console.warn("\u8B80\u53D6\u8A2D\u5B9A\u5931\u6557\uFF0C\u4F7F\u7528\u9810\u8A2D\u503C", err2);
      return __spreadValues({}, DEFAULTS);
    }
  }
  function saveSettings(settings2) {
    const clean = sanitize(settings2);
    try {
      localStorage.setItem(KEY, JSON.stringify(clean));
    } catch (err2) {
      console.warn("\u5132\u5B58\u8A2D\u5B9A\u5931\u6557", err2);
    }
    return clean;
  }
  function applySettings(settings2) {
    const theme = THEMES[settings2.theme];
    const root = document.documentElement.style;
    root.setProperty("--bg", theme.bg);
    root.setProperty("--fg", theme.fg);
    root.setProperty("--sub", theme.sub);
    root.setProperty("--panel", theme.panel);
    root.setProperty("--line", theme.line);
    root.setProperty("--font-size", "".concat(settings2.fontSize, "px"));
    root.setProperty("--line-height", String(settings2.lineHeight));
    root.setProperty("--font", FONTS[settings2.font].css);
    document.documentElement.dataset.theme = settings2.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme.bg);
  }

  // js/reader-ui.js
  var SWIPE_MIN_PX = 40;
  var TAP_PREV_ZONE = 0.3;
  var TAP_NEXT_ZONE = 0.7;
  var CLICK_SUPPRESS_MS = 500;
  var TOAST_MS = 1500;
  var CLOCK_INTERVAL_MS = 2e4;
  var $ = (id) => document.getElementById(id);
  var stage = $("stage");
  var menu = $("menu");
  var toc = $("toc");
  var tocList = $("toc-list");
  var settingsPanel = $("settings-panel");
  var slider = $("chapter-slider");
  var sliderLabel = $("slider-label");
  var toast = $("toast");
  var download = $("download");
  var settings = loadSettings();
  var toastTimer = null;
  function initReaderUi({ onBack }) {
    applySettings(settings);
    bindStage();
    bindMenu(onBack);
    bindToc();
    bindSettings();
    bindKeyboard();
    startClock();
    onEdge(showToast);
    onChange(syncMenu);
  }
  function onBookOpened() {
    const { chapterTitles } = getState();
    const frag = document.createDocumentFragment();
    chapterTitles.forEach((title, i2) => {
      const li = document.createElement("li");
      li.textContent = title;
      li.dataset.index = String(i2);
      frag.append(li);
    });
    setChildren(tocList, [frag]);
    slider.max = String(Math.max(0, chapterTitles.length - 1));
    closeAllPanels();
  }
  function isAnyPanelOpen() {
    return !menu.hidden || !toc.hidden || !settingsPanel.hidden;
  }
  function closeAllPanels() {
    menu.hidden = true;
    toc.hidden = true;
    settingsPanel.hidden = true;
  }
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, TOAST_MS);
  }
  function showDownload(done, total) {
    if (!total || done >= total) {
      download.hidden = true;
      return;
    }
    $("download-text").textContent = "\u4E0B\u8F09\u4E2D ".concat(done, "/").concat(total);
    $("download-fill").style.width = "".concat(done / total * 100, "%");
    download.hidden = false;
  }
  function bindStage() {
    let touchStart = null;
    let suppressClickUntil = 0;
    stage.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    stage.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
    stage.addEventListener("touchend", (e) => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
      suppressClickUntil = Date.now() + CLICK_SUPPRESS_MS;
      if (dx < 0) nextPage();
      else prevPage();
    });
    stage.addEventListener("click", (e) => {
      if (Date.now() < suppressClickUntil) return;
      const x2 = e.clientX / stage.clientWidth;
      if (x2 < TAP_PREV_ZONE) prevPage();
      else if (x2 > TAP_NEXT_ZONE) nextPage();
      else openMenu();
    });
  }
  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if ($("reader").hidden || isAnyPanelOpen()) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") nextPage();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prevPage();
      else return;
      e.preventDefault();
    });
  }
  function openMenu() {
    menu.hidden = false;
    syncMenu();
  }
  function syncMenu() {
    var _a2;
    if (menu.hidden && toc.hidden) return;
    const s = getState();
    $("menu-title").textContent = s.title;
    slider.value = String(s.chapter);
    sliderLabel.textContent = (_a2 = s.chapterTitles[s.chapter]) != null ? _a2 : "";
  }
  function bindMenu(onBack) {
    $("menu-close-area").addEventListener("click", () => {
      menu.hidden = true;
    });
    $("btn-back").addEventListener("click", () => {
      closeAllPanels();
      onBack();
    });
    $("btn-prev-ch").addEventListener("click", () => goChapter(getState().chapter - 1));
    $("btn-next-ch").addEventListener("click", () => goChapter(getState().chapter + 1));
    slider.addEventListener("input", () => {
      var _a2;
      sliderLabel.textContent = (_a2 = getState().chapterTitles[Number(slider.value)]) != null ? _a2 : "";
    });
    slider.addEventListener("change", () => goChapter(Number(slider.value)));
    $("btn-toc").addEventListener("click", openToc);
    $("btn-settings").addEventListener("click", () => {
      menu.hidden = true;
      renderSettings();
      settingsPanel.hidden = false;
    });
  }
  function openToc() {
    var _a2;
    menu.hidden = true;
    const { chapter } = getState();
    (_a2 = tocList.querySelector("li.current")) == null ? void 0 : _a2.classList.remove("current");
    const current = tocList.children[chapter];
    current == null ? void 0 : current.classList.add("current");
    toc.hidden = false;
    current == null ? void 0 : current.scrollIntoView({ block: "center" });
  }
  function bindToc() {
    const close2 = () => {
      toc.hidden = true;
    };
    $("btn-toc-close").addEventListener("click", close2);
    $("toc-mask").addEventListener("click", close2);
    tocList.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-index]");
      if (!li) return;
      close2();
      goChapter(Number(li.dataset.index));
    });
  }
  function updateSettings(patch) {
    settings = saveSettings(__spreadValues(__spreadValues({}, settings), patch));
    applySettings(settings);
    relayout();
    renderSettings();
  }
  function renderOptions(container, entries, activeKey, key, decorate) {
    const buttons = Object.keys(entries).map((id) => {
      const item = entries[id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.label;
      btn.dataset[key] = id;
      btn.classList.toggle("active", id === activeKey);
      decorate == null ? void 0 : decorate(btn, item);
      return btn;
    });
    setChildren(container, buttons);
  }
  function renderSettings() {
    $("val-fontSize").textContent = String(settings.fontSize);
    $("val-lineHeight").textContent = settings.lineHeight.toFixed(1);
    renderOptions($("font-options"), FONTS, settings.font, "font", (btn, item) => {
      btn.style.fontFamily = item.css;
    });
    renderOptions($("theme-options"), THEMES, settings.theme, "theme", (btn, item) => {
      btn.classList.add("swatch");
      btn.style.background = item.bg;
      btn.style.color = item.fg;
    });
  }
  function bindSettings() {
    $("settings-mask").addEventListener("click", () => {
      settingsPanel.hidden = true;
    });
    settingsPanel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.step) {
        const key = btn.dataset.step;
        const delta = LIMITS[key].step * Number(btn.dataset.dir);
        updateSettings({ [key]: settings[key] + delta });
      } else if (btn.dataset.font) {
        updateSettings({ font: btn.dataset.font });
      } else if (btn.dataset.theme) {
        updateSettings({ theme: btn.dataset.theme });
      }
    });
  }
  function startClock() {
    const clock = $("clock");
    const tick = () => {
      const now = /* @__PURE__ */ new Date();
      clock.textContent = "".concat(now.getHours(), ":").concat(String(now.getMinutes()).padStart(2, "0"));
    };
    tick();
    setInterval(tick, CLOCK_INTERVAL_MS);
  }

  // js/app.js
  var LAST_BOOK_KEY = "novel-reader:last-book";
  var RESIZE_DEBOUNCE_MS = 150;
  var shelfView = document.getElementById("shelf");
  var readerView = document.getElementById("reader");
  var downloading = {};
  function rememberBook(id) {
    try {
      if (id) localStorage.setItem(LAST_BOOK_KEY, id);
      else localStorage.removeItem(LAST_BOOK_KEY);
    } catch (err2) {
      console.warn("\u7121\u6CD5\u8A18\u9304\u4E0A\u6B21\u95B1\u8B80\u7684\u66F8", err2);
    }
  }
  function lastBook() {
    try {
      return localStorage.getItem(LAST_BOOK_KEY);
    } catch (e) {
      return null;
    }
  }
  function openBook(id) {
    return __async(this, null, function* () {
      try {
        yield loadBook(id);
      } catch (err2) {
        console.error("\u6253\u958B\u66F8\u672C\u5931\u6557", err2);
        rememberBook(null);
        showStatus("\u6253\u4E0D\u958B\u9019\u672C\u66F8\uFF0C\u53EF\u80FD\u5DF2\u88AB\u522A\u9664", true);
        yield showShelf();
        return;
      }
      shelfView.hidden = true;
      readerView.hidden = false;
      onBookOpened();
      rememberBook(id);
      yield start();
      prefetchBuiltin(id);
    });
  }
  function prefetchBuiltin(id) {
    return __async(this, null, function* () {
      if (downloading[id]) return;
      const book = yield getBook(id).catch(() => null);
      if (!book || !book.builtin || isFullyDownloaded(book)) return;
      downloading[id] = true;
      try {
        yield downloadRemaining(id, showDownload);
        showToast("\u300A".concat(book.title, "\u300B\u5DF2\u5168\u90E8\u4E0B\u8F09\uFF0C\u53EF\u4EE5\u96E2\u7DDA\u95B1\u8B80\u4E86"));
      } catch (err2) {
        console.warn("\u80CC\u666F\u4E0B\u8F09\u4E2D\u65B7\uFF0C\u6709\u7DB2\u8DEF\u6642\u6703\u81EA\u52D5\u7E7C\u7E8C", err2);
        const latest = yield getBook(id).catch(() => null);
        if (latest) showToast("\u4E0B\u8F09\u4E2D\u65B7\uFF08".concat(readyCount(latest), "/").concat(latest.chunkStarts.length, "\uFF09\uFF0C\u6709\u7DB2\u8DEF\u6642\u6703\u81EA\u52D5\u7E7C\u7E8C\uFF0C\u5148\u5225\u96E2\u7DDA"));
      } finally {
        downloading[id] = false;
        showDownload(0, 0);
      }
    });
  }
  function resumeDownloads() {
    return __async(this, null, function* () {
      const books = yield listBooks().catch(() => []);
      books.forEach((b) => prefetchBuiltin(b.id));
    });
  }
  function showShelf() {
    return __async(this, null, function* () {
      close();
      readerView.hidden = true;
      shelfView.hidden = false;
      rememberBook(null);
      yield refreshShelf();
    });
  }
  function bindLifecycle() {
    let timer = null;
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(() => relayout(), RESIZE_DEBOUNCE_MS);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushProgress();
      else resumeDownloads();
    });
    window.addEventListener("online", resumeDownloads);
    window.addEventListener("pagehide", () => flushProgress());
  }
  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").catch((err2) => console.warn("\u96E2\u7DDA\u5FEB\u53D6\u8A3B\u518A\u5931\u6557", err2));
  }
  function fixLegacyStatusBar() {
    const supportsEnv = window.CSS && CSS.supports && CSS.supports("padding-top: env(safe-area-inset-top)");
    if (navigator.standalone && !supportsEnv) document.documentElement.classList.add("legacy-standalone");
  }
  function main() {
    return __async(this, null, function* () {
      var _a2, _b2;
      fixLegacyStatusBar();
      setChunkLoader(loadBuiltinChunk);
      initShelf({ onOpen: openBook });
      initReaderUi({ onBack: showShelf });
      bindLifecycle();
      registerServiceWorker();
      (_b2 = (_a2 = navigator.storage) == null ? void 0 : _a2.persist) == null ? void 0 : _b2.call(_a2).catch(() => {
      });
      const id = lastBook();
      if (id) yield openBook(id);
      else yield refreshShelf();
      resumeDownloads();
    });
  }
  main();
})();
