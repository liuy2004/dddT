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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { Deferred, serializeFrameWithLength, } from "../rsocket-core/index.js";
var TcpDuplexConnection = /** @class */ (function (_super) {
    __extends(TcpDuplexConnection, _super);
    function TcpDuplexConnection(socket, 
    // dependency injected to facilitate testing
    deserializer, multiplexerDemultiplexerFactory) {
        var _this = _super.call(this) || this;
        _this.socket = socket;
        _this.deserializer = deserializer;
        _this.remainingBuffer = Buffer.allocUnsafe(0);
        /**
         * Handles close event from the underlying socket.
         * @param hadError
         * @private
         */
        _this.handleClosed = function (hadError) {
            var message = hadError
                ? "TcpDuplexConnection: ".concat(_this.error.message)
                : "TcpDuplexConnection: Socket closed unexpectedly.";
            _this.close(new Error(message));
        };
        /**
         * Handles error events from the underlying socket. `handleClosed` is expected to be called
         * immediately following `handleError`.
         * @param error
         * @private
         */
        _this.handleError = function (error) {
            _this.error = error;
        };
        _this.handleData = function (chunks) {
            var e_1, _a;
            try {
                // Combine partial frame data from previous chunks with the next chunk,
                // then extract any complete frames plus any remaining data.
                var buffer = Buffer.concat([_this.remainingBuffer, chunks]);
                var lastOffset = 0;
                var frames_2 = _this.deserializer.deserializeFrames(buffer);
                try {
                    for (var frames_1 = __values(frames_2), frames_1_1 = frames_1.next(); !frames_1_1.done; frames_1_1 = frames_1.next()) {
                        var _b = __read(frames_1_1.value, 2), frame = _b[0], offset = _b[1];
                        lastOffset = offset;
                        _this.multiplexerDemultiplexer.handle(frame);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (frames_1_1 && !frames_1_1.done && (_a = frames_1.return)) _a.call(frames_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                _this.remainingBuffer = buffer.slice(lastOffset, buffer.length);
            }
            catch (error) {
                _this.close(error);
            }
        };
        /**
         * Emitted when an error occurs. The 'close' event will be called directly following this event.
         */
        socket.on("error", _this.handleError);
        /**
         * Emitted once the socket is fully closed. The argument hadError is a boolean which says
         * if the socket was closed due to a transmission error.
         */
        socket.on("close", _this.handleClosed);
        /**
         * Emitted when data is received. The argument data will be a Buffer or String. Encoding of data is set by
         * socket.setEncoding(). The data will be lost if there is no listener when a Socket emits a 'data' event.
         */
        socket.on("data", _this.handleData);
        _this.multiplexerDemultiplexer = multiplexerDemultiplexerFactory(_this);
        return _this;
    }
    Object.defineProperty(TcpDuplexConnection.prototype, "availability", {
        get: function () {
            return this.done ? 0 : 1;
        },
        enumerable: false,
        configurable: true
    });
    TcpDuplexConnection.prototype.close = function (error) {
        if (this.done) {
            return;
        }
        this.socket.off("error", this.handleError);
        this.socket.off("close", this.handleClosed);
        this.socket.off("data", this.handleData);
        this.socket.end();
        delete this.socket;
        _super.prototype.close.call(this, error);
    };
    TcpDuplexConnection.prototype.send = function (frame) {
        if (this.done) {
            return;
        }
        var buffer = serializeFrameWithLength(frame);
        this.socket.write(buffer);
    };
    return TcpDuplexConnection;
}(Deferred));
export { TcpDuplexConnection };
//# sourceMappingURL=TcpDuplexConnection.js.map