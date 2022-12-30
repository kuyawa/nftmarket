import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByWallet } from 'libs/data/registry'

export default async function userByWalletHandler(req:NextApiRequest, res:NextApiResponse){
  let address = String(req.query.address)
  let result  = await getUserByWallet(address)
  return res.status(200).json(result)
}