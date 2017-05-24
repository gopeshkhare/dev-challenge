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
var gur = [];
const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {


    if (global.DEBUG) {
        console.info(msg)
    }
}
//createTableEntry function generates a dynamic table from pre formatted data.

function createTableEntry() {

    var tab, tr, td, tn;
    tab = document.getElementById('table');
    while (tab.rows.length > 1) {
        tab.deleteRow(1);
    }
    for (var x in gur) {

        tr = document.createElement('tr');
        td = document.createElement('td');
        tn = document.createTextNode(gur[x].name);
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
        tn = document.createTextNode(gur[x].lastChangeAskAmount);

        td.appendChild(tn);
        tr.appendChild(td);

       
        td = document.createElement('td');

        td.setAttribute("id", gur[x].name);
        tr.appendChild(td);


        const exampleSparkline = document.getElementById(gur[x].name);
        deleteExtra(x);
        Sparkline.draw(exampleSparkline, gur[x].previousMid);




    }

}

//deleteExtra function Deletes nodes older than 3o seconds for sparklines
function deleteExtra(x) {
    
    for (var i = gur[x].timeStamp.length - 1; i >= 0; i--) {
        var currentTs = getTimeStampSeconds() - gur[x].timeStamp[i];
        if (currentTs >= 30) {
            gur[x].timeStamp = gur[x].timeStamp.slice(i + 1, gur[x].timeStamp.length);
            gur[x].previousMid = gur[x].previousMid.slice(i + 1, gur[x].timeStamp.length);

            break;
        }
    }
} 

function connectCallback() {
    client.debug("I am inside connect");
    var subscription = client.subscribe("/fx/prices", function(message) {
        var myJSON = message.body;
        var myObj = JSON.parse(myJSON);

        var arr = [];
        for (var i in myObj)
            arr.push([i, myObj[i]]);
        var insert = true;
        var index;
        var name = arr[0][1];
        var currentBestBidPrice = arr[1][1];
        var currentBestAskPrice = arr[2][1];
        var lastChangeBidAmount = arr[6][1];
        var lastChangeAskAmount = arr[5][1];
        var midPrice = (currentBestAskPrice + currentBestBidPrice) / 2;
        if (gur.length == 0) {
            var objects = {
                name: name,
                currentBestBidPrice: currentBestBidPrice,
                currentBestAskPrice: currentBestAskPrice,
                lastChangeBidAmount: lastChangeBidAmount,
                lastChangeAskAmount: lastChangeAskAmount,
                previousMid: [],
                timeStamp: []
            };


            gur.push(objects);

        } else {
            for (var j = 0; j < gur.length; j++) {

                var new1 = gur[j];

                if (new1.name == name) {
                    insert = false;
                    index = j;
                }

            }
            if (insert) {
                var objects = {
                    name: name,
                    currentBestBidPrice: currentBestBidPrice,
                    currentBestAskPrice: currentBestAskPrice,
                    lastChangeBidAmount: lastChangeBidAmount,
                    lastChangeAskAmount: lastChangeAskAmount,
                    previousMid: [],
                    timeStamp: []
                };
                objects.previousMid.push(midPrice);
                var ts = getTimeStampSeconds();
                objects.timeStamp.push(ts);

                gur.push(objects);


            } else {
                gur[index].previousMid.push(midPrice);
                var ts = getTimeStampSeconds();
                gur[index].timeStamp.push(ts);
                gur[index].currentBestBidPrice = currentBestBidPrice;
                gur[index].currentBestAskPrice = currentBestAskPrice;
                gur[index].lastChangeBidAmount = lastChangeBidAmount;
                gur[index].lastChangeAskAmount = lastChangeAskAmount;
            }

            gur.sort(function(a, b) {
                return parseFloat(a.lastChangeBidAmount) - parseFloat(b.lastChangeBidAmount);
            });
            createTableEntry();

        }
        
    });

}


//getTimeStampSeconds function gives relative timestamp in seconds
function getTimeStampSeconds() {
    var d = new Date();
    var min = d.getMinutes();
    var seconds = d.getSeconds();
    var totalSeconds = (min * 60) + seconds;
    return totalSeconds;
}

client.connect({}, connectCallback, function(error) {
    alert(error.headers.message)
})
