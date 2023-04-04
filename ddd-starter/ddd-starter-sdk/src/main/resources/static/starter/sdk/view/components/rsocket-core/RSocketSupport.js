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
import { ErrorCodes, RSocketError } from "./Errors.js";
import { Flags, FrameTypes, } from "./Frames.js";
import { RequestChannelRequesterStream, RequestChannelResponderStream, } from "./RequestChannelStream.js";
import { RequestFnFRequesterStream, RequestFnfResponderStream, } from "./RequestFnFStream.js";
import { RequestResponseRequesterStream, RequestResponseResponderStream, } from "./RequestResponseStream.js";
import { RequestStreamRequesterStream, RequestStreamResponderStream, } from "./RequestStreamStream.js";
var RSocketRequester = /** @class */ (function () {
    function RSocketRequester(connection, fragmentSize, leaseManager) {
        this.connection = connection;
        this.fragmentSize = fragmentSize;
        this.leaseManager = leaseManager;
    }
    RSocketRequester.prototype.fireAndForget = function (payload, responderStream) {
        var handler = new RequestFnFRequesterStream(payload, responderStream, this.fragmentSize, this.leaseManager);
        if (this.leaseManager) {
            this.leaseManager.requestLease(handler);
        }
        else {
            this.connection.multiplexerDemultiplexer.createRequestStream(handler);
        }
        return handler;
    };
    RSocketRequester.prototype.requestResponse = function (payload, responderStream) {
        var handler = new RequestResponseRequesterStream(payload, responderStream, this.fragmentSize, this.leaseManager);
        if (this.leaseManager) {
            this.leaseManager.requestLease(handler);
        }
        else {
            this.connection.multiplexerDemultiplexer.createRequestStream(handler);
        }
        return handler;
    };
    RSocketRequester.prototype.requestStream = function (payload, initialRequestN, responderStream) {
        var handler = new RequestStreamRequesterStream(payload, responderStream, this.fragmentSize, initialRequestN, this.leaseManager);
        if (this.leaseManager) {
            this.leaseManager.requestLease(handler);
        }
        else {
            this.connection.multiplexerDemultiplexer.createRequestStream(handler);
        }
        return handler;
    };
    RSocketRequester.prototype.requestChannel = function (payload, initialRequestN, isCompleted, responderStream) {
        var handler = new RequestChannelRequesterStream(payload, isCompleted, responderStream, this.fragmentSize, initialRequestN, this.leaseManager);
        if (this.leaseManager) {
            this.leaseManager.requestLease(handler);
        }
        else {
            this.connection.multiplexerDemultiplexer.createRequestStream(handler);
        }
        return handler;
    };
    RSocketRequester.prototype.metadataPush = function (metadata, responderStream) {
        throw new Error("Method not implemented.");
    };
    RSocketRequester.prototype.close = function (error) {
        this.connection.close(error);
    };
    RSocketRequester.prototype.onClose = function (callback) {
        this.connection.onClose(callback);
    };
    return RSocketRequester;
}());
export { RSocketRequester };
var LeaseHandler = /** @class */ (function () {
    function LeaseHandler(maxPendingRequests, multiplexer) {
        this.maxPendingRequests = maxPendingRequests;
        this.multiplexer = multiplexer;
        this.pendingRequests = [];
        this.expirationTime = 0;
        this.availableLease = 0;
    }
    LeaseHandler.prototype.handle = function (frame) {
        this.expirationTime = frame.ttl + Date.now();
        this.availableLease = frame.requestCount;
        while (this.availableLease > 0 && this.pendingRequests.length > 0) {
            var handler = this.pendingRequests.shift();
            this.availableLease--;
            this.multiplexer.createRequestStream(handler);
        }
    };
    LeaseHandler.prototype.requestLease = function (handler) {
        var availableLease = this.availableLease;
        if (availableLease > 0 && Date.now() < this.expirationTime) {
            this.availableLease = availableLease - 1;
            this.multiplexer.createRequestStream(handler);
            return;
        }
        if (this.pendingRequests.length >= this.maxPendingRequests) {
            handler.handleReject(new RSocketError(ErrorCodes.REJECTED, "No available lease given"));
            return;
        }
        this.pendingRequests.push(handler);
    };
    LeaseHandler.prototype.cancelRequest = function (handler) {
        var index = this.pendingRequests.indexOf(handler);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
        }
    };
    return LeaseHandler;
}());
export { LeaseHandler };
var DefaultStreamRequestHandler = /** @class */ (function () {
    function DefaultStreamRequestHandler(rsocket, fragmentSize) {
        this.rsocket = rsocket;
        this.fragmentSize = fragmentSize;
    }
    DefaultStreamRequestHandler.prototype.handle = function (frame, stream) {
        switch (frame.type) {
            case FrameTypes.REQUEST_FNF:
                if (this.rsocket.fireAndForget) {
                    new RequestFnfResponderStream(frame.streamId, stream, this.rsocket.fireAndForget.bind(this.rsocket), frame);
                }
                return;
            case FrameTypes.REQUEST_RESPONSE:
                if (this.rsocket.requestResponse) {
                    new RequestResponseResponderStream(frame.streamId, stream, this.fragmentSize, this.rsocket.requestResponse.bind(this.rsocket), frame);
                    return;
                }
                this.rejectRequest(frame.streamId, stream);
                return;
            case FrameTypes.REQUEST_STREAM:
                if (this.rsocket.requestStream) {
                    new RequestStreamResponderStream(frame.streamId, stream, this.fragmentSize, this.rsocket.requestStream.bind(this.rsocket), frame);
                    return;
                }
                this.rejectRequest(frame.streamId, stream);
                return;
            case FrameTypes.REQUEST_CHANNEL:
                if (this.rsocket.requestChannel) {
                    new RequestChannelResponderStream(frame.streamId, stream, this.fragmentSize, this.rsocket.requestChannel.bind(this.rsocket), frame);
                    return;
                }
                this.rejectRequest(frame.streamId, stream);
                return;
        }
    };
    DefaultStreamRequestHandler.prototype.rejectRequest = function (streamId, stream) {
        stream.send({
            type: FrameTypes.ERROR,
            streamId: streamId,
            flags: Flags.NONE,
            code: ErrorCodes.REJECTED,
            message: "No available handler found",
        });
    };
    DefaultStreamRequestHandler.prototype.close = function () { };
    return DefaultStreamRequestHandler;
}());
export { DefaultStreamRequestHandler };
var DefaultConnectionFrameHandler = /** @class */ (function () {
    function DefaultConnectionFrameHandler(connection, keepAliveHandler, keepAliveSender, leaseHandler, rsocket) {
        this.connection = connection;
        this.keepAliveHandler = keepAliveHandler;
        this.keepAliveSender = keepAliveSender;
        this.leaseHandler = leaseHandler;
        this.rsocket = rsocket;
    }
    DefaultConnectionFrameHandler.prototype.handle = function (frame) {
        switch (frame.type) {
            case FrameTypes.KEEPALIVE:
                this.keepAliveHandler.handle(frame);
                return;
            case FrameTypes.LEASE:
                if (this.leaseHandler) {
                    this.leaseHandler.handle(frame);
                    return;
                }
                // TODO throw exception and close connection
                return;
            case FrameTypes.ERROR:
                // TODO: add code validation
                this.connection.close(new RSocketError(frame.code, frame.message));
                return;
            case FrameTypes.METADATA_PUSH:
                if (this.rsocket.metadataPush) {
                    // this.rsocket.metadataPush()
                }
                return;
            default:
                this.connection.multiplexerDemultiplexer.connectionOutbound.send({
                    type: FrameTypes.ERROR,
                    streamId: 0,
                    flags: Flags.NONE,
                    message: "Received unknown frame type",
                    code: ErrorCodes.CONNECTION_ERROR,
                });
            // TODO: throw an exception and close connection
        }
    };
    DefaultConnectionFrameHandler.prototype.pause = function () {
        var _a;
        this.keepAliveHandler.pause();
        (_a = this.keepAliveSender) === null || _a === void 0 ? void 0 : _a.pause();
    };
    DefaultConnectionFrameHandler.prototype.resume = function () {
        var _a;
        this.keepAliveHandler.start();
        (_a = this.keepAliveSender) === null || _a === void 0 ? void 0 : _a.start();
    };
    DefaultConnectionFrameHandler.prototype.close = function (error) {
        var _a;
        this.keepAliveHandler.close();
        (_a = this.rsocket.close) === null || _a === void 0 ? void 0 : _a.call(this.rsocket, error);
    };
    return DefaultConnectionFrameHandler;
}());
export { DefaultConnectionFrameHandler };
var KeepAliveHandlerStates;
(function (KeepAliveHandlerStates) {
    KeepAliveHandlerStates[KeepAliveHandlerStates["Paused"] = 0] = "Paused";
    KeepAliveHandlerStates[KeepAliveHandlerStates["Running"] = 1] = "Running";
    KeepAliveHandlerStates[KeepAliveHandlerStates["Closed"] = 2] = "Closed";
})(KeepAliveHandlerStates || (KeepAliveHandlerStates = {}));
var KeepAliveHandler = /** @class */ (function () {
    function KeepAliveHandler(connection, keepAliveTimeoutDuration) {
        this.connection = connection;
        this.keepAliveTimeoutDuration = keepAliveTimeoutDuration;
        this.state = KeepAliveHandlerStates.Paused;
        this.outbound = connection.multiplexerDemultiplexer.connectionOutbound;
    }
    KeepAliveHandler.prototype.handle = function (frame) {
        this.keepAliveLastReceivedMillis = Date.now();
        if (Flags.hasRespond(frame.flags)) {
            this.outbound.send({
                type: FrameTypes.KEEPALIVE,
                streamId: 0,
                data: frame.data,
                flags: frame.flags ^ Flags.RESPOND,
                lastReceivedPosition: 0,
            });
        }
    };
    KeepAliveHandler.prototype.start = function () {
        if (this.state !== KeepAliveHandlerStates.Paused) {
            return;
        }
        this.keepAliveLastReceivedMillis = Date.now();
        this.state = KeepAliveHandlerStates.Running;
        this.activeTimeout = setTimeout(this.timeoutCheck.bind(this), this.keepAliveTimeoutDuration);
    };
    KeepAliveHandler.prototype.pause = function () {
        if (this.state !== KeepAliveHandlerStates.Running) {
            return;
        }
        this.state = KeepAliveHandlerStates.Paused;
        clearTimeout(this.activeTimeout);
    };
    KeepAliveHandler.prototype.close = function () {
        this.state = KeepAliveHandlerStates.Closed;
        clearTimeout(this.activeTimeout);
    };
    KeepAliveHandler.prototype.timeoutCheck = function () {
        var now = Date.now();
        var noKeepAliveDuration = now - this.keepAliveLastReceivedMillis;
        if (noKeepAliveDuration >= this.keepAliveTimeoutDuration) {
            this.connection.close(new Error("No keep-alive acks for ".concat(this.keepAliveTimeoutDuration, " millis")));
        }
        else {
            this.activeTimeout = setTimeout(this.timeoutCheck.bind(this), Math.max(100, this.keepAliveTimeoutDuration - noKeepAliveDuration));
        }
    };
    return KeepAliveHandler;
}());
export { KeepAliveHandler };
var KeepAliveSenderStates;
(function (KeepAliveSenderStates) {
    KeepAliveSenderStates[KeepAliveSenderStates["Paused"] = 0] = "Paused";
    KeepAliveSenderStates[KeepAliveSenderStates["Running"] = 1] = "Running";
    KeepAliveSenderStates[KeepAliveSenderStates["Closed"] = 2] = "Closed";
})(KeepAliveSenderStates || (KeepAliveSenderStates = {}));
var KeepAliveSender = /** @class */ (function () {
    function KeepAliveSender(outbound, keepAlivePeriodDuration) {
        this.outbound = outbound;
        this.keepAlivePeriodDuration = keepAlivePeriodDuration;
        this.state = KeepAliveSenderStates.Paused;
    }
    KeepAliveSender.prototype.sendKeepAlive = function () {
        this.outbound.send({
            type: FrameTypes.KEEPALIVE,
            streamId: 0,
            data: undefined,
            flags: Flags.RESPOND,
            lastReceivedPosition: 0,
        });
    };
    KeepAliveSender.prototype.start = function () {
        if (this.state !== KeepAliveSenderStates.Paused) {
            return;
        }
        this.state = KeepAliveSenderStates.Running;
        this.activeInterval = setInterval(this.sendKeepAlive.bind(this), this.keepAlivePeriodDuration);
    };
    KeepAliveSender.prototype.pause = function () {
        if (this.state !== KeepAliveSenderStates.Running) {
            return;
        }
        this.state = KeepAliveSenderStates.Paused;
        clearInterval(this.activeInterval);
    };
    KeepAliveSender.prototype.close = function () {
        this.state = KeepAliveSenderStates.Closed;
        clearInterval(this.activeInterval);
    };
    return KeepAliveSender;
}());
export { KeepAliveSender };
//# sourceMappingURL=RSocketSupport.js.map