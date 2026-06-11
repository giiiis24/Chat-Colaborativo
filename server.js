const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Almacén de clientes conectados para gestionar sus metadatos
const clients = new Map();

/**
 * Evento: Nueva conexión WebSocket
 * Se ejecuta cuando un cliente se conecta al servidor
 */
wss.on('connection', (ws) => {
    // 1. Asignar nombre de usuario automático (Usuario_123)
    const userId = Math.floor(Math.random() * 10000);
    const username = `Usuario_${userId}`;
    
    clients.set(ws, { 
        username,
        connectedAt: new Date()
    });
    
    console.log(`[✓ CONEXIÓN] Nuevo cliente conectado: ${username}`);
    console.log(`[📊 ESTADO] Total de usuarios conectados: ${clients.size}`);

    // 2. Notificar a todos los clientes que un usuario se unió
    broadcast({
        type: 'system',
        message: `${username} se ha unido al chat.`,
        timestamp: new Date().toLocaleTimeString(),
        usersOnline: clients.size
    });

    /**
     * Evento: Mensaje recibido del cliente
     * Se ejecuta cuando el cliente envía un mensaje
     */
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            console.log(`[💬 MENSAJE] ${username}: ${data.content}`);
            
            // Validar que el contenido no esté vacío
            if (data.content && data.content.trim() !== '') {
                broadcast({
                    type: 'chat',
                    user: username,
                    content: data.content,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        } catch (e) {
            console.error("❌ Error al procesar mensaje:", e.message);
        }
    });

    /**
     * Evento: Error en la conexión
     */
    ws.on('error', (error) => {
        console.error(`❌ Error en conexión de ${username}:`, error.message);
    });

    /**
     * Evento: Desconexión del cliente
     */
    ws.on('close', () => {
        clients.delete(ws);
        console.log(`[✗ DESCONEXIÓN] ${username} se ha desconectado.`);
        console.log(`[📊 ESTADO] Total de usuarios conectados: ${clients.size}`);
        
        // Notificar a todos los clientes restantes
        broadcast({
            type: 'system',
            message: `${username} se ha desconectado del chat.`,
            timestamp: new Date().toLocaleTimeString(),
            usersOnline: clients.size
        });
    });
});

/**
 * Función: Enviar mensaje a todos los clientes conectados
 * @param {Object} data - Datos del mensaje a enviar
 */
function broadcast(data) {
    const message = JSON.stringify(data);
    
    clients.forEach((client, ws) => {
        // Solo enviar si la conexión está abierta
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });
}

// Configurar el servidor para escuchar en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🚀 SERVIDOR DE CHAT COLABORATIVO INICIADO            ║');
    console.log(`║   🌐 Escuchando en: http://localhost:${PORT}              ║`);
    console.log('║   📡 WebSocket habilitado                              ║');
    console.log('║   ✅ Listo para aceptar conexiones                     ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\n');
});
