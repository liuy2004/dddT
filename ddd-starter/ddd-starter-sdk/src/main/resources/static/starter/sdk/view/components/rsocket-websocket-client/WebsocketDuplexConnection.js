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
import { Deferred, serializeFrame, } from "../rsocket-core/index.js";
var WebsocketDuplexConnection = /** @class */ (function (_super) {
    __extends(WebsocketDuplexConnection, _super);
    function WebsocketDuplexConnection(websocket, deserializer, multiplexerDemultiplexerFactory) {
        var _this = _super.call(this) || this;
        _this.websocket = websocket;
        _this.deserializer = deserializer;
        _this.handleClosed = function (e) {
            _this.close(new Error(e.reason || "WebsocketDuplexConnection: Socket closed unexpectedly."));
        };
        _this.handleError = function (e) {
            _this.close(e.error);
        };
        _this.handleMessage = function (message) {
            try {
                var buffer = Buffer.from(message.data);
                var frame = _this.deserializer.deserializeFrame(buffer);
                _this.multiplexerDemultiplexer.handle(frame);
            }
            catch (error) {
                _this.close(error);
            }
        };
        websocket.addEventListener("close", _this.handleClosed);
        websocket.addEventListener("error", _this.handleError);
        websocket.addEventListener("message", _this.handleMessage);
        _this.multiplexerDemultiplexer = multiplexerDemultiplexerFactory(_this);
        return _this;
    }
    Object.defineProperty(WebsocketDuplexConnection.prototype, "availability", {
        get: function () {
            return this.done ? 0 : 1;
        },
        enumerable: false,
        configurable: true
    });
    WebsocketDuplexConnection.prototype.close = function (error) {
        if (this.done) {
            _super.prototype.close.call(this, error);
            return;
        }
        this.websocket.removeEventListener("close", this.handleClosed);
        this.websocket.removeEventListener("error", this.handleError);
        this.websocket.removeEventListener("message", this.handleMessage);
        this.websocket.close();
        delete this.websocket;
        _super.prototype.close.call(this, error);
    };
    WebsocketDuplexConnection.prototype.send = function (frame) {
        if (this.done) {
            return;
        }
        var buffer = serializeFrame(frame);
        this.websocket.send(buffer);
    };
    return WebsocketDuplexConnection;
}(Deferred));
export { WebsocketDuplexConnection };
//# sourceMappingURL=WebsocketDuplexConnection.js.map