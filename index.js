const fs = require("fs")
const parse = require("csv-parse/lib/sync")
// const download = require("download-git-repo")
const _ = require("lodash")

const resourceDir = `${__dirname}/resources`

// date,state,fips,cases,deaths
const stateCsv = fs.readFileSync(`${resourceDir}/us-states.csv`, "utf8")

// date,county,state,fips,cases,deaths
const countyCsv = fs.readFileSync(`${resourceDir}/us-counties.csv`, "utf8")

function getStateData (csv) {
    const stateData = parse(csv)
    stateData.shift()

    const stateInfoByDate = {}

    _.forEach(stateData, row => {
        const date = row[0]
        const state = row[1]
        const stateInfo = {
            fips: row[2],
            cases: row[3],
            deaths: row[4]
        }

        const stateEntries = stateInfoByDate[date] || {}
        stateEntries[state] = stateInfo
        stateInfoByDate[date] = stateEntries
    })
}

function addCountyData (csv, stateInfoByDate) {
    const countyData = parse(csv)
    countyData.shift()

    _.forEach(countyData, row => {
        const date = row[0]
        const county = row[1]
        const state = row[2]
        const countyInfo = {
            fips: row[3],
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
    })
}

function getCountyData (csv) {
    const countyData = parse(csv)
    countyData.shift()

    const countyInfoByDate = {}

    _.forEach(countyData, row => {
        const date = row[0]
        const county = row[1]
        const state = row[2]
        const countyInfo = {
            fips: row[3],
            cases: row[4],
            deaths: row[5],
            state: state
        }

        // update county map
        const countyEntries = countyInfoByDate[date] || {}
        countyEntries[county] = countyInfo
        countyInfoByDate[date] = countyEntries
    })
}

module.exports = {
    // Dictionary with all state date
    stateData: function () {
        const stateData = getStateData(stateCsv)
        addCountyData(countyCsv, stateData)
        return stateData
    },

    // Dictionary with all county data
    countyData: function () {
        return getCountyData(countyCsv)
    }
}
