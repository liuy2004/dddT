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
"use strict";
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
import { Flags, FrameTypes, } from "./Frames.js";
export var FLAGS_MASK = 0x3ff; // low 10 bits
export var FRAME_TYPE_OFFFSET = 10; // frame type is offset 10 bytes within the uint16 containing type + flags
export var MAX_CODE = 0x7fffffff; // uint31
export var MAX_KEEPALIVE = 0x7fffffff; // uint31
export var MAX_LIFETIME = 0x7fffffff; // uint31
export var MAX_METADATA_LENGTH = 0xffffff; // uint24
export var MAX_MIME_LENGTH = 0xff; // int8
export var MAX_REQUEST_COUNT = 0x7fffffff; // uint31
export var MAX_REQUEST_N = 0x7fffffff; // uint31
export var MAX_RESUME_LENGTH = 0xffff; // uint16
export var MAX_STREAM_ID = 0x7fffffff; // uint31
export var MAX_TTL = 0x7fffffff; // uint31
export var MAX_VERSION = 0xffff; // uint16
/**
 * Mimimum value that would overflow bitwise operators (2^32).
 */
var BITWISE_OVERFLOW = 0x100000000;
/**
 * Read a uint24 from a buffer starting at the given offset.
 */
export function readUInt24BE(buffer, offset) {
    var val1 = buffer.readUInt8(offset) << 16;
    var val2 = buffer.readUInt8(offset + 1) << 8;
    var val3 = buffer.readUInt8(offset + 2);
    return val1 | val2 | val3;
}
/**
 * Writes a uint24 to a buffer starting at the given offset, returning the
 * offset of the next byte.
 */
export function writeUInt24BE(buffer, value, offset) {
    offset = buffer.writeUInt8(value >>> 16, offset); // 3rd byte
    offset = buffer.writeUInt8((value >>> 8) & 0xff, offset); // 2nd byte
    return buffer.writeUInt8(value & 0xff, offset); // 1st byte
}
/**
 * Read a uint64 (technically supports up to 53 bits per JS number
 * representation).
 */
export function readUInt64BE(buffer, offset) {
    var high = buffer.readUInt32BE(offset);
    var low = buffer.readUInt32BE(offset + 4);
    return high * BITWISE_OVERFLOW + low;
}
/**
 * Write a uint64 (technically supports up to 53 bits per JS number
 * representation).
 */
export function writeUInt64BE(buffer, value, offset) {
    var high = (value / BITWISE_OVERFLOW) | 0;
    var low = value % BITWISE_OVERFLOW;
    offset = buffer.writeUInt32BE(high, offset); // first half of uint64
    return buffer.writeUInt32BE(low, offset); // second half of uint64
}
/**
 * Frame header is:
 * - stream id (uint32 = 4)
 * - type + flags (uint 16 = 2)
 */
var FRAME_HEADER_SIZE = 6;
/**
 * Size of frame length and metadata length fields.
 */
var UINT24_SIZE = 3;
/**
 * Reads a frame from a buffer that is prefixed with the frame length.
 */
export function deserializeFrameWithLength(buffer) {
    var frameLength = readUInt24BE(buffer, 0);
    return deserializeFrame(buffer.slice(UINT24_SIZE, UINT24_SIZE + frameLength));
}
/**
 * Given a buffer that may contain zero or more length-prefixed frames followed
 * by zero or more bytes of a (partial) subsequent frame, returns an array of
 * the frames and an int representing the buffer offset.
 */
