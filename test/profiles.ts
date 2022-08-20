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
  let other: SignerWithAddress

  beforeEach(async () => {
    user = (await ethers.getSigners())[0]
    other = (await ethers.getSigners())[1]
    profiles = await loadFixture(deployProfilesFixture)
  })

  describe("#update", () => {
    it("emits profile data", async () => {
      await expect(profiles.connect(user).update(profile))
        .to.emit(profiles, "Updated")
        .withArgs(
          user.address,
          Object.values(profile)
        )
    })

    describe("rate limit", () => {
      it("reverts if called more than once an hour by the same address", async () => {
        // call once
        await expect (profiles.connect(user).update(profile))
          .to.emit(profiles, "Updated")

        // call second time
        await expect(profiles.connect(user).update(profile))
          .to.be.revertedWith("profiles can only be updated once per hour")

        // call from another wallet
        await expect (profiles.connect(other).update(profile))
          .to.emit(profiles, "Updated")
      })

      it("emits profile data again once an hour has passed", async () => {
        // call once
        await expect (profiles.connect(user).update(profile))
          .to.emit(profiles, "Updated")

        // call second time
        await expect(profiles.connect(user).update(profile))
          .to.be.reverted

        // mine an hour in time
        await network.provider.send("evm_increaseTime", [oneHour])
        await network.provider.send("evm_mine")

        // call third time
        await expect(profiles.connect(user).update(profile))
          .to.emit(profiles, "Updated")
          .withArgs(
            user.address,
            Object.values(profile)
          )
      })
    })

    describe("size limits", () => {
      const encoder = new TextEncoder()

      it("updates with a name up to 32 bytes", async () => {
        const longName = "Lorem-ipsum-dolor-sit-amet-duise"
        expect(encoder.encode(longName).length).to.eq(32)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            name: longName
          }
        )).to.emit(profiles, "Updated")
      })

      it("updates with a description up to 512 bytes", async () => {
        const longDescription = `Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed blandit arcu sed placerat pharetra. Aliquam mollis mi
        vel magna fringilla consequat. Nulla feugiat rutrum ornare. Vivamus eu
        porta nulla, pulvinar ultricies odio. Proin volutpat eros sed quam imperdiet,
        nec dapibus diam lacinia. Etiam dolor dolor, gravida id semper ut, dapibus a
        felis. Curabitur pretium enim ut metus ultrices, ac pretium turpis auctor.
        Proin ornare venenatis nibh, eu molestie arcuse.`

        expect(encoder.encode(longDescription).length).to.eq(512)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            description: longDescription
          }
        )).to.emit(profiles, "Updated")
      })


      it("updates with a thumbnailURI up to 2048 bytes", async () => {
        const longURI = '#'.repeat(2048)
        expect(encoder.encode(longURI).length).to.eq(2048)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            thumbnailURI:  String(longURI)
          }
        )).to.emit(profiles, "Updated")
      })

      it("updates with a linkURI up to 2048 bytes", async () => {
        const longURI = '#'.repeat(2048)
        expect(encoder.encode(longURI).length).to.eq(2048)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            linkURI:  longURI
          }
        )).to.emit(profiles, "Updated")
      })

      it("reverts if name is longer than 32 bytes", async () => {
        const longName = "Lorem-ipsum-dolor-sit-amet-duis-1"
        expect(encoder.encode(longName).length).to.eq(33)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            name: longName
          }
        )).to.be.revertedWith("name too long")
      })

      it("reverts if descrition is longer than 512 bytes", async () => {
        const longDescription = `Lorem ipsum dolor sit amet, consectetur
adipiscing elit. Sed blandit arcu sed placerat pharetra. Aliquam mollis mi
vel magna fringilla consequat. Nulla feugiat rutrum ornare. Vivamus eu
porta nulla, pulvinar ultricies odio. Proin volutpat eros sed quam imperdiet,
nec dapibus diam lacinia. Etiam dolor dolor, gravida id semper ut, dapibus a
felis. Curabitur pretium enim ut metus ultrices, ac pretium turpis auctor.
Proin ornare venenatis nibh, eu molestie arcu sagittis sed. Vestibulum sed tellus
quis nisi quis.`
        expect(encoder.encode(longDescription).length).to.eq(513)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            description: longDescription
          }
        )).to.be.revertedWith("description too long")
      })

      it("reverts if link uri is longer than 2048 bytes", async () => {
        const longURI = new Uint8Array(2049)
        expect(longURI.length).to.eq(2049)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            linkURI: String(longURI)
          }
        )).to.be.revertedWith("link uri too long")
      })

      it("reverts if thumbnail uri is longer than 2048 bytes", async () => {
        const longURI = new Uint8Array(2049)
        expect(longURI.length).to.eq(2049)

        await expect(
          profiles.connect(user).update(
          {
            ...profile,
            thumbnailURI: String(longURI)
          }
        )).to.be.revertedWith("thumbnail uri too long")
      })
    })
  })
})
