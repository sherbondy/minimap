function createMinimap(){
    console.log("done loading.");    
}

function updateMinimap(){
}

function moveViewport(){
}

chrome.browserAction.onClicked.addListener(function(tabID) {
    // toggle the minimap here.
    chrome.tabs.executeScript(null, {code:"alert('hooray.');"});
});

chrome.tabs.onUpdated.addListener(function(tabID){
    chrome.tabs.get(tab, function(tab){
	if (tab.status === "complete" && (tab.url != undefined)){
	    createMinimap();
	}
    });
});
