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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { readUInt24BE, writeUInt24BE } from "../rsocket-core/index.js";
import { WellKnownMimeType } from "./WellKnownMimeType.js";
var CompositeMetadata = /** @class */ (function () {
    function CompositeMetadata(buffer) {
        this._buffer = buffer;
    }
    CompositeMetadata.prototype.iterator = function () {
        return decodeCompositeMetadata(this._buffer);
    };
    CompositeMetadata.prototype[Symbol.iterator] = function () {
        return decodeCompositeMetadata(this._buffer);
    };
    return CompositeMetadata;
}());
export { CompositeMetadata };
export function encodeCompositeMetadata(metadata) {
    var e_1, _a;
    var encodedCompositeMetadata = Buffer.allocUnsafe(0);
    try {
        for (var metadata_1 = __values(metadata), metadata_1_1 = metadata_1.next(); !metadata_1_1.done; metadata_1_1 = metadata_1.next()) {
            var _b = __read(metadata_1_1.value, 2), metadataKey = _b[0], metadataValue = _b[1];
            var metadataRealValue = typeof metadataValue === "function" ? metadataValue() : metadataValue;
            if (metadataKey instanceof WellKnownMimeType ||
                typeof metadataKey === "number" ||
                metadataKey.constructor.name === "WellKnownMimeType") {
                encodedCompositeMetadata = encodeAndAddWellKnownMetadata(encodedCompositeMetadata, metadataKey, metadataRealValue);
            }
            else {
                encodedCompositeMetadata = encodeAndAddCustomMetadata(encodedCompositeMetadata, metadataKey, metadataRealValue);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (metadata_1_1 && !metadata_1_1.done && (_a = metadata_1.return)) _a.call(metadata_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return encodedCompositeMetadata;
}
// see #encodeMetadataHeader(ByteBufAllocator, String, int)
export function encodeAndAddCustomMetadata(compositeMetaData, customMimeType, metadata) {
    return Buffer.concat([
        compositeMetaData,
        encodeCustomMetadataHeader(customMimeType, metadata.byteLength),
        metadata,
    ]);
}
// see #encodeMetadataHeader(ByteBufAllocator, byte, int)
export function encodeAndAddWellKnownMetadata(compositeMetadata, knownMimeType, metadata) {
    var mimeTypeId;
    if (Number.isInteger(knownMimeType)) {
        mimeTypeId = knownMimeType;
    }
    else {
        mimeTypeId = knownMimeType.identifier;
    }
    return Buffer.concat([
        compositeMetadata,
        encodeWellKnownMetadataHeader(mimeTypeId, metadata.byteLength),
        metadata,
    ]);
}
export function decodeMimeAndContentBuffersSlices(compositeMetadata, entryIndex) {
    var mimeIdOrLength = compositeMetadata.readInt8(entryIndex);
    var mime;
    var toSkip = entryIndex;
    if ((mimeIdOrLength & STREAM_METADATA_KNOWN_MASK) ===
        STREAM_METADATA_KNOWN_MASK) {
        mime = compositeMetadata.slice(toSkip, toSkip + 1);
        toSkip += 1;
    }
    else {
        // M flag unset, remaining 7 bits are the length of the mime
        var mimeLength = (mimeIdOrLength & 0xff) + 1;
        if (compositeMetadata.byteLength > toSkip + mimeLength) {
            // need to be able to read an extra mimeLength bytes (we have already read one so byteLength should be strictly more)
            // here we need a way for the returned ByteBuf to differentiate between a
            // 1-byte length mime type and a 1 byte encoded mime id, preferably without
            // re-applying the byte mask. The easiest way is to include the initial byte
            // and have further decoding ignore the first byte. 1 byte buffer == id, 2+ byte
            // buffer == full mime string.
            mime = compositeMetadata.slice(toSkip, toSkip + mimeLength + 1);
            // we thus need to skip the bytes we just sliced, but not the flag/length byte
            // which was already skipped in initial read
            toSkip += mimeLength + 1;
        }
        else {
            throw new Error("Metadata is malformed. Inappropriately formed Mime Length");
        }
    }
    if (compositeMetadata.byteLength >= toSkip + 3) {
        // ensures the length medium can be read
        var metadataLength = readUInt24BE(compositeMetadata, toSkip);
        toSkip += 3;
        if (compositeMetadata.byteLength >= metadataLength + toSkip) {
            var metadata = compositeMetadata.slice(toSkip, toSkip + metadataLength);
            return [mime, metadata];
        }
        else {
            throw new Error("Metadata is malformed. Inappropriately formed Metadata Length or malformed content");
        }
    }
    else {
        throw new Error("Metadata is malformed. Metadata Length is absent or malformed");
    }
}
export function decodeMimeTypeFromMimeBuffer(flyweightMimeBuffer) {
    if (flyweightMimeBuffer.length < 2) {
        throw new Error("Unable to decode explicit MIME type");
    }
    // the encoded length is assumed to be kept at the start of the buffer
    // but also assumed to be irrelevant because the rest of the slice length
    // actually already matches _decoded_length
    return flyweightMimeBuffer.toString("ascii", 1);
}
export function encodeCustomMetadataHeader(customMime, metadataLength) {
    // allocate one byte + the length of the mimetype
    var metadataHeader = Buffer.allocUnsafe(4 + customMime.length);
    // fill the buffer to clear previous memory
    metadataHeader.fill(0);
    // write the custom mime in UTF8 but validate it is all ASCII-compatible
    // (which produces the correct result since ASCII chars are still encoded on 1 byte in UTF8)
    var customMimeLength = metadataHeader.write(customMime, 1);
    if (!isAscii(metadataHeader, 1)) {
        throw new Error("Custom mime type must be US_ASCII characters only");
    }
    if (customMimeLength < 1 || customMimeLength > 128) {
        throw new Error("Custom mime type must have a strictly positive length that fits on 7 unsigned bits, ie 1-128");
    }
    // encoded length is one less than actual length, since 0 is never a valid length, which gives
    // wider representation range
    metadataHeader.writeUInt8(customMimeLength - 1);
    writeUInt24BE(metadataHeader, metadataLength, customMimeLength + 1);
    return metadataHeader;
}
export function encodeWellKnownMetadataHeader(mimeType, metadataLength) {
    var buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt8(mimeType | STREAM_METADATA_KNOWN_MASK);
    writeUInt24BE(buffer, metadataLength, 1);
    return buffer;
}
export function decodeCompositeMetadata(buffer) {
    var length, entryIndex, headerAndData, header, data, typeString, id, type;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                length = buffer.byteLength;
                entryIndex = 0;
                _a.label = 1;
            case 1:
                if (!(entryIndex < length)) return [3 /*break*/, 7];
                headerAndData = decodeMimeAndContentBuffersSlices(buffer, entryIndex);
                header = headerAndData[0];
                data = headerAndData[1];
                entryIndex = computeNextEntryIndex(entryIndex, header, data);
                if (!!isWellKnownMimeType(header)) return [3 /*break*/, 3];
                typeString = decodeMimeTypeFromMimeBuffer(header);
                if (!typeString) {
                    throw new Error("MIME type cannot be null");
                }
                return [4 /*yield*/, new ExplicitMimeTimeEntry(data, typeString)];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3:
                id = decodeMimeIdFromMimeBuffer(header);
                type = WellKnownMimeType.fromIdentifier(id);
                if (!(WellKnownMimeType.UNKNOWN_RESERVED_MIME_TYPE === type)) return [3 /*break*/, 5];
                return [4 /*yield*/, new ReservedMimeTypeEntry(data, id)];
            case 4:
                _a.sent();
                return [3 /*break*/, 1];
            case 5: return [4 /*yield*/, new WellKnownMimeTypeEntry(data, type)];
            case 6:
                _a.sent();
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}
var ExplicitMimeTimeEntry = /** @class */ (function () {
    function ExplicitMimeTimeEntry(content, type) {
        this.content = content;
        this.type = type;
    }
    return ExplicitMimeTimeEntry;
}());
export { ExplicitMimeTimeEntry };
var ReservedMimeTypeEntry = /** @class */ (function () {
    function ReservedMimeTypeEntry(content, type) {
        this.content = content;
        this.type = type;
    }
    Object.defineProperty(ReservedMimeTypeEntry.prototype, "mimeType", {
        /**
         * Since this entry represents a compressed id that couldn't be decoded, this is
         * always {@code null}.
         */
        get: function () {
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    return ReservedMimeTypeEntry;
}());
export { ReservedMimeTypeEntry };
var WellKnownMimeTypeEntry = /** @class */ (function () {
    function WellKnownMimeTypeEntry(content, type) {
        this.content = content;
        this.type = type;
    }
    Object.defineProperty(WellKnownMimeTypeEntry.prototype, "mimeType", {
        get: function () {
            return this.type.string;
        },
        enumerable: false,
        configurable: true
    });
    return WellKnownMimeTypeEntry;
}());
export { WellKnownMimeTypeEntry };
function decodeMimeIdFromMimeBuffer(mimeBuffer) {
    if (!isWellKnownMimeType(mimeBuffer)) {
        return WellKnownMimeType.UNPARSEABLE_MIME_TYPE.identifier;
    }
    return mimeBuffer.readInt8() & STREAM_METADATA_LENGTH_MASK;
}
function computeNextEntryIndex(currentEntryIndex, headerSlice, contentSlice) {
    return (currentEntryIndex +
        headerSlice.byteLength + // this includes the mime length byte
        3 + // 3 bytes of the content length, which are excluded from the slice
        contentSlice.byteLength);
}
function isWellKnownMimeType(header) {
    return header.byteLength === 1;
}
var STREAM_METADATA_KNOWN_MASK = 0x80; // 1000 0000
var STREAM_METADATA_LENGTH_MASK = 0x7f; // 0111 1111
function isAscii(buffer, offset) {
    var isAscii = true;
    for (var i = offset, length_1 = buffer.length; i < length_1; i++) {
        if (buffer[i] > 127) {
            isAscii = false;
            break;
        }
    }
    return isAscii;
}
//# sourceMappingURL=CompositeMetadata.js.map