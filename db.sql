CREATE DATABASE multi_storey;
USE multi_storey;

CREATE TABLE station (
    station_id INT UNSIGNED NOT NULL,
    host VARCHAR(32),
    port INT UNSIGNED,
    is_it_connected TINYINT UNSIGNED
);

CREATE TABLE level (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    storey INT NOT NULL,
    lot_occupied INT NOT NULL,
    lot_total INT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT level_id_pk PRIMARY KEY(id)
);