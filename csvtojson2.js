var fs= require("fs");
const readline = require('readline');

var rl = readline.createInterface({
  input: require('fs').createReadStream('FoodFacts.csv')
});

var h=0;
var result=[];
var arr=[];
var necount =0;



//--------  Zones Object Formation ----------
var obj={'North Europe':{},'Central Europe':{},'South Europe':{}};
var ne = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
var ce=['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
var se=['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];


var len;
var headers;
var countryIndex;
var fatIndex;
var proteinIndex;
var carbIndex;

//------- Read line by line ----------
rl.on('line',function(line){


//------- Extract header ----------
  if(h==0){
    //console.log('Line from file:',line);
    headers=line.split(",")
    len=headers.length;
    countryIndex = headers.indexOf('countries_en');
    fatIndex = headers.indexOf('fat_100g');
    proteinIndex=headers.indexOf('proteins_100g');
    carbIndex=headers.indexOf('carbohydrates_100g');

    // console.log(len);
    // console.log(countryIndex);
    // console.log(fatIndex);
    // console.log(proteinIndex);
    // console.log(carbIndex);
    //console.log(headers);
console.log(headers[fatIndex]);


    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        obj[key][headers[fatIndex]] = 0;
        obj[key][headers[proteinIndex]] = 0;
        obj[key][headers[carbIndex]] = 0;
      }
    }

  }
//console.log(JSON.stringify(obj));
//--------- Rest of the file ---------------------
else  {

//--------- Regex to find string with " " --------
     var regex= /".*?"/g ;


     var oldex;
     while(oldex=regex.exec(line)){
     var newex = oldex[0].replace(/,/g,"~");
    // console.log(newex);
     line=line.replace(oldex,newex);
    // console.log(line);
   }

   var currline = line.split(",");

   for(var i=0;i<len;i++){
   if(currline[i].trim()==''){
     currline[i]=0;
   }
 }




// ------- JSON object creation -----------



var carr = currline[countryIndex] + '';
//console.log(typeof carr);
var countryArr = carr.split("~");


for(var k=0;k<countryArr.length;k++){

if(ne.includes(countryArr[k])){

   obj["North Europe"][headers[fatIndex]]+= parseFloat(currline[fatIndex]);
   obj["North Europe"][headers[proteinIndex]]+= parseFloat(currline[proteinIndex]);
   obj["North Europe"][headers[carbIndex]]+= parseFloat(currline[carbIndex]);

  //  console.log(obj);

}

if(ce.includes(countryArr[k])){
   obj["Central Europe"][headers[fatIndex]]+= parseFloat(currline[fatIndex]);
   obj["Central Europe"][headers[proteinIndex]]+= parseFloat(currline[proteinIndex]);
   obj["Central Europe"][headers[carbIndex]]+= parseFloat(currline[carbIndex]);

//console.log(obj);
}

if(se.includes(countryArr[k])){
   obj["South Europe"][headers[fatIndex]]+= parseFloat(currline[fatIndex]);
   obj["South Europe"][headers[proteinIndex]]+= parseFloat(currline[proteinIndex]);
   obj["South Europe"][headers[carbIndex]]+= parseFloat(currline[carbIndex]);

}

  // console.log(obj);
  }
}
    h++;
});

// --------- Write JSON to File -------
rl.on('close',function(){
	fs.writeFileSync('result2.json',JSON.stringify(obj),'utf-8');
});
