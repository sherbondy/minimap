function createMinimap(tab){
    console.log("done loading.");
    chrome.tabs.executeScript(tab.id, {file: "minimap.js"}, function(result){
	console.log("execution finished.");
    });
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
