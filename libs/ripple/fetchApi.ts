interface PayloadType {
  method: string;
  params: any[];
}

// Fetch ripple rpc servers
// Returns payload result
// On error returns error:message
export default async function fetchApi(payload:PayloadType){
  try {
    let url = process.env.XRPL_RPC_URI
    let options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }
    let result = await fetch(url, options)
    let data = await result.json()
    return data
  } catch(ex) {
    console.error(ex)
    return {error: ex.message}
  }
}
