// UTILS

function classes(txt){
    return txt.split(' ').map(c => styles[c]).join(' ')
}

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    let path = '; path=/';
    document.cookie = `${name}=${value}${expires}${path}`;
}

function changeTheme(evt) {
    console.log('Prev theme', document.body.dataset.theme)
    let theme = document.body.dataset.theme=='dark'?'lite':'dark'
    document.body.dataset.theme = theme
    document.getElementById('text-theme').innerHTML = theme=='dark'?'Lite Mode':'Dark Mode'
    setCookie('theme', theme)
    console.log('Changed theme to', theme)
    evt.stopPropagation()
    evt.preventDefault()
    return false
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copying to clipboard was successful!');
    }, function(err) {
        console.error('Could not copy to clipboard:', err);
    });
}


export {
    classes,
    setCookie,
    changeTheme,
    copyToClipboard
}