export function deserializeFrames(buffer) {
    var offset, frameLength, frameStart, frameEnd, frameBuffer, frame;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                offset = 0;
                _a.label = 1;
            case 1:
                if (!(offset + UINT24_SIZE < buffer.length)) return [3 /*break*/, 3];
                frameLength = readUInt24BE(buffer, offset);
                frameStart = offset + UINT24_SIZE;
                frameEnd = frameStart + frameLength;
                if (frameEnd > buffer.length) {
                    // not all bytes of next frame received
                    return [3 /*break*/, 3];
                }
                frameBuffer = buffer.slice(frameStart, frameEnd);
                frame = deserializeFrame(frameBuffer);
                offset = frameEnd;
                return [4 /*yield*/, [frame, offset]];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
/**
 * Writes a frame to a buffer with a length prefix.
 */
export function serializeFrameWithLength(frame) {
    var buffer = serializeFrame(frame);
    var lengthPrefixed = Buffer.allocUnsafe(buffer.length + UINT24_SIZE);
    writeUInt24BE(lengthPrefixed, buffer.length, 0);
    buffer.copy(lengthPrefixed, UINT24_SIZE);
    return lengthPrefixed;
}
/**
 * Read a frame from the buffer.
 */
export function deserializeFrame(buffer) {
    var offset = 0;
    var streamId = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   streamId >= 0,
    //   'RSocketBinaryFraming: Invalid frame, expected a positive stream id, got `%s.',
    //   streamId,
    // );
    var typeAndFlags = buffer.readUInt16BE(offset);
    offset += 2;
    var type = typeAndFlags >>> FRAME_TYPE_OFFFSET; // keep highest 6 bits
    var flags = typeAndFlags & FLAGS_MASK; // keep lowest 10 bits
    switch (type) {
        case FrameTypes.SETUP:
            return deserializeSetupFrame(buffer, streamId, flags);
        case FrameTypes.PAYLOAD:
            return deserializePayloadFrame(buffer, streamId, flags);
        case FrameTypes.ERROR:
            return deserializeErrorFrame(buffer, streamId, flags);
        case FrameTypes.KEEPALIVE:
            return deserializeKeepAliveFrame(buffer, streamId, flags);
        case FrameTypes.REQUEST_FNF:
            return deserializeRequestFnfFrame(buffer, streamId, flags);
        case FrameTypes.REQUEST_RESPONSE:
            return deserializeRequestResponseFrame(buffer, streamId, flags);
        case FrameTypes.REQUEST_STREAM:
            return deserializeRequestStreamFrame(buffer, streamId, flags);
        case FrameTypes.REQUEST_CHANNEL:
            return deserializeRequestChannelFrame(buffer, streamId, flags);
        case FrameTypes.METADATA_PUSH:
            return deserializeMetadataPushFrame(buffer, streamId, flags);
        case FrameTypes.REQUEST_N:
            return deserializeRequestNFrame(buffer, streamId, flags);
        case FrameTypes.RESUME:
            return deserializeResumeFrame(buffer, streamId, flags);
        case FrameTypes.RESUME_OK:
            return deserializeResumeOkFrame(buffer, streamId, flags);
        case FrameTypes.CANCEL:
            return deserializeCancelFrame(buffer, streamId, flags);
        case FrameTypes.LEASE:
            return deserializeLeaseFrame(buffer, streamId, flags);
        default:
        // invariant(
        //   false,
        //   "RSocketBinaryFraming: Unsupported frame type `%s`.",
        //   getFrameTypeName(type)
        // );
    }
}
/**
 * Convert the frame to a (binary) buffer.
 */
export function serializeFrame(frame) {
    switch (frame.type) {
        case FrameTypes.SETUP:
            return serializeSetupFrame(frame);
        case FrameTypes.PAYLOAD:
            return serializePayloadFrame(frame);
        case FrameTypes.ERROR:
            return serializeErrorFrame(frame);
        case FrameTypes.KEEPALIVE:
            return serializeKeepAliveFrame(frame);
        case FrameTypes.REQUEST_FNF:
        case FrameTypes.REQUEST_RESPONSE:
            return serializeRequestFrame(frame);
        case FrameTypes.REQUEST_STREAM:
        case FrameTypes.REQUEST_CHANNEL:
            return serializeRequestManyFrame(frame);
        case FrameTypes.METADATA_PUSH:
            return serializeMetadataPushFrame(frame);
        case FrameTypes.REQUEST_N:
            return serializeRequestNFrame(frame);
        case FrameTypes.RESUME:
            return serializeResumeFrame(frame);
        case FrameTypes.RESUME_OK:
            return serializeResumeOkFrame(frame);
        case FrameTypes.CANCEL:
            return serializeCancelFrame(frame);
        case FrameTypes.LEASE:
            return serializeLeaseFrame(frame);
        default:
        // invariant(
        //   false,
        //   "RSocketBinaryFraming: Unsupported frame type `%s`.",
        //   getFrameTypeName(frame.type)
        // );
    }
}
/**
 * Byte size of frame without size prefix
 */
export function sizeOfFrame(frame) {
    switch (frame.type) {
        case FrameTypes.SETUP:
            return sizeOfSetupFrame(frame);
        case FrameTypes.PAYLOAD:
            return sizeOfPayloadFrame(frame);
        case FrameTypes.ERROR:
            return sizeOfErrorFrame(frame);
        case FrameTypes.KEEPALIVE:
            return sizeOfKeepAliveFrame(frame);
        case FrameTypes.REQUEST_FNF:
        case FrameTypes.REQUEST_RESPONSE:
            return sizeOfRequestFrame(frame);
        case FrameTypes.REQUEST_STREAM:
        case FrameTypes.REQUEST_CHANNEL:
            return sizeOfRequestManyFrame(frame);
        case FrameTypes.METADATA_PUSH:
            return sizeOfMetadataPushFrame(frame);
        case FrameTypes.REQUEST_N:
            return sizeOfRequestNFrame(frame);
        case FrameTypes.RESUME:
            return sizeOfResumeFrame(frame);
        case FrameTypes.RESUME_OK:
            return sizeOfResumeOkFrame(frame);
        case FrameTypes.CANCEL:
            return sizeOfCancelFrame(frame);
        case FrameTypes.LEASE:
            return sizeOfLeaseFrame(frame);
        default:
        // invariant(
        //   false,
        //   "RSocketBinaryFraming: Unsupported frame type `%s`.",
        //   getFrameTypeName(frame.type)
        // );
    }
}
/**
 * Writes a SETUP frame into a new buffer and returns it.
 *
 * Prefix size is:
 * - version (2x uint16 = 4)
 * - keepalive (uint32 = 4)
 * - lifetime (uint32 = 4)
 * - mime lengths (2x uint8 = 2)
 */
var SETUP_FIXED_SIZE = 14;
var RESUME_TOKEN_LENGTH_SIZE = 2;
function serializeSetupFrame(frame) {
    var resumeTokenLength = frame.resumeToken != null ? frame.resumeToken.byteLength : 0;
    var metadataMimeTypeLength = frame.metadataMimeType != null
        ? Buffer.byteLength(frame.metadataMimeType, "ascii")
        : 0;
    var dataMimeTypeLength = frame.dataMimeType != null
        ? Buffer.byteLength(frame.dataMimeType, "ascii")
        : 0;
    var payloadLength = getPayloadLength(frame);
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE +
        SETUP_FIXED_SIZE + //
        (resumeTokenLength ? RESUME_TOKEN_LENGTH_SIZE + resumeTokenLength : 0) +
        metadataMimeTypeLength +
        dataMimeTypeLength +
        payloadLength);
    var offset = writeHeader(frame, buffer);
    offset = buffer.writeUInt16BE(frame.majorVersion, offset);
    offset = buffer.writeUInt16BE(frame.minorVersion, offset);
    offset = buffer.writeUInt32BE(frame.keepAlive, offset);
    offset = buffer.writeUInt32BE(frame.lifetime, offset);
    if (frame.flags & Flags.RESUME_ENABLE) {
        offset = buffer.writeUInt16BE(resumeTokenLength, offset);
        if (frame.resumeToken != null) {
            offset += frame.resumeToken.copy(buffer, offset);
        }
    }
    offset = buffer.writeUInt8(metadataMimeTypeLength, offset);
    if (frame.metadataMimeType != null) {
        offset += buffer.write(frame.metadataMimeType, offset, offset + metadataMimeTypeLength, "ascii");
    }
    offset = buffer.writeUInt8(dataMimeTypeLength, offset);
    if (frame.dataMimeType != null) {
        offset += buffer.write(frame.dataMimeType, offset, offset + dataMimeTypeLength, "ascii");
    }
    writePayload(frame, buffer, offset);
    return buffer;
}
function sizeOfSetupFrame(frame) {
    var resumeTokenLength = frame.resumeToken != null ? frame.resumeToken.byteLength : 0;
    var metadataMimeTypeLength = frame.metadataMimeType != null
        ? Buffer.byteLength(frame.metadataMimeType, "ascii")
        : 0;
    var dataMimeTypeLength = frame.dataMimeType != null
        ? Buffer.byteLength(frame.dataMimeType, "ascii")
        : 0;
    var payloadLength = getPayloadLength(frame);
    return (FRAME_HEADER_SIZE +
        SETUP_FIXED_SIZE + //
        (resumeTokenLength ? RESUME_TOKEN_LENGTH_SIZE + resumeTokenLength : 0) +
        metadataMimeTypeLength +
        dataMimeTypeLength +
        payloadLength);
}
/**
 * Reads a SETUP frame from the buffer and returns it.
 */
function deserializeSetupFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   'RSocketBinaryFraming: Invalid SETUP frame, expected stream id to be 0.',
    // );
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var majorVersion = buffer.readUInt16BE(offset);
    offset += 2;
    var minorVersion = buffer.readUInt16BE(offset);
    offset += 2;
    var keepAlive = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   keepAlive >= 0 && keepAlive <= MAX_KEEPALIVE,
    //   'RSocketBinaryFraming: Invalid SETUP frame, expected keepAlive to be ' +
    //     '>= 0 and <= %s. Got `%s`.',
    //   MAX_KEEPALIVE,
    //   keepAlive,
    // );
    var lifetime = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   lifetime >= 0 && lifetime <= MAX_LIFETIME,
    //   'RSocketBinaryFraming: Invalid SETUP frame, expected lifetime to be ' +
    //     '>= 0 and <= %s. Got `%s`.',
    //   MAX_LIFETIME,
    //   lifetime,
    // );
    var resumeToken = null;
    if (flags & Flags.RESUME_ENABLE) {
        var resumeTokenLength = buffer.readInt16BE(offset);
        offset += 2;
        // invariant(
        //   resumeTokenLength >= 0 && resumeTokenLength <= MAX_RESUME_LENGTH,
        //   'RSocketBinaryFraming: Invalid SETUP frame, expected resumeToken length ' +
        //     'to be >= 0 and <= %s. Got `%s`.',
        //   MAX_RESUME_LENGTH,
        //   resumeTokenLength,
        // );
        resumeToken = buffer.slice(offset, offset + resumeTokenLength);
        offset += resumeTokenLength;
    }
    var metadataMimeTypeLength = buffer.readUInt8(offset);
    offset += 1;
    var metadataMimeType = buffer.toString("ascii", offset, offset + metadataMimeTypeLength);
    offset += metadataMimeTypeLength;
    var dataMimeTypeLength = buffer.readUInt8(offset);
    offset += 1;
    var dataMimeType = buffer.toString("ascii", offset, offset + dataMimeTypeLength);
    offset += dataMimeTypeLength;
    var frame = {
        data: null,
        dataMimeType: dataMimeType,
        flags: flags,
        keepAlive: keepAlive,
        lifetime: lifetime,
        majorVersion: majorVersion,
        metadata: null,
        metadataMimeType: metadataMimeType,
        minorVersion: minorVersion,
        resumeToken: resumeToken,
        // streamId,
        streamId: 0,
        type: FrameTypes.SETUP,
    };
    readPayload(buffer, frame, offset);
    return frame;
}
/**
 * Writes an ERROR frame into a new buffer and returns it.
 *
 * Prefix size is for the error code (uint32 = 4).
 */
