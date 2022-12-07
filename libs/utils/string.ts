const Utils = {
  stringToHex: function(str) {
      var stx = unescape(encodeURIComponent(str))
      var hex = ''
      for (var i=0; i<stx.length; i++) {
          hex += Number(stx.charCodeAt(i)).toString(16)
      }
      return hex.toUpperCase()
  },
  hexToString: function(hex) {
      var str = ''
      for (var i=0; i<hex.length; i+=2) {
          str += String.fromCharCode(parseInt(hex.substr(i,2),16))
      }
      return decodeURIComponent(escape(str))
  },
  imageUrl: function(image) {
    console.log('IMGURL', `${process.env.AWS_API_ENDPOINT}/${image}`)
    //return `${process.env.AWS_API_ENDPOINT}/${image}`
    return `https://enlightenmint.s3.us-east-1.amazonaws.com/${image}`
  }
}

export default Utils
