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
import { ClientServerInputMultiplexerDemultiplexer, ResumableClientServerInputMultiplexerDemultiplexer, StreamIdGenerator, } from "./ClientServerMultiplexerDemultiplexer.js";
import { ErrorCodes, RSocketError } from "./Errors.js";
import { Flags, FrameTypes } from "./Frames.js";
import { DefaultConnectionFrameHandler, DefaultStreamRequestHandler, KeepAliveHandler, KeepAliveSender, LeaseHandler, RSocketRequester, } from "./RSocketSupport.js";
import { FrameStore } from "./Resume.js";
var RSocketServer = /** @class */ (function () {
    function RSocketServer(config) {
        var _a, _b;
        this.acceptor = config.acceptor;
        this.transport = config.transport;
        this.lease = config.lease;
        this.serverSideKeepAlive = config.serverSideKeepAlive;
        this.sessionStore = config.resume ? {} : undefined;
        this.sessionTimeout = (_b = (_a = config.resume) === null || _a === void 0 ? void 0 : _a.sessionTimeout) !== null && _b !== void 0 ? _b : undefined;
    }
    RSocketServer.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.transport.bind(function (frame, connection) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, error, error, leaseHandler, requester, responder, keepAliveHandler_1, keepAliveSender_1, connectionFrameHandler_1, streamsHandler, e_1;
                            var _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _a = frame.type;
                                        switch (_a) {
                                            case FrameTypes.SETUP: return [3 /*break*/, 1];
                                            case FrameTypes.RESUME: return [3 /*break*/, 5];
                                        }
                                        return [3 /*break*/, 6];
                                    case 1:
                                        _f.trys.push([1, 3, , 4]);
                                        if (this.lease && !Flags.hasLease(frame.flags)) {
                                            error = new RSocketError(ErrorCodes.REJECTED_SETUP, "Lease has to be enabled");
                                            connection.multiplexerDemultiplexer.connectionOutbound.send({
                                                type: FrameTypes.ERROR,
                                                streamId: 0,
                                                flags: Flags.NONE,
                                                code: error.code,
                                                message: error.message,
                                            });
                                            connection.close(error);
                                            return [2 /*return*/];
                                        }
                                        if (Flags.hasLease(frame.flags) && !this.lease) {
                                            error = new RSocketError(ErrorCodes.REJECTED_SETUP, "Lease has to be disabled");
                                            connection.multiplexerDemultiplexer.connectionOutbound.send({
                                                type: FrameTypes.ERROR,
                                                streamId: 0,
                                                flags: Flags.NONE,
                                                code: error.code,
                                                message: error.message,
                                            });
                                            connection.close(error);
                                            return [2 /*return*/];
                                        }
                                        leaseHandler = Flags.hasLease(frame.flags)
                                            ? new LeaseHandler((_b = this.lease.maxPendingRequests) !== null && _b !== void 0 ? _b : 256, connection.multiplexerDemultiplexer)
                                            : undefined;
                                        requester = new RSocketRequester(connection, (_d = (_c = this.fragmentation) === null || _c === void 0 ? void 0 : _c.maxOutboundFragmentSize) !== null && _d !== void 0 ? _d : 0, leaseHandler);
                                        return [4 /*yield*/, this.acceptor.accept({
                                                data: frame.data,
                                                dataMimeType: frame.dataMimeType,
                                                metadata: frame.metadata,
                                                metadataMimeType: frame.metadataMimeType,
                                                flags: frame.flags,
                                                keepAliveMaxLifetime: frame.lifetime,
                                                keepAliveInterval: frame.keepAlive,
                                                resumeToken: frame.resumeToken,
                                            }, requester)];
                                    case 2:
                                        responder = _f.sent();
                                        keepAliveHandler_1 = new KeepAliveHandler(connection, frame.lifetime);
                                        keepAliveSender_1 = this.serverSideKeepAlive
                                            ? new KeepAliveSender(connection.multiplexerDemultiplexer.connectionOutbound, frame.keepAlive)
                                            : undefined;
                                        connectionFrameHandler_1 = new DefaultConnectionFrameHandler(connection, keepAliveHandler_1, keepAliveSender_1, leaseHandler, responder);
                                        streamsHandler = new DefaultStreamRequestHandler(responder, 0);
                                        connection.onClose(function (e) {
                                            keepAliveSender_1 === null || keepAliveSender_1 === void 0 ? void 0 : keepAliveSender_1.close();
                                            keepAliveHandler_1.close();
                                            connectionFrameHandler_1.close(e);
                                        });
                                        connection.multiplexerDemultiplexer.connectionInbound(connectionFrameHandler_1);
                                        connection.multiplexerDemultiplexer.handleRequestStream(streamsHandler);
                                        keepAliveHandler_1.start();
                                        keepAliveSender_1 === null || keepAliveSender_1 === void 0 ? void 0 : keepAliveSender_1.start();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _f.sent();
                                        connection.multiplexerDemultiplexer.connectionOutbound.send({
                                            type: FrameTypes.ERROR,
                                            streamId: 0,
                                            code: ErrorCodes.REJECTED_SETUP,
                                            message: (_e = e_1.message) !== null && _e !== void 0 ? _e : "",
                                            flags: Flags.NONE,
                                        });
                                        connection.close(e_1 instanceof RSocketError
                                            ? e_1
                                            : new RSocketError(ErrorCodes.REJECTED_SETUP, e_1.message));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                    case 5:
                                        {
                                            // frame should be handled earlier
                                            return [2 /*return*/];
                                        }
                                        _f.label = 6;
                                    case 6:
                                        {
                                            connection.multiplexerDemultiplexer.connectionOutbound.send({
                                                type: FrameTypes.ERROR,
                                                streamId: 0,
                                                code: ErrorCodes.UNSUPPORTED_SETUP,
                                                message: "Unsupported setup",
                                                flags: Flags.NONE,
                                            });
                                            connection.close(new RSocketError(ErrorCodes.UNSUPPORTED_SETUP));
                                        }
                                        _f.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); }, function (frame, outbound) {
                            if (frame.type === FrameTypes.RESUME) {
                                if (_this.sessionStore) {
                                    var multiplexerDemultiplexer = _this.sessionStore[frame.resumeToken.toString()];
                                    if (!multiplexerDemultiplexer) {
                                        outbound.send({
                                            type: FrameTypes.ERROR,
                                            streamId: 0,
                                            code: ErrorCodes.REJECTED_RESUME,
                                            message: "No session found for the given resume token",
                                            flags: Flags.NONE,
                                        });
                                        outbound.close();
                                        return;
                                    }
                                    multiplexerDemultiplexer.resume(frame, outbound, outbound);
                                    return multiplexerDemultiplexer;
                                }
                                outbound.send({
                                    type: FrameTypes.ERROR,
                                    streamId: 0,
                                    code: ErrorCodes.REJECTED_RESUME,
                                    message: "Resume is not enabled",
                                    flags: Flags.NONE,
                                });
                                outbound.close();
                                return;
                            }
                            else if (frame.type === FrameTypes.SETUP) {
                                if (Flags.hasResume(frame.flags)) {
                                    if (!_this.sessionStore) {
                                        var error = new RSocketError(ErrorCodes.REJECTED_SETUP, "No resume support");
                                        outbound.send({
                                            type: FrameTypes.ERROR,
                                            streamId: 0,
                                            flags: Flags.NONE,
                                            code: error.code,
                                            message: error.message,
                                        });
                                        outbound.close(error);
                                        return;
                                    }
                                    var multiplexerDumiltiplexer = new ResumableClientServerInputMultiplexerDemultiplexer(StreamIdGenerator.create(0), outbound, outbound, new FrameStore(), // TODO: add size parameter
                                    frame.resumeToken.toString(), _this.sessionStore, _this.sessionTimeout);
                                    _this.sessionStore[frame.resumeToken.toString()] =
                                        multiplexerDumiltiplexer;
                                    return multiplexerDumiltiplexer;
                                }
                            }
                            return new ClientServerInputMultiplexerDemultiplexer(StreamIdGenerator.create(0), outbound, outbound);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return RSocketServer;
}());
export { RSocketServer };
//# sourceMappingURL=RSocketServer.js.map