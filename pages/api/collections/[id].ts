import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getCollectionById } from '/libs/data/registry.ts';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  let { method, headers, query } = req
  switch (method) {
    case "GET":
      let resp = await getCollectionById(query.id)
      return res.status(200).json(resp)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}