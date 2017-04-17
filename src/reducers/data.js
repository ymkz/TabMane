import { createReducer } from 'redux-act'
import { sync } from '../actions/data'

const initialState = []

export default createReducer({
  [sync]: (state, payload) => [...payload]
}, initialState)
