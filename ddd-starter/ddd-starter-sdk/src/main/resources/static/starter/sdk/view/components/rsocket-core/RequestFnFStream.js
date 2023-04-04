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
var RequestFnFRequesterStream = /** @class */ (function () {
    function RequestFnFRequesterStream(payload, receiver, fragmentSize, leaseManager) {
        this.payload = payload;
        this.receiver = receiver;
        this.fragmentSize = fragmentSize;
        this.leaseManager = leaseManager;
        this.streamType = FrameTypes.REQUEST_FNF;
    }
    RequestFnFRequesterStream.prototype.handleReady = function (streamId, stream) {
        var e_1, _a;
        if (this.done) {
            return false;
        }
        this.streamId = streamId;
        if (isFragmentable(this.payload, this.fragmentSize, FrameTypes.REQUEST_FNF)) {
            try {
                for (var _b = __values(fragment(streamId, this.payload, this.fragmentSize, FrameTypes.REQUEST_FNF)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var frame = _c.value;
                    stream.send(frame);
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
            stream.send({
                type: FrameTypes.REQUEST_FNF,
                data: this.payload.data,
                metadata: this.payload.metadata,
                flags: this.payload.metadata ? Flags.METADATA : 0,
                streamId: streamId,
            });
        }
        this.done = true;
        this.receiver.onComplete();
        return true;
    };
    RequestFnFRequesterStream.prototype.handleReject = function (error) {
        if (this.done) {
            return;
        }
        this.done = true;
        this.receiver.onError(error);
    };
    RequestFnFRequesterStream.prototype.cancel = function () {
        var _a;
        if (this.done) {
            return;
        }
        this.done = true;
        (_a = this.leaseManager) === null || _a === void 0 ? void 0 : _a.cancelRequest(this);
    };
    RequestFnFRequesterStream.prototype.handle = function (frame) {
        if (frame.type == FrameTypes.ERROR) {
            this.close(new RSocketError(frame.code, frame.message));
            return;
        }
        this.close(new RSocketError(ErrorCodes.CANCELED, "Received invalid frame"));
    };
    RequestFnFRequesterStream.prototype.close = function (error) {
        if (this.done) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        if (error) {
            this.receiver.onError(error);
        }
        else {
            this.receiver.onComplete();
        }
    };
    return RequestFnFRequesterStream;
}());
export { RequestFnFRequesterStream };
var RequestFnfResponderStream = /** @class */ (function () {
    function RequestFnfResponderStream(streamId, stream, handler, frame) {
        this.streamId = streamId;
        this.stream = stream;
        this.handler = handler;
        this.streamType = FrameTypes.REQUEST_FNF;
        if (Flags.hasFollows(frame.flags)) {
            Reassembler.add(this, frame.data, frame.metadata);
            stream.connect(this);
            return;
        }
        var payload = {
            data: frame.data,
            metadata: frame.metadata,
        };
        try {
            this.cancellable = handler(payload, this);
        }
        catch (e) {
            // do nothing
        }
    }
    RequestFnfResponderStream.prototype.handle = function (frame) {
        var errorMessage;
        if (frame.type == FrameTypes.PAYLOAD) {
            if (Flags.hasFollows(frame.flags)) {
                if (Reassembler.add(this, frame.data, frame.metadata)) {
                    return;
                }
                errorMessage = "Unexpected fragment size";
            }
            else {
                this.stream.disconnect(this);
                var payload = Reassembler.reassemble(this, frame.data, frame.metadata);
                try {
                    this.cancellable = this.handler(payload, this);
                }
                catch (e) {
                    // do nothing
                }
                return;
            }
        }
        else {
            errorMessage = "Unexpected frame type [".concat(frame.type, "]");
        }
        this.done = true;
        if (frame.type != FrameTypes.CANCEL && frame.type != FrameTypes.ERROR) {
            this.stream.send({
                type: FrameTypes.ERROR,
                streamId: this.streamId,
                flags: Flags.NONE,
                code: ErrorCodes.CANCELED,
                message: errorMessage,
            });
        }
        this.stream.disconnect(this);
        Reassembler.cancel(this);
        // TODO: throws if strict
    };
    RequestFnfResponderStream.prototype.close = function (error) {
        var _a;
        if (this.done) {
            console.warn("Trying to close for the second time. ".concat(error ? "Dropping error [".concat(error, "].") : ""));
            return;
        }
        this.done = true;
        Reassembler.cancel(this);
        (_a = this.cancellable) === null || _a === void 0 ? void 0 : _a.cancel();
    };
    RequestFnfResponderStream.prototype.onError = function (error) { };
    RequestFnfResponderStream.prototype.onComplete = function () { };
    return RequestFnfResponderStream;
}());
export { RequestFnfResponderStream };
/*
export function request(
  payload: Payload,
  responderStream: UnidirectionalStream
): Handler<Cancellable> {
  return {
    create: (r) => {
      const response = new RequestFnFRequesterHandler(
        payload,
        responderStream,
        r
      );

      r.add(response);

      return response;
    },
  };
}

export function response(
  handler: (payload: Payload, responderStream: UnidirectionalStream,) => void
): Handler<void> {
  return {
    create: (r) => new RequestFnfResponderHandler(),
  };
} */
//# sourceMappingURL=RequestFnFStream.js.map