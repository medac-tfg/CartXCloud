# 🌐 CartXCloud - Sistema Backend

**Backend principal del ecosistema CartX para gestión de retail con tecnología RFID**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

---

## 📋 Descripción

CartXCloud es el backend Node.js que potencia todo el ecosistema CartX. Proporciona una plataforma de gestión de retail en tiempo real con capacidades de escaneo RFID, gestión de carritos de compra, control de inventario y administración multi-tenant.

## 🏗️ Arquitectura

El sistema está construido alrededor de cuatro áreas funcionales principales:

- **🛒 Cart Operations** (`cartRoutes`) - Gestión de carritos y órdenes
- **📦 Inventory Management** (`stockerRoutes`) - Control de inventario y productos
- **⚙️ Administrative Control** (`panelRoutes`) - Panel de administración web
- **🔐 Security Management** (`securityRoutes`) - Gestión de seguridad y autenticación

## 🚀 Características Principales

### Multi-Tenant
- Soporte para múltiples tiendas en una sola instalación
- Configuraciones específicas por tienda
- Límites administrativos por tenant

### Tiempo Real
- Actualizaciones en vivo vía Socket.IO
- Sincronización de carritos entre dispositivos
- Notificaciones administrativas instantáneas

### Integración RFID
- Identificación rápida de productos mediante etiquetas RFID
- Modelo de asociación `ScannedProduct` para tracking
- Auditoría completa de movimientos de inventario

### Cálculos Financieros Precisos
- Librería `big.js` para aritmética decimal exacta
- Prevención de errores de punto flotante
- Generación precisa de facturas y totales

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js con TypeScript
- **Framework:** Fastify para alto rendimiento HTTP
- **Base de Datos:** MongoDB con Mongoose ODM
- **Tiempo Real:** Socket.IO para comunicación bidireccional
- **Templating:** Eta engine para renderizado server-side
- **Módulos:** ES Modules para JavaScript moderno

## ⚙️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-org/CartXCloud.git
cd CartXCloud

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

## 🔧 Configuración

El sistema utiliza variables de entorno para configuración:

- `MONGODB_URI` - Conexión a base de datos MongoDB
- `PORT` - Puerto del servidor (por defecto 3000)
- `NODE_ENV` - Entorno de ejecución

---

**Parte del ecosistema CartX - TFG DAM 2023-2025**