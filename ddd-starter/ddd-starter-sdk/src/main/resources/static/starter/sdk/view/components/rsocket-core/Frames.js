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
export var FrameTypes;
(function (FrameTypes) {
    FrameTypes[FrameTypes["RESERVED"] = 0] = "RESERVED";
    FrameTypes[FrameTypes["SETUP"] = 1] = "SETUP";
    FrameTypes[FrameTypes["LEASE"] = 2] = "LEASE";
    FrameTypes[FrameTypes["KEEPALIVE"] = 3] = "KEEPALIVE";
    FrameTypes[FrameTypes["REQUEST_RESPONSE"] = 4] = "REQUEST_RESPONSE";
    FrameTypes[FrameTypes["REQUEST_FNF"] = 5] = "REQUEST_FNF";
    FrameTypes[FrameTypes["REQUEST_STREAM"] = 6] = "REQUEST_STREAM";
    FrameTypes[FrameTypes["REQUEST_CHANNEL"] = 7] = "REQUEST_CHANNEL";
    FrameTypes[FrameTypes["REQUEST_N"] = 8] = "REQUEST_N";
    FrameTypes[FrameTypes["CANCEL"] = 9] = "CANCEL";
    FrameTypes[FrameTypes["PAYLOAD"] = 10] = "PAYLOAD";
    FrameTypes[FrameTypes["ERROR"] = 11] = "ERROR";
    FrameTypes[FrameTypes["METADATA_PUSH"] = 12] = "METADATA_PUSH";
    FrameTypes[FrameTypes["RESUME"] = 13] = "RESUME";
    FrameTypes[FrameTypes["RESUME_OK"] = 14] = "RESUME_OK";
    FrameTypes[FrameTypes["EXT"] = 63] = "EXT";
})(FrameTypes || (FrameTypes = {}));
export var Flags;
(function (Flags) {
    Flags[Flags["NONE"] = 0] = "NONE";
    Flags[Flags["COMPLETE"] = 64] = "COMPLETE";
    Flags[Flags["FOLLOWS"] = 128] = "FOLLOWS";
    Flags[Flags["IGNORE"] = 512] = "IGNORE";
    Flags[Flags["LEASE"] = 64] = "LEASE";
    Flags[Flags["METADATA"] = 256] = "METADATA";
    Flags[Flags["NEXT"] = 32] = "NEXT";
    Flags[Flags["RESPOND"] = 128] = "RESPOND";
    Flags[Flags["RESUME_ENABLE"] = 128] = "RESUME_ENABLE";
})(Flags || (Flags = {}));
(function (Flags) {
    function hasMetadata(flags) {
        return (flags & Flags.METADATA) === Flags.METADATA;
    }
    Flags.hasMetadata = hasMetadata;
    function hasComplete(flags) {
        return (flags & Flags.COMPLETE) === Flags.COMPLETE;
    }
    Flags.hasComplete = hasComplete;
    function hasNext(flags) {
        return (flags & Flags.NEXT) === Flags.NEXT;
    }
    Flags.hasNext = hasNext;
    function hasFollows(flags) {
        return (flags & Flags.FOLLOWS) === Flags.FOLLOWS;
    }
    Flags.hasFollows = hasFollows;
    function hasIgnore(flags) {
        return (flags & Flags.IGNORE) === Flags.IGNORE;
    }
    Flags.hasIgnore = hasIgnore;
    function hasRespond(flags) {
        return (flags & Flags.RESPOND) === Flags.RESPOND;
    }
    Flags.hasRespond = hasRespond;
    function hasLease(flags) {
        return (flags & Flags.LEASE) === Flags.LEASE;
    }
    Flags.hasLease = hasLease;
    function hasResume(flags) {
        return (flags & Flags.RESUME_ENABLE) === Flags.RESUME_ENABLE;
    }
    Flags.hasResume = hasResume;
})(Flags || (Flags = {}));
export var Lengths;
(function (Lengths) {
    Lengths[Lengths["FRAME"] = 3] = "FRAME";
    Lengths[Lengths["HEADER"] = 6] = "HEADER";
    Lengths[Lengths["METADATA"] = 3] = "METADATA";
    Lengths[Lengths["REQUEST"] = 3] = "REQUEST";
})(Lengths || (Lengths = {}));
export var Frame;
(function (Frame) {
    function isConnection(frame) {
        return frame.streamId === 0;
    }
    Frame.isConnection = isConnection;
    function isRequest(frame) {
        return (FrameTypes.REQUEST_RESPONSE <= frame.type &&
            frame.type <= FrameTypes.REQUEST_CHANNEL);
    }
    Frame.isRequest = isRequest;
})(Frame || (Frame = {}));
//# sourceMappingURL=Frames.js.map