var ERROR_FIXED_SIZE = 4;
function serializeErrorFrame(frame) {
    var messageLength = frame.message != null ? Buffer.byteLength(frame.message, "utf8") : 0;
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + ERROR_FIXED_SIZE + messageLength);
    var offset = writeHeader(frame, buffer);
    offset = buffer.writeUInt32BE(frame.code, offset);
    if (frame.message != null) {
        buffer.write(frame.message, offset, offset + messageLength, "utf8");
    }
    return buffer;
}
function sizeOfErrorFrame(frame) {
    var messageLength = frame.message != null ? Buffer.byteLength(frame.message, "utf8") : 0;
    return FRAME_HEADER_SIZE + ERROR_FIXED_SIZE + messageLength;
}
/**
 * Reads an ERROR frame from the buffer and returns it.
 */
function deserializeErrorFrame(buffer, streamId, flags) {
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var code = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   code >= 0 && code <= MAX_CODE,
    //   "RSocketBinaryFraming: Invalid ERROR frame, expected code to be >= 0 and <= %s. Got `%s`.",
    //   MAX_CODE,
    //   code
    // );
    var messageLength = buffer.length - offset;
    var message = "";
    if (messageLength > 0) {
        message = buffer.toString("utf8", offset, offset + messageLength);
        offset += messageLength;
    }
    return {
        code: code,
        flags: flags,
        message: message,
        streamId: streamId,
        type: FrameTypes.ERROR,
    };
}
/**
 * Writes a KEEPALIVE frame into a new buffer and returns it.
 *
 * Prefix size is for the last received position (uint64 = 8).
 */
