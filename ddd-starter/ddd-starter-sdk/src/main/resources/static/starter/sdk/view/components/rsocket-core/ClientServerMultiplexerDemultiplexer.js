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
import { ErrorCodes, Flags, FrameTypes } from "./index.js";
import { Deferred } from "./Deferred.js";
import { RSocketError } from "./Errors.js";
import { Frame } from "./Frames.js";
export var StreamIdGenerator;
(function (StreamIdGenerator) {
    function create(seedId) {
        return new StreamIdGeneratorImpl(seedId);
    }
    StreamIdGenerator.create = create;
    var StreamIdGeneratorImpl = /** @class */ (function () {
        function StreamIdGeneratorImpl(currentId) {
            this.currentId = currentId;
        }
        StreamIdGeneratorImpl.prototype.next = function (handler) {
            var nextId = this.currentId + 2;
            if (!handler(nextId)) {
                return;
            }
            this.currentId = nextId;
        };
        return StreamIdGeneratorImpl;
    }());
})(StreamIdGenerator || (StreamIdGenerator = {}));
var ClientServerInputMultiplexerDemultiplexer = /** @class */ (function (_super) {
    __extends(ClientServerInputMultiplexerDemultiplexer, _super);
    function ClientServerInputMultiplexerDemultiplexer(streamIdSupplier, outbound, closeable) {
        var _this = _super.call(this) || this;
        _this.streamIdSupplier = streamIdSupplier;
        _this.outbound = outbound;
        _this.closeable = closeable;
        _this.registry = {};
        closeable.onClose(_this.close.bind(_this));
        return _this;
    }
    ClientServerInputMultiplexerDemultiplexer.prototype.handle = function (frame) {
        if (Frame.isConnection(frame)) {
            if (frame.type === FrameTypes.RESERVED) {
                // TODO: throw
                return;
            }
            this.connectionFramesHandler.handle(frame);
            // TODO: Connection Handler
        }
        else if (Frame.isRequest(frame)) {
            if (this.registry[frame.streamId]) {
                // TODO: Send error and close connection
                return;
            }
            this.requestFramesHandler.handle(frame, this);
        }
        else {
            var handler = this.registry[frame.streamId];
            if (!handler) {
                // TODO: add validation
                return;
            }
            handler.handle(frame);
        }
        // TODO: add extensions support
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.connectionInbound = function (handler) {
        if (this.connectionFramesHandler) {
            throw new Error("Connection frame handler has already been installed");
        }
        this.connectionFramesHandler = handler;
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.handleRequestStream = function (handler) {
        if (this.requestFramesHandler) {
            throw new Error("Stream handler has already been installed");
        }
        this.requestFramesHandler = handler;
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.send = function (frame) {
        this.outbound.send(frame);
    };
    Object.defineProperty(ClientServerInputMultiplexerDemultiplexer.prototype, "connectionOutbound", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    ClientServerInputMultiplexerDemultiplexer.prototype.createRequestStream = function (streamHandler) {
        var _this = this;
        // handle requester side stream registration
        if (this.done) {
            streamHandler.handleReject(new Error("Already closed"));
            return;
        }
        var registry = this.registry;
        this.streamIdSupplier.next(function (streamId) { return streamHandler.handleReady(streamId, _this); }, Object.keys(registry));
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.connect = function (handler) {
        this.registry[handler.streamId] = handler;
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.disconnect = function (stream) {
        delete this.registry[stream.streamId];
    };
    ClientServerInputMultiplexerDemultiplexer.prototype.close = function (error) {
        if (this.done) {
            _super.prototype.close.call(this, error);
            return;
        }
        for (var streamId in this.registry) {
            var stream = this.registry[streamId];
            stream.close(new Error("Closed. ".concat(error ? "Original cause [".concat(error, "].") : "")));
        }
        _super.prototype.close.call(this, error);
    };
    return ClientServerInputMultiplexerDemultiplexer;
}(Deferred));
export { ClientServerInputMultiplexerDemultiplexer };
var ResumableClientServerInputMultiplexerDemultiplexer = /** @class */ (function (_super) {
    __extends(ResumableClientServerInputMultiplexerDemultiplexer, _super);
    function ResumableClientServerInputMultiplexerDemultiplexer(streamIdSupplier, outbound, closeable, frameStore, token, sessionStoreOrReconnector, sessionTimeout) {
        var _this = _super.call(this, streamIdSupplier, outbound, new Deferred()) || this;
        _this.frameStore = frameStore;
        _this.token = token;
        _this.sessionTimeout = sessionTimeout;
        if (sessionStoreOrReconnector instanceof Function) {
            _this.reconnector = sessionStoreOrReconnector;
        }
        else {
            _this.sessionStore = sessionStoreOrReconnector;
        }
        closeable.onClose(_this.handleConnectionClose.bind(_this));
        return _this;
    }
    ResumableClientServerInputMultiplexerDemultiplexer.prototype.send = function (frame) {
        if (Frame.isConnection(frame)) {
            if (frame.type === FrameTypes.KEEPALIVE) {
                frame.lastReceivedPosition = this.frameStore.lastReceivedFramePosition;
            }
            else if (frame.type === FrameTypes.ERROR) {
                this.outbound.send(frame);
                if (this.sessionStore) {
                    delete this.sessionStore[this.token];
                }
                _super.prototype.close.call(this, new RSocketError(frame.code, frame.message));
                return;
            }
        }
        else {
            this.frameStore.store(frame);
        }
        this.outbound.send(frame);
    };
    ResumableClientServerInputMultiplexerDemultiplexer.prototype.handle = function (frame) {
        if (Frame.isConnection(frame)) {
            if (frame.type === FrameTypes.KEEPALIVE) {
                try {
                    this.frameStore.dropTo(frame.lastReceivedPosition);
                }
                catch (re) {
                    this.outbound.send({
                        type: FrameTypes.ERROR,
                        streamId: 0,
                        flags: Flags.NONE,
                        code: re.code,
                        message: re.message,
                    });
                    this.close(re);
                }
            }
            else if (frame.type === FrameTypes.ERROR) {
                _super.prototype.handle.call(this, frame);
                if (this.sessionStore) {
                    delete this.sessionStore[this.token];
                }
                _super.prototype.close.call(this, new RSocketError(frame.code, frame.message));
                return;
            }
        }
        else {
            this.frameStore.record(frame);
        }
        _super.prototype.handle.call(this, frame);
    };
    ResumableClientServerInputMultiplexerDemultiplexer.prototype.resume = function (frame, outbound, closeable) {
        this.outbound = outbound;
        switch (frame.type) {
            case FrameTypes.RESUME: {
                clearTimeout(this.timeoutId);
                if (this.frameStore.lastReceivedFramePosition < frame.clientPosition) {
                    var e = new RSocketError(ErrorCodes.REJECTED_RESUME, "Impossible to resume since first available client frame position is greater than last received server frame position");
                    this.outbound.send({
                        type: FrameTypes.ERROR,
                        streamId: 0,
                        flags: Flags.NONE,
                        code: e.code,
                        message: e.message,
                    });
                    this.close(e);
                    return;
                }
                try {
                    this.frameStore.dropTo(frame.serverPosition);
                }
                catch (re) {
                    this.outbound.send({
                        type: FrameTypes.ERROR,
                        streamId: 0,
                        flags: Flags.NONE,
                        code: re.code,
                        message: re.message,
                    });
                    this.close(re);
                    return;
                }
                this.outbound.send({
                    type: FrameTypes.RESUME_OK,
                    streamId: 0,
                    flags: Flags.NONE,
                    clientPosition: this.frameStore.lastReceivedFramePosition,
                });
                break;
            }
            case FrameTypes.RESUME_OK: {
                try {
                    this.frameStore.dropTo(frame.clientPosition);
                }
                catch (re) {
                    this.outbound.send({
                        type: FrameTypes.ERROR,
                        streamId: 0,
                        flags: Flags.NONE,
                        code: re.code,
                        message: re.message,
                    });
                    this.close(re);
                }
                break;
            }
        }
        this.frameStore.drain(this.outbound.send.bind(this.outbound));
        closeable.onClose(this.handleConnectionClose.bind(this));
        this.connectionFramesHandler.resume();
    };
    ResumableClientServerInputMultiplexerDemultiplexer.prototype.handleConnectionClose = function (_error) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.connectionFramesHandler.pause();
                        if (!this.reconnector) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.reconnector(this, this.frameStore)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.close(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.timeoutId = setTimeout(this.close.bind(this), this.sessionTimeout);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ResumableClientServerInputMultiplexerDemultiplexer;
}(ClientServerInputMultiplexerDemultiplexer));
export { ResumableClientServerInputMultiplexerDemultiplexer };
var ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer = /** @class */ (function () {
    function ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer(outbound, closeable, delegate) {
        this.outbound = outbound;
        this.closeable = closeable;
        this.delegate = delegate;
        this.resumed = false;
    }
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.close = function () {
        this.delegate.close();
    };
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.onClose = function (callback) {
        this.delegate.onClose(callback);
    };
    Object.defineProperty(ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype, "connectionOutbound", {
        get: function () {
            return this.delegate.connectionOutbound;
        },
        enumerable: false,
        configurable: true
    });
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.createRequestStream = function (streamHandler) {
        this.delegate.createRequestStream(streamHandler);
    };
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.connectionInbound = function (handler) {
        this.delegate.connectionInbound(handler);
    };
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.handleRequestStream = function (handler) {
        this.delegate.handleRequestStream(handler);
    };
    ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer.prototype.handle = function (frame) {
        var _this = this;
        if (!this.resumed) {
            if (frame.type === FrameTypes.RESUME_OK) {
                this.resumed = true;
                this.delegate.resume(frame, this.outbound, this.closeable);
                return;
            }
            else {
                this.outbound.send({
                    type: FrameTypes.ERROR,
                    streamId: 0,
                    code: ErrorCodes.CONNECTION_ERROR,
                    message: "Incomplete RESUME handshake. Unexpected frame ".concat(frame.type, " received"),
                    flags: Flags.NONE,
                });
                this.closeable.close();
                this.closeable.onClose(function () {
                    return _this.delegate.close(new RSocketError(ErrorCodes.CONNECTION_ERROR, "Incomplete RESUME handshake. Unexpected frame ".concat(frame.type, " received")));
                });
            }
            return;
        }
        this.delegate.handle(frame);
    };
    return ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer;
}());
export { ResumeOkAwaitingResumableClientServerInputMultiplexerDemultiplexer };
//# sourceMappingURL=ClientServerMultiplexerDemultiplexer.js.map