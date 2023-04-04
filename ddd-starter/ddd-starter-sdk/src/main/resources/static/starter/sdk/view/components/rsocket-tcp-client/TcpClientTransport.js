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
import net from "./__mocks__/net.js";
import { TcpDuplexConnection } from "./TcpDuplexConnection.js";
var TcpClientTransport = /** @class */ (function () {
    function TcpClientTransport(options) {
        var _a;
        this.connectionOptions = options.connectionOptions;
        this.socketCreator =
            (_a = options.socketCreator) !== null && _a !== void 0 ? _a : (function (options) { return net.connect(options); });
    }
    TcpClientTransport.prototype.connect = function (multiplexerDemultiplexerFactory) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var socket;
            var openListener = function () {
                socket.removeListener("error", errorListener);
                socket.removeListener("close", errorListener);
                socket.removeListener("end", errorListener);
                resolve(new TcpDuplexConnection(socket, new Deserializer(), multiplexerDemultiplexerFactory));
            };
            var errorListener = function (error) {
                socket.removeListener("error", errorListener);
                socket.removeListener("close", errorListener);
                socket.removeListener("end", errorListener);
                reject(error);
            };
            socket = _this.socketCreator(_this.connectionOptions);
            socket.once("connect", openListener);
            socket.once("error", errorListener);
            socket.once("close", errorListener);
            socket.once("end", errorListener);
        });
    };
    return TcpClientTransport;
}());
export { TcpClientTransport };
//# sourceMappingURL=TcpClientTransport.js.map