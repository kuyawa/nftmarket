import Random from 'libs/utils/random'

export default async function Upload(file, ext){
  console.log('Uploading file', file)
  try {
    let id   = Random.string() // To avoid collisions
    let name = id+ext
  //let name = 'art/'+id+ext
    let type = file.type
    let data = new FormData()
    data.append('name', name)
    data.append('file', file)
    let resp = await fetch('/api/utils/upload', {method: 'POST', body: data});
    let info = await resp.json();
    console.log('Upload', info)
    if(info.success) {
      console.log('Upload success!')
    } else {
      console.error('Upload failed!')
    }
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
