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
import { Flags, FrameTypes, Lengths, } from "./Frames.js";
export function isFragmentable(payload, fragmentSize, frameType) {
    if (fragmentSize === 0) {
        return false;
    }
    return (payload.data.byteLength +
        (payload.metadata ? payload.metadata.byteLength + Lengths.METADATA : 0) +
        (frameType == FrameTypes.REQUEST_STREAM ||
            frameType == FrameTypes.REQUEST_CHANNEL
            ? Lengths.REQUEST
            : 0) >
        fragmentSize);
}
export function fragment(streamId, payload, fragmentSize, frameType, isComplete) {
    var dataLength, firstFrame, remaining, metadata, metadataLength, metadataPosition, nextMetadataPosition, nextMetadataPosition, dataPosition, data, nextDataPosition, nextDataPosition;
    var _a, _b;
    if (isComplete === void 0) { isComplete = false; }
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                dataLength = (_b = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.byteLength) !== null && _b !== void 0 ? _b : 0;
                firstFrame = frameType !== FrameTypes.PAYLOAD;
                remaining = fragmentSize;
                if (!payload.metadata) return [3 /*break*/, 6];
                metadataLength = payload.metadata.byteLength;
                if (!(metadataLength === 0)) return [3 /*break*/, 1];
                remaining -= Lengths.METADATA;
                metadata = Buffer.allocUnsafe(0);
                return [3 /*break*/, 6];
            case 1:
                metadataPosition = 0;
                if (!firstFrame) return [3 /*break*/, 3];
                remaining -= Lengths.METADATA;
                nextMetadataPosition = Math.min(metadataLength, metadataPosition + remaining);
                metadata = payload.metadata.slice(metadataPosition, nextMetadataPosition);
                remaining -= metadata.byteLength;
                metadataPosition = nextMetadataPosition;
                if (!(remaining === 0)) return [3 /*break*/, 3];
                firstFrame = false;
                return [4 /*yield*/, {
                        type: frameType,
                        flags: Flags.FOLLOWS | Flags.METADATA,
                        data: undefined,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 2:
                _c.sent();
                metadata = undefined;
                remaining = fragmentSize;
                _c.label = 3;
            case 3:
                if (!(metadataPosition < metadataLength)) return [3 /*break*/, 6];
                remaining -= Lengths.METADATA;
                nextMetadataPosition = Math.min(metadataLength, metadataPosition + remaining);
                metadata = payload.metadata.slice(metadataPosition, nextMetadataPosition);
                remaining -= metadata.byteLength;
                metadataPosition = nextMetadataPosition;
                if (!(remaining === 0 || dataLength === 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, {
                        type: FrameTypes.PAYLOAD,
                        flags: Flags.NEXT |
                            Flags.METADATA |
                            (metadataPosition === metadataLength &&
                                isComplete &&
                                dataLength === 0
                                ? Flags.COMPLETE
                                : Flags.FOLLOWS),
                        data: undefined,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 4:
                _c.sent();
                metadata = undefined;
                remaining = fragmentSize;
                _c.label = 5;
            case 5: return [3 /*break*/, 3];
            case 6:
                dataPosition = 0;
                if (!firstFrame) return [3 /*break*/, 8];
                nextDataPosition = Math.min(dataLength, dataPosition + remaining);
                data = payload.data.slice(dataPosition, nextDataPosition);
                remaining -= data.byteLength;
                dataPosition = nextDataPosition;
                return [4 /*yield*/, {
                        type: frameType,
                        flags: Flags.FOLLOWS | (metadata ? Flags.METADATA : Flags.NONE),
                        data: data,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 7:
                _c.sent();
                metadata = undefined;
                data = undefined;
                remaining = fragmentSize;
                _c.label = 8;
            case 8:
                if (!(dataPosition < dataLength)) return [3 /*break*/, 10];
                nextDataPosition = Math.min(dataLength, dataPosition + remaining);
                data = payload.data.slice(dataPosition, nextDataPosition);
                remaining -= data.byteLength;
                dataPosition = nextDataPosition;
                return [4 /*yield*/, {
                        type: FrameTypes.PAYLOAD,
                        flags: dataPosition === dataLength
                            ? (isComplete ? Flags.COMPLETE : Flags.NONE) |
                                Flags.NEXT |
                                (metadata ? Flags.METADATA : 0)
                            : Flags.FOLLOWS | Flags.NEXT | (metadata ? Flags.METADATA : 0),
                        data: data,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 9:
                _c.sent();
                metadata = undefined;
                data = undefined;
                remaining = fragmentSize;
                return [3 /*break*/, 8];
            case 10: return [2 /*return*/];
        }
    });
}
export function fragmentWithRequestN(streamId, payload, fragmentSize, frameType, requestN, isComplete) {
    var dataLength, firstFrame, remaining, metadata, metadataLength, metadataPosition, nextMetadataPosition, nextMetadataPosition, dataPosition, data, nextDataPosition, nextDataPosition;
    var _a, _b;
    if (isComplete === void 0) { isComplete = false; }
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                dataLength = (_b = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.byteLength) !== null && _b !== void 0 ? _b : 0;
                firstFrame = true;
                remaining = fragmentSize;
                if (!payload.metadata) return [3 /*break*/, 6];
                metadataLength = payload.metadata.byteLength;
                if (!(metadataLength === 0)) return [3 /*break*/, 1];
                remaining -= Lengths.METADATA;
                metadata = Buffer.allocUnsafe(0);
                return [3 /*break*/, 6];
            case 1:
                metadataPosition = 0;
                if (!firstFrame) return [3 /*break*/, 3];
                remaining -= Lengths.METADATA + Lengths.REQUEST;
                nextMetadataPosition = Math.min(metadataLength, metadataPosition + remaining);
                metadata = payload.metadata.slice(metadataPosition, nextMetadataPosition);
                remaining -= metadata.byteLength;
                metadataPosition = nextMetadataPosition;
                if (!(remaining === 0)) return [3 /*break*/, 3];
                firstFrame = false;
                return [4 /*yield*/, {
                        type: frameType,
                        flags: Flags.FOLLOWS | Flags.METADATA,
                        data: undefined,
                        requestN: requestN,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 2:
                _c.sent();
                metadata = undefined;
                remaining = fragmentSize;
                _c.label = 3;
            case 3:
                if (!(metadataPosition < metadataLength)) return [3 /*break*/, 6];
                remaining -= Lengths.METADATA;
                nextMetadataPosition = Math.min(metadataLength, metadataPosition + remaining);
                metadata = payload.metadata.slice(metadataPosition, nextMetadataPosition);
                remaining -= metadata.byteLength;
                metadataPosition = nextMetadataPosition;
                if (!(remaining === 0 || dataLength === 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, {
                        type: FrameTypes.PAYLOAD,
                        flags: Flags.NEXT |
                            Flags.METADATA |
                            (metadataPosition === metadataLength &&
                                isComplete &&
                                dataLength === 0
                                ? Flags.COMPLETE
                                : Flags.FOLLOWS),
                        data: undefined,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 4:
                _c.sent();
                metadata = undefined;
                remaining = fragmentSize;
                _c.label = 5;
            case 5: return [3 /*break*/, 3];
            case 6:
                dataPosition = 0;
                if (!firstFrame) return [3 /*break*/, 8];
                remaining -= Lengths.REQUEST;
                nextDataPosition = Math.min(dataLength, dataPosition + remaining);
                data = payload.data.slice(dataPosition, nextDataPosition);
                remaining -= data.byteLength;
                dataPosition = nextDataPosition;
                return [4 /*yield*/, {
                        type: frameType,
                        flags: Flags.FOLLOWS | (metadata ? Flags.METADATA : Flags.NONE),
                        data: data,
                        requestN: requestN,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 7:
                _c.sent();
                metadata = undefined;
                data = undefined;
                remaining = fragmentSize;
                _c.label = 8;
            case 8:
                if (!(dataPosition < dataLength)) return [3 /*break*/, 10];
                nextDataPosition = Math.min(dataLength, dataPosition + remaining);
                data = payload.data.slice(dataPosition, nextDataPosition);
                remaining -= data.byteLength;
                dataPosition = nextDataPosition;
                return [4 /*yield*/, {
                        type: FrameTypes.PAYLOAD,
                        flags: dataPosition === dataLength
                            ? (isComplete ? Flags.COMPLETE : Flags.NONE) |
                                Flags.NEXT |
                                (metadata ? Flags.METADATA : 0)
                            : Flags.FOLLOWS | Flags.NEXT | (metadata ? Flags.METADATA : 0),
                        data: data,
                        metadata: metadata,
                        streamId: streamId,
                    }];
            case 9:
                _c.sent();
                metadata = undefined;
                data = undefined;
                remaining = fragmentSize;
                return [3 /*break*/, 8];
            case 10: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=Fragmenter.js.map