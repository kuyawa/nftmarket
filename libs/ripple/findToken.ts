// After minting a token, parses the tx response to get the last token Id
// Loops all affected nodes looking for a token in final fields but not in previous
// If a node is found, that's the token Id freshly minted
// Else returns null
export default function findToken(txInfo:any){
  let found = null
  for (var i=0; i<txInfo.result.meta.AffectedNodes.length; i++) {
    let node = txInfo.result.meta.AffectedNodes[i]
    if(node.ModifiedNode && node.ModifiedNode.LedgerEntryType=='NFTokenPage'){
      let m = node.ModifiedNode.FinalFields.NFTokens.length
      let n = node.ModifiedNode.PreviousFields.NFTokens.length
      for (var j=0; j<m; j++) {
        let tokenId = node.ModifiedNode.FinalFields.NFTokens[j].NFToken.NFTokenID
        found = tokenId
        for (var k=0; k<n; k++) {
          if(tokenId==node.ModifiedNode.PreviousFields.NFTokens[k].NFToken.NFTokenID){
            found = null
            break
          }
        }
        if(found){ break }
      }
    }
    if(found){ break }
  }
  return found
}
