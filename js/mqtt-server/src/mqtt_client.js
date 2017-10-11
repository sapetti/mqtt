import { connect } from 'mqtt'
const client = connect('mqtt://192.168.0.18:1883')

const TEMPERATURE = '/temperature'
const IRRIGATION = '/irrigation'
const REGISTER = '/register'
const LIGHT = '/light'
const SERVICES = '/services'
const SERVICES_AVAILABLE = [SERVICES, TEMPERATURE, IRRIGATION, LIGHT]
const REFRESH = '/refresh'

let state = {}
let boards = {}

export const init = () => {

  console.log('Starting MQTT client')

  client.on('connect', () => {
    console.log('Connected!')
    client.subscribe(REGISTER)

    //request idle boards
    setTimeout(() => client.publish(REFRESH, JSON.stringify({})), 5000)

    // //------------------------------------------------------------------------->>
    // // Testing purpouses
    // client.publish('/server/connected', 'true')
    // client.publish(REGISTER, '/cocina/NodeMCU1')
    // client.publish(REGISTER, '/cocina/NodeMCU2')
    // setTimeout(() => client.publish('/cocina/NodeMCU1' + SERVICES + '/value', '{ "services": ["/temperature", "/irrigation"] }'), 5000)
    // setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.4'), 9100)
    // setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.5'), 9200)
    // setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.6'), 9300)
    // setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.7'), 9400)
    // setTimeout(() => client.publish('/cocina/NodeMCU2' + SERVICES + '/value', '{ "services": ["/irrigation"] }'), 6000)
    // setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.4'), 8100)
    // setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.5'), 8200)
    // setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.6'), 8300)
    // setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.7'), 8400)
    //   //------------------------------------------------------------------------->>
  })

  client.on('message', (topic, message) => {
    message = message.toString() || ''
    console.log('Message received', topic, message)

    //handle register topic
    if(topic === REGISTER) {
      console.log('Registering board', message)
      //add board to list
      boards = Object.assign({}, boards, { [message]: { services: [] } })
      //subscribe to receive the available services
      client.subscribe(message + SERVICES + '/value')
      console.log(boards)

      //request the available services
      setTimeout(() => {
        client.publish(message + SERVICES, JSON.stringify({}))
      }, 2000)

    //handle temperature topic
    } else if (topic.indexOf(TEMPERATURE) !== -1) {
      console.log('Adding temperature values', message)
      Object.keys(boards).filter((id) => topic === id + TEMPERATURE)
      .filter((id) => boards[id].services.indexOf(TEMPERATURE) !== -1)
      .map((id) => {
        let board = boards[id]
        console.log('123', board)
        board.temperature = (board.temperature || []).concat(message)
        boards = Object.assign({}, boards, board)
      })

    //handle services register topic
    } else if (topic.indexOf(SERVICES + '/value') !== -1) {
      console.log('Adding services')
      Object.keys(boards)
      .filter((id) => topic === id + SERVICES + '/value')
      .map((id) => {
          let board = boards[id]
          board.services = JSON.parse(message).services || []
          console.log('services',JSON.parse(message).services)
          boards = Object.assign({}, boards, { [id]: board })
      })
      console.log(boards)
    } else {
      console.log('No handler for topic %s', topic)
    }
    console.log('')
  })
}

export const retrieveBoards = (id = null) => {
  if(id) {
    return boards[id]
  } else {
    return boards
  }
}

// export const testConnection = (client) => {
//   //------------------------------------------------------------------------->>
//   // Testing purpouses
//   client.publish('/server/connected', 'true')
//   client.publish(REGISTER, '/cocina/NodeMCU1')
//   client.publish(REGISTER, '/cocina/NodeMCU2')
//   setTimeout(() => client.publish('/cocina/NodeMCU1' + SERVICES + '/value', '{ "services": ["/temperature", "/irrigation"] }'), 5000)
//   setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.4'), 9100)
//   setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.5'), 9200)
//   setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.6'), 9300)
//   setTimeout(() => client.publish('/cocina/NodeMCU1'+TEMPERATURE, '37.7'), 9400)
//   setTimeout(() => client.publish('/cocina/NodeMCU2' + SERVICES + '/value', '{ "services": ["/irrigation"] }'), 6000)
//   setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.4'), 8100)
//   setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.5'), 8200)
//   setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.6'), 8300)
//   setTimeout(() => client.publish('/cocina/NodeMCU2'+TEMPERATURE, '38.7'), 8400)
//   return true
//   //------------------------------------------------------------------------->>
// }

export default client
