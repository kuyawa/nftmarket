import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getUserByWallet } from '/libs/data/registry.ts';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  let address = req.query.address
  let resp = await getUserByWallet(address)
  return res.status(200).json(resp)
}