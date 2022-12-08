import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { createUser, updateUser } from '/libs/data/registry.ts';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  let { method, headers, query, body } = req
  switch (method) {
    case "POST":
      let create = await createUser(body)
      return res.status(200).json(create)
      break
    case "PUT":
      let update = await updateUser(body)
      return res.status(200).json(update)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}