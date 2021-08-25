document.addEventListener("DOMContentLoaded", function() {
  setTimeout(()=>{
    console.log(`██████╗  ██████╗ ██╗  ██╗██╗  ██╗██╗   ██╗██╗██╗██╗
██╔══██╗██╔═══██╗██║ ██╔╝╚██╗██╔╝╚██╗ ██╔╝██║██║██║
██████╔╝██║   ██║█████╔╝  ╚███╔╝  ╚████╔╝ ██║██║██║
██╔═══╝ ██║   ██║██╔═██╗  ██╔██╗   ╚██╔╝  ╚═╝╚═╝╚═╝
██║     ╚██████╔╝██║  ██╗██╔╝ ██╗   ██║   ██╗██╗██╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝╚═╝
                                                   `);
  }, 3000);
});

chrome.runtime.onMessage.addListener(
  (req, sender, callback) => {
    if(req.authtoken && callback){
      if(localStorage.token){
        let token = localStorage.token.replace(new RegExp('"', 'g'), '')
        callback(token);
      }
      else callback(false);
    }
    console.log(req);
  });
