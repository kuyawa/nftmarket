import { NextApiRequest, NextApiResponse } from 'next'
import { getOrganizationById } from 'libs/data/registry'

export default async function organizationByIdHandler(req:NextApiRequest, res:NextApiResponse){
  let { method, query } = req
  switch (method) {
    case "GET":
      let id = String(query.id)
      let result = await getOrganizationById(id)
      return res.status(200).json(result)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}