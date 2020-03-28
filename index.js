var fs = require("fs")

var state_data = fs.readFileSync(`resources/us-states.csv`, 'utf8')
var county_data = fs.readFileSync(`resources/us-counties.csv`, 'utf8')

console.log(state_data)

module.exports = function (x) {
      return x
};

var myFn = function (x) {
        return x
};