var KEEPALIVE_FIXED_SIZE = 8;
function serializeKeepAliveFrame(frame) {
    var dataLength = frame.data != null ? frame.data.byteLength : 0;
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + KEEPALIVE_FIXED_SIZE + dataLength);
    var offset = writeHeader(frame, buffer);
    offset = writeUInt64BE(buffer, frame.lastReceivedPosition, offset);
    if (frame.data != null) {
        frame.data.copy(buffer, offset);
    }
    return buffer;
}
function sizeOfKeepAliveFrame(frame) {
    var dataLength = frame.data != null ? frame.data.byteLength : 0;
    return FRAME_HEADER_SIZE + KEEPALIVE_FIXED_SIZE + dataLength;
}
/**
 * Reads a KEEPALIVE frame from the buffer and returns it.
 */
function deserializeKeepAliveFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   "RSocketBinaryFraming: Invalid KEEPALIVE frame, expected stream id to be 0."
    // );
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var lastReceivedPosition = readUInt64BE(buffer, offset);
    offset += 8;
    var data = null;
    if (offset < buffer.length) {
        data = buffer.slice(offset, buffer.length);
    }
    return {
        data: data,
        flags: flags,
        lastReceivedPosition: lastReceivedPosition,
        // streamId,
        streamId: 0,
        type: FrameTypes.KEEPALIVE,
    };
}
/**
 * Writes a LEASE frame into a new buffer and returns it.
 *
 * Prefix size is for the ttl (uint32) and requestcount (uint32).
 */
var LEASE_FIXED_SIZE = 8;
function serializeLeaseFrame(frame) {
    var metaLength = frame.metadata != null ? frame.metadata.byteLength : 0;
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + LEASE_FIXED_SIZE + metaLength);
    var offset = writeHeader(frame, buffer);
    offset = buffer.writeUInt32BE(frame.ttl, offset);
    offset = buffer.writeUInt32BE(frame.requestCount, offset);
    if (frame.metadata != null) {
        frame.metadata.copy(buffer, offset);
    }
    return buffer;
}
function sizeOfLeaseFrame(frame) {
    var metaLength = frame.metadata != null ? frame.metadata.byteLength : 0;
    return FRAME_HEADER_SIZE + LEASE_FIXED_SIZE + metaLength;
}
/**
 * Reads a LEASE frame from the buffer and returns it.
 */
function deserializeLeaseFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   "RSocketBinaryFraming: Invalid LEASE frame, expected stream id to be 0."
    // );
    // const length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var ttl = buffer.readUInt32BE(offset);
    offset += 4;
    var requestCount = buffer.readUInt32BE(offset);
    offset += 4;
    var metadata = null;
    if (offset < buffer.length) {
        metadata = buffer.slice(offset, buffer.length);
    }
    return {
        flags: flags,
        metadata: metadata,
        requestCount: requestCount,
        // streamId,
        streamId: 0,
        ttl: ttl,
        type: FrameTypes.LEASE,
    };
}
/**
 * Writes a REQUEST_FNF or REQUEST_RESPONSE frame to a new buffer and returns
 * it.
 *
 * Note that these frames have the same shape and only differ in their type.
 */
function serializeRequestFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + payloadLength);
    var offset = writeHeader(frame, buffer);
    writePayload(frame, buffer, offset);
    return buffer;
}
function sizeOfRequestFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    return FRAME_HEADER_SIZE + payloadLength;
}
/**
 * Writes a METADATA_PUSH frame to a new buffer and returns
 * it.
 */
