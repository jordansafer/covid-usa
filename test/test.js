var assert = require("assert")
const _ = require("lodash")

describe("lib", function () {
    this.timeout(60000)
    var lib = require("../index.js")
    const date = "2020-03-14"
    const state = "Massachusetts"
    const county = "Middlesex"
    describe("#stateData()", function () {
        it("should have state and county cases", function (done) {
            lib.stateData(stateDict => {
                assert(stateDict[date][state].cases > 0)
                assert(stateDict[date][state][county].cases > 0)
                done()
            })
        })
    })

    describe("#countyData()", function () {
        it("should have county cases", function (done) {
            lib.countyData(countyDict => {
                assert(countyDict[date][county].cases > 0)
                done()
            })
        })
    })

    describe("#allStates()", function () {
        it("should have specific & enough states", function (done) {
            lib.allStates(states => {
                assert(_.find(states, s => s === state))
                assert(states.length >= 50)
                done()
            })
        })
    })

    describe("#countiesByState()", function () {
        it("MA should have Middlesex and at least 5 counties", function (done) {
            lib.countiesByState(countiesByState => {
                const counties = countiesByState[state]
                assert(_.find(counties, c => c === county))
                assert(counties.length >= 10)
                done()
            })
        })
    })

    describe("#allCounties(state)", function () {
        it("should have Middlesex and at least 5 counties", function (done) {
            lib.allCounties(state, counties => {
                assert(_.find(counties, c => c === county))
                assert(counties.length >= 10)
                done()
            })
        })
    })
})
