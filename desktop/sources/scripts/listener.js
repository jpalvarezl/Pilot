"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram_1 = require("dgram");
var Listener = /** @class */ (function () {
    function Listener(pilot) {
        var _this = this;
        this.server = dgram_1.default.createSocket('udp4');
        this.server.on('message', function (msg, rinfo) {
            pilot.mixer.run("".concat(msg));
        });
        this.server.on('listening', function () {
            var address = _this.server.address();
            console.log("Server listening for UDP:\n ".concat(address.address, ":").concat(address.port));
        });
        this.server.on('error', function (err) {
            console.log("Server error:\n ".concat(err.stack));
            _this.server.close();
        });
        this.server.bind(49161); // TODO - make this configurable
    }
    return Listener;
}());
exports.default = Listener;
