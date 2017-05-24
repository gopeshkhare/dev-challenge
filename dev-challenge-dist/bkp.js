/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function createTableEntry(){

			var tab, tr, td, tn;
			tab = document.getElementById('table');
while(tab.rows.length > 1) {
  tab.deleteRow(1);
}
			for(var x in gur){
		
				tr = document.createElement('tr');
					td = document.createElement('td');
					 tn = document.createTextNode(gur[x].name);
					// console.log(tn);
							td.appendChild(tn);
							 tr.appendChild(td);
					   tab.appendChild(tr);
			   
			   
					td = document.createElement('td');
					 tn = document.createTextNode(gur[x].currentBestBidPrice);
							td.appendChild(tn);
							 tr.appendChild(td);
							 
					td = document.createElement('td');
					 tn = document.createTextNode(gur[x].currentBestAskPrice);
							td.appendChild(tn);
							 tr.appendChild(td);
					td = document.createElement('td');
					 tn = document.createTextNode(gur[x].lastChangeBidAmount);
							td.appendChild(tn);
							 tr.appendChild(td);
						
					td = document.createElement('td');
					// tn = document.createTextNode(gur[x].lastChangeAskAmount);
					var nowTime=getTimeStampSeconds();
					//var time=nowTime-gur[x].timeStamp[0];
					
					 tn = document.createTextNode(gur[x].lastChangeAskAmount);

							td.appendChild(tn);
							 tr.appendChild(td);
							 
					/*td = document.createElement('td');
					td.setAttribute("id", name+"ID");
					const exampleSparkline = document.getElementById('Div1')
					Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])
					 tn = document.createTextNode(gur[x].lastChangeAskAmount);
							td.appendChild(tn);
							 tr.appendChild(td);*/
					td = document.createElement('td');	
			
					td.setAttribute("id",gur[x].name);
				 tr.appendChild(td);

					
					const exampleSparkline = document.getElementById(gur[x].name);
				//	console.log(exampleSparkline+"<<<<<<<<");
				deleteExtra(x);
Sparkline.draw(exampleSparkline, gur[x].previousMid);

	//				const sparkElement = document.createElement('td');
		//			const sparkline = new Sparkline(sparkElement)
			//			sparkline.draw([1,2,3,4,5])
						/** sometime later... */
				//		sparkline.draw([2,3,4,5,1])
				
						
					   }

}

function deleteExtra(x) {
//var tsArray=gur[x].timeStamp;
console.log("TESTING::"+gur[x].timeStamp);
   // document.getElementById("demo").innerHTML = gur[x].timeStamp;
   //var fruits = [6, 5, 4, 3, 2, 1];
    for(var i=gur[x].timeStamp.length-1; i>=0; i--){
    console.log(gur[x].timeStamp.length);
	var currentTs=getTimeStampSeconds()-gur[x].timeStamp[i];
    if(currentTs>=30){
    	 gur[x].timeStamp = gur[x].timeStamp.slice(i+1, gur[x].timeStamp.length);
		 gur[x].previousMid = gur[x].previousMid.slice(i+1, gur[x].timeStamp.length);

        break;
    }
    }
	console.log("TSARR"+gur[x].timeStamp.length);
	var timestp=getTimeStampSeconds();
   document.getElementById("demo").innerHTML = timestp-gur[x].timeStamp[0];
    
}

function findandDelOldEntries(x) {

var index=0;
for(var l=0;l<gur[x].timeStamp.length;l++){
var currentTime=getTimeStampSeconds();
var last=gur[x].timeStamp.length-1;
var parseTs=currentTime-parseInt(gur[x].timeStamp[last-l]);
console.log("parsTs"+parseTs+"X="+x);
if(parseTs>1){
index=last-l+1;
deleteElements(index,parseTs,last,x);
break;
}
else{
var ele=last-l;
console.log(parseTs+"DoNotDelete THIS ELSEMENT"+ele)
}
}}



function deleteElements(index,parseTs,last,x){

console.log(parseTs+"Dlete THIS ELSEMENT"+index);
for(var z=0;z<last-index+1;z++){
gur[x].timeStamp[z]=gur[x].timeStamp[index+z+1];
gur[x].previousMid[z]=gur[x].previousMid[index+z+1];
}

/*for(var z=1;z<gur[x].timeStamp.length-index;z++){
gur[x].timeStamp[z]=gur[x].timeStamp[index+z];
gur[x].previousMid[z]=gur[x].previousMid[index+z];
}*/
}


	var gur=[];
	var gop=0;
	

