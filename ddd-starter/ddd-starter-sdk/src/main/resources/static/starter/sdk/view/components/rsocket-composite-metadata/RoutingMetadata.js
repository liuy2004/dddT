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
var RoutingMetadata = /** @class */ (function () {
    function RoutingMetadata(buffer) {
        this._buffer = buffer;
    }
    RoutingMetadata.prototype.iterator = function () {
        return decodeRoutes(this._buffer);
    };
    RoutingMetadata.prototype[Symbol.iterator] = function () {
        return decodeRoutes(this._buffer);
    };
    return RoutingMetadata;
}());
export { RoutingMetadata };
/**
 * Encode given set of routes into {@link Buffer} following the <a href="https://github.com/rsocket/rsocket/blob/master/Extensions/Routing.md">Routing Metadata Layout</a>
 *
 * @param routes non-empty set of routes
 * @returns {Buffer} with encoded content
 */
export function encodeRoutes() {
    var routes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        routes[_i] = arguments[_i];
    }
    if (routes.length < 1) {
        throw new Error("routes should be non empty array");
    }
    return Buffer.concat(routes.map(function (route) { return encodeRoute(route); }));
}
export function encodeRoute(route) {
    var encodedRoute = Buffer.from(route, "utf8");
    if (encodedRoute.length > 255) {
        throw new Error("route length should fit into unsigned byte length but the given one is ".concat(encodedRoute.length));
    }
    var encodedLength = Buffer.allocUnsafe(1);
    encodedLength.writeUInt8(encodedRoute.length);
    return Buffer.concat([encodedLength, encodedRoute]);
}
export function decodeRoutes(routeMetadataBuffer) {
    var length, offset, routeLength, route;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                length = routeMetadataBuffer.byteLength;
                offset = 0;
                _a.label = 1;
            case 1:
                if (!(offset < length)) return [3 /*break*/, 3];
                routeLength = routeMetadataBuffer.readUInt8(offset++);
                if (offset + routeLength > length) {
                    throw new Error("Malformed RouteMetadata. Offset(".concat(offset, ") + RouteLength(").concat(routeLength, ") is greater than TotalLength"));
                }
                route = routeMetadataBuffer.toString("utf8", offset, offset + routeLength);
                offset += routeLength;
                return [4 /*yield*/, route];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=RoutingMetadata.js.map