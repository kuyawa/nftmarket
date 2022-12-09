import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import Session    from '/libs/utils/session.ts'
// @ts-ignore
import {updateOffer} from '/libs/data/registry.ts'


export default async function acceptOffer(req:NextApiRequest, res:NextApiResponse){
  console.log('ACCEPT OFFER...')
  let session = Session(req)
  let data = req.body
  console.log('DATA:', data)

  // Data must be {id, status}
  // Update sell offer, set status = 1 if accepted or 2 if declined
  let result = await updateOffer(data)
  console.log('RESULT', result)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  return res.status(200).json({success:true, id:result.data.id, offerId:result.data.offerId, status:result.data.status})
}