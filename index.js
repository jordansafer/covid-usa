const fs = require("fs")
const parse = require("csv-parse/lib/sync")
const _ = require("lodash")

// date,state,fips,cases,deaths
const stateCsv = fs.readFileSync("resources/us-states.csv", "utf8")

// date,county,state,fips,cases,deaths
const countyCsv = fs.readFileSync("resources/us-counties.csv", "utf8")

// parse state data
const stateData = parse(stateCsv)
stateData.shift()

const stateInfoByDate = {}

_.forEach(stateData, row => {
    const date = row[0]
    const state = row[1]
    const stateInfo = {
        cases: row[3],
        deaths: row[4]
    }

    const stateEntries = stateInfoByDate[date] || {}
    stateEntries[state] = stateInfo
    stateInfoByDate[date] = stateEntries
})

// parse county data
const countyData = parse(countyCsv)
countyData.shift()

const countyInfoByDate = {}

_.forEach(countyData, row => {
    const date = row[0]
    const county = row[1]
    const state = row[2]
    const countyInfo = {
        cases: row[4],
        deaths: row[5],
        state: state
    }

    // Update state map with county field
    const stateEntries = stateInfoByDate[date] || {}
    const stateInfo = stateEntries[state] || {}
    stateInfo[county] = countyInfo
    stateEntries[state] = stateInfo
    stateInfoByDate[date] = stateEntries

    // update county map
    const countyEntries = countyInfoByDate[date] || {}
    countyEntries[state] = countyInfo
    countyInfoByDate[date] = countyEntries
})

module.exports = {
    // Dictionary with all state date
    state: stateInfoByDate,

    // Dictionary with all county data
    county: countyInfoByDate
}
