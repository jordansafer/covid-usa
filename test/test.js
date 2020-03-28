var assert = require('assert')

var lib = require('../index.js')

let state_dict = lib.state

let date = "2020-03-14"
let state = "Massachusetts"

console.log(state_dict[date][state])

let county_dict = lib.county

let county = "Middlesex"
console.log(state_dict[date][state][county])
console.log(county_dict[date][county])

// assert.equals(a,b)