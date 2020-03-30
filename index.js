const fs = require("fs")
const parse = require("csv-parse/lib/sync")
const download = require("download-git-repo")
const _ = require("lodash")

const resourceDir = `${__dirname}/resources`

function getStateData () {
    // date,state,fips,cases,deaths
    const stateCsv = fs.readFileSync(`${resourceDir}/us-states.csv`, "utf8")

    const stateData = parse(stateCsv)
    stateData.shift()

    const byDate = _.groupBy(stateData, row => row[0])
    const stateInfoByDate = _.mapValues(byDate, dayData => {
        const byState = _.keyBy(dayData, row => row[1])
        const stateInfo = _.mapValues(byState, row => {
            return {
                fips: row[2],
                cases: row[3],
                deaths: row[4]
            }
        })
        return stateInfo
    })
    return stateInfoByDate
}

function addCountyData (stateInfoByDate) {
    const countyCsv = fs.readFileSync(`${resourceDir}/us-counties.csv`, "utf8")
    const countyData = parse(countyCsv)
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
    const countyCsv = fs.readFileSync(`${resourceDir}/us-counties.csv`, "utf8")
    const countyData = parse(countyCsv)
    // remove headers: date,county,state,fips,cases,deaths
    countyData.shift()

    const byDate = _.groupBy(countyData, row => row[0])
    const countyInfoByDate = _.mapValues(byDate, dayData => {
        const byCounty = _.keyBy(dayData, row => row[1])
        const countyInfo = _.mapValues(byCounty, row => {
            return {
                state: row[2],
                fips: row[3],
                cases: row[4],
                deaths: row[5]
            }
        })
        return countyInfo
    })
    return countyInfoByDate
}

function errorFn (err) {
    if (err) console.log(err)
}

function stateDataCached () {
    const stateData = getStateData()
    addCountyData(stateData)
    return stateData
}

function countyDataCached () {
    return getCountyData()
}

module.exports = {
    // Dictionary with all state date
    stateDataCached: stateDataCached,

    // Dictionary with all county data
    countyDataCached: countyDataCached,

    // Get latest state date
    stateData: function () {
        download("nytimes/covid-19-data", resourceDir, errorFn)
        return stateDataCached()
    },

    // Get latest county data
    countyData: function () {
        download("nytimes/covid-19-data", resourceDir, errorFn)
        return countyDataCached()
    }
}
