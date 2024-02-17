const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB ERROR :${e.message} `)
    process.exit(1)
  }
}
initializeDbAndServer()

app.get('/players/', async (request, response) => {
  const getplayersQuery = `
  SELECT *
  FROM cricket_team;`
  const playerList = await db.get(getplayersQuery)
  const ans = playerList => {
    return {
      player_id: playerList.player_id,
      playerName: playerList.playerName,
      jerseyNumber: playerList.jerseyNumber,
      role: playerList.role,
    }
  }
  response.send(playerList.map(each => ans(each)))
})

//ADD PLAYER
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  addPlayerQuery = `
  INSERT INTO 
    cricket_team(playerName,jerseyNumber,role)
  VALUES (
    '${playerName}',${jerseyNumber},'${role}'
  );`
  const dbResponse = await db.run(addPlayerQuery)
  const player_id = dbResponse.lastID
  response.send('Player Added to Team')
})

//API 3

app.get('/players/:playerId/', async (request, response) => {
  const player_id = request.params
  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id= ${player_id}`
  const player = db.get(getPlayerQuery)
  response.send(player)
})

//API4

app.put('/players/:playerId/', async (request, response) => {
  const {player_id} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const updatePlayerQuery = `
  UPDATE cricket_team
  SET 
    playername = '${playerName}'
    jerseyNumber = ${jerseyNumber}
    role= '${role}' 
  WHERE player_id = ${player_id};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Up')
})

app.delete('/players/:playerId/', async (request, reponse) => {
  const {player_id} = request.params
  const deletePlayerQuery = `
  DELETE FROM cricket_team
  WHERE player_id= ${player_id};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
https://github.com/Saicharantenukuntla/cricketTeam.git: