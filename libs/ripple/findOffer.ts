// After creating a sell offer, parses the tx response to get the offer Id
// Loops all affected nodes looking for an offer
// If a NFTokenOffer is found, that's the offer Id
// Else returns null
export default function findOffer(txInfo:any){
	for (var i = 0; i < txInfo.result.meta.AffectedNodes.length; i++) {
		let node = txInfo.result.meta.AffectedNodes[i]
		if(node.CreatedNode && node.CreatedNode.LedgerEntryType=='NFTokenOffer'){
			return node.CreatedNode.LedgerIndex
		}
	}
}