function serializeMetadataPushFrame(frame) {
    var metadata = frame.metadata;
    if (metadata != null) {
        var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + metadata.byteLength);
        var offset = writeHeader(frame, buffer);
        metadata.copy(buffer, offset);
        return buffer;
    }
    else {
        var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE);
        writeHeader(frame, buffer);
        return buffer;
    }
}
function sizeOfMetadataPushFrame(frame) {
    return (FRAME_HEADER_SIZE + (frame.metadata != null ? frame.metadata.byteLength : 0));
}
function deserializeRequestFnfFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_FNF frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    var frame = {
        data: null,
        flags: flags,
        // length,
        metadata: null,
        streamId: streamId,
        type: FrameTypes.REQUEST_FNF,
    };
    readPayload(buffer, frame, FRAME_HEADER_SIZE);
    return frame;
}
function deserializeRequestResponseFrame(buffer, streamId, flags) {
    // invariant(
    // streamId > 0,
    // "RSocketBinaryFraming: Invalid REQUEST_RESPONSE frame, expected stream id to be > 0."
    // );
    // const length = buffer.length;
    var frame = {
        data: null,
        flags: flags,
        // length,
        metadata: null,
        streamId: streamId,
        type: FrameTypes.REQUEST_RESPONSE,
    };
    readPayload(buffer, frame, FRAME_HEADER_SIZE);
    return frame;
}
function deserializeMetadataPushFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   "RSocketBinaryFraming: Invalid METADATA_PUSH frame, expected stream id to be 0."
    // );
    // const length = buffer.length;
    return {
        flags: flags,
        // length,
        metadata: length === FRAME_HEADER_SIZE
            ? null
            : buffer.slice(FRAME_HEADER_SIZE, length),
        // streamId,
        streamId: 0,
        type: FrameTypes.METADATA_PUSH,
    };
}
/**
 * Writes a REQUEST_STREAM or REQUEST_CHANNEL frame to a new buffer and returns
 * it.
 *
 * Note that these frames have the same shape and only differ in their type.
 *
 * Prefix size is for requestN (uint32 = 4).
 */
var REQUEST_MANY_HEADER = 4;
function serializeRequestManyFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + REQUEST_MANY_HEADER + payloadLength);
    var offset = writeHeader(frame, buffer);
    offset = buffer.writeUInt32BE(frame.requestN, offset);
    writePayload(frame, buffer, offset);
    return buffer;
}
function sizeOfRequestManyFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    return FRAME_HEADER_SIZE + REQUEST_MANY_HEADER + payloadLength;
}
function deserializeRequestStreamFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_STREAM frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var requestN = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   requestN > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_STREAM frame, expected requestN to be > 0, got `%s`.",
    //   requestN
    // );
    var frame = {
        data: null,
        flags: flags,
        // length,
        metadata: null,
        requestN: requestN,
        streamId: streamId,
        type: FrameTypes.REQUEST_STREAM,
    };
    readPayload(buffer, frame, offset);
    return frame;
}
function deserializeRequestChannelFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_CHANNEL frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var requestN = buffer.readInt32BE(offset);
    offset += 4;
    // invariant(
    //   requestN > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_STREAM frame, expected requestN to be > 0, got `%s`.",
    //   requestN
    // );
    var frame = {
        data: null,
        flags: flags,
        // length,
        metadata: null,
        requestN: requestN,
        streamId: streamId,
        type: FrameTypes.REQUEST_CHANNEL,
    };
    readPayload(buffer, frame, offset);
    return frame;
}
/**
 * Writes a REQUEST_N frame to a new buffer and returns it.
 *
 * Prefix size is for requestN (uint32 = 4).
 */
var REQUEST_N_HEADER = 4;
function serializeRequestNFrame(frame) {
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + REQUEST_N_HEADER);
    var offset = writeHeader(frame, buffer);
    buffer.writeUInt32BE(frame.requestN, offset);
    return buffer;
}
function sizeOfRequestNFrame(frame) {
    return FRAME_HEADER_SIZE + REQUEST_N_HEADER;
}
function deserializeRequestNFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_N frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    var requestN = buffer.readInt32BE(FRAME_HEADER_SIZE);
    // invariant(
    //   requestN > 0,
    //   "RSocketBinaryFraming: Invalid REQUEST_STREAM frame, expected requestN to be > 0, got `%s`.",
    //   requestN
    // );
    return {
        flags: flags,
        // length,
        requestN: requestN,
        streamId: streamId,
        type: FrameTypes.REQUEST_N,
    };
}
/**
 * Writes a CANCEL frame to a new buffer and returns it.
 */
