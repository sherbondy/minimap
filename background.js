var disabled = false;
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    disabled = !disabled;
    chrome.tabs.executeScript(null, {code:"document.body.style.background='red !important'"});
});


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
    if (disabled) {return;};
    loadScripts(tab.id, ["minimap.js"]);
}


chrome.tabs.onUpdated.addListener(function(tabID){
    chrome.tabs.get(tabID, function(tab){
	if (tab.status === "complete" && (tab.url != undefined)){
	    createMinimap(tab);
	}
    });
});
