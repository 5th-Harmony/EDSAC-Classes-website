import { Room } from './Room';
import { mediasoupManager } from './mediasoup';

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  async createRoom(roomId: string): Promise<Room> {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!;
    }

    const router = await mediasoupManager.createRouter(roomId);
    const room = new Room(roomId, router);
    this.rooms.set(roomId, room);
    
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.close();
      this.rooms.delete(roomId);
      mediasoupManager.deleteRouter(roomId);
    }
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export const roomManager = new RoomManager();