function serializeCancelFrame(frame) {
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE);
    writeHeader(frame, buffer);
    return buffer;
}
function sizeOfCancelFrame(frame) {
    return FRAME_HEADER_SIZE;
}
function deserializeCancelFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid CANCEL frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    return {
        flags: flags,
        // length,
        streamId: streamId,
        type: FrameTypes.CANCEL,
    };
}
/**
 * Writes a PAYLOAD frame to a new buffer and returns it.
 */
function serializePayloadFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + payloadLength);
    var offset = writeHeader(frame, buffer);
    writePayload(frame, buffer, offset);
    return buffer;
}
function sizeOfPayloadFrame(frame) {
    var payloadLength = getPayloadLength(frame);
    return FRAME_HEADER_SIZE + payloadLength;
}
function deserializePayloadFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId > 0,
    //   "RSocketBinaryFraming: Invalid PAYLOAD frame, expected stream id to be > 0."
    // );
    var length = buffer.length;
    var frame = {
        data: null,
        flags: flags,
        // length,
        metadata: null,
        streamId: streamId,
        type: FrameTypes.PAYLOAD,
    };
    readPayload(buffer, frame, FRAME_HEADER_SIZE);
    return frame;
}
/**
 * Writes a RESUME frame into a new buffer and returns it.
 *
 * Fixed size is:
 * - major version (uint16 = 2)
 * - minor version (uint16 = 2)
 * - token length (uint16 = 2)
 * - client position (uint64 = 8)
 * - server position (uint64 = 8)
 */
var RESUME_FIXED_SIZE = 22;
function serializeResumeFrame(frame) {
    var resumeTokenLength = frame.resumeToken.byteLength;
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + RESUME_FIXED_SIZE + resumeTokenLength);
    var offset = writeHeader(frame, buffer);
    offset = buffer.writeUInt16BE(frame.majorVersion, offset);
    offset = buffer.writeUInt16BE(frame.minorVersion, offset);
    offset = buffer.writeUInt16BE(resumeTokenLength, offset);
    offset += frame.resumeToken.copy(buffer, offset);
    offset = writeUInt64BE(buffer, frame.serverPosition, offset);
    writeUInt64BE(buffer, frame.clientPosition, offset);
    return buffer;
}
function sizeOfResumeFrame(frame) {
    var resumeTokenLength = frame.resumeToken.byteLength;
    return FRAME_HEADER_SIZE + RESUME_FIXED_SIZE + resumeTokenLength;
}
function deserializeResumeFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   "RSocketBinaryFraming: Invalid RESUME frame, expected stream id to be 0."
    // );
    var length = buffer.length;
    var offset = FRAME_HEADER_SIZE;
    var majorVersion = buffer.readUInt16BE(offset);
    offset += 2;
    var minorVersion = buffer.readUInt16BE(offset);
    offset += 2;
    var resumeTokenLength = buffer.readInt16BE(offset);
    offset += 2;
    // invariant(
    //   resumeTokenLength >= 0 && resumeTokenLength <= MAX_RESUME_LENGTH,
    //   "RSocketBinaryFraming: Invalid SETUP frame, expected resumeToken length " +
    //     "to be >= 0 and <= %s. Got `%s`.",
    //   MAX_RESUME_LENGTH,
    //   resumeTokenLength
    // );
    var resumeToken = buffer.slice(offset, offset + resumeTokenLength);
    offset += resumeTokenLength;
    var serverPosition = readUInt64BE(buffer, offset);
    offset += 8;
    var clientPosition = readUInt64BE(buffer, offset);
    offset += 8;
    return {
        clientPosition: clientPosition,
        flags: flags,
        // length,
        majorVersion: majorVersion,
        minorVersion: minorVersion,
        resumeToken: resumeToken,
        serverPosition: serverPosition,
        // streamId,
        streamId: 0,
        type: FrameTypes.RESUME,
    };
}
/**
 * Writes a RESUME_OK frame into a new buffer and returns it.
 *
 * Fixed size is:
 * - client position (uint64 = 8)
 */
