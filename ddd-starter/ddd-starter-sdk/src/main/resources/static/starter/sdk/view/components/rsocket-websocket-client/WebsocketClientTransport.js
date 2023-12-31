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
import { Deserializer, } from "../rsocket-core/index.js";
import { WebsocketDuplexConnection } from "./WebsocketDuplexConnection.js";
var WebsocketClientTransport = /** @class */ (function () {
    function WebsocketClientTransport(options) {
        var _a;
        this.url = options.url;
        this.factory = (_a = options.wsCreator) !== null && _a !== void 0 ? _a : (function (url) { return new WebSocket(url); });
    }
    WebsocketClientTransport.prototype.connect = function (multiplexerDemultiplexerFactory) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var websocket = _this.factory(_this.url);
            websocket.binaryType = "arraybuffer";
            var openListener = function () {
                websocket.removeEventListener("open", openListener);
                websocket.removeEventListener("error", errorListener);
                resolve(new WebsocketDuplexConnection(websocket, new Deserializer(), multiplexerDemultiplexerFactory));
            };
            var errorListener = function (ev) {
                websocket.removeEventListener("open", openListener);
                websocket.removeEventListener("error", errorListener);
                reject(ev.error);
            };
            websocket.addEventListener("open", openListener);
            websocket.addEventListener("error", errorListener);
        });
    };
    return WebsocketClientTransport;
}());
export { WebsocketClientTransport };
//# sourceMappingURL=WebsocketClientTransport.js.map