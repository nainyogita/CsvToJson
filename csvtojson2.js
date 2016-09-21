var fs = require("fs");
const readline = require('readline');

var rl = readline.createInterface({
    input: require('fs').createReadStream('FoodFacts.csv')
});

var h = 0;
var result = [];
var arr = [];
var necount = 0;


//--------  Zones Object Formation ----------
var obj = {
    'North Europe': {},
    'Central Europe': {},
    'South Europe': {}
};
var ne = ['United Kingdom', 'Denmark', 'Sweden', 'Norway'];
var ce = ['France', 'Belgium', 'Germany', 'Switzerland', 'Netherlands'];
var se = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia', 'Albania'];

var fatAvg = [0, 0, 0];
var proteinAvg = [0, 0, 0];
var carbAvg = [0, 0, 0];

var len;
var headers;
var countryIndex;
var fatIndex;
var proteinIndex;
var carbIndex;

//------- Read line by line ----------
rl.on('line', function(line) {


    //------- Extract header ----------
    if (h == 0) {

        headers = line.split(",")
        len = headers.length;
        countryIndex = headers.indexOf('countries_en');
        fatIndex = headers.indexOf('fat_100g');
        proteinIndex = headers.indexOf('proteins_100g');
        carbIndex = headers.indexOf('carbohydrates_100g');

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key][headers[fatIndex]] = 0;
                obj[key][headers[proteinIndex]] = 0;
                obj[key][headers[carbIndex]] = 0;
            }
        }

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

        var currline = line.split(",");

        // ------- JSON object creation -----------
        var carr = currline[countryIndex] + '';
        //console.log(typeof carr);
        var countryArr = carr.split("~");


        for (var k = 0; k < countryArr.length; k++) {
            countryArr[k] = countryArr[k].replace("\"", '');
            var counterLoc = -1;
            if (ne.includes(countryArr[k])) {
                if (checkNan(currline[fatIndex]))
                    obj["North Europe"][headers[fatIndex]] += parseFloat(currline[fatIndex]);
                if (checkNan(currline[proteinIndex]))
                    obj["North Europe"][headers[proteinIndex]] += parseFloat(currline[proteinIndex]);
                if (checkNan(currline[carbIndex]))
                    obj["North Europe"][headers[carbIndex]] += parseFloat(currline[carbIndex]);

                counterLoc = 0;
            }

            if (ce.includes(countryArr[k])) {
                if (checkNan(currline[fatIndex]))
                    obj["Central Europe"][headers[fatIndex]] += parseFloat(currline[fatIndex]);
                if (checkNan(currline[proteinIndex]))
                    obj["Central Europe"][headers[proteinIndex]] += parseFloat(currline[proteinIndex]);
                if (checkNan(currline[carbIndex]))
                    obj["Central Europe"][headers[carbIndex]] += parseFloat(currline[carbIndex]);

                counterLoc = 1;
            }

            if (se.includes(countryArr[k])) {
                if (checkNan(currline[fatIndex]))
                    obj["South Europe"][headers[fatIndex]] += parseFloat(currline[fatIndex]);
                if (checkNan(currline[proteinIndex]))
                    obj["South Europe"][headers[proteinIndex]] += parseFloat(currline[proteinIndex]);
                if (checkNan(currline[carbIndex]))
                    obj["South Europe"][headers[carbIndex]] += parseFloat(currline[carbIndex]);
                counterLoc = 2;
            }

            if (counterLoc != -1) {

                if (checkNan(currline[fatIndex]))
                    fatAvg[counterLoc]++;

                if (checkNan(currline[proteinIndex]))
                    proteinAvg[counterLoc]++;

                if (checkNan(currline[carbIndex]))
                    carbAvg[counterLoc]++;

            }
        }
    }
    h++;
});


function checkNan(element) {
    if (element.trim() == "")
        return false;
    else
        return true;
}


// --------- Write JSON to File -------
rl.on('close', function() {
    console.log(fatAvg + "\n" + proteinAvg + "\n" + carbAvg);
    average(fatAvg, proteinAvg, carbAvg, obj);
    fs.writeFileSync('result2.json', JSON.stringify(obj), 'utf-8');
});


function average(fatAvg, proteinAvg, carbAvg, obj) {

    var zones = Object.keys(obj);

    for (var key in obj) {
        var index = zones.indexOf(key);

        obj[key]['fat_100g'] /= fatAvg[index];
        obj[key]['proteins_100g'] /= proteinAvg[index];
        obj[key]['carbohydrates_100g'] /= carbAvg[index];

    }
}
