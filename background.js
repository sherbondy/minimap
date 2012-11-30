function loadScripts(tabID, scriptArray){
    if (scriptArray.length > 0){
	var scriptName = scriptArray[0];
	chrome.tabs.executeScript(tabID, {file: scriptName}, function(result){
	    console.log("loaded "+scriptName);
	    loadScripts(tabID, scriptArray.slice(1));
	});
    } else {
	console.log("all scripts loaded.");
    }
}

function createMinimap(tab){
    console.log("creating minimap");

    chrome.tabs.insertCSS(tab.id, {file: "minimap.css"});

    var scripts = ["html2canvas.js", "jquery-1.8.3.min.js", "minimap.js"];
    loadScripts(tab.id, scripts);
}

chrome.browserAction.onClicked.addListener(function(tabID) {
    // toggle the minimap here.
    chrome.tabs.executeScript(null, {code:"alert('hooray.');"});
});

chrome.tabs.onUpdated.addListener(function(tabID){
    chrome.tabs.get(tabID, function(tab){
	if (tab.status === "complete" && (tab.url != undefined)){
	    createMinimap(tab);
	}
    });
});
