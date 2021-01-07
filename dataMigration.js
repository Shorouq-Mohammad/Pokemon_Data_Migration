const Sequelize = require('sequelize')
const poke_data = require('./poke_data.json')

const sequelize = new Sequelize('mysql://root:@localhost/pokemon')
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })
    
//Exercise 1 : loading data to database
const insertTrainer = async function(pokemon_id, trainer){
    const {name, town} = trainer
    let town_id
    let trainer_id
    try { //if it is duplicate it will throw an error because of unique constraint
        town_id = (await sequelize.query(`INSERT INTO town VALUES (NULL, "${town}")`))[0]
    } catch (error) {
        town_id = (await sequelize.query(`SELECT id FROM town WHERE town = "${town}"`))[0][0].id
    }
    try {
        trainer_id = (await sequelize.query(`INSERT INTO trainer VALUES (NULL, "${name}", ${town_id})`))[0]
    } catch (error) {
        trainer_id = (await sequelize.query(`SELECT id FROM trainer WHERE name = "${name}" AND town_id = ${town_id}`))[0][0].id
    }
    await sequelize.query(`INSERT INTO pokemon_trainer VALUES (${pokemon_id}, ${trainer_id})`)    
}

const insertPokemon = async function(pokemon){ 
    const {id, name, type, height, weight, ownedBy} = pokemon
    let type_id
    try {
        type_id = (await sequelize.query(`INSERT INTO pokemon_type VALUES (NULL, "${type}")`))[0]
    } catch (error) {
        type_id = (await sequelize.query(`SELECT id FROM pokemon_type WHERE type="${type}"`))[0][0].id
    }
    await sequelize.query(`INSERT INTO pokemon VALUES (${id}, "${name}", ${type_id}, ${height}, ${weight})`)
    await ownedBy.forEach(async t => await insertTrainer(id, t))
}

const loadData = async function(){
    try {
        await poke_data.forEach(async p => await insertPokemon(p))
    } catch (error) {
        console.log(error);
    }
}
// loadData()

//exercise 2
const heaviestPokemon = async function (){
    const pokemon = (await sequelize.query(`SELECT * FROM pokemon WHERE weight = (SELECT MAX(weight) FROM pokemon);`))[0][0]
    return pokemon
}
// heaviestPokemon()

//exercise 3
const findByType = async function(type){
    const pokemonNames = (await sequelize.query(`SELECT name 
                                FROM pokemon AS p, pokemon_type AS pt
                                WHERE p.type_id = pt.id AND pt.type = "${type}";`))[0]
    return pokemonNames.map(p => p.name)
}
// findByType("grass")

//exercise 4
const findOwners = async function(pokemonName){
    const owners = (await sequelize.query(`SELECT t.name
                                FROM pokemon AS p, trainer AS t, pokemon_trainer as pt
                                WHERE p.id = pt.pokemon_id 
                                AND t.id = pt.trainer_id 
                                AND p.name = "${pokemonName}";`))[0]
    return owners.map(o => o.name)
}
// findOwners("gengar")

//exercise 5
const findRoster = async function(trainerName){
    const pokemons = (await sequelize.query(`SELECT p.name
                                FROM pokemon AS p, trainer AS t, pokemon_trainer as pt
                                WHERE p.id = pt.pokemon_id 
                                AND t.id = pt.trainer_id 
                                AND t.name = "${trainerName}";`))[0]
    return pokemons.map(p => p.name)
}
// findRoster("Loga")

//exercise 6
const mostOwned = async function(){
    const query = `SELECT name, COUNT(*) AS total
                    FROM pokemon_trainer AS pt, pokemon AS p
                    WHERE pt.pokemon_id = p.id
                    GROUP BY pokemon_id`;
    const pokemons = (await sequelize.query(`SELECT name, total
                FROM (${query}) AS result
                WHERE total = (SELECT MAX(total) FROM (${query}) AS result);`))[0]
    return pokemons.map(p => p.name)
}
// mostOwned()