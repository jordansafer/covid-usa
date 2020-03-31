var assert = require("assert")
const _ = require("lodash")

describe("lib", function () {
    var lib = require("../index.js")
    const date = "2020-03-14"
    const state = "Massachusetts"
    const county = "Middlesex"
    describe("#stateData()", function () {
        const stateDict = lib.stateData()
        it("should have state cases", function () {
            assert(stateDict[date][state].cases > 0)
        })

        it("should have county cases", function () {
            assert(stateDict[date][state][county].cases > 0)
        })
    })

    describe("#countyData()", function () {
        const countyDict = lib.countyData()
        it("should have county cases", function () {
            assert(countyDict[date][county].cases > 0)
        })
    })

    describe("#allStates()", function () {
        const states = lib.allStates()
        it("should have Massachusetts", function () {
            assert(_.find(states, s => s === state))
        })
        it("should have at least 50 (with territories)", function () {
            assert(states.length >= 50)
        })
    })

    describe("#allCounties(state)", function () {
        const counties = lib.allCounties(state)
        it("should have Middlesex", function () {
            assert(_.find(counties, c => c === county))
        })
        it("should have at least 5", function () {
            assert(counties.length >= 5)
        })
    })
})
