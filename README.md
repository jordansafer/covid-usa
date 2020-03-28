# covid-usa 
## Import the latest US Covid data in JS
### See NYT for data: https://github.com/nytimes/covid-19-data


## Usage:
### Add to package.json
`npm install covid-usa`

or

```
"dependencies": {
    "covid-usa": "1.0.1"
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


