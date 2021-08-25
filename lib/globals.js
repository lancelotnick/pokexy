/* helper functions */
function roomTabs(f, url){
  chrome.tabs.query({
    url: url || 'https://drrr.com/room/*'
  }, (tabs) => f(tabs));
}

function sendTab(data, except, callback, after, url){
  roomTabs((tabs) => {
    if(tabs.length){
      chrome.tabs.sendMessage(tabs[0].id, data, callback);
      if(after) after();
    }
    else if(except) except();
  }, url);
}

function bcastTabs(data){
  roomTabs((tabs) =>
    tabs.forEach((tab) =>
      chrome.tabs.sendMessage(tab.id, data)));
}
