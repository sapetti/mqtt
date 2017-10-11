const board = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const boards = (state = [], action) => {
  switch (action.type) {
    case 'test':
      return board(state, action)
    default:
      return state
  }
}

export default boards
