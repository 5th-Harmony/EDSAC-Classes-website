// @ts-nocheck
import { types } from 'mediasoup';
import { mediasoupManager } from './mediasoup';
import { config } from '../config/mediasoup';

export interface Peer {
  id: string;
  userId: number;
  userName: string;
  role: 'host' | 'participant';
  transports: Map<string, types.WebRtcTransport>;
  producers: Map<string, types.Producer>;
  consumers: Map<string, types.Consumer>;
}

export class Room {
  public id: string;
  public router: types.Router;
  public peers: Map<string, Peer> = new Map();
  public isActive: boolean = false;

  constructor(roomId: string, router: types.Router) {
    this.id = roomId;
    this.router = router;
  }

  addPeer(peerId: string, userId: number, userName: string, role: 'host' | 'participant'): Peer {
    const peer: Peer = {
      id: peerId,
      userId,
      userName,
      role,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    };

    this.peers.set(peerId, peer);
    return peer;
  }

  removePeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      // Close all transports
      peer.transports.forEach(transport => transport.close());
      
      // Close all producers
      peer.producers.forEach(producer => producer.close());
      
      // Close all consumers
      peer.consumers.forEach(consumer => consumer.close());
      
      this.peers.delete(peerId);
    }
  }

  async createWebRtcTransport(peerId: string) {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const transport = await this.router.createWebRtcTransport({
      listenIps: config.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: config.webRtcTransport.initialAvailableOutgoingBitrate,
    });

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') {
        transport.close();
      }
    });

    peer.transports.set(transport.id, transport);
    return transport;
  }

  async createProducer(peerId: string, transportId: string, rtpParameters: any, kind: 'audio' | 'video') {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const transport = peer.transports.get(transportId);
    if (!transport) throw new Error('Transport not found');

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    peer.producers.set(producer.id, producer);

    // Create consumers for all other peers
    for (const [otherPeerId, otherPeer] of this.peers) {
      if (otherPeerId !== peerId) {
        await this.createConsumer(otherPeerId, producer.id);
      }
    }

    return producer;
  }

  async createConsumer(peerId: string, producerId: string) {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const producer = this.getProducerById(producerId);
    if (!producer) throw new Error('Producer not found');

    // Find a suitable transport for consuming
    const transport = Array.from(peer.transports.values())[0];
    if (!transport) throw new Error('No transport available');

    if (!this.router.canConsume({ producerId, rtpCapabilities: transport.rtpCapabilities })) {
      throw new Error('Cannot consume');
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities: transport.rtpCapabilities,
      paused: true,
    });

    peer.consumers.set(consumer.id, consumer);
    return consumer;
  }

  private getProducerById(producerId: string): types.Producer | undefined {
    for (const peer of this.peers.values()) {
      const producer = peer.producers.get(producerId);
      if (producer) return producer;
    }
    return undefined;
  }

  getPeerList() {
    return Array.from(this.peers.values()).map(peer => ({
      id: peer.id,
      userId: peer.userId,
      userName: peer.userName,
      role: peer.role,
    }));
  }

  close() {
    this.peers.forEach(peer => {
      peer.transports.forEach(transport => transport.close());
    });
    this.router.close();
  }
}
