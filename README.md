# covid-usa A simple way to view and program with the latest US Covid data
### Courtesy of the NYT for collecting the data


## Usage:
### Add to package.json

```
"dependencies": {
    "covid-usa": "jordansafer/covid-usa"
}
```
### Access the data
```js
var covidData = require("covid-usa");

// state level by date
var stateData = covidData.state;
console.log(stateData["2020-03-20"]["California"].cases);
console.log(stateData["2020-03-20"]["California"].deaths);

// county level data by date
var countyData = covidData.county;
console.log(countyData["2020-03-10"]["Middlesex"].cases);
```


