/**
 * Cliente WebSocket para Chat Colaborativo
 * Maneja la conexión con el servidor y la interfaz del usuario
 */

class ChatClient {
    constructor() {
        // Elementos del DOM
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput');
        this.messageForm = document.getElementById('messageForm');
        this.sendBtn = document.getElementById('sendBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.usersCount = document.getElementById('usersCount');
        this.usernameBadge = document.getElementById('usernameBadge');

        // Estado del cliente
        this.ws = null;
        this.username = null;
        this.isConnected = false;

        // Inicializar
        this.init();
    }

    /**
     * Inicializar el cliente
     */
    init() {
        this.connect();
        this.setupEventListeners();
    }

    /**
     * Conectar al servidor WebSocket
     */
    connect() {
        // Determinar la URL del servidor
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}`;

        try {
            this.ws = new WebSocket(wsUrl);

            // Evento: Conexión abierta
            this.ws.onopen = () => {
                console.log('✓ Conectado al servidor WebSocket');
                this.isConnected = true;
                this.updateConnectionStatus(true);
                this.clearWelcomeMessage();
                this.messageInput.disabled = false;
                this.sendBtn.disabled = false;
            };

            // Evento: Mensaje recibido del servidor
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (e) {
                    console.error('Error al procesar mensaje:', e);
                }
            };

            // Evento: Error en la conexión
            this.ws.onerror = (error) => {
                console.error('❌ Error en WebSocket:', error);
                this.updateConnectionStatus(false);
            };

            // Evento: Conexión cerrada
            this.ws.onclose = () => {
                console.log('✗ Desconectado del servidor');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.messageInput.disabled = true;
                this.sendBtn.disabled = true;

                // Intentar reconectar cada 5 segundos
                console.log('Intentando reconectar en 5 segundos...');
                setTimeout(() => this.connect(), 5000);
            };
        } catch (e) {
            console.error('Error al conectar:', e);
            this.updateConnectionStatus(false);
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Enviar mensaje al hacer submit del formulario
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Enviar mensaje con Enter (Shift+Enter para nueva línea)
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    /**
     * Enviar mensaje al servidor
     */
    sendMessage() {
        const message = this.messageInput.value.trim();

        if (!message || !this.isConnected) {
            return;
        }

        try {
            // Enviar al servidor
            this.ws.send(JSON.stringify({
                content: message
            }));

            // Limpiar input
            this.messageInput.value = '';
            this.messageInput.focus();
        } catch (e) {
            console.error('Error al enviar mensaje:', e);
        }
    }

    /**
     * Manejar mensaje recibido del servidor
     * @param {Object} data - Datos del mensaje
     */
    handleMessage(data) {
        if (data.type === 'chat') {
            this.displayChatMessage(data);
        } else if (data.type === 'system') {
            this.displaySystemMessage(data);
        }

        // Actualizar contador de usuarios
        if (data.usersOnline) {
            this.usersCount.textContent = data.usersOnline;
        }
    }

    /**
     * Mostrar mensaje de chat
     * @param {Object} data - Datos del mensaje
     */
    displayChatMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';

        // Determinar si es mensaje propio
        const isOwnMessage = this.username && data.user === this.username;
        if (isOwnMessage) {
            messageDiv.classList.add('own');
        }

        // Obtener letra inicial del usuario para el avatar
        const avatarLetter = data.user.charAt(0).toUpperCase();

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatarLetter}</div>
            <div class="message-content">
                <div class="message-header">
                    <span>${data.user}</span>
                </div>
                <div class="message-text">${this.escapeHtml(data.content)}</div>
                <div class="message-timestamp">${data.timestamp}</div>
            </div>
        `;

        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Mostrar mensaje del sistema
     * @param {Object} data - Datos del mensaje
     */
    displaySystemMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `
            <strong>${data.message}</strong>
            <span style="font-size: 0.9em; margin-left: 8px;">📍 ${data.timestamp}</span>
        `;

        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Limpiar mensaje de bienvenida
     */
    clearWelcomeMessage() {
        const welcome = this.messagesArea.querySelector('.welcome-message');
        if (welcome) {
            welcome.remove();
        }
    }

    /**
     * Actualizar estado de conexión
     * @param {Boolean} connected - Si está conectado
     */
    updateConnectionStatus(connected) {
        if (connected) {
            this.statusIndicator.className = 'status-indicator connected';
            this.statusText.textContent = 'Conectado';
        } else {
            this.statusIndicator.className = 'status-indicator disconnected';
            this.statusText.textContent = 'Desconectado';
        }
    }

    /**
     * Desplazar hacia el final de los mensajes
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 0);
    }

    /**
     * Escapar caracteres HTML para evitar inyecciones
     * @param {String} text - Texto a escapar
     * @returns {String} - Texto escapado
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Establecer nombre de usuario (opcional, por si se envía desde el servidor)
     * @param {String} username - Nombre de usuario
     */
    setUsername(username) {
        this.username = username;
        this.usernameBadge.textContent = username;
    }
}

/**
 * Inicializar cliente cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatClient = new ChatClient();

    // Simular que el usuario recibe su nombre (en una implementación real,
    // el servidor enviaría el nombre asignado)
    // Por ahora, extraemos el nombre de los mensajes del sistema
    const originalHandleMessage = chatClient.handleMessage.bind(chatClient);
    chatClient.handleMessage = function(data) {
        if (data.type === 'system' && data.message.includes('se ha unido')) {
            // Intentar extraer el nombre del mensaje
            const match = data.message.match(/^(Usuario_\d+)/);
            if (match && !this.username) {
                this.setUsername(match[1]);
            }
        }
        originalHandleMessage(data);
    };
});
