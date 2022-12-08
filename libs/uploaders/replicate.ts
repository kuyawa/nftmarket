// @ts-ignore
import Random from '/libs/utils/random.ts'

export default async function Replicate(file, ext){
  try {
    let id   = Random.string() // To avoid collisions
    let name = id+ext
  //let name = 'art/'+id+ext
    let type = file.type
    let data = new FormData()
    data.append('name', name)
    data.append('file', file)
    let resp = await fetch('/api/replicate', {method: 'POST', body: data});
    let info = await resp.json();
    console.log('Replicate', info)
    if(info.success) {
      console.log('Replicate success!')
    } else {
      console.error('Replicate failed!')
    }
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
