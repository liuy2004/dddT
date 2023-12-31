var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EventEmitter = require("events");
var MockSocket = /** @class */ (function (_super) {
    __extends(MockSocket, _super);
    function MockSocket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.send = jest.fn();
        _this.close = jest.fn();
        _this.addEventListener = function (name, handler) {
            _this.on(name, handler);
        };
        _this.removeEventListener = function (name, handler) {
            _this.on(name, handler);
        };
        _this.mock = {
            close: function (event) {
                _this.emit("close", event);
            },
            open: function () {
                _this.emit("connect");
            },
            message: function (message) {
                _this.emit("message", message);
            },
            error: function (event) {
                _this.emit("error", event);
            },
        };
        return _this;
    }
    return MockSocket;
}(EventEmitter));
export { MockSocket };
//# sourceMappingURL=ws.js.map