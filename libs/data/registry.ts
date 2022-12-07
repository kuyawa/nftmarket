const registryApiUrl = process.env.CFCE_REGISTRY_API_URL

type Dictionary = { [key:string]:any }

const fetchRegistry = async (endpoint: string, page: number = 0, size: number = 100) => {
  let url = `${registryApiUrl}/${endpoint}`
  console.log('GET', process.env.CFCE_REGISTRY_API_URL)
  console.log('REGISTRY', url)
  let query = ''
  if(page){ query = '?page='+page }
  if(size){ query += (page?'&':'?')+'size='+size }
  if(query){ url += query }
  const options = {
    headers: {
      'x-api-key': process.env.CFCE_REGISTRY_API_KEY,
      'content-type': 'application/json'
    }
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

const postRegistry = async (endpoint: string, data: Dictionary) => {
  const url = `${registryApiUrl}/${endpoint}`
  console.log('POST', process.env.CFCE_REGISTRY_API_URL)
  console.log('REGISTRY', url)
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CFCE_REGISTRY_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

export const getOrganizations = (id: string) => fetchRegistry(`organizations/list`)
export const getOrganizationById = (id: string) => fetchRegistry(`organizations/${id}`)
export const getOrganizationsByCategory = (categorySlug: string) => fetchRegistry(`organizations?category=${categorySlug}`)
export const getOrganizationsByWallet = (walletAddress: string) => fetchRegistry(`organizations?wallet=${walletAddress}`)
export const getCategories = () => fetchRegistry('categories')
export const createNFT = (data: Dictionary) => postRegistry('nft', data)

// ENLIGHTEN

// Users
export const createUser = (data: Dictionary) => postRegistry('users', data)
export const getUserById = (id: string) => fetchRegistry(`users/${id}`)
export const getUserByName = (name: string) => fetchRegistry(`users/name/${name}`)
export const getUserByWallet = (wallet: string) => fetchRegistry(`users/wallet/${wallet}`)
// Collections
export const createCollection = (data: Dictionary) => postRegistry('collections', data)
export const getCollections = (page: number = 0, size: number = 100) => fetchRegistry('collections', page, size)
export const getCollectionsByUser = (user: string) => fetchRegistry(`collections/user/${user}`)
export const getCollectionById = (id: string) => fetchRegistry(`collections/${id}`)
// Artworks
export const createArtwork = (data: Dictionary) => postRegistry('artworks', data)
export const getArtworks = (page: number = 0, size: number = 100) => fetchRegistry('artworks', page, size)
export const getArtworksByUser = (user: string) => fetchRegistry(`artworks/user/${user}`)
export const getArtworksByCollection = (id: string) => fetchRegistry(`collections/nfts/${id}`)
export const getArtworkById = (id: string) => fetchRegistry(`artworks/${id}`)
// Offers
export const createOffer = (data: Dictionary) => postRegistry('offers', data)
export const getOffers = (page: number = 0, size: number = 100) => fetchRegistry('offers', page, size)
export const getOffersByUser = (user: string) => fetchRegistry(`offers/user/${user}`)
export const getOfferById = (id: string) => fetchRegistry(`offers/${id}`)
