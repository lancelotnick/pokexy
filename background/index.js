function hideDetail(e){
  e.text = "\\*".repeat(e.text.length)
  e.url = "\\*".repeat(e.url.length)
  return e;
}

function cvt(mode, e){
  if(mode == "明人")
    return e.self ? e : null;
  else if(mode == "暗人")
    return e.self ? hideDetail(e) : null;
  else if(mode == "明房")
    return e;
  else if(mode == "暗房")
    return hideDetail(e)
  return e.self ? e : null;
}

function log2mkd(type, e){
  //type, user, text, url
  if(!e) return "";
  console.log('log data', e);
  if(type === "msg")
    return `**${e.user}**: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === "me")
    return `${e.user}: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  //if(type === "dm")
  //  return `${e.user}: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === "music")
    return `_${e.user}_ plays ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === "join")
    return `${e.user} join the room`
  if(type === "leave")
    return `${e.user} leave the room`
  if(type === "new-host")
    return `${e.user} become the room owner`
  if(type === "room-description")
    return `room desc: ${e.text}`
  if(type === "room-profile")
    return `room name: ${e.text}`
  return '';
}

chrome.runtime.onMessage.addListener((req, sender, callback) => {
  //if(["msg", "me"].includes(req.type)){
  chrome.storage.sync.get(async (config)=>{
    let proxy_switch = config[`switch_proxy`] &&
      ['Authorization', 'guildId', 'channelId']
      .map(field => config[field])
      .every(value => typeof(value) == 'string' && value.length);

    if(!proxy_switch && config[`switch_proxy`]){
      chrome.storage.sync.set({
        switch_proxy: proxy_switch
      });
    }

    if(req.type && proxy_switch){
      window.gid = config['guildId']
      window.cid = config['channelId']
      let channelId = cid
      // Send a message
      let mkd = log2mkd(req.type, cvt(config['proxy_mode'], req))
      if(mkd.length){
        let sentMessage = await api.sendMessage(channelId, log2mkd(req.type, req))
      }
    }
  });
})
