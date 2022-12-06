// Common utils

function $(id){ return document.getElementById(id) }

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    let path = '; path=/';
    document.cookie = `${name}=${value}${expires}${path}`;
    //document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
    let value = null;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
        if (c.indexOf(nameEQ) == 0) { value = c.substring(nameEQ.length, c.length); break; }
    }
    return value;
}

function setTheme() {
  let theme = getCookie('theme')
  console.log('Theme', theme)
  if(!theme){
    theme = 'dark'
    setCookie('theme', theme)
  }
  document.body.dataset.theme = theme
  document.getElementById('text-theme').innerHTML = theme=='dark'?'Lite Mode':'Dark Mode'
}

function init() {
  console.log('App started')
  setTheme()
}

init()