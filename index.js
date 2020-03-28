let fs = require("fs")
let parse = require("csv-parse/lib/sync")
let _ = require("lodash")

// date,state,fips,cases,deaths
let state_csv = fs.readFileSync(`resources/us-states.csv`, 'utf8')

// date,county,state,fips,cases,deaths
let county_csv = fs.readFileSync(`resources/us-counties.csv`, 'utf8')


// parse state data
let state_data = parse(state_csv)
state_data.shift()

state_info_by_date = {}

_.forEach(state_data, row => {
    let date = row[0]
    let state = row[1]
    let state_info = {
        "cases": row[3],
        "deaths": row[4]
    }

    let state_entries = state_info_by_date[date] || {}
    state_entries[state] = state_info
    state_info_by_date[date] = state_entries
})

// parse county data
let county_data = parse(county_csv)
county_data.shift()

county_info_by_date = {}

_.forEach(county_data, row => {
    let date = row[0]
    let county = row[1]
    let state = row[2]
    let county_info = {
        "cases": row[4],
        "deaths": row[5],
        "state": state
    }

    // Update state map with county field
    let state_entries = state_info_by_date[date] || {}
    let state_info = state_entries[state] || {}
    state_info[county] = county_info
    state_entries[state] = state_info
    state_info_by_date[date] = state_entries

    // update county map
    let county_entries = county_info_by_date[date] || {}
    county_entries[state] = county_info
    county_info_by_date[date] = county_entries
})


module.exports = {
    // Dictionary with all state date
    state: state_info_by_date,

    // Dictionary with all county data
    county: county_info_by_date
};

var myFn = function (x) {
        return x
};
