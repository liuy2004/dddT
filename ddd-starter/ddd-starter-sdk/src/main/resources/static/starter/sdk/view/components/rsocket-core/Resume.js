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
import { ErrorCodes, RSocketError } from "./index.js";
import { sizeOfFrame } from "./Codecs.js";
var FrameStore = /** @class */ (function () {
    function FrameStore() {
        this.storedFrames = [];
        this._lastReceivedFramePosition = 0;
        this._firstAvailableFramePosition = 0;
        this._lastSentFramePosition = 0;
    }
    Object.defineProperty(FrameStore.prototype, "lastReceivedFramePosition", {
        get: function () {
            return this._lastReceivedFramePosition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStore.prototype, "firstAvailableFramePosition", {
        get: function () {
            return this._firstAvailableFramePosition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStore.prototype, "lastSentFramePosition", {
        get: function () {
            return this._lastSentFramePosition;
        },
        enumerable: false,
        configurable: true
    });
    FrameStore.prototype.store = function (frame) {
        this._lastSentFramePosition += sizeOfFrame(frame);
        this.storedFrames.push(frame);
    };
    FrameStore.prototype.record = function (frame) {
        this._lastReceivedFramePosition += sizeOfFrame(frame);
    };
    FrameStore.prototype.dropTo = function (lastReceivedPosition) {
        var bytesToDrop = lastReceivedPosition - this._firstAvailableFramePosition;
        while (bytesToDrop > 0 && this.storedFrames.length > 0) {
            var storedFrame = this.storedFrames.shift();
            bytesToDrop -= sizeOfFrame(storedFrame);
        }
        if (bytesToDrop !== 0) {
            throw new RSocketError(ErrorCodes.CONNECTION_ERROR, "State inconsistency. Expected bytes to drop ".concat(lastReceivedPosition - this._firstAvailableFramePosition, " but actual ").concat(bytesToDrop));
        }
        this._firstAvailableFramePosition = lastReceivedPosition;
    };
    FrameStore.prototype.drain = function (consumer) {
        var e_1, _a;
        try {
            for (var _b = __values(this.storedFrames), _c = _b.next(); !_c.done; _c = _b.next()) {
                var frame = _c.value;
                consumer(frame);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return FrameStore;
}());
export { FrameStore };
//# sourceMappingURL=Resume.js.map