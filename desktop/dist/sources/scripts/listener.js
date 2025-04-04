"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
class Listener {
    constructor(pilot) {
        this.server = dgram_1.default.createSocket('udp4');
        this.server.on('message', (msg, rinfo) => {
            pilot.mixer.run(`${msg}`);
        });
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`Server listening for UDP:\n ${address.address}:${address.port}`);
        });
        this.server.on('error', (err) => {
            console.log(`Server error:\n ${err.stack}`);
            this.server.close();
        });
        this.server.bind(49161); // TODO - make this configurable
    }
}
exports.default = Listener;
