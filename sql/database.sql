-- Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS bike_store;
USE bike_store;

-- 1. Tabla CATEGORIA
CREATE TABLE CATEGORIA (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL
);

-- 2. Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(12,2) NOT NULL,
    stock INT NOT NULL,
    marca VARCHAR(50),
    imagen_url VARCHAR(255),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

-- 3. Tabla USUARIO
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    clave_hash VARCHAR(255) NOT NULL,
    forzar_cambio BOOLEAN DEFAULT FALSE
);

-- 4. Tabla TELEFONO_USUARIO (Para manejar múltiples teléfonos por usuario)
CREATE TABLE TELEFONO_USUARIO (
    id_telefono INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo VARCHAR(30),
    CONSTRAINT fk_telefono_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 5. Tabla ROL (Con permisos CRUD: c, r, u, d)
CREATE TABLE ROL (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_rol VARCHAR(30) NOT NULL,
    descripcion VARCHAR(50),
    c BOOLEAN DEFAULT FALSE,
    r BOOLEAN DEFAULT FALSE,
    u BOOLEAN DEFAULT FALSE,
    d BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_rol_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 6. Tabla PEDIDO (Incluye los campos de dirección de envío)
CREATE TABLE PEDIDO (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    numero VARCHAR(30) NOT NULL,
    fecha DATETIME NOT NULL,
    precio_total DECIMAL(12,2) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    barrio VARCHAR(30),
    comuna VARCHAR(30),
    ciudad VARCHAR(30),
    direccion VARCHAR(30),
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- 7. Tabla DETALLE_PEDIDO (Relación N:M entre Pedido y Producto)
CREATE TABLE DETALLE_PEDIDO (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
);

-- 8. Tabla PAGO (Relación 1:1 con Pedido gracias a UNIQUE en id_pedido)
CREATE TABLE PAGO (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL UNIQUE,
    metodo VARCHAR(30) NOT NULL,
    referencia VARCHAR(100),
    CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE
);