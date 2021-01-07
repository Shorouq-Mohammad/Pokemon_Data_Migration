CREATE TABLE pokemon_type(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(30)
);

CREATE TABLE town (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    town VARCHAR(50)
)

CREATE TABLE pokemon (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30),
    type_id INT,
    height INT,
    weight INT,
    FOREIGN KEY(type_id) REFERENCES pokemon_type(id)
);

CREATE TABLE trainer (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    town_id INT,
    FOREIGN KEY (town_id) REFERENCES town (id)
)


CREATE TABLE pokemon_trainer (
    pokemon_id INT,
    trainer_id INT,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (trainer_id) REFERENCES trainer(id)
)

-- USE pokemon;

-- ALTER TABLE pokemon_type
-- DROP COLUMN type;

-- ALTER TABLE town
-- DROP COLUMN town;

-- ALTER TABLE pokemon_type
-- ADD type varchar(30) UNIQUE;
-- ALTER TABLE town
-- ADD town varchar(50) UNIQUE;

-- -- USE pokemon;
-- ALTER TABLE trainer
-- ADD UNIQUE (name, town_id);