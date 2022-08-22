# Profiles

A simple contract to manage profiles on Olta in a decentralized way.

By calling `update` the profile is signalled for that wallet address by emitting an `Updated` event. This event is then indexed by a subgraph and used on our front end website. The data will also be accessible to creators building dynamic nft's.

There is no state stored on-chain but the events will be. This saves on gas.

Other smart contracts cannot read events directly but event data is completely public and will exist for as long as the block-chain does.

## Profile

The `Updated` event emits the following:
  - user: wallet address
  - profile
    - name: a display name for the user
    - description: a description about the user
    - thumbnailURI: a URI to a thumbnail image for the user
    - linkURI: a URI to external profile or website

This data will be indexed by olta's subgraph and then be used to display profiles on [beta.olta.art](https://beta.olta.art). It also makes profile data available for projects and editions.

### Limits

The contract is rate limited to one update per hour per wallet.

The profile property's have been limited to the following sizes
|property|limit (bytes)|
|---|---|
|name|32|
|description|512|
|thumbnailURI|2048|
|linkURI|2048|


## This is a test
Our intention is to migrate to lens protocol, or something similar, once they open it up a bit more.

## Deployments

| chain | address |
|---|---|
|mumbai| [0x485210cd4205a658EAf35072b07032fE583756Fb](https://mumbai.polygonscan.com/address/0x485210cd4205a658EAf35072b07032fE583756Fb) |
|polygon| [0x1acde240D4990CBD97DC60D7E36fE254b16ea569](https://polygonscan.com/address/0x1acde240D4990CBD97DC60D7E36fE254b16ea569) |

## Gas Benefits

| Contract | Function | gas cost |
|---|---|---|
| ERC721A | Mint | 76,690 |
| **Profiles** | **Update** | **54,985** |
