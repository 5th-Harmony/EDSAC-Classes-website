import { createWorker, types } from 'mediasoup';
import { config } from '../config/mediasoup';

class MediasoupManager {
  private workers: types.Worker[] = [];
  private routers: Map<string, types.Router> = new Map();
  private nextWorkerIdx = 0;

  async init() {
    const numWorkers = Object.keys(require('os').cpus()).length;
    
    for (let i = 0; i < numWorkers; i++) {
      const worker = await createWorker({
        logLevel: config.mediasoup.worker.logLevel,
        logTags: config.mediasoup.worker.logTags,
        rtcMinPort: config.mediasoup.worker.rtcMinPort,
        rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
      });

      worker.on('died', () => {
        console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
        setTimeout(() => process.exit(1), 2000);
      });

      this.workers.push(worker);
    }

    console.log(`Created ${numWorkers} mediasoup workers`);
  }

  getNextWorker(): types.Worker {
    const worker = this.workers[this.nextWorkerIdx];
    this.nextWorkerIdx = (this.nextWorkerIdx + 1) % this.workers.length;
    return worker;
  }

  async createRouter(roomId: string): Promise<types.Router> {
    const worker = this.getNextWorker();
    const router = await worker.createRouter({
      mediaCodecs: config.mediasoup.router.mediaCodecs,
    });

    this.routers.set(roomId, router);
    return router;
  }

  getRouter(roomId: string): types.Router | undefined {
    return this.routers.get(roomId);
  }

  deleteRouter(roomId: string) {
    const router = this.routers.get(roomId);
    if (router) {
      router.close();
      this.routers.delete(roomId);
    }
  }
}

export const mediasoupManager = new MediasoupManager();
