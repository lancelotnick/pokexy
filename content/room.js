function MsgDOM2EventObj(msg){

  var type = '', user = '', text = '', url = '', info = '';

  try{
    if(msg.classList.contains("system")){
      if(msg.classList.contains("me")){
        type = "me";
        user = $(msg).find('.name').text();
        text = $(msg).contents().filter(function() {
          return this.nodeType == 3;
        }).get().pop().textContent;
      }
      else if(msg.classList.contains("music")){
        type = "music";
        names = $(msg).find('.name');
        user = names[0].textContent;
        text = names[1].textContent;
      }
      else{
        [["leave", "leave"], ["join", "join"], ["new-host", "new-host"]]
          .forEach(([w, e]) => {
            if(msg.classList.contains(w)){
              type = e;
              user = $(msg).find('.name').text();
              text = $(msg).text();
            }
          });
        if(!type){
          classList = msg.className.split(/\s+/);
          classList.splice(classList.indexOf('talk'), 1);
          classList.splice(classList.indexOf('system'), 1);
          type = classList.length ? classList[0] : 'unknown'
          names = $(msg).find('.name');
          if(names.length){
            user = names[0].textContent;
            if(names.length > 1)
              text = names[1].textContent;
          }
        }
        if(type == "room-profile"){
          text = $('.room-title-name').text()
        }
        else if(type == "room-description"){
          text = $(msg)[0].childNodes[3].textContent
        }
      }
    }
    else{
      text = $(msg).find($('.bubble p'))
        .clone().children().remove().end().text();
      var ue = $(msg).find($('.bubble p a'));
      if(ue.length) url = ue.attr('href');
      ue = $(msg).find($('img'));
      if(ue.length) url = ue.attr('data-src');

      var $user = $(msg).find('.name span');
      if($user.length > 1){ // send dm to someone
        console.log($user);
        user = $user[2].textContent;
        type = "dmto";
      }
      else{
        user = $(msg).find('.name span').text();
        type = msg.classList.contains("secret") ? "dm" : "msg";
      }
      if(type == "dm" || type == "dmto"){
        if(user == $('#user_name').text()) return;
      }
    }
  }
  catch(err){
    alert('err from talks')
    console.log(err);
    throw new Error("Stop execution");
    return;
  }

  return {
    type: type,
    user: user,
    text: text,
    url: url
  };
}

$(document).ready(function(){
  let name = $('#user_name').text()
  $('#talks').bind('DOMNodeInserted', function(event) {
    var e = event.target;
    if(e.parentElement.id == 'talks'){
      obj = MsgDOM2EventObj(e)
      obj.self = obj.user == name;
      console.log(obj)
      chrome.runtime.sendMessage(obj);
    }
  });
});

