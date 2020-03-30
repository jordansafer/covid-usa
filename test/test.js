var assert = require("assert")

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
})
