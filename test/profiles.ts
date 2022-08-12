import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { Profiles } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const oneHour = 3600

const profile: Profiles.ProfileStruct = {
  name: "olta",
  description: "The place for interactive dynamic nft's",
  thumbnailURI: "https://pbs.twimg.com/profile_images/1381333533252325382/90BzLmr-_400x400.jpg",
  linkURI: "https://twitter.com/oltaart"
}

const deployProfilesFixture = async () => {
  const Profiles = await ethers.getContractFactory("Profiles");
  const profiles = await Profiles.deploy()

  return profiles
}

describe("Profiles", () => {
  let profiles: Profiles
  let user: SignerWithAddress

  beforeEach(async () => {
    user = (await ethers.getSigners())[0]
    profiles = await loadFixture(deployProfilesFixture)
  })

  describe("#update", () => {
    it("emits profile data", async () => {
      await expect(profiles.connect(user).update(profile))
        .to.emit(profiles, "updated")
        .withArgs(
          user.address,
          Object.values(profile)
        )
    })

    it("reverts if called more than once an hour by the same address", async () => {
      // call once
      await expect (profiles.connect(user).update(profile))
        .to.emit(profiles, "updated")

      // call second time
      await expect(profiles.connect(user).update(profile))
        .to.be.revertedWith("profiles can only be updated once per hour")
    })

    it("emits profile again once an hour has passed", async () => {
      // call once
      await expect (profiles.connect(user).update(profile))
        .to.emit(profiles, "updated")

      // call second time
      await expect(profiles.connect(user).update(profile))
        .to.be.reverted

      // mine an hour in time
      await network.provider.send("evm_increaseTime", [oneHour])
      await network.provider.send("evm_mine")

      // call third time
      await expect(profiles.connect(user).update(profile))
        .to.emit(profiles, "updated")
        .withArgs(
          user.address,
          Object.values(profile)
        )
    })
  })
})
