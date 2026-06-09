-- =============================================================================
-- Migración 0003 — Imagen de producto
-- -----------------------------------------------------------------------------
-- APPEND-ONLY: no editar una vez publicada. Agrega la columna `image_filename`
-- a `product`. El archivo de imagen NO se guarda en la base: vive en la carpeta
-- de datos del usuario (userData/product-images/) y acá se guarda solo su nombre.
-- Se sirve al renderer con el protocolo interno app-image:// (ver src/main/main.js).
-- =============================================================================

ALTER TABLE product ADD COLUMN image_filename TEXT;
