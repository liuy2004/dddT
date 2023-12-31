/*
 * Copyright 2021-2022 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Deferred = /** @class */ (function () {
    function Deferred() {
        this._done = false;
        this.onCloseCallbacks = [];
    }
    Object.defineProperty(Deferred.prototype, "done", {
        get: function () {
            return this._done;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Signals to an observer that the Deferred operation has been closed, which invokes
     * the provided `onClose` callback.
     */
    Deferred.prototype.close = function (error) {
        var e_1, _a, e_2, _b;
        if (this.done) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        this._done = true;
        this._error = error;
        if (error) {
            try {
                for (var _c = __values(this.onCloseCallbacks), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var callback = _d.value;
                    callback(error);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return;
        }
        try {
            for (var _e = __values(this.onCloseCallbacks), _f = _e.next(); !_f.done; _f = _e.next()) {
                var callback = _f.value;
                callback();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * Registers a callback to be called when the Closeable is closed. optionally with an Error.
     */
    Deferred.prototype.onClose = function (callback) {
        if (this._done) {
            callback(this._error);
            return;
        }
        this.onCloseCallbacks.push(callback);
    };
    return Deferred;
}());
export { Deferred };
//# sourceMappingURL=Deferred.js.map