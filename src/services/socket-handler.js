/**
 * Socket.IO Handler
 * Manages real-time connections and events
 */

/**
 * Setup Socket.IO event handlers
 * @param {Object} io - Socket.IO server instance
 */
export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Send welcome message
        socket.emit('log', {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: '🔌 Connected to IPTV Processor server'
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });

        // Handle ping for connection testing
        socket.on('ping', () => {
            socket.emit('pong');
        });
    });
}
