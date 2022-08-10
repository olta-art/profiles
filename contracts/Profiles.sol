// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;


/**
* @title Profiles
* @author Olta
*
* @notice This is a simple way to add profile data to the blockchain.
*/

contract Profiles {

    struct Profile {
        string name;
        string description;
        string thumbnailURI;
        string linkURI;
    }

    event updated(
        address user,
        Profile profile
    );

    /**
    * @notice emits updated event with caller along with the profile calldata
    * @param profile a struct containing profile data
    *      name: a display name for the user
    *      description: a description about the user
    *      thumbnailURI: a URI to a thumnail image for the user
    *      linkURI: a URI to external profile or website
    */
    function update(Profile calldata profile) external {
        emit updated(msg.sender, profile);
    }
}