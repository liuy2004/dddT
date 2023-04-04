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
var WellKnownAuthType = /** @class */ (function () {
    function WellKnownAuthType(string, identifier) {
        this.string = string;
        this.identifier = identifier;
    }
    /**
     * Find the {@link WellKnownAuthType} for the given identifier (as an {@link number}). Valid
     * identifiers are defined to be integers between 0 and 127, inclusive. Identifiers outside of
     * this range will produce the {@link #UNPARSEABLE_AUTH_TYPE}. Additionally, some identifiers in
     * that range are still only reserved and don't have a type associated yet: this method returns
     * the {@link #UNKNOWN_RESERVED_AUTH_TYPE} when passing such an identifier, which lets call sites
     * potentially detect this and keep the original representation when transmitting the associated
     * metadata buffer.
     *
     * @param id the looked up identifier
     * @return the {@link WellKnownAuthType}, or {@link #UNKNOWN_RESERVED_AUTH_TYPE} if the id is out
     *     of the specification's range, or {@link #UNKNOWN_RESERVED_AUTH_TYPE} if the id is one that
     *     is merely reserved but unknown to this implementation.
     */
    WellKnownAuthType.fromIdentifier = function (id) {
        if (id < 0x00 || id > 0x7f) {
            return WellKnownAuthType.UNPARSEABLE_AUTH_TYPE;
        }
        return WellKnownAuthType.TYPES_BY_AUTH_ID[id];
    };
    /**
     * Find the {@link WellKnownAuthType} for the given {@link String} representation. If the
     * representation is {@code null} or doesn't match a {@link WellKnownAuthType}, the {@link
     * #UNPARSEABLE_AUTH_TYPE} is returned.
     *
     * @param authTypeString the looked up mime type
     * @return the matching {@link WellKnownAuthType}, or {@link #UNPARSEABLE_AUTH_TYPE} if none
     *     matches
     */
    WellKnownAuthType.fromString = function (authTypeString) {
        if (!authTypeString) {
            throw new Error("type must be non-null");
        }
        // force UNPARSEABLE if by chance UNKNOWN_RESERVED_MIME_TYPE's text has been used
        if (authTypeString === WellKnownAuthType.UNKNOWN_RESERVED_AUTH_TYPE.string) {
            return WellKnownAuthType.UNPARSEABLE_AUTH_TYPE;
        }
        return (WellKnownAuthType.TYPES_BY_AUTH_STRING.get(authTypeString) ||
            WellKnownAuthType.UNPARSEABLE_AUTH_TYPE);
    };
    /** @see #string() */
    WellKnownAuthType.prototype.toString = function () {
        return this.string;
    };
    return WellKnownAuthType;
}());
export { WellKnownAuthType };
(function (WellKnownAuthType) {
    var e_1, _a;
    WellKnownAuthType.UNPARSEABLE_AUTH_TYPE = new WellKnownAuthType("UNPARSEABLE_AUTH_TYPE_DO_NOT_USE", -2);
    WellKnownAuthType.UNKNOWN_RESERVED_AUTH_TYPE = new WellKnownAuthType("UNKNOWN_YET_RESERVED_DO_NOT_USE", -1);
    WellKnownAuthType.SIMPLE = new WellKnownAuthType("simple", 0x00);
    WellKnownAuthType.BEARER = new WellKnownAuthType("bearer", 0x01);
    WellKnownAuthType.TYPES_BY_AUTH_ID = new Array(128);
    WellKnownAuthType.TYPES_BY_AUTH_STRING = new Map();
    var ALL_MIME_TYPES = [
        WellKnownAuthType.UNPARSEABLE_AUTH_TYPE,
        WellKnownAuthType.UNKNOWN_RESERVED_AUTH_TYPE,
        WellKnownAuthType.SIMPLE,
        WellKnownAuthType.BEARER,
    ];
    WellKnownAuthType.TYPES_BY_AUTH_ID.fill(WellKnownAuthType.UNKNOWN_RESERVED_AUTH_TYPE);
    try {
        for (var ALL_MIME_TYPES_1 = __values(ALL_MIME_TYPES), ALL_MIME_TYPES_1_1 = ALL_MIME_TYPES_1.next(); !ALL_MIME_TYPES_1_1.done; ALL_MIME_TYPES_1_1 = ALL_MIME_TYPES_1.next()) {
            var value = ALL_MIME_TYPES_1_1.value;
            if (value.identifier >= 0) {
                WellKnownAuthType.TYPES_BY_AUTH_ID[value.identifier] = value;
                WellKnownAuthType.TYPES_BY_AUTH_STRING.set(value.string, value);
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
        Object.seal(WellKnownAuthType.TYPES_BY_AUTH_ID);
    }
})(WellKnownAuthType || (WellKnownAuthType = {}));
//# sourceMappingURL=WellKnownAuthType.js.map