# 💬 Chat Colaborativo en Tiempo Real con WebSocket

## 📋 Descripción del Proyecto

Sistema de Chat Colaborativo que permite a múltiples usuarios comunicarse en tiempo real mediante WebSocket. Fue desarrollado como parte de un proyecto educativo para comprender la comunicación bidireccional persistente entre cliente y servidor.

**Características principales:**
- ✅ Comunicación en tiempo real con WebSocket
- ✅ Múltiples usuarios conectados simultáneamente
- ✅ Asignación automática de nombres de usuario (Usuario_XXX)
- ✅ Notificaciones de conexión/desconexión de usuarios
- ✅ Historial visible de mensajes
- ✅ Interfaz moderna y responsiva
- ✅ Indicador de estado de conexión
- ✅ Contador de usuarios en línea

---

## 🛠️ Requisitos Técnicos

### Software requerido:
- **Node.js** v14 o superior (descargar desde [nodejs.org](https://nodejs.org))
- **npm** (incluido con Node.js)
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)

---

## 📦 Instalación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ChatColaborativo.git
cd ChatColaborativo
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Este comando descargará e instalará:
- **express**: Framework web para Node.js
- **ws**: Librería WebSocket para Node.js

---

## 🚀 Ejecutar el Servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

Verás un mensaje en la terminal:
```
╔════════════════════════════════════════════════════════╗
║   🚀 SERVIDOR DE CHAT COLABORATIVO INICIADO            ║
║   🌐 Escuchando en: http://localhost:3000              ║
║   📡 WebSocket habilitado                              ║
║   ✅ Listo para aceptar conexiones                     ║
╚════════════════════════════════════════════════════════╝
```

---

## 🌐 Usar el Chat

1. Abre tu navegador web
2. Accede a `http://localhost:3000`
3. Se te asignará un nombre de usuario automático (ej: "Usuario_1234")
4. Abre varias ventanas o pestañas para simular múltiples usuarios
5. ¡Comienza a enviar mensajes! 💬

---

## 📁 Estructura del Proyecto

```
ChatColaborativo/
├── server.js                 # Servidor WebSocket principal
├── package.json              # Dependencias del proyecto
├── README.md                 # Este archivo
├── .gitignore               # Archivos ignorados por Git
└── public/
    ├── index.html           # Interfaz HTML del cliente
    ├── style.css            # Estilos CSS
    └── client.js            # Lógica del cliente WebSocket
```

---

## 📝 Especificaciones Técnicas

### Arquitectura:
- **Backend**: Node.js + Express + WebSocket (ws)
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Protocolo**: WebSocket (RFC 6455)
- **Formato de datos**: JSON

### Puerto:
- Por defecto: **3000** (modificable con variable de entorno `PORT`)

### Comunicación WebSocket:

#### Mensajes del Cliente → Servidor:
```json
{
  "content": "Hola a todos!"
}
```

#### Mensajes del Servidor → Cliente:

**Mensaje de Chat:**
```json
{
  "type": "chat",
  "user": "Usuario_1234",
  "content": "Hola a todos!",
  "timestamp": "10:30:45"
}
```

**Mensaje del Sistema:**
```json
{
  "type": "system",
  "message": "Usuario_1234 se ha unido al chat.",
  "timestamp": "10:30:45",
  "usersOnline": 5
}
```

---

## 🎨 Características de la Interfaz

### Header
- Título del chat
- Indicador de estado de conexión (con color: 🟢 Conectado, 🔴 Desconectado)
- Contador de usuarios en línea

### Área de Mensajes
- Historial scrolleable de mensajes
- Diferenciación visual entre mensajes propios (verde) y de otros usuarios (azul)
- Avatares con iniciales del usuario
- Timestamps de cada mensaje
- Mensajes del sistema en gris

### Footer
- Campo de entrada de texto
- Botón de envío
- Información del usuario actual

---

## 🔧 Configuración

### Cambiar el Puerto

Edita en `server.js`:
```javascript
const PORT = process.env.PORT || 3000;  // Cambiar 3000 por otro puerto
```

O desde la terminal:
```bash
PORT=8000 npm start
```

### Configuración HTTPS/WSS

Para producción, se recomienda usar HTTPS y WSS. Modifica `server.js`:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

const server = https.createServer(options, app);
```

---

## 🐛 Solución de Problemas

### Problema: "No se puede conectar al servidor"
**Solución:** Verifica que el servidor esté ejecutándose con `npm start`

### Problema: "Puerto 3000 ya está en uso"
**Solución:** Usa otro puerto con `PORT=8000 npm start`

### Problema: "WebSocket no se conecta"
**Solución:** Verifica la consola del navegador (F12) para mensajes de error

### Problema: "Módulos faltantes"
**Solución:** Ejecuta `npm install` nuevamente

---

## 📊 Registro del Servidor

El servidor muestra en la terminal:
- ✓ Nuevas conexiones de clientes
- 💬 Mensajes recibidos
- ✗ Desconexiones
- 📊 Total de usuarios conectados
- ❌ Errores de procesamiento

---

## 🚀 Despliegue en Producción

### Opciones recomendadas:

1. **Heroku** (gratuito con limitaciones)
```bash
heroku create tu-app-name
git push heroku main
```

2. **Railway** (gratis con créditos)
```bash
railway link
railway up
```

3. **Replit** (gratis)
- Sube el código a Replit
- Haz clic en "Run"

4. **AWS/Google Cloud/Azure** (pago)
- Usar servicios de contenedores (Docker)
- Documentación disponible en cada plataforma

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Eres libre de usarlo, modificarlo y distribuirlo.

---

## 👥 Autores

- Desarrollado como proyecto educativo
- Versión 1.0 - Junio 2026

---

## 📚 Recursos Útiles

- [WebSocket MDN](https://developer.mozilla.org/es/docs/Web/API/WebSocket)
- [Express.js](https://expressjs.com/es/)
- [ws - WebSocket Library](https://github.com/websockets/ws)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 💡 Ideas de Mejora

- [ ] Autenticación de usuarios
- [ ] Salas de chat privadas
- [ ] Historial persistente en base de datos
- [ ] Emojis y reacciones
- [ ] Búsqueda de mensajes
- [ ] Notificaciones de "escribiendo..."
- [ ] Upload de archivos
- [ ] Temas oscuro/claro
- [ ] Integración con redes sociales (Google, Facebook)

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas, puedes:
1. Revisar los logs del servidor (terminal)
2. Abrir la consola del navegador (F12)
3. Crear un issue en el repositorio de GitHub

---

**¡Gracias por usar Chat Colaborativo! 🎉**
