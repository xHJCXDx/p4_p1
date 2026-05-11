-- Script para crear base de datos PostgreSQL desde database.db
-- Crear base de datos si no existe
DROP DATABASE IF EXISTS p4_p1;
CREATE DATABASE p4_p1;

-- Tabla: categoria
CREATE TABLE categoria (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR NOT NULL UNIQUE,
	descripcion VARCHAR NOT NULL,
	imagen_url VARCHAR,
	parent_id INTEGER REFERENCES categoria (id),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP
);
CREATE INDEX ix_categoria_nombre ON categoria (nombre);

-- Tabla: ingrediente
CREATE TABLE ingrediente (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR NOT NULL UNIQUE,
	descripcion VARCHAR,
	es_alergeno BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_ingrediente_nombre ON ingrediente (nombre);

-- Tabla: producto
CREATE TABLE producto (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR NOT NULL,
	descripcion VARCHAR NOT NULL,
	precio_base NUMERIC(10, 2) NOT NULL,
	imagenes_url JSONB NOT NULL,
	stock_cantidad INTEGER NOT NULL,
	disponible BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP
);
CREATE INDEX ix_producto_nombre ON producto (nombre);

-- Tabla: formapago
CREATE TABLE formapago (
	codigo VARCHAR(20) PRIMARY KEY,
	descripcion VARCHAR(80) NOT NULL,
	habilitado BOOLEAN NOT NULL
);

-- Tabla: estadopedido
CREATE TABLE estadopedido (
	codigo VARCHAR(20) PRIMARY KEY,
	descripcion VARCHAR(80) NOT NULL,
	orden INTEGER NOT NULL,
	es_terminal BOOLEAN NOT NULL
);

-- Tabla: productocategorialink
CREATE TABLE productocategorialink (
	producto_id INTEGER NOT NULL REFERENCES producto (id),
	categoria_id INTEGER NOT NULL REFERENCES categoria (id),
	es_principal BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (producto_id, categoria_id)
);

-- Tabla: productoingredientelink
CREATE TABLE productoingredientelink (
	producto_id INTEGER NOT NULL REFERENCES producto (id),
	ingrediente_id INTEGER NOT NULL REFERENCES ingrediente (id),
	es_removible BOOLEAN NOT NULL,
	PRIMARY KEY (producto_id, ingrediente_id)
);

-- Tabla: pedido
CREATE TABLE pedido (
	id SERIAL PRIMARY KEY,
	usuario_id INTEGER NOT NULL,
	direccion_id INTEGER,
	estado_codigo VARCHAR NOT NULL REFERENCES estadopedido (codigo),
	forma_pago_codigo VARCHAR NOT NULL REFERENCES formapago (codigo),
	notas VARCHAR,
	subtotal NUMERIC(10, 2) NOT NULL,
	descuento NUMERIC(10, 2) NOT NULL,
	costo_envio NUMERIC(10, 2) NOT NULL,
	total NUMERIC(10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP
);

-- Tabla: detallepedido
CREATE TABLE detallepedido (
	pedido_id INTEGER NOT NULL REFERENCES pedido (id),
	producto_id INTEGER NOT NULL REFERENCES producto (id),
	cantidad INTEGER NOT NULL,
	personalizacion JSONB NOT NULL,
	nombre_snapshot VARCHAR(200) NOT NULL,
	precio_snapshot NUMERIC(10, 2) NOT NULL,
	subtotal_snap NUMERIC(10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (pedido_id, producto_id)
);

-- Tabla: pago
CREATE TABLE pago (
	id SERIAL PRIMARY KEY,
	pedido_id INTEGER NOT NULL REFERENCES pedido (id),
	mp_payment_id INTEGER UNIQUE,
	mp_status VARCHAR(30) NOT NULL,
	mp_status_detail VARCHAR(100),
	transaction_amount NUMERIC(10, 2) NOT NULL,
	external_reference VARCHAR(100) NOT NULL UNIQUE,
	idempotency_key VARCHAR(100) NOT NULL UNIQUE,
	payment_method_id VARCHAR(50),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: historialestadopedido
CREATE TABLE historialestadopedido (
	id SERIAL PRIMARY KEY,
	pedido_id INTEGER NOT NULL REFERENCES pedido (id),
	estado_hacia VARCHAR(20) NOT NULL REFERENCES estadopedido (codigo),
	estado_desde VARCHAR(20) REFERENCES estadopedido (codigo),
	usuario_id INTEGER,
	motivo VARCHAR,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: participante
CREATE TABLE participante (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR NOT NULL,
	email VARCHAR NOT NULL UNIQUE,
	edad INTEGER NOT NULL,
	pais VARCHAR NOT NULL,
	modalidad VARCHAR NOT NULL,
	tecnologias JSONB NOT NULL,
	nivel VARCHAR NOT NULL,
	"aceptaTerminos" BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP
);
CREATE INDEX ix_participante_email ON participante (email);
CREATE INDEX ix_participante_nombre ON participante (nombre);

-- Datos de catálogos
INSERT INTO formapago (codigo, descripcion, habilitado) VALUES
	('EFECTIVO', 'Efectivo', TRUE),
	('TARJETA', 'Tarjeta de Crédito/Débito', TRUE),
	('TRANSFERENCIA', 'Transferencia Bancaria', TRUE)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO estadopedido (codigo, descripcion, orden, es_terminal) VALUES
	('PENDIENTE', 'Pedido Pendiente', 1, FALSE),
	('CONFIRMADO', 'Pedido Confirmado', 2, FALSE),
	('ENVIADO', 'Pedido Enviado', 3, FALSE),
	('ENTREGADO', 'Pedido Entregado', 4, TRUE),
	('CANCELADO', 'Pedido Cancelado', 5, TRUE)
ON CONFLICT (codigo) DO NOTHING;
