![Build](https://github.com/jordansafer/covid-usa/workflows/Build/badge.svg)
[![NPM version](http://img.shields.io/npm/v/covid-usa.svg)](https://www.npmjs.com/package/covid-usa)
[![NPM Downloads](https://img.shields.io/npm/dt/covid-usa.svg)](https://www.npmjs.com/covid-usa)
# covid-usa 
## Import the latest US Covid data in JS
### See NYT for data: https://github.com/nytimes/covid-19-data


## Usage:
### Add to package.json
`npm install covid-usa`

or

```
"dependencies": {
    "covid-usa": "2.1.1"
}
```
### Access the data
```js
var covidData = require("covid-usa");

// latest state level by date
covidData.stateData(stateDate => {
    console.log(stateData["2020-03-20"]["California"].cases);
    console.log(stateData["2020-03-20"]["California"].deaths);
    console.log(stateData["2020-03-20"]["California"].fid);
    console.log(stateData["2020-03-20"]["Massachusetts"]["Middlesex"].cases);
});

// list of all states in dataset
covidData.allStates(states => {
    ...
});

// map of each state to list of counties in dataset
covidData.countiesByState(countiesByState => {
    console.log(countiesByState["California"])
});

// list of all counties in a state in the dataset
covidData.allCounties("California", counties => {
    ...
});

// county level data by date
covidData.countyData(countyData => {
    console.log(countyData["2020-03-10"]["Middlesex"].cases);
});

// cached APIs to avoid redownloading latest data from NYT
var cachedStateData = covidData.stateDataCached();
var cachedCountyData = covidData.countyDataCached();
```


