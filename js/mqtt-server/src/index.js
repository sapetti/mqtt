import express from 'express'
import { init, retrieveBoards } from './mqtt_client'

const app = express()


app.use(express.static('../home-ui/build'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/boards', (req, res) => {
  res.jsonp(retrieveBoards())
})

app.get('/boards/:id', (req, res) => {
  res.jsonp(retrieveBoards(id))
})

app.listen(3000, () => {
  console.log('Home automation server listening on port 3000!')
  init()
})
