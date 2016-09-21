var fs= require("fs");
const readline = require('readline');

var rl = readline.createInterface({
  input: require('fs').createReadStream('FoodFacts.csv')
});

var h=0;
var result=[];
var arr=[];
var obj={};
var len;
var headers;
var countryIndex;
var saltIndex;
var sugarIndex;
var countries = ["Netherlands","Canada","Australia","France","Spain","South Africa","Germany","United Kingdom","United States"];
//------- Read line by line ----------
rl.on('line',function(line){

  var obj1={};

//------- Extract header ----------
  if(h==0){
    //console.log('Line from file:',line);
    headers=line.split(",")
    len=headers.length;
    countryIndex = headers.indexOf('countries_en');
    saltIndex = headers.indexOf('salt_100g');
    sugarIndex=headers.indexOf('sugars_100g');

    // console.log(len);
    // console.log(countryIndex);
    // console.log(saltIndex);
    // console.log(sugarIndex);
    // //console.log(headers);

  }

//--------- Rest of the file ---------------------
  else {

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


var carr = currline[countryIndex] + '';
//console.log(typeof carr);
var countryArr = carr.split("~");


for(var k=0;k<countryArr.length;k++){

if(countries.includes(countryArr[k])){
// ------- JSON object creation -----------
//console.log(currline[countryIndex]);
 obj1[headers[saltIndex]]=parseFloat(currline[saltIndex]);
 obj1[headers[sugarIndex]]=parseFloat(currline[sugarIndex]);

  if(obj[countryArr[k]] == undefined){
      // console.log(countryArr[k])
      obj[countryArr[k]] = obj1;
    //console.log('Country doesnt exit');
  }
  else{
  // console.log('already exist ');
   obj[countryArr[k]][headers[sugarIndex]] += parseFloat(currline[sugarIndex]);
   obj[countryArr[k]][headers[saltIndex]] += parseFloat(currline[saltIndex]);

  }
  // console.log(obj);

}
}
}
    h++;

});


// --------- Write JSON to File -------
rl.on('close',function(){
	fs.writeFileSync('result1.json',JSON.stringify(obj),'utf-8');
});

// // --------Read File----------
// fs.readFile('FoodFacts.csv',function(err,data){
//   if(err){
//     return console.error(err);
//   }
//   //console.log('Asynchronous read' + data.toString());
// });
