var bkg = chrome.extension.getBackgroundPage;

function setProxySwitch(v){
  chrome.storage.sync.set({ 'switch_proxy': v });
  $('#proxy-switch').attr('class', `fa fa-toggle-${v ? 'on' : 'off'}`);
}

function bio_setup(config){

  if(config['proxy_mode']){
    $('#proxy_mode').val(config['proxy_mode']);
  }

  $('#proxy_mode').change(function(){
    chrome.storage.sync.set({ proxy_mode: $(this).val() });
  });


  ['Authorization', 'guildId', 'channelId'].forEach(field => {
    config[field] && $(`#${field}`).val(config[field]);
  })

  let proxy_switch = config[`switch_proxy`] &&
    ['Authorization', 'guildId', 'channelId']
    .map(field => config[field])
    .every(value => typeof(value) == 'string' && value.length);

  if(!proxy_switch && config[`switch_proxy`]){
    chrome.storage.sync.set({
      switch_proxy: proxy_switch
    });
  }

  $('#proxy-switch').attr('class', `fa fa-toggle-${proxy_switch ? 'on' : 'off'}`);
  $('#proxy-switch-btn').click(function(){
    let v = !$('#proxy-switch').hasClass(`fa-toggle-on`);
    setProxySwitch(v);
  });

  $('#authtoken-get').on('click', function(){
    let createDcTab = doNext => () => {
      chrome.tabs.create({
        active: false,
        url: 'https://discord.com/channels/@me',
      }, function(tab){
        doNext && setTimeout(doNext, 1000);
        //doNext && doNext();
      });
    }

    let sendDiscordTab = ifnotab => () =>
      sendTab({'authtoken': true}, ifnotab, token => {
        console.log(`token is ===> ${token}`);
        if(token && token.length){
          chrome.storage.sync.set({'Authorization': token})
          $('#Authorization').val(token);
        } else alert("please refetch the token");
      }, undefined, 'https://discord.com/channels/*');

    roomTabs(tabs => {
      if(tabs.length)
        chrome.tabs.reload(tabs[0].id, sendDiscordTab(() => {}))
      else
        createDcTab(sendDiscordTab(() => {}))();
      //chrome.tabs.remove(tabs.map(tab => tab.id), () => {
      //  createDcTab(sendDiscordTab(() => {}))();
      //})
    }, ["*://discord.com/*", "*://discordapp.com/*"])

    //createDcTab(sendDiscordTab(() => {}))();
    //sendDiscordTab(createDcTab(sendDiscordTab(() => {})))();
  });

  $('#authtoken-del').on('click', function(){
    chrome.storage.sync.remove('Authorization')
    $('#Authorization').val("");
    setProxySwitch(false);
  });


  $('#channel-set').on('click', function(){
    let url = prompt('input the channel URL\n(https://discord.com/channels/.../...)');
    if(url === null) return;
    let regexp = new RegExp('https://discord.com/channels/(\\d+)/(\\d+)');
    let m = url.match(regexp);
    if(m){
      let cfg = {
        'guildId': m[1],
        'channelId': m[2]
      };
      chrome.storage.sync.set(cfg);
      Object.keys(cfg).forEach(field => {
        cfg[field] && $(`#${field}`).val(cfg[field]);
      })
    }
    else alert("invalid channel URL");
  });

  $('#channel-del').on('click', function(){
    ['guildId', 'channelId'].forEach(field => {
      chrome.storage.sync.remove(field)
      $(`#${field}`).val("");
    });
    setProxySwitch(false);
  });
}

$(document).ready(function(){
  $("#goto-dc").click(function(){
    chrome.tabs.create({url: 'https://discord.com/invite/BBCw3UY'});
  });
  $("#goto-repo").click(function(){
    chrome.tabs.create({url: 'https://github.com/DrrrChatbots'});
  });

  chrome.storage.sync.get((config)=>{
    bio_setup(config);
  });
});
