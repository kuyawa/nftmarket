import { NextApiRequest, NextApiResponse } from 'next'
import Session    from 'libs/utils/session'
import sellOffer  from 'libs/nft/sellOffer'
import {createOffer} from 'libs/data/registry'

export default async function newSellOfferHandler(req:NextApiRequest, res:NextApiResponse){
  let session = Session(req)
  let offer   = req.body
  // Create sell offer
  let sell = await sellOffer(offer.tokenId, session.account, offer.price)
  if(sell.error){
    return res.status(500).json({success:false, error:sell.error})
  }
  // Save sell offer to DB
  offer.offerId = sell.offerId
  let result = await createOffer(offer)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  return res.status(200).json({success:true, id:result.data.id, offerId:offer.offerId})
}