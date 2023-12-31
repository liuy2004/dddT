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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ClientServerInputMultiplexerDemultiplexer, ResumableClientServerInputMultiplexerDemultiplexer, ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer, StreamIdGenerator, } from "./ClientServerMultiplexerDemultiplexer.js";
import { Flags, FrameTypes } from "./Frames.js";
import { DefaultConnectionFrameHandler, DefaultStreamRequestHandler, KeepAliveHandler, KeepAliveSender, LeaseHandler, RSocketRequester, } from "./RSocketSupport.js";
import { FrameStore } from "./Resume.js";
var RSocketConnector = /** @class */ (function () {
    function RSocketConnector(config) {
        this.config = config;
    }
    RSocketConnector.prototype.connect = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __awaiter(this, void 0, void 0, function () {
            var config, setupFrame, connection, keepAliveSender, keepAliveHandler, leaseHandler, responder, connectionFrameHandler, streamsHandler;
            var _this = this;
            return __generator(this, function (_w) {
                switch (_w.label) {
                    case 0:
                        config = this.config;
                        setupFrame = {
                            type: FrameTypes.SETUP,
                            dataMimeType: (_b = (_a = config.setup) === null || _a === void 0 ? void 0 : _a.dataMimeType) !== null && _b !== void 0 ? _b : "application/octet-stream",
                            metadataMimeType: (_d = (_c = config.setup) === null || _c === void 0 ? void 0 : _c.metadataMimeType) !== null && _d !== void 0 ? _d : "application/octet-stream",
                            keepAlive: (_f = (_e = config.setup) === null || _e === void 0 ? void 0 : _e.keepAlive) !== null && _f !== void 0 ? _f : 60000,
                            lifetime: (_h = (_g = config.setup) === null || _g === void 0 ? void 0 : _g.lifetime) !== null && _h !== void 0 ? _h : 300000,
                            metadata: (_k = (_j = config.setup) === null || _j === void 0 ? void 0 : _j.payload) === null || _k === void 0 ? void 0 : _k.metadata,
                            data: (_m = (_l = config.setup) === null || _l === void 0 ? void 0 : _l.payload) === null || _m === void 0 ? void 0 : _m.data,
                            resumeToken: (_p = (_o = config.resume) === null || _o === void 0 ? void 0 : _o.tokenGenerator()) !== null && _p !== void 0 ? _p : null,
                            streamId: 0,
                            majorVersion: 1,
                            minorVersion: 0,
                            flags: (((_r = (_q = config.setup) === null || _q === void 0 ? void 0 : _q.payload) === null || _r === void 0 ? void 0 : _r.metadata) ? Flags.METADATA : Flags.NONE) |
                                (config.lease ? Flags.LEASE : Flags.NONE) |
                                (config.resume ? Flags.RESUME_ENABLE : Flags.NONE),
                        };
                        return [4 /*yield*/, config.transport.connect(function (outbound) {
                                return config.resume
                                    ? new ResumableClientServerInputMultiplexerDemultiplexer(StreamIdGenerator.create(-1), outbound, outbound, new FrameStore(), // TODO: add size control
                                    setupFrame.resumeToken.toString(), function (self, frameStore) { return __awaiter(_this, void 0, void 0, function () {
                                        var multiplexerDemultiplexerProvider, reconnectionAttempts, reconnector;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    multiplexerDemultiplexerProvider = function (outbound) {
                                                        outbound.send({
                                                            type: FrameTypes.RESUME,
                                                            streamId: 0,
                                                            flags: Flags.NONE,
                                                            clientPosition: frameStore.firstAvailableFramePosition,
                                                            serverPosition: frameStore.lastReceivedFramePosition,
                                                            majorVersion: setupFrame.minorVersion,
                                                            minorVersion: setupFrame.majorVersion,
                                                            resumeToken: setupFrame.resumeToken,
                                                        });
                                                        return new ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer(outbound, outbound, self);
                                                    };
                                                    reconnectionAttempts = -1;
                                                    reconnector = function () {
                                                        reconnectionAttempts++;
                                                        return config.resume
                                                            .reconnectFunction(reconnectionAttempts)
                                                            .then(function () {
                                                            return config.transport
                                                                .connect(multiplexerDemultiplexerProvider)
                                                                .catch(reconnector);
                                                        });
                                                    };
                                                    return [4 /*yield*/, reconnector()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })
                                    : new ClientServerInputMultiplexerDemultiplexer(StreamIdGenerator.create(-1), outbound, outbound);
                            })];
                    case 1:
                        connection = _w.sent();
                        keepAliveSender = new KeepAliveSender(connection.multiplexerDemultiplexer.connectionOutbound, setupFrame.keepAlive);
                        keepAliveHandler = new KeepAliveHandler(connection, setupFrame.lifetime);
                        leaseHandler = config.lease
                            ? new LeaseHandler((_s = config.lease.maxPendingRequests) !== null && _s !== void 0 ? _s : 256, connection.multiplexerDemultiplexer)
                            : undefined;
                        responder = (_t = config.responder) !== null && _t !== void 0 ? _t : {};
                        connectionFrameHandler = new DefaultConnectionFrameHandler(connection, keepAliveHandler, keepAliveSender, leaseHandler, responder);
                        streamsHandler = new DefaultStreamRequestHandler(responder, 0);
                        connection.onClose(function (e) {
                            keepAliveSender.close();
                            keepAliveHandler.close();
                            connectionFrameHandler.close(e);
                        });
                        connection.multiplexerDemultiplexer.connectionInbound(connectionFrameHandler);
                        connection.multiplexerDemultiplexer.handleRequestStream(streamsHandler);
                        connection.multiplexerDemultiplexer.connectionOutbound.send(setupFrame);
                        keepAliveHandler.start();
                        keepAliveSender.start();
                        return [2 /*return*/, new RSocketRequester(connection, (_v = (_u = config.fragmentation) === null || _u === void 0 ? void 0 : _u.maxOutboundFragmentSize) !== null && _v !== void 0 ? _v : 0, leaseHandler)];
                }
            });
        });
    };
    return RSocketConnector;
}());
export { RSocketConnector };
//# sourceMappingURL=RSocketConnector.js.map