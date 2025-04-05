import * as dgram from 'dgram';

export default class Listener {
  private server: dgram.Socket;

  constructor(pilot: any) {
    this.server = dgram.createSocket('udp4');

    this.server.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo): void => {
      pilot.mixer.run(`${msg}`);
    });

    this.server.on('listening', (): void => {
      const address = this.server.address();
      console.log(`Server listening for UDP:\n ${address.address}:${address.port}`);
    });

    this.server.on('error', (err: Error): void => {
      console.log(`Server error:\n ${err.stack}`);
      this.server.close();
    });

    this.server.bind(49161); // TODO - make this configurable
  }
}
