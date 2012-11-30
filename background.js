var disabled = false;
// Called when the user clicks on the browser action.

function badgeToggle(color, text){
    chrome.browserAction.setBadgeBackgroundColor({color:color});
    chrome.browserAction.setBadgeText({text: text});
}

function badgeOn(){ badgeToggle("#00FF00", "ON"); }
badgeOn();

chrome.browserAction.onClicked.addListener(function(tab) {
    disabled = !disabled;
    console.log("DISABLED: ",disabled);

    if (disabled) {
        // get all tabs and KILL minimaps in them
        badgeToggle("#FF0000", "OFF");
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                chrome.tabs.executeScript(tab.id, {code: "$('#minimap').remove();"}, null);
            }
        });
        return;
    } else {
        // return functionality to current tab
        badgeOn();
        chrome.tabs.executeScript(null, {code: "createMinimap();"}, null);
    }
    // could try to remake minimaps on all tabs here, but a quick attempt revealed many issues
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
    if (disabled) {return;}
    loadScripts(tab.id, ["minimap.js"]);
}

chrome.tabs.onUpdated.addListener(function(tabID){
    chrome.tabs.get(tabID, function(tab){
        if (tab.status === "complete" && (tab.url !== undefined)){
            createMinimap(tab);
        }
    });
});


