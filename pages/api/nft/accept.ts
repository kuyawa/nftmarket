import { NextApiRequest, NextApiResponse } from 'next'
import Session from 'libs/utils/session'
import {updateOffer} from 'libs/data/registry'

// req.body must be {id, buyerid, status}
export default async function acceptOfferHandler(req:NextApiRequest, res:NextApiResponse){
  let session = Session(req)
  let {id, buyerid, status} = req.body
  let data = {id, buyerid, status}
  // Update sell offer, set status = 1 if accepted or 2 if declined
  let result = await updateOffer(data)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  return res.status(200).json({success:true, id:result.data.id, offerId:result.data.offerId, status:result.data.status})
}