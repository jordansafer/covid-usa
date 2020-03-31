const fs = require("fs")
const parse = require("csv-parse/lib/sync")
const download = require("download-git-repo")
const _ = require("lodash")

const resourceDir = `${__dirname}/resources`
const stateFilePath = `${resourceDir}/us-states.csv`
const countyFilePath = `${resourceDir}/us-counties.csv`

function getStateData () {
    // date,state,fips,cases,deaths
    const stateCsv = fs.readFileSync(stateFilePath, "utf8")

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
    const countyCsv = fs.readFileSync(countyFilePath, "utf8")
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

function getCountyData () {
    const countyCsv = fs.readFileSync(countyFilePath, "utf8")
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

function allStates () {
    // date,state,fips,cases,deaths
    const stateCsv = fs.readFileSync(`${resourceDir}/us-states.csv`, "utf8")
    const stateData = parse(stateCsv)
    stateData.shift()

    const byState = _.groupBy(stateData, row => row[1])
    return Object.keys(byState)
}

function countiesByState () {
    const countyCsv = fs.readFileSync(`${resourceDir}/us-counties.csv`, "utf8")
    const countyData = parse(countyCsv)
    // remove headers: date,county,state,fips,cases,deaths
    countyData.shift()

    const byState = _.groupBy(countyData, row => row[2])
    return _.mapValues(byState, stateData => {
        const byCounty = _.groupBy(stateData, row => row[1])
        return Object.keys(byCounty)
    })
}

function allCounties (state) {
    const countyCsv = fs.readFileSync(`${resourceDir}/us-counties.csv`, "utf8")
    const countyData = parse(countyCsv)
    // remove headers: date,county,state,fips,cases,deaths
    countyData.shift()

    const byState = _.groupBy(countyData, row => row[2])
    const stateData = byState[state]
    const byCounty = _.groupBy(stateData, row => row[1])
    return Object.keys(byCounty)
}

function stateDataCached () {
    const stateData = getStateData()
    addCountyData(stateData)
    return stateData
}

function countyDataCached () {
    return getCountyData()
}

function downloadNYT (callback) {
    const getFileUpdatedDate = (filePath) => {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath)
            return stats.mtime
        }
        return 0
    }
    const refreshDelta = 24 * 60 * 60 * 1000
    const currentTime = Date.now()
    const stateUpdateTime = getFileUpdatedDate(stateFilePath)
    const countyUpdateTime = getFileUpdatedDate(countyFilePath)
    const olderTime = Math.min(stateUpdateTime, countyUpdateTime)

    if (currentTime - olderTime < refreshDelta) {
        callback()
        return
    }

    download("nytimes/covid-19-data", resourceDir, err => {
        if (err) {
            console.log(err)
        }
        callback()
    })
}

module.exports = {
    // Dictionary with all state date
    stateDataCached: stateDataCached,

    // Dictionary with all county data
    countyDataCached: countyDataCached,

    // Get latest state date
    stateData: function (callback) {
        downloadNYT(() => {
            callback(stateDataCached())
        })
    },

    // Get latest county data
    countyData: function (callback) {
        downloadNYT(() => {
            callback(countyDataCached())
        })
    },

    // list of state in dataset
    allStates: function (callback) {
        downloadNYT(() => {
            callback(allStates())
        })
    },

    countiesByState: function (callback) {
        downloadNYT(() => {
            callback(countiesByState())
        })
    },

    allCounties: function (state, callback) {
        downloadNYT(() => {
            callback(allCounties(state))
        })
    }
}
