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