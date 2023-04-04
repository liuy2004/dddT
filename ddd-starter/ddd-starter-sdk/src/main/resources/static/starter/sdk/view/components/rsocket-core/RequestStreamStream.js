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
var RequestStreamRequesterStream = /** @class */ (function () {
    function RequestStreamRequesterStream(payload, receiver, fragmentSize, initialRequestN, leaseManager) {
        this.payload = payload;
        this.receiver = receiver;
        this.fragmentSize = fragmentSize;
        this.initialRequestN = initialRequestN;
        this.leaseManager = leaseManager;
        this.streamType = FrameTypes.REQUEST_STREAM;
        // TODO: add payload size validation
    }
    RequestStreamRequesterStream.prototype.handleReady = function (streamId, stream) {
        var e_1, _a;
        if (this.done) {
            return false;
        }
        this.streamId = streamId;
        this.stream = stream;
        stream.connect(this);
        if (isFragmentable(this.payload, this.fragmentSize, FrameTypes.REQUEST_STREAM)) {
            try {
                for (var _b = __values(fragmentWithRequestN(streamId, this.payload, this.fragmentSize, FrameTypes.REQUEST_STREAM, this.initialRequestN)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                type: FrameTypes.REQUEST_STREAM,
                data: this.payload.data,
                metadata: this.payload.metadata,
                requestN: this.initialRequestN,
                flags: this.payload.metadata !== undefined ? Flags.METADATA : 0,
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
    RequestStreamRequesterStream.prototype.handleReject = function (error) {
        if (this.done) {
            return;
        }
        this.done = true;
        this.receiver.onError(error);
    };
    RequestStreamRequesterStream.prototype.handle = function (frame) {
        var errorMessage;
        var frameType = frame.type;
        switch (frameType) {
            case FrameTypes.PAYLOAD: {
                var hasComplete = Flags.hasComplete(frame.flags);
                var hasNext = Flags.hasNext(frame.flags);
                if (hasComplete || !Flags.hasFollows(frame.flags)) {
                    if (hasComplete) {
                        this.done = true;
                        this.stream.disconnect(this);
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
                if (!Reassembler.add(this, frame.data, frame.metadata)) {
                    errorMessage = "Unexpected fragment size";
                    break;
                }
                return;
            }
            case FrameTypes.ERROR: {
                this.done = true;
                this.stream.disconnect(this);
                Reassembler.cancel(this);
                this.receiver.onError(new RSocketError(frame.code, frame.message));
                return;
            }
            case FrameTypes.EXT: {
                if (this.hasFragments) {
                    errorMessage = "Unexpected frame type [".concat(frameType, "] during reassembly");
                    break;
                }
                this.receiver.onExtension(frame.extendedType, frame.extendedContent, Flags.hasIgnore(frame.flags));
                return;
            }
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
        // TODO: throw an exception if strict frame handling mode
    };
    RequestStreamRequesterStream.prototype.request = function (n) {
        if (this.done) {
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
    RequestStreamRequesterStream.prototype.cancel = function () {
        var _a;
        if (this.done) {
            return;
        }
        this.done = true;
        if (!this.streamId) {
            (_a = this.leaseManager) === null || _a === void 0 ? void 0 : _a.cancelRequest(this);
            return;
        }
        this.stream.send({
            type: FrameTypes.CANCEL,
            flags: Flags.NONE,
            streamId: this.streamId,
        });
        this.stream.disconnect(this);
        Reassembler.cancel(this);
    };
    RequestStreamRequesterStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
        if (this.done) {
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
    RequestStreamRequesterStream.prototype.close = function (error) {
        if (this.done) {
            return;
        }
        this.done = true;
        Reassembler.cancel(this);
        if (error) {
            this.receiver.onError(error);
        }
        else {
            this.receiver.onComplete();
        }
    };
    return RequestStreamRequesterStream;
}());
export { RequestStreamRequesterStream };
var RequestStreamResponderStream = /** @class */ (function () {
    function RequestStreamResponderStream(streamId, stream, fragmentSize, handler, frame) {
        this.streamId = streamId;
        this.stream = stream;
        this.fragmentSize = fragmentSize;
        this.handler = handler;
        this.streamType = FrameTypes.REQUEST_STREAM;
        stream.connect(this);
        if (Flags.hasFollows(frame.flags)) {
            this.initialRequestN = frame.requestN;
            Reassembler.add(this, frame.data, frame.metadata);
            return;
        }
        var payload = {
            data: frame.data,
            metadata: frame.metadata,
        };
        try {
            this.receiver = handler(payload, frame.requestN, this);
        }
        catch (error) {
            this.onError(error);
        }
    }
    RequestStreamResponderStream.prototype.handle = function (frame) {
        var _a;
        var errorMessage;
        if (!this.receiver || this.hasFragments) {
            if (frame.type === FrameTypes.PAYLOAD) {
                if (Flags.hasFollows(frame.flags)) {
                    if (Reassembler.add(this, frame.data, frame.metadata)) {
                        return;
                    }
                    errorMessage = "Unexpected frame size";
                }
                else {
                    var payload = Reassembler.reassemble(this, frame.data, frame.metadata);
                    try {
                        this.receiver = this.handler(payload, this.initialRequestN, this);
                    }
                    catch (error) {
                        this.onError(error);
                    }
                    return;
                }
            }
            else {
                errorMessage = "Unexpected frame type [".concat(frame.type, "] during reassembly");
            }
        }
        else if (frame.type === FrameTypes.REQUEST_N) {
            this.receiver.request(frame.requestN);
            return;
        }
        else if (frame.type === FrameTypes.EXT) {
            this.receiver.onExtension(frame.extendedType, frame.extendedContent, Flags.hasIgnore(frame.flags));
            return;
        }
        else {
            errorMessage = "Unexpected frame type [".concat(frame.type, "]");
        }
        this.done = true;
        Reassembler.cancel(this);
        (_a = this.receiver) === null || _a === void 0 ? void 0 : _a.cancel();
        if (frame.type !== FrameTypes.CANCEL && frame.type !== FrameTypes.ERROR) {
            this.stream.send({
                type: FrameTypes.ERROR,
                flags: Flags.NONE,
                code: ErrorCodes.CANCELED,
                message: errorMessage,
                streamId: this.streamId,
            });
        }
        this.stream.disconnect(this);
        // TODO: throws if strict
    };
    RequestStreamResponderStream.prototype.onError = function (error) {
        if (this.done) {
            console.warn("Trying to error for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        this.done = true;
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
    };
    RequestStreamResponderStream.prototype.onNext = function (payload, isCompletion) {
        var e_2, _a;
        if (this.done) {
            return;
        }
        if (isCompletion) {
            this.done = true;
        }
        // TODO: add payload size validation
        if (isFragmentable(payload, this.fragmentSize, FrameTypes.PAYLOAD)) {
            try {
                for (var _b = __values(fragment(this.streamId, payload, this.fragmentSize, FrameTypes.PAYLOAD, isCompletion)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                flags: Flags.NEXT |
                    (isCompletion ? Flags.COMPLETE : Flags.NONE) |
                    (payload.metadata ? Flags.METADATA : Flags.NONE),
                data: payload.data,
                metadata: payload.metadata,
                streamId: this.streamId,
            });
        }
        if (isCompletion) {
            this.stream.disconnect(this);
        }
    };
    RequestStreamResponderStream.prototype.onComplete = function () {
        if (this.done) {
            return;
        }
        this.done = true;
        this.stream.send({
            type: FrameTypes.PAYLOAD,
            flags: Flags.COMPLETE,
            streamId: this.streamId,
            data: null,
            metadata: null,
        });
        this.stream.disconnect(this);
    };
    RequestStreamResponderStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
        if (this.done) {
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
    RequestStreamResponderStream.prototype.close = function (error) {
        var _a;
        if (this.done) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        Reassembler.cancel(this);
        (_a = this.receiver) === null || _a === void 0 ? void 0 : _a.cancel();
    };
    return RequestStreamResponderStream;
}());
export { RequestStreamResponderStream };
//# sourceMappingURL=RequestStreamStream.js.map