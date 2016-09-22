var fs = require("fs");
const readline = require('readline');

var rl = readline.createInterface({
    input: require('fs').createReadStream('FoodFacts.csv')
});

var h = 0;
var result = [];
var arr = [];
var obj = {};
var len;
var headers;
var countryIndex;
var saltIndex;
var sugarIndex;
var countries = ["Netherlands", "Canada", "Australia", "France", "Spain", "South Africa", "Germany", "United Kingdom", "United States"];

var saltAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var sugarAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//------- Read line by line ---------
rl.on('line', function(line) {

    var obj1 = {};

    //------- Extract header ----------
    if (h == 0) {

        headers = line.split(",")
        len = headers.length;
        countryIndex = headers.indexOf('countries_en');
        saltIndex = headers.indexOf('salt_100g');
        sugarIndex = headers.indexOf('sugars_100g');
    }

    //--------- Rest of the file ---------------------
    else {

        //--------- Regex to find string with " " --------
        var regex = /".*?"/g;
        var oldex;
        while (oldex = regex.exec(line)) {
            var newex = oldex[0].replace(/,/g, "~");
            line = line.replace(oldex, newex);
        }

        //--- Split the string by ','
        var currline = line.split(",");
        var carr = currline[countryIndex] + '';
        var countryArr = carr.split("~");

        //Loop through country column which consits more than one country
        for (var k = 0; k < countryArr.length; k++) {

            countryArr[k] = countryArr[k].replace("\"", '');

            if (countries.includes(countryArr[k])) {
                // ------- JSON object creation -----------

                if (obj[countryArr[k]] == undefined) {

                    createInnerObj(obj1, currline, saltIndex);
                    createInnerObj(obj1, currline, sugarIndex);

                    obj[countryArr[k]] = obj1;

                } else {

                    if (checkNan(currline[sugarIndex])) {
                        obj[countryArr[k]][headers[sugarIndex]] += parseFloat(currline[sugarIndex]);
                    }
                    if (checkNan(currline[saltIndex])) {
                        obj[countryArr[k]][headers[saltIndex]] += parseFloat(currline[saltIndex]);
                    }

                }

                var counterLoc = countries.indexOf(countryArr[k]);

                if (checkNan(currline[saltIndex])) {
                    saltAvg[counterLoc]++;
                }
                if (checkNan(currline[sugarIndex])) {
                    sugarAvg[counterLoc]++;
                }
            }
        }
    }
    h++;

});

//create innerobject for key("country") in json
function createInnerObj(obj1, currline, index) {
    if (checkNan(currline[index]))
        obj1[headers[index]] = parseFloat(currline[index]);
    else
        obj1[headers[index]] = 0;
}

//Check if Column Value is empty
function checkNan(element) {
    if (element.trim() == "")
        return false;
    else
        return true;
}

//Calculate average for repeating countries
function average(saltAvg, sugarAvg, obj) {

    for (var key in obj) {
        var index = countries.indexOf(key);
        obj[key]['salt_100g'] /= saltAvg[index];
        obj[key]['sugars_100g'] /= sugarAvg[index];

    }
}

// --------- Write JSON to File -------
rl.on('close', function() {
    console.log(saltAvg + "\n" + sugarAvg);
    average(saltAvg, sugarAvg, obj);
    fs.writeFileSync('result1.json', JSON.stringify(obj), 'utf-8');
});