function connectCallback() {
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
	client.debug("I am inside connect");
	var subscription = client.subscribe("/fx/prices", function(message){
		var myJSON = message.body;
		var myObj = JSON.parse(myJSON);
		
		var arr = [];
		for (var i in myObj)
			arr.push([i,myObj[i]]);		
		//console.log(arr);
		var insert=true;
		var index;
		var name = arr[0][1];
			var currentBestBidPrice = arr[1][1];
			var currentBestAskPrice = arr[2][1];
			var lastChangeBidAmount = arr[6][1];
			var lastChangeAskAmount = arr[5][1];	
			var midPrice=(currentBestAskPrice+currentBestBidPrice)/2;
					if(gur.length==0){
	//	console.log("gur is zero")
		 var objects = {name:name, currentBestBidPrice:currentBestBidPrice,currentBestAskPrice:currentBestAskPrice,lastChangeBidAmount:lastChangeBidAmount,lastChangeAskAmount:lastChangeAskAmount,previousMid:[],timeStamp:[]};


 gur.push(objects);
   
  }
else{
for (var j=0;j<gur.length;j++){
	
  var new1=gur[j];
//console.log("new"+new1.name);
		
if(new1.name==name){
//console.log("insert False");
	insert=false;
	index=j;
}

}
if(insert){
//console.log("is insert");
var objects = {name:name, currentBestBidPrice:currentBestBidPrice,currentBestAskPrice:currentBestAskPrice,lastChangeBidAmount:lastChangeBidAmount,lastChangeAskAmount:lastChangeAskAmount,previousMid:[],timeStamp:[] };
objects.previousMid.push(midPrice);
var ts=getTimeStampSeconds();
objects.timeStamp.push(ts);

  gur.push(objects);
    	
	
}
else{
gur[index].previousMid.push(midPrice);
var ts=getTimeStampSeconds();
gur[index].timeStamp.push(ts);
//console.log("update::"+gur[index].previousMid)
gur[index].currentBestBidPrice=currentBestBidPrice;
gur[index].currentBestAskPrice=currentBestAskPrice;
gur[index].lastChangeBidAmount=lastChangeBidAmount;
gur[index].lastChangeAskAmount=lastChangeAskAmount;
}

gur.sort(function(a, b) {
    return parseFloat(a.lastChangeBidAmount) - parseFloat(b.lastChangeBidAmount);
});
createTableEntry(); 

}
/*
{

}
else{
console.log("else loop::::"+j);
 var objects = {name:name, currentBestBidPrice:currentBestBidPrice,currentBestAskPrice:currentBestAskPrice,lastChangeBidAmount:lastChangeBidAmount,lastChangeAskAmount:lastChangeAskAmount};
  gur.push(objects);
  console.log("OBJ"+objects.name);
  	document.getElementById('name').innerHTML +=j+gur[j].name+'<br>';
			document.getElementById('bestBid').innerHTML +=j+ gur[j].currentBestBidPrice+ '<br>';
			document.getElementById('bestAsk').innerHTML +=j+ gur[j].currentBestAskPrice+'<br>';
			document.getElementById('changeBid').innerHTML +=j+ gur[j].lastChangeBidAmount+'<br>';
			document.getElementById('changeAsk').innerHTML +=j+ gur[j].lastChangeAskAmount+'<br>';
			
}
			
	
	}
			
}



/*	
console.log("   IMP2::::"+gop);
			document.getElementById('name').innerHTML +='<br>'+ gur[gop].name;
			document.getElementById('bestBid').innerHTML +='<br>'+ gur[gop].currentBestBidPrice;
			document.getElementById('bestAsk').innerHTML +='<br>'+ gur[gop].currentBestAskPrice;
			document.getElementById('changeBid').innerHTML +='<br>'+ gur[gop].lastChangeBidAmount;
			document.getElementById('changeAsk').innerHTML +='<br>'+ gur[gop].lastChangeAskAmount;
			
			
 gop=gop+1;	
	
		/*	var str=obj+'j'
			var str = {
					[key]: 's'
				};
			console.log(obj);
		*/
		/**var arrLength = arr.length;
		for (i = 0; i < arrLength; i++) {
			var tab = document.getElementById("table");
			var row = table.insertRow(0);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			var cell6 = row.insertCell(1);
			cell1.innerHTML = "NAME";
			cell2.innerHTML = "Current Best Bid Price";
			document.getElementById('name').innerHTML = arr[0][1];
		}**/
		
		
		//document.getElementById('name').innerHTML = arr[0][1];
							/**var body, tab, tr, td, tn, row, col;
							body = document.getElementsByTagName('body')[0];
							tab = document.createElement('table');
							for (row = 0; row < arr.length; row++){
							tr = document.createElement('tr');
							for (col = 0; col < arr[row].length; col++){
							td = document.createElement('td');
							tn = document.createTextNode(arr[row][col]);
							td.appendChild(tn);
							tr.appendChild(td);
							}
							tab.appendChild(tr);
							}
							body.appendChild(tab);**/
		
		
		/**for (var key in myObj) {
			console.log(' name=' + key + ' value=' + myObj[key]);
			const name = document.getElementById('name')
			name.append(key.name);
			// do some more stuff with obj[key]
		}**/
		/*		for (var p in gur){
			console.log("GUR+++++++++name::"+p+"::"+gur[p].name);
			console.log("GUR+++++++++currentBestBidPrice::"+p+"::"+gur[p].currentBestBidPrice);

			
			}*/
	});

  }
function getTimeStampSeconds() {
    var d = new Date();
    var min=d.getMinutes();
    var seconds = d.getSeconds();
    var totalSeconds=(min*60)+seconds;
    return totalSeconds;
}




client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])


