# Profiles

A simple contract to manage profiles on Olta in a decentrilized way.

By calling `update` the profile is signaled for that wallet address by emitting an `updated` event. This event is then indexed by a subgraph.

There is no state stored on-chain but the events will be. This saves on gas.

Other smart contracts cannot read events directly but event data is completely public and there for as long as the block-chain exists.

## Profile

The `updated` event emits the following:
  - user: wallet address
  - profile
    - name: a display name for the user
    - description: a description about the user
    - thumbnailURI: a URI to a thumnail image for the user
    - linkURI: a URI to external profile or website

This data will be indexed by olta's subgraph and then be used to display profiles on [beta.olta.art](https://beta.olta.art). It also makes profile data availble for projects and editions.

## This is a test
Our intention is to migrate to lense protocal, or somthing simular, once they open it up a bit more.

## Deployments

| chain | adress |
|---|---|
|mumbai| coming soon|
|polyogon| coming soon|

## Gas Benifits
![rough-estimate](https://user-images.githubusercontent.com/47055562/183977173-1507bee7-12de-456c-b00f-e17f5ac6d0eb.png)
Demonstration of gas saved vs storing profiles as mapping(address > profile). Note price is for ETH
