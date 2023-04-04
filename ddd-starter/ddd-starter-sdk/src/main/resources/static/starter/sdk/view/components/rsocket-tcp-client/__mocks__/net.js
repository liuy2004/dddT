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
import EventEmitter from '../../events/index.js';
import jest from '../../jest/index.js';
var MockSocket = /** @class */ (function (_super) {
    __extends(MockSocket, _super);
    function MockSocket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.end = jest.fn(function () {
            // 'end' is only emitted when a FIN packet is received
            _this.emit("close");
        });
        _this.write = jest.fn();
        _this.mock = {
            close: function () {
                _this.emit("close");
            },
            connect: function () {
                _this.emit("connect");
            },
            data: function (data) {
                _this.emit("data", data);
            },
            error: function (error) {
                _this.emit("error", error);
            },
        };
        return _this;
    }
    MockSocket.prototype.destroy = function () { };
    return MockSocket;
}(EventEmitter));
var net = {
    connect: function () {
        var socket = new MockSocket();
        net.socket = socket; // for easy accessibility in tests
        return socket;
    },
    socket: null,
};
export default net;
/*export default {
    MockSocket,
    net,
};*/
//# sourceMappingURL=net.js.map