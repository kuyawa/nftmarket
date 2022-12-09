export async function apiGet(url){
  try {
    let resp = await fetch(url)
    let info = await resp.json()
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.error}
  }
}
export async function apiPost(url, data){
  try {
    let options = {
      method: 'POST', 
      headers: {'content-type':'application/json'}, 
      body: JSON.stringify(data)
    }
    let resp = await fetch(url, options)
    let info = await resp.json()
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.error}
  }
}
export async function apiPut(url, data){
  try {
    let options = {
      method: 'PUT', 
      headers: {'content-type':'application/json'}, 
      body: JSON.stringify(data)
    }
    let resp = await fetch(url, options)
    let info = await resp.json()
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.error}
  }
}
export async function apiDelete(url){
  // Not used
  return {success:false, error:'Delete is not available'}
}
