import { NextApiRequest, NextApiResponse } from 'next'
import { getCollections, createCollection } from 'libs/data/registry'

export default async function collectionsHandler(req:NextApiRequest, res:NextApiResponse){
  let { method, body } = req
  let result
  switch (method) {
    case "GET":
      result = await getCollections()
      return res.status(200).json(result)
      break
    case "POST":
      let record = body
      result = await createCollection(record)
      return res.status(200).json(result)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}