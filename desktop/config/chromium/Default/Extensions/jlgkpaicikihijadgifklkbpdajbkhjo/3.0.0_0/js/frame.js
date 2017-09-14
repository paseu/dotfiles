document.body.addEventListener("click", function(event) {
    try {
        if(event.target.href) {
            chrome.runtime.sendMessage({href: event.target.href});
        }
    }catch(e){
        console.log(e);
    }
});

document.body.addEventListener('contextmenu', function(event) {
    if(event.target.href) {
        chrome.runtime.sendMessage({ahref: event.target.href});
    }
    return false;
}, false);

document.body.addEventListener("auxclick", function(event) {
    if(event.target.href) {
        chrome.runtime.sendMessage({ahref: event.target.href});
    }
});