var RESUME_OK_FIXED_SIZE = 8;
function serializeResumeOkFrame(frame) {
    var buffer = Buffer.allocUnsafe(FRAME_HEADER_SIZE + RESUME_OK_FIXED_SIZE);
    var offset = writeHeader(frame, buffer);
    writeUInt64BE(buffer, frame.clientPosition, offset);
    return buffer;
}
function sizeOfResumeOkFrame(frame) {
    return FRAME_HEADER_SIZE + RESUME_OK_FIXED_SIZE;
}
function deserializeResumeOkFrame(buffer, streamId, flags) {
    // invariant(
    //   streamId === 0,
    //   "RSocketBinaryFraming: Invalid RESUME frame, expected stream id to be 0."
    // );
    var length = buffer.length;
    var clientPosition = readUInt64BE(buffer, FRAME_HEADER_SIZE);
    return {
        clientPosition: clientPosition,
        flags: flags,
        // length,
        // streamId,
        streamId: 0,
        type: FrameTypes.RESUME_OK,
    };
}
/**
 * Write the header of the frame into the buffer.
 */
function writeHeader(frame, buffer) {
    var offset = buffer.writeInt32BE(frame.streamId, 0);
    // shift frame to high 6 bits, extract lowest 10 bits from flags
    return buffer.writeUInt16BE((frame.type << FRAME_TYPE_OFFFSET) | (frame.flags & FLAGS_MASK), offset);
}
/**
 * Determine the length of the payload section of a frame. Only applies to
 * frame types that MAY have both metadata and data.
 */
function getPayloadLength(frame) {
    var payloadLength = 0;
    if (frame.data != null) {
        payloadLength += frame.data.byteLength;
    }
    if (Flags.hasMetadata(frame.flags)) {
        payloadLength += UINT24_SIZE;
        if (frame.metadata != null) {
            payloadLength += frame.metadata.byteLength;
        }
    }
    return payloadLength;
}
/**
 * Write the payload of a frame into the given buffer. Only applies to frame
 * types that MAY have both metadata and data.
 */
function writePayload(frame, buffer, offset) {
    if (Flags.hasMetadata(frame.flags)) {
        if (frame.metadata != null) {
            var metaLength = frame.metadata.byteLength;
            offset = writeUInt24BE(buffer, metaLength, offset);
            offset += frame.metadata.copy(buffer, offset);
        }
        else {
            offset = writeUInt24BE(buffer, 0, offset);
        }
    }
    if (frame.data != null) {
        frame.data.copy(buffer, offset);
    }
}
/**
 * Read the payload from a buffer and write it into the frame. Only applies to
 * frame types that MAY have both metadata and data.
 */
function readPayload(buffer, frame, offset) {
    if (Flags.hasMetadata(frame.flags)) {
        var metaLength = readUInt24BE(buffer, offset);
        offset += UINT24_SIZE;
        if (metaLength > 0) {
            frame.metadata = buffer.slice(offset, offset + metaLength);
            offset += metaLength;
        }
    }
    if (offset < buffer.length) {
        frame.data = buffer.slice(offset, buffer.length);
    }
}
// exported as class to facilitate testing
var Deserializer = /** @class */ (function () {
    function Deserializer() {
    }
    /**
     * Read a frame from the buffer.
     */
    Deserializer.prototype.deserializeFrame = function (buffer) {
        return deserializeFrame(buffer);
    };
    /**
     * Reads a frame from a buffer that is prefixed with the frame length.
     */
    Deserializer.prototype.deserializeFrameWithLength = function (buffer) {
        return deserializeFrameWithLength(buffer);
    };
    /**
     * Given a buffer that may contain zero or more length-prefixed frames followed
     * by zero or more bytes of a (partial) subsequent frame, returns an array of
     * the frames and a int representing the buffer offset.
     */
    Deserializer.prototype.deserializeFrames = function (buffer) {
        return deserializeFrames(buffer);
    };
    return Deserializer;
}());
export { Deserializer };
//# sourceMappingURL=Codecs.js.map