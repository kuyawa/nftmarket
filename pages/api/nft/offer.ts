import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import sellOffer  from '/libs/nft/sellOffer.ts'
// @ts-ignore
import Session    from '/libs/utils/session.ts'
// @ts-ignore
import {createOffer} from '/libs/data/registry.ts'


export default async function NewNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('OFFER...')
  let session = Session(req)
  let offer = req.body
  console.log('DATA:', offer)

  // Create sell offer
  let sell = await sellOffer(offer.tokenId, session.account)
  console.log('SELL', sell)
  if(sell.error){
    return res.status(500).json({success:false, error:sell.error})
  }

  // Save sell offer
  offer.offerId = sell.offerId
  console.log('OFFER', offer)
  let result = await createOffer(offer)
  console.log('RESULT', result)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  return res.status(200).json({success:true, offerId:offer.offerId})
}