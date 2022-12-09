import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getCollections, createCollection } from '/libs/data/registry.ts';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  let { method, headers, query, body } = req
  switch (method) {
    case "GET":
      let list = await getCollections()
      return res.status(200).json(list)
      break
    case "POST":
      let resp = await createCollection(body)
      return res.status(200).json(resp)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}