import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
let io: Server;

export function initWebSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(String(token), JWT_SECRET) as { id: number; role: string };
      (socket as any).userId = payload.id;
      (socket as any).userRole = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as number;
    const role = (socket as any).userRole as string;

    // Join personal room
    socket.join(`user:${userId}`);

    // Admins join admin room
    if (role === 'admin') {
      socket.join('admins');
    }

    // Students join their section room (if applicable)
    if (role === 'student') {
      socket.join('students');
    }

    console.log(`[WS] User ${userId} connected (role: ${role})`);

    socket.on('disconnect', () => {
      console.log(`[WS] User ${userId} disconnected`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('WebSocket not initialized');
  return io;
}

// Emit notification to specific user
export function emitToUser(userId: number, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, data);
}

// Emit notification to all students
export function emitToStudents(event: string, data: any) {
  io?.to('students').emit(event, data);
}

// Emit notification to all admins
export function emitToAdmins(event: string, data: any) {
  io?.to('admins').emit(event, data);
}

// Broadcast to all connected clients
export function broadcast(event: string, data: any) {
  io?.emit(event, data);
}
