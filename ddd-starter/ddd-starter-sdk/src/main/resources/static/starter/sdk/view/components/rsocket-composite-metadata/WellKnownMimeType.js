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
var WellKnownMimeType = /** @class */ (function () {
    function WellKnownMimeType(string, identifier) {
        this.string = string;
        this.identifier = identifier;
    }
    /**
     * Find the {@link WellKnownMimeType} for the given identifier (as an {@code int}). Valid
     * identifiers are defined to be integers between 0 and 127, inclusive. Identifiers outside of
     * this range will produce the {@link #UNPARSEABLE_MIME_TYPE}. Additionally, some identifiers in
     * that range are still only reserved and don't have a type associated yet: this method returns
     * the {@link #UNKNOWN_RESERVED_MIME_TYPE} when passing such an identifier, which lets call sites
     * potentially detect this and keep the original representation when transmitting the associated
     * metadata buffer.
     *
     * @param id the looked up identifier
     * @return the {@link WellKnownMimeType}, or {@link #UNKNOWN_RESERVED_MIME_TYPE} if the id is out
     *     of the specification's range, or {@link #UNKNOWN_RESERVED_MIME_TYPE} if the id is one that
     *     is merely reserved but unknown to this implementation.
     */
    WellKnownMimeType.fromIdentifier = function (id) {
        if (id < 0x00 || id > 0x7f) {
            return WellKnownMimeType.UNPARSEABLE_MIME_TYPE;
        }
        return WellKnownMimeType.TYPES_BY_MIME_ID[id];
    };
    /**
     * Find the {@link WellKnownMimeType} for the given {@link String} representation. If the
     * representation is {@code null} or doesn't match a {@link WellKnownMimeType}, the {@link
     * #UNPARSEABLE_MIME_TYPE} is returned.
     *
     * @param mimeType the looked up mime type
     * @return the matching {@link WellKnownMimeType}, or {@link #UNPARSEABLE_MIME_TYPE} if none
     *     matches
     */
    WellKnownMimeType.fromString = function (mimeType) {
        if (!mimeType) {
            throw new Error("type must be non-null");
        }
        // force UNPARSEABLE if by chance UNKNOWN_RESERVED_MIME_TYPE's text has been used
        if (mimeType === WellKnownMimeType.UNKNOWN_RESERVED_MIME_TYPE.string) {
            return WellKnownMimeType.UNPARSEABLE_MIME_TYPE;
        }
        return (WellKnownMimeType.TYPES_BY_MIME_STRING.get(mimeType) ||
            WellKnownMimeType.UNPARSEABLE_MIME_TYPE);
    };
    WellKnownMimeType.prototype.toString = function () {
        return this.string;
    };
    return WellKnownMimeType;
}());
export { WellKnownMimeType };
(function (WellKnownMimeType) {
    var e_1, _a;
    WellKnownMimeType.UNPARSEABLE_MIME_TYPE = new WellKnownMimeType("UNPARSEABLE_MIME_TYPE_DO_NOT_USE", -2);
    WellKnownMimeType.UNKNOWN_RESERVED_MIME_TYPE = new WellKnownMimeType("UNKNOWN_YET_RESERVED_DO_NOT_USE", -1);
    WellKnownMimeType.APPLICATION_AVRO = new WellKnownMimeType("application/avro", 0x00);
    WellKnownMimeType.APPLICATION_CBOR = new WellKnownMimeType("application/cbor", 0x01);
    WellKnownMimeType.APPLICATION_GRAPHQL = new WellKnownMimeType("application/graphql", 0x02);
    WellKnownMimeType.APPLICATION_GZIP = new WellKnownMimeType("application/gzip", 0x03);
    WellKnownMimeType.APPLICATION_JAVASCRIPT = new WellKnownMimeType("application/javascript", 0x04);
    WellKnownMimeType.APPLICATION_JSON = new WellKnownMimeType("application/json", 0x05);
    WellKnownMimeType.APPLICATION_OCTET_STREAM = new WellKnownMimeType("application/octet-stream", 0x06);
    WellKnownMimeType.APPLICATION_PDF = new WellKnownMimeType("application/pdf", 0x07);
    WellKnownMimeType.APPLICATION_THRIFT = new WellKnownMimeType("application/vnd.apache.thrift.binary", 0x08);
    WellKnownMimeType.APPLICATION_PROTOBUF = new WellKnownMimeType("application/vnd.google.protobuf", 0x09);
    WellKnownMimeType.APPLICATION_XML = new WellKnownMimeType("application/xml", 0x0a);
    WellKnownMimeType.APPLICATION_ZIP = new WellKnownMimeType("application/zip", 0x0b);
    WellKnownMimeType.AUDIO_AAC = new WellKnownMimeType("audio/aac", 0x0c);
    WellKnownMimeType.AUDIO_MP3 = new WellKnownMimeType("audio/mp3", 0x0d);
    WellKnownMimeType.AUDIO_MP4 = new WellKnownMimeType("audio/mp4", 0x0e);
    WellKnownMimeType.AUDIO_MPEG3 = new WellKnownMimeType("audio/mpeg3", 0x0f);
    WellKnownMimeType.AUDIO_MPEG = new WellKnownMimeType("audio/mpeg", 0x10);
    WellKnownMimeType.AUDIO_OGG = new WellKnownMimeType("audio/ogg", 0x11);
    WellKnownMimeType.AUDIO_OPUS = new WellKnownMimeType("audio/opus", 0x12);
    WellKnownMimeType.AUDIO_VORBIS = new WellKnownMimeType("audio/vorbis", 0x13);
    WellKnownMimeType.IMAGE_BMP = new WellKnownMimeType("image/bmp", 0x14);
    WellKnownMimeType.IMAGE_GIG = new WellKnownMimeType("image/gif", 0x15);
    WellKnownMimeType.IMAGE_HEIC_SEQUENCE = new WellKnownMimeType("image/heic-sequence", 0x16);
    WellKnownMimeType.IMAGE_HEIC = new WellKnownMimeType("image/heic", 0x17);
    WellKnownMimeType.IMAGE_HEIF_SEQUENCE = new WellKnownMimeType("image/heif-sequence", 0x18);
    WellKnownMimeType.IMAGE_HEIF = new WellKnownMimeType("image/heif", 0x19);
    WellKnownMimeType.IMAGE_JPEG = new WellKnownMimeType("image/jpeg", 0x1a);
    WellKnownMimeType.IMAGE_PNG = new WellKnownMimeType("image/png", 0x1b);
    WellKnownMimeType.IMAGE_TIFF = new WellKnownMimeType("image/tiff", 0x1c);
    WellKnownMimeType.MULTIPART_MIXED = new WellKnownMimeType("multipart/mixed", 0x1d);
    WellKnownMimeType.TEXT_CSS = new WellKnownMimeType("text/css", 0x1e);
    WellKnownMimeType.TEXT_CSV = new WellKnownMimeType("text/csv", 0x1f);
    WellKnownMimeType.TEXT_HTML = new WellKnownMimeType("text/html", 0x20);
    WellKnownMimeType.TEXT_PLAIN = new WellKnownMimeType("text/plain", 0x21);
    WellKnownMimeType.TEXT_XML = new WellKnownMimeType("text/xml", 0x22);
    WellKnownMimeType.VIDEO_H264 = new WellKnownMimeType("video/H264", 0x23);
    WellKnownMimeType.VIDEO_H265 = new WellKnownMimeType("video/H265", 0x24);
    WellKnownMimeType.VIDEO_VP8 = new WellKnownMimeType("video/VP8", 0x25);
    WellKnownMimeType.APPLICATION_HESSIAN = new WellKnownMimeType("application/x-hessian", 0x26);
    WellKnownMimeType.APPLICATION_JAVA_OBJECT = new WellKnownMimeType("application/x-java-object", 0x27);
    WellKnownMimeType.APPLICATION_CLOUDEVENTS_JSON = new WellKnownMimeType("application/cloudevents+json", 0x28);
    // ... reserved for future use ...
    WellKnownMimeType.MESSAGE_RSOCKET_MIMETYPE = new WellKnownMimeType("message/x.rsocket.mime-type.v0", 0x7a);
    WellKnownMimeType.MESSAGE_RSOCKET_ACCEPT_MIMETYPES = new WellKnownMimeType("message/x.rsocket.accept-mime-types.v0", 0x7b);
    WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION = new WellKnownMimeType("message/x.rsocket.authentication.v0", 0x7c);
    WellKnownMimeType.MESSAGE_RSOCKET_TRACING_ZIPKIN = new WellKnownMimeType("message/x.rsocket.tracing-zipkin.v0", 0x7d);
    WellKnownMimeType.MESSAGE_RSOCKET_ROUTING = new WellKnownMimeType("message/x.rsocket.routing.v0", 0x7e);
    WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA = new WellKnownMimeType("message/x.rsocket.composite-metadata.v0", 0x7f);
    WellKnownMimeType.TYPES_BY_MIME_ID = new Array(128);
    WellKnownMimeType.TYPES_BY_MIME_STRING = new Map();
    var ALL_MIME_TYPES = [
        WellKnownMimeType.UNPARSEABLE_MIME_TYPE,
        WellKnownMimeType.UNKNOWN_RESERVED_MIME_TYPE,
        WellKnownMimeType.APPLICATION_AVRO,
        WellKnownMimeType.APPLICATION_CBOR,
        WellKnownMimeType.APPLICATION_GRAPHQL,
        WellKnownMimeType.APPLICATION_GZIP,
        WellKnownMimeType.APPLICATION_JAVASCRIPT,
        WellKnownMimeType.APPLICATION_JSON,
        WellKnownMimeType.APPLICATION_OCTET_STREAM,
        WellKnownMimeType.APPLICATION_PDF,
        WellKnownMimeType.APPLICATION_THRIFT,
        WellKnownMimeType.APPLICATION_PROTOBUF,
        WellKnownMimeType.APPLICATION_XML,
        WellKnownMimeType.APPLICATION_ZIP,
        WellKnownMimeType.AUDIO_AAC,
        WellKnownMimeType.AUDIO_MP3,
        WellKnownMimeType.AUDIO_MP4,
        WellKnownMimeType.AUDIO_MPEG3,
        WellKnownMimeType.AUDIO_MPEG,
        WellKnownMimeType.AUDIO_OGG,
        WellKnownMimeType.AUDIO_OPUS,
        WellKnownMimeType.AUDIO_VORBIS,
        WellKnownMimeType.IMAGE_BMP,
        WellKnownMimeType.IMAGE_GIG,
        WellKnownMimeType.IMAGE_HEIC_SEQUENCE,
        WellKnownMimeType.IMAGE_HEIC,
        WellKnownMimeType.IMAGE_HEIF_SEQUENCE,
        WellKnownMimeType.IMAGE_HEIF,
        WellKnownMimeType.IMAGE_JPEG,
        WellKnownMimeType.IMAGE_PNG,
        WellKnownMimeType.IMAGE_TIFF,
        WellKnownMimeType.MULTIPART_MIXED,
        WellKnownMimeType.TEXT_CSS,
        WellKnownMimeType.TEXT_CSV,
        WellKnownMimeType.TEXT_HTML,
        WellKnownMimeType.TEXT_PLAIN,
        WellKnownMimeType.TEXT_XML,
        WellKnownMimeType.VIDEO_H264,
        WellKnownMimeType.VIDEO_H265,
        WellKnownMimeType.VIDEO_VP8,
        WellKnownMimeType.APPLICATION_HESSIAN,
        WellKnownMimeType.APPLICATION_JAVA_OBJECT,
        WellKnownMimeType.APPLICATION_CLOUDEVENTS_JSON,
        WellKnownMimeType.MESSAGE_RSOCKET_MIMETYPE,
        WellKnownMimeType.MESSAGE_RSOCKET_ACCEPT_MIMETYPES,
        WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION,
        WellKnownMimeType.MESSAGE_RSOCKET_TRACING_ZIPKIN,
        WellKnownMimeType.MESSAGE_RSOCKET_ROUTING,
        WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA,
    ];
    WellKnownMimeType.TYPES_BY_MIME_ID.fill(WellKnownMimeType.UNKNOWN_RESERVED_MIME_TYPE);
    try {
        for (var ALL_MIME_TYPES_1 = __values(ALL_MIME_TYPES), ALL_MIME_TYPES_1_1 = ALL_MIME_TYPES_1.next(); !ALL_MIME_TYPES_1_1.done; ALL_MIME_TYPES_1_1 = ALL_MIME_TYPES_1.next()) {
            var value = ALL_MIME_TYPES_1_1.value;
            if (value.identifier >= 0) {
                WellKnownMimeType.TYPES_BY_MIME_ID[value.identifier] = value;
                WellKnownMimeType.TYPES_BY_MIME_STRING.set(value.string, value);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (ALL_MIME_TYPES_1_1 && !ALL_MIME_TYPES_1_1.done && (_a = ALL_MIME_TYPES_1.return)) _a.call(ALL_MIME_TYPES_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (Object.seal) {
        Object.seal(WellKnownMimeType.TYPES_BY_MIME_ID);
    }
})(WellKnownMimeType || (WellKnownMimeType = {}));
//# sourceMappingURL=WellKnownMimeType.js.map