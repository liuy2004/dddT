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
import { ErrorCodes, RSocketError } from "./Errors.js";
import { fragment, fragmentWithRequestN, isFragmentable } from "./Fragmenter.js";
import { Flags, FrameTypes, } from "./Frames.js";
import * as Reassembler from "./Reassembler.js";
var RequestChannelRequesterStream = /** @class */ (function () {
    function RequestChannelRequesterStream(payload, isComplete, receiver, fragmentSize, initialRequestN, leaseManager) {
        this.payload = payload;
        this.isComplete = isComplete;
        this.receiver = receiver;
        this.fragmentSize = fragmentSize;
        this.initialRequestN = initialRequestN;
        this.leaseManager = leaseManager;
        this.streamType = FrameTypes.REQUEST_CHANNEL;
        // TODO: add payload size validation
    }
    RequestChannelRequesterStream.prototype.handleReady = function (streamId, stream) {
        var e_1, _a;
        if (this.outboundDone) {
            return false;
        }
        this.streamId = streamId;
        this.stream = stream;
        stream.connect(this);
        var isCompleted = this.isComplete;
        if (isCompleted) {
            this.outboundDone = isCompleted;
        }
        if (isFragmentable(this.payload, this.fragmentSize, FrameTypes.REQUEST_CHANNEL)) {
            try {
                for (var _b = __values(fragmentWithRequestN(streamId, this.payload, this.fragmentSize, FrameTypes.REQUEST_CHANNEL, this.initialRequestN, isCompleted)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var frame = _c.value;
                    this.stream.send(frame);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            this.stream.send({
                type: FrameTypes.REQUEST_CHANNEL,
                data: this.payload.data,
                metadata: this.payload.metadata,
                requestN: this.initialRequestN,
                flags: (this.payload.metadata !== undefined ? Flags.METADATA : Flags.NONE) |
                    (isCompleted ? Flags.COMPLETE : Flags.NONE),
                streamId: streamId,
            });
        }
        if (this.hasExtension) {
            this.stream.send({
                type: FrameTypes.EXT,
                streamId: streamId,
                extendedContent: this.extendedContent,
                extendedType: this.extendedType,
                flags: this.flags,
            });
        }
        return true;
    };
    RequestChannelRequesterStream.prototype.handleReject = function (error) {
        if (this.inboundDone) {
            return;
        }
        this.inboundDone = true;
        this.outboundDone = true;
        this.receiver.onError(error);
    };
    RequestChannelRequesterStream.prototype.handle = function (frame) {
        var errorMessage;
        var frameType = frame.type;
        switch (frameType) {
            case FrameTypes.PAYLOAD: {
                var hasComplete = Flags.hasComplete(frame.flags);
                var hasNext = Flags.hasNext(frame.flags);
                if (hasComplete || !Flags.hasFollows(frame.flags)) {
                    if (hasComplete) {
                        this.inboundDone = true;
                        if (this.outboundDone) {
                            this.stream.disconnect(this);
                        }
                        if (!hasNext) {
                            // TODO: add validation no frame in reassembly
                            this.receiver.onComplete();
                            return;
                        }
                    }
                    var payload = this.hasFragments
                        ? Reassembler.reassemble(this, frame.data, frame.metadata)
                        : {
                            data: frame.data,
                            metadata: frame.metadata,
                        };
                    this.receiver.onNext(payload, hasComplete);
                    return;
                }
                if (Reassembler.add(this, frame.data, frame.metadata)) {
                    return;
                }
                errorMessage = "Unexpected frame size";
                break;
            }
            case FrameTypes.CANCEL: {
                if (this.outboundDone) {
                    return;
                }
                this.outboundDone = true;
                if (this.inboundDone) {
                    this.stream.disconnect(this);
                }
                this.receiver.cancel();
                return;
            }
            case FrameTypes.REQUEST_N: {
                if (this.outboundDone) {
                    return;
                }
                if (this.hasFragments) {
                    errorMessage = "Unexpected frame type [".concat(frameType, "] during reassembly");
                    break;
                }
                this.receiver.request(frame.requestN);
                return;
            }
            case FrameTypes.ERROR: {
                var outboundDone = this.outboundDone;
                this.inboundDone = true;
                this.outboundDone = true;
                this.stream.disconnect(this);
                Reassembler.cancel(this);
                if (!outboundDone) {
                    this.receiver.cancel();
                }
                this.receiver.onError(new RSocketError(frame.code, frame.message));
                return;
            }
            case FrameTypes.EXT:
                this.receiver.onExtension(frame.extendedType, frame.extendedContent, Flags.hasIgnore(frame.flags));
                return;
            default: {
                errorMessage = "Unexpected frame type [".concat(frameType, "]");
            }
        }
        this.close(new RSocketError(ErrorCodes.CANCELED, errorMessage));
        this.stream.send({
            type: FrameTypes.CANCEL,
            streamId: this.streamId,
            flags: Flags.NONE,
        });
        this.stream.disconnect(this);
    };
    RequestChannelRequesterStream.prototype.request = function (n) {
        if (this.inboundDone) {
            return;
        }
        if (!this.streamId) {
            this.initialRequestN += n;
            return;
        }
        this.stream.send({
            type: FrameTypes.REQUEST_N,
            flags: Flags.NONE,
            requestN: n,
            streamId: this.streamId,
        });
    };
    RequestChannelRequesterStream.prototype.cancel = function () {
        var _a;
        var inboundDone = this.inboundDone;
        var outboundDone = this.outboundDone;
        if (inboundDone && outboundDone) {
            return;
        }
        this.inboundDone = true;
        this.outboundDone = true;
        if (!outboundDone) {
            this.receiver.cancel();
        }
        if (!this.streamId) {
            (_a = this.leaseManager) === null || _a === void 0 ? void 0 : _a.cancelRequest(this);
            return;
        }
        this.stream.send({
            type: inboundDone ? FrameTypes.ERROR : FrameTypes.CANCEL,
            flags: Flags.NONE,
            streamId: this.streamId,
            code: ErrorCodes.CANCELED,
            message: "Cancelled",
        });
        this.stream.disconnect(this);
        Reassembler.cancel(this);
    };
    RequestChannelRequesterStream.prototype.onNext = function (payload, isComplete) {
        var e_2, _a;
        if (this.outboundDone) {
            return;
        }
        if (isComplete) {
            this.outboundDone = true;
            if (this.inboundDone) {
                this.stream.disconnect(this);
            }
        }
        if (isFragmentable(payload, this.fragmentSize, FrameTypes.PAYLOAD)) {
            try {
                for (var _b = __values(fragment(this.streamId, payload, this.fragmentSize, FrameTypes.PAYLOAD, isComplete)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var frame = _c.value;
                    this.stream.send(frame);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else {
            this.stream.send({
                type: FrameTypes.PAYLOAD,
                streamId: this.streamId,
                flags: Flags.NEXT |
                    (payload.metadata ? Flags.METADATA : Flags.NONE) |
                    (isComplete ? Flags.COMPLETE : Flags.NONE),
                data: payload.data,
                metadata: payload.metadata,
            });
        }
    };
    RequestChannelRequesterStream.prototype.onComplete = function () {
        if (!this.streamId) {
            this.isComplete = true;
            return;
        }
        if (this.outboundDone) {
            return;
        }
        this.outboundDone = true;
        this.stream.send({
            type: FrameTypes.PAYLOAD,
            streamId: this.streamId,
            flags: Flags.COMPLETE,
            data: null,
            metadata: null,
        });
        if (this.inboundDone) {
            this.stream.disconnect(this);
        }
    };
    RequestChannelRequesterStream.prototype.onError = function (error) {
        if (this.outboundDone) {
            return;
        }
        var inboundDone = this.inboundDone;
        this.outboundDone = true;
        this.inboundDone = true;
        this.stream.send({
            type: FrameTypes.ERROR,
            streamId: this.streamId,
            flags: Flags.NONE,
            code: error instanceof RSocketError
                ? error.code
                : ErrorCodes.APPLICATION_ERROR,
            message: error.message,
        });
        this.stream.disconnect(this);
        if (!inboundDone) {
            this.receiver.onError(error);
        }
    };
    RequestChannelRequesterStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
        if (this.outboundDone) {
            return;
        }
        if (!this.streamId) {
            this.hasExtension = true;
            this.extendedType = extendedType;
            this.extendedContent = content;
            this.flags = canBeIgnored ? Flags.IGNORE : Flags.NONE;
            return;
        }
        this.stream.send({
            streamId: this.streamId,
            type: FrameTypes.EXT,
            extendedType: extendedType,
            extendedContent: content,
            flags: canBeIgnored ? Flags.IGNORE : Flags.NONE,
        });
    };
    RequestChannelRequesterStream.prototype.close = function (error) {
        if (this.inboundDone && this.outboundDone) {
            return;
        }
        var inboundDone = this.inboundDone;
        var outboundDone = this.outboundDone;
        this.inboundDone = true;
        this.outboundDone = true;
        Reassembler.cancel(this);
        if (!outboundDone) {
            this.receiver.cancel();
        }
        if (!inboundDone) {
            if (error) {
                this.receiver.onError(error);
            }
            else {
                this.receiver.onComplete();
            }
        }
    };
    return RequestChannelRequesterStream;
}());
export { RequestChannelRequesterStream };
var RequestChannelResponderStream = /** @class */ (function () {
    function RequestChannelResponderStream(streamId, stream, fragmentSize, handler, frame) {
        this.streamId = streamId;
        this.stream = stream;
        this.fragmentSize = fragmentSize;
        this.handler = handler;
        this.streamType = FrameTypes.REQUEST_CHANNEL;
        stream.connect(this);
        if (Flags.hasFollows(frame.flags)) {
            Reassembler.add(this, frame.data, frame.metadata);
            this.initialRequestN = frame.requestN;
            this.isComplete = Flags.hasComplete(frame.flags);
            return;
        }
        var payload = {
            data: frame.data,
            metadata: frame.metadata,
        };
        var hasComplete = Flags.hasComplete(frame.flags);
        this.inboundDone = hasComplete;
        try {
            this.receiver = handler(payload, frame.requestN, hasComplete, this);
            if (this.outboundDone && this.defferedError) {
                this.receiver.onError(this.defferedError);
            }
        }
        catch (error) {
            if (this.outboundDone && !this.inboundDone) {
                this.cancel();
            }
            else {
                this.inboundDone = true;
            }
            this.onError(error);
        }
    }
    RequestChannelResponderStream.prototype.handle = function (frame) {
        var errorMessage;
        var frameType = frame.type;
        switch (frameType) {
            case FrameTypes.PAYLOAD: {
                if (Flags.hasFollows(frame.flags)) {
                    if (Reassembler.add(this, frame.data, frame.metadata)) {
                        return;
                    }
                    errorMessage = "Unexpected frame size";
                    break;
                }
                var payload = this.hasFragments
                    ? Reassembler.reassemble(this, frame.data, frame.metadata)
                    : {
                        data: frame.data,
                        metadata: frame.metadata,
                    };
                var hasComplete = Flags.hasComplete(frame.flags);
                if (!this.receiver) {
                    var inboundDone = this.isComplete || hasComplete;
                    if (inboundDone) {
                        this.inboundDone = true;
                        if (this.outboundDone) {
                            this.stream.disconnect(this);
                        }
                    }
                    try {
                        this.receiver = this.handler(payload, this.initialRequestN, inboundDone, this);
                        if (this.outboundDone && this.defferedError) {
                        }
                    }
                    catch (error) {
                        if (this.outboundDone && !this.inboundDone) {
                            this.cancel();
                        }
                        else {
                            this.inboundDone = true;
                        }
                        this.onError(error);
                    }
                }
                else {
                    if (hasComplete) {
                        this.inboundDone = true;
                        if (this.outboundDone) {
                            this.stream.disconnect(this);
                        }
                        if (!Flags.hasNext(frame.flags)) {
                            this.receiver.onComplete();
                            return;
                        }
                    }
                    this.receiver.onNext(payload, hasComplete);
                }
                return;
            }
            case FrameTypes.REQUEST_N: {
                if (!this.receiver || this.hasFragments) {
                    errorMessage = "Unexpected frame type [".concat(frameType, "] during reassembly");
                    break;
                }
                this.receiver.request(frame.requestN);
                return;
            }
            case FrameTypes.ERROR:
            case FrameTypes.CANCEL: {
                var inboundDone = this.inboundDone;
                var outboundDone = this.outboundDone;
                this.inboundDone = true;
                this.outboundDone = true;
                this.stream.disconnect(this);
                Reassembler.cancel(this);
                if (!this.receiver) {
                    return;
                }
                if (!outboundDone) {
                    this.receiver.cancel();
                }
                if (!inboundDone) {
                    var error = frameType === FrameTypes.CANCEL
                        ? new RSocketError(ErrorCodes.CANCELED, "Cancelled")
                        : new RSocketError(frame.code, frame.message);
                    this.receiver.onError(error);
                }
                return;
            }
            case FrameTypes.EXT: {
                if (!this.receiver || this.hasFragments) {
                    errorMessage = "Unexpected frame type [".concat(frameType, "] during reassembly");
                    break;
                }
                this.receiver.onExtension(frame.extendedType, frame.extendedContent, Flags.hasIgnore(frame.flags));
                return;
            }
            default: {
                errorMessage = "Unexpected frame type [".concat(frameType, "]");
                // TODO: throws if strict
            }
        }
        this.stream.send({
            type: FrameTypes.ERROR,
            flags: Flags.NONE,
            code: ErrorCodes.CANCELED,
            message: errorMessage,
            streamId: this.streamId,
        });
        this.stream.disconnect(this);
        this.close(new RSocketError(ErrorCodes.CANCELED, errorMessage));
    };
    RequestChannelResponderStream.prototype.onError = function (error) {
        if (this.outboundDone) {
            console.warn("Trying to error for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        var inboundDone = this.inboundDone;
        this.outboundDone = true;
        this.inboundDone = true;
        this.stream.send({
            type: FrameTypes.ERROR,
            flags: Flags.NONE,
            code: error instanceof RSocketError
                ? error.code
                : ErrorCodes.APPLICATION_ERROR,
            message: error.message,
            streamId: this.streamId,
        });
        this.stream.disconnect(this);
        if (!inboundDone) {
            if (this.receiver) {
                this.receiver.onError(error);
            }
            else {
                this.defferedError = error;
            }
        }
    };
    RequestChannelResponderStream.prototype.onNext = function (payload, isCompletion) {
        var e_3, _a;
        if (this.outboundDone) {
            return;
        }
        if (isCompletion) {
            this.outboundDone = true;
        }
        // TODO: add payload size validation
        if (isFragmentable(payload, this.fragmentSize, FrameTypes.PAYLOAD)) {
            try {
                for (var _b = __values(fragment(this.streamId, payload, this.fragmentSize, FrameTypes.PAYLOAD, isCompletion)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var frame = _c.value;
                    this.stream.send(frame);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else {
            this.stream.send({
                type: FrameTypes.PAYLOAD,
                flags: Flags.NEXT |
                    (isCompletion ? Flags.COMPLETE : Flags.NONE) |
                    (payload.metadata ? Flags.METADATA : Flags.NONE),
                data: payload.data,
                metadata: payload.metadata,
                streamId: this.streamId,
            });
        }
        if (isCompletion && this.inboundDone) {
            this.stream.disconnect(this);
        }
    };
    RequestChannelResponderStream.prototype.onComplete = function () {
        if (this.outboundDone) {
            return;
        }
        this.outboundDone = true;
        this.stream.send({
            type: FrameTypes.PAYLOAD,
            flags: Flags.COMPLETE,
            streamId: this.streamId,
            data: null,
            metadata: null,
        });
        if (this.inboundDone) {
            this.stream.disconnect(this);
        }
    };
    RequestChannelResponderStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
        if (this.outboundDone && this.inboundDone) {
            return;
        }
        this.stream.send({
            type: FrameTypes.EXT,
            streamId: this.streamId,
            flags: canBeIgnored ? Flags.IGNORE : Flags.NONE,
            extendedType: extendedType,
            extendedContent: content,
        });
    };
    RequestChannelResponderStream.prototype.request = function (n) {
        if (this.inboundDone) {
            return;
        }
        this.stream.send({
            type: FrameTypes.REQUEST_N,
            flags: Flags.NONE,
            streamId: this.streamId,
            requestN: n,
        });
    };
    RequestChannelResponderStream.prototype.cancel = function () {
        if (this.inboundDone) {
            return;
        }
        this.inboundDone = true;
        this.stream.send({
            type: FrameTypes.CANCEL,
            flags: Flags.NONE,
            streamId: this.streamId,
        });
        if (this.outboundDone) {
            this.stream.disconnect(this);
        }
    };
    RequestChannelResponderStream.prototype.close = function (error) {
        if (this.inboundDone && this.outboundDone) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        var inboundDone = this.inboundDone;
        var outboundDone = this.outboundDone;
        this.inboundDone = true;
        this.outboundDone = true;
        Reassembler.cancel(this);
        var receiver = this.receiver;
        if (!receiver) {
            return;
        }
        if (!outboundDone) {
            receiver.cancel();
        }
        if (!inboundDone) {
            if (error) {
                receiver.onError(error);
            }
            else {
                receiver.onComplete();
            }
        }
    };
    return RequestChannelResponderStream;
}());
export { RequestChannelResponderStream };
//# sourceMappingURL=RequestChannelStream.js.map