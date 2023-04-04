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
import { fragment, isFragmentable } from "./Fragmenter.js";
import { Flags, FrameTypes, } from "./Frames.js";
import * as Reassembler from "./Reassembler.js";
var RequestResponseRequesterStream = /** @class */ (function () {
    function RequestResponseRequesterStream(payload, receiver, fragmentSize, leaseManager) {
        this.payload = payload;
        this.receiver = receiver;
        this.fragmentSize = fragmentSize;
        this.leaseManager = leaseManager;
        this.streamType = FrameTypes.REQUEST_RESPONSE;
    }
    RequestResponseRequesterStream.prototype.handleReady = function (streamId, stream) {
        var e_1, _a;
        if (this.done) {
            return false;
        }
        this.streamId = streamId;
        this.stream = stream;
        stream.connect(this);
        if (isFragmentable(this.payload, this.fragmentSize, FrameTypes.REQUEST_RESPONSE)) {
            try {
                for (var _b = __values(fragment(streamId, this.payload, this.fragmentSize, FrameTypes.REQUEST_RESPONSE)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                type: FrameTypes.REQUEST_RESPONSE,
                data: this.payload.data,
                metadata: this.payload.metadata,
                flags: this.payload.metadata ? Flags.METADATA : 0,
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
    RequestResponseRequesterStream.prototype.handleReject = function (error) {
        if (this.done) {
            return;
        }
        this.done = true;
        this.receiver.onError(error);
    };
    RequestResponseRequesterStream.prototype.handle = function (frame) {
        var errorMessage;
        var frameType = frame.type;
        switch (frameType) {
            case FrameTypes.PAYLOAD: {
                var hasComplete = Flags.hasComplete(frame.flags);
                var hasPayload = Flags.hasNext(frame.flags);
                if (hasComplete || !Flags.hasFollows(frame.flags)) {
                    this.done = true;
                    this.stream.disconnect(this);
                    if (!hasPayload) {
                        // TODO: add validation no frame in reassembly
                        this.receiver.onComplete();
                        return;
                    }
                    var payload = this.hasFragments
                        ? Reassembler.reassemble(this, frame.data, frame.metadata)
                        : {
                            data: frame.data,
                            metadata: frame.metadata,
                        };
                    this.receiver.onNext(payload, true);
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
    RequestResponseRequesterStream.prototype.cancel = function () {
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
    RequestResponseRequesterStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
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
    RequestResponseRequesterStream.prototype.close = function (error) {
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
    return RequestResponseRequesterStream;
}());
export { RequestResponseRequesterStream };
var RequestResponseResponderStream = /** @class */ (function () {
    function RequestResponseResponderStream(streamId, stream, fragmentSize, handler, frame) {
        this.streamId = streamId;
        this.stream = stream;
        this.fragmentSize = fragmentSize;
        this.handler = handler;
        this.streamType = FrameTypes.REQUEST_RESPONSE;
        stream.connect(this);
        if (Flags.hasFollows(frame.flags)) {
            Reassembler.add(this, frame.data, frame.metadata);
            return;
        }
        var payload = {
            data: frame.data,
            metadata: frame.metadata,
        };
        try {
            this.receiver = handler(payload, this);
        }
        catch (error) {
            this.onError(error);
        }
    }
    RequestResponseResponderStream.prototype.handle = function (frame) {
        var _a;
        var errorMessage;
        if (!this.receiver || this.hasFragments) {
            if (frame.type === FrameTypes.PAYLOAD) {
                if (Flags.hasFollows(frame.flags)) {
                    if (Reassembler.add(this, frame.data, frame.metadata)) {
                        return;
                    }
                    errorMessage = "Unexpected fragment size";
                }
                else {
                    var payload = Reassembler.reassemble(this, frame.data, frame.metadata);
                    try {
                        this.receiver = this.handler(payload, this);
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
        else if (frame.type === FrameTypes.EXT) {
            this.receiver.onExtension(frame.extendedType, frame.extendedContent, Flags.hasIgnore(frame.flags));
            return;
        }
        else {
            errorMessage = "Unexpected frame type [".concat(frame.type, "]");
        }
        this.done = true;
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
        Reassembler.cancel(this);
        // TODO: throws if strict
    };
    RequestResponseResponderStream.prototype.onError = function (error) {
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
    RequestResponseResponderStream.prototype.onNext = function (payload, isCompletion) {
        var e_2, _a;
        if (this.done) {
            return;
        }
        this.done = true;
        // TODO: add payload size validation
        if (isFragmentable(payload, this.fragmentSize, FrameTypes.PAYLOAD)) {
            try {
                for (var _b = __values(fragment(this.streamId, payload, this.fragmentSize, FrameTypes.PAYLOAD, true)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                flags: Flags.NEXT | Flags.COMPLETE | (payload.metadata ? Flags.METADATA : 0),
                data: payload.data,
                metadata: payload.metadata,
                streamId: this.streamId,
            });
        }
        this.stream.disconnect(this);
    };
    RequestResponseResponderStream.prototype.onComplete = function () {
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
    RequestResponseResponderStream.prototype.onExtension = function (extendedType, content, canBeIgnored) {
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
    RequestResponseResponderStream.prototype.close = function (error) {
        var _a;
        if (this.done) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        Reassembler.cancel(this);
        (_a = this.receiver) === null || _a === void 0 ? void 0 : _a.cancel();
    };
    return RequestResponseResponderStream;
}());
export { RequestResponseResponderStream };
//# sourceMappingURL=RequestResponseStream.js.map