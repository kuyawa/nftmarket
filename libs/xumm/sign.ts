import {XummSdkJwt} from 'xumm-sdk'

export default async function Sign(tx:any, userToken:string) {
  console.log('SIGN TX', tx)
  try {
    let xumm = new XummSdkJwt(userToken)
    if(!xumm){ return {success:false, error: 'Login with XUMM wallet first'} }
    let {created, resolved} = await xumm.payload.createAndSubscribe(tx, function (payloadEvent) {
      if(typeof payloadEvent.data.signed !== 'undefined') {
        console.log('EVENT>', payloadEvent)
        console.log('DATA>', payloadEvent.data)
        return payloadEvent.data  // Resolved value of the `resolved` property
      }
      console.log('DATA?', payloadEvent.data) // check progress
    })
    //console.log('C', created)
    //console.log('R', resolved)
    let payloadId = created?.uuid
    console.log('PAYLOADID', payloadId)
    if(payloadId){ 
      let outcome:any = await resolved
      console.log('OUTCOME', outcome)
      console.log('SIGNED', outcome?.signed)
      if(outcome.signed){
        console.log('TXID', outcome?.txid)
        return {success:true, payloadId:payloadId, transactionId:outcome?.txid}
      } else {
        return {success:false, error:'User declined signature'}
      }
    }
    else {
      console.error('NO PAYLOAD ID')
      return {success:false, error:'Error signing transaction'}
    }
  } catch(ex) {
    console.error('ERROR:', ex)
    return {success:false, error:ex.message}
  }
}

