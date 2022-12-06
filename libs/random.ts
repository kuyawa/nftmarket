const Random = {
  number: function(len=10){
    let ret = '';
    const chars = '0123456789';
    for (let i=0; i<len; ++i) {
        ret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ret;
  },
  string: function(len=10){
    let ret = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    for (let i=0; i<len; ++i) {
        ret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ret;
  },
  address: function(){
    let buf = crypto.getRandomValues(new Uint8Array(20));
    let adr = '0x'+Array.from(buf).map(x=>{return x.toString(16).padStart(2,'0')}).join('');
    return adr;
  }
}

export default Random