export function stringToHex(str) {
  var stx = unescape(encodeURIComponent(str))
  var hex = ''
  for (var i=0; i<stx.length; i++) {
    hex += Number(stx.charCodeAt(i)).toString(16)
  }
  return hex.toUpperCase()
}

export function hexToString(hex) {
  var str = ''
  for (var i=0; i<hex.length; i+=2) {
    str += String.fromCharCode(parseInt(hex.substr(i,2),16))
  }
  return decodeURIComponent(escape(str))
}

export function imageUrl(image) {
  //return `${process.env.AWS_API_ENDPOINT}/${image}`
  let url = `https://enlightenmint.s3.us-east-1.amazonaws.com/${image}`
  //console.log('IMGURL', url)
  return url
}

