(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global = typeof globalThis !== 'undefined' ? globalThis : global || self;
        global.browserID3Writer = factory();
    }
})(this, function () {
    'use strict';

    function t(t, e) {
        return e = null == e ? t.srcElement || t.target : e, new Error(t + " on " + e);
    }

    function e(e) {
        return new Promise((function (r, n) {
            e.onload = function () { r(e.result); };
            e.onerror = function (o) { n(t(o, e)); };
        }));
    }

    function r(t) {
        if ("string" == typeof t) return t;
        var r = new FileReader();
        return r.readAsArrayBuffer(t), e(r);
    }

    function n(t) {
        if (t instanceof ArrayBuffer) return t;
        var r = new FileReader();
        return r.readAsArrayBuffer(new Blob([t])), e(r);
    }

    class o {
        constructor(t) {
            if (!t) throw new Error("Buffer is required");
            this.arrayBuffer = t;
            this.view = new DataView(t);
            this.offset = 0;
        }
        skip(t) {
            this.offset += t;
        }
        setUint8(t) {
            this.view.setUint8(this.offset, t);
            this.offset += 1;
        }
        setUint16(t) {
            this.view.setUint16(this.offset, t);
            this.offset += 2;
        }
        setUint32(t) {
            this.view.setUint32(this.offset, t);
            this.offset += 4;
        }
        setUint32Array(t) {
            t.forEach((t => { this.setUint32(t); }));
        }
        setUint8Array(t) {
            t.forEach((t => { this.setUint8(t); }));
        }
        setString(t) {
            for (var e = 0; e < t.length; e++) {
                this.setUint8(t.charCodeAt(e));
            }
        }
    }

    function i(t) {
        var e = t.length, r = new Uint8Array(e);
        for (var n = 0; n < e; n++) r[n] = t.charCodeAt(n);
        return r;
    }

    function s(t) {
        var e = t.length, r = new Uint16Array(e);
        for (var n = 0; n < e; n++) r[n] = t.charCodeAt(n);
        return r;
    }

<<<<<<< HEAD
=======
    // UTF-16LE conversion helper
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
    function u(t) {
        var e = t.length, r = new Uint8Array(2 * e);
        for (var n = 0; n < e; n++) {
            var o = t.charCodeAt(n);
            r[2 * n] = 255 & o;
            r[2 * n + 1] = o >> 8 & 255;
        }
        return r;
    }

<<<<<<< HEAD
    // UTF string array builder
=======
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
    function a(t) {
        var e = [];
        for (var r = 0; r < t.length; r++) {
            var n = t.charCodeAt(r);
            n < 128 ? e.push(n) : n < 2048 ? e.push(192 | n >> 6, 128 | 63 & n) : n < 55296 || n >= 57344 ? e.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (r++, n = 65536 + ((1023 & n) << 10 | 1023 & t.charCodeAt(r)), e.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n));
        }
        return new Uint8Array(e);
    }

    function h(t, e) {
        var r = 127 & t, n = 127 & t >> 7, o = 127 & t >> 14, i = 127 & t >> 21;
        return e ? [i, o, n, r] : [t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t];
    }

    function f(t) {
        return (127 & t[0]) << 21 | (127 & t[1]) << 14 | (127 & t[2]) << 7 | 127 & t[3];
    }

    function c(t) {
        return t[0] << 24 | t[1] << 16 | t[2] << 8 | t[3];
    }

    class d {
        constructor(t) {
            this.name = t;
            this.value = void 0;
        }
        set(t) {
            this.value = t;
        }
    }

    class l extends d {
        constructor(t) {
            super(t);
        }
        size(t) {
            var e = t.length;
            return "US-ASCII" === this.encoding ? e + 3 : 5 + 2 * e;
        }
        write(t, e) {
            var r = t.length;
            if ("US-ASCII" === this.encoding) {
                e.setUint8(0);
                var n = i(t);
                e.setUint8Array(n);
            } else {
                e.setUint8(1);
                e.setUint8(255);
                e.setUint8(254);
                var o = u(t);
                e.setUint8Array(o);
            }
            e.setUint8(0);
            e.setUint8(0);
        }
    }

    class v extends d {
        constructor(t) {
            super(t);
        }
        size(t) {
            var e = t.length;
            return "US-ASCII" === this.encoding ? e + 3 : 5 + 2 * e;
        }
        write(t, e) {
            var r = t.length;
            if ("US-ASCII" === this.encoding) {
                e.setUint8(0);
                var n = i(t);
                e.setUint8Array(n);
            } else {
                e.setUint8(1);
                e.setUint8(255);
                e.setUint8(254);
                var o = u(t);
                e.setUint8Array(o);
            }
            e.setUint8(0);
            e.setUint8(0);
        }
    }

    class p extends d {
        constructor(t) {
            super(t);
        }
<<<<<<< HEAD
        // FIXED: Sahi image size calculator (was over-allocating 14 bytes, causing binary corruption)
=======
        // FIX: Mobile-compatible accurate size calculator (US-ASCII vs UTF-16)
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
        size(t) {
            var e = t.mimeType.length, 
                r = t.description.length, 
                n = t.data.byteLength;
<<<<<<< HEAD
            return 7 + e + 2 * r + n;
        }
        write(t, e) {
            var r = i(t.mimeType);
            e.setUint8(1);
            e.setUint8Array(r);
            e.setUint8(0);
            e.setUint8(t.type);
            e.setUint8(255);
            e.setUint8(254);
            if (t.description.length) {
                var n = u(t.description);
                e.setUint8Array(n);
            }
            e.setUint8(0);
            e.setUint8(0);
=======
            if ("US-ASCII" === this.encoding) {
                return 4 + e + r + n;
            } else {
                return 7 + e + 2 * r + n;
            }
        }
        // FIX: Mobile-compatible dual-encoding writer (Writes clean ASCII for Mobile compatibility)
        write(t, e) {
            var r = i(t.mimeType);
            if ("US-ASCII" === this.encoding) {
                e.setUint8(0); // encoding 0 (US-ASCII)
                e.setUint8Array(r);
                e.setUint8(0);
                e.setUint8(t.type);
                if (t.description.length) {
                    var n = i(t.description);
                    e.setUint8Array(n);
                }
                e.setUint8(0);
            } else {
                e.setUint8(1); // encoding 1 (UTF-16LE)
                e.setUint8Array(r);
                e.setUint8(0);
                e.setUint8(t.type);
                e.setUint8(255);
                e.setUint8(254);
                if (t.description.length) {
                    var n = u(t.description);
                    e.setUint8Array(n);
                }
                e.setUint8(0);
                e.setUint8(0);
            }
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
            var o = new Uint8Array(t.data);
            e.setUint8Array(o);
        }
    }

    class y extends d {
        constructor(t) {
            super(t);
        }
        size(t) {
            var e = t.text.length, r = t.description.length;
            return "US-ASCII" === this.encoding ? 6 + e + r : 14 + 2 * (e + r);
        }
        write(t, e) {
            e.setUint8(1);
            e.setString(t.language);
            e.setUint8(255);
            e.setUint8(254);
            var r = u(t.description);
            e.setUint8Array(r);
            e.setUint8(0);
            e.setUint8(0);
            e.setUint8(255);
            e.setUint8(254);
            var n = u(t.text);
            e.setUint8Array(n);
            e.setUint8(0);
            e.setUint8(0);
        }
    }

    class g {
        constructor(t) {
            this.id = t;
            this.size = 0;
            this.flags = [0, 0];
            this.data = void 0;
        }
        set(t) {
            this.data = t;
        }
    }

    class BrowserID3Writer {
        constructor(t) {
            if (!t || 0 === t.byteLength) throw new Error("ArrayBuffer is required");
            this.buffer = t;
<<<<<<< HEAD
            this.padding = 0;
=======
            this.padding = 4096;
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
            this.frames = [];
            this.url = "";
        }
        setFrame(t, e) {
            var r;
            switch (t) {
                case "TPE1":
                case "TPE2":
                case "TCON":
                case "TCOM":
                case "USLT":
                case "APIC":
                case "COMM":
                case "TIT2":
                case "TALB":
                case "TYER":
                case "TRCK":
                    r = t;
                    break;
                default:
                    throw new Error("Unsupported frame: " + t);
            }
            var n = new g(r);
            n.set(e);
            this.frames.push(n);
            return this;
        }
        addTag() {
            var t = this.frames.map((t => {
                var e;
                switch (t.id) {
                    case "TIT2":
                    case "TALB":
                    case "TPE1":
                    case "TPE2":
                    case "TCON":
                    case "TCOM":
                    case "TYER":
                    case "TRCK":
                        (e = new l(t.id)).encoding = "UTF-16LE";
                        break;
                    case "COMM":
                        (e = new y(t.id)).encoding = "UTF-16LE";
                        break;
                    case "APIC":
<<<<<<< HEAD
                        (e = new p(t.id)).encoding = "UTF-16LE";
=======
                        // FIX: Forcing US-ASCII for APIC frame for maximum mobile/native player compatibility
                        (e = new p(t.id)).encoding = "US-ASCII";
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
                        break;
                    default:
                        throw new Error("Frame not implemented");
                }
                return {
                    id: t.id,
                    size: e.size(t.data),
                    flags: [0, 0],
                    write: e.write.bind(e, t.data)
                };
            }));
            var e = 10,
                r = t.reduce(((t, e) => t + e.size + 10), 0),
                n = this.padding,
                i = r + n,
                s = new o(new ArrayBuffer(e + i + this.buffer.byteLength));
            s.setString("ID3");
            s.setUint8(3);
            s.setUint8(0);
            s.setUint8(0);
            s.setUint8Array(h(i, !0));
            t.forEach((t => {
                s.setString(t.id);
                s.setUint8Array(h(t.size, !1));
                s.setUint8Array(t.flags);
                t.write(s);
            }));
            s.skip(n);
            var u = new Uint8Array(this.buffer);
            s.setUint8Array(u);
            this.arrayBuffer = s.arrayBuffer;
            return this.arrayBuffer;
        }
    }

    return BrowserID3Writer;
});