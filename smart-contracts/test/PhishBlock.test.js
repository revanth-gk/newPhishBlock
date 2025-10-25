const { expect } = require("chai");

describe("PhishBlock", function () {
  let phishBlock;
  let owner;
  let validator;
  let reporter;

  beforeEach(async function () {
    [owner, validator, reporter] = await ethers.getSigners();
    
    const PhishBlock = await ethers.getContractFactory("PhishBlock");
    phishBlock = await PhishBlock.deploy();
    await phishBlock.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await phishBlock.admin(owner.address)).to.equal(true);
    });

    it("Should initialize report count to 0", async function () {
      expect(await phishBlock.reportCount()).to.equal(0);
    });
  });

  describe("Report Submission", function () {
    it("Should allow users to submit reports", async function () {
      await expect(phishBlock.connect(reporter).submitReport(
        "URL",
        "https://malicious-site.com",
        "QmWmyoMoctfbAaiEs65a7i6wrCJYLqJgu4rK9at2bCdXV8"
      )).to.emit(phishBlock, "ReportSubmitted")
        .withArgs(1, reporter.address, "https://malicious-site.com");
      
      expect(await phishBlock.reportCount()).to.equal(1);
    });

    it("Should fail when submitting with invalid report type", async function () {
      await expect(phishBlock.connect(reporter).submitReport(
        "INVALID",
        "https://malicious-site.com",
        "QmWmyoMoctfbAaiEs65a7i6wrCJYLqJgu4rK9at2bCdXV8"
      )).to.be.revertedWith("Invalid report type");
    });

    it("Should fail when submitting with empty target", async function () {
      await expect(phishBlock.connect(reporter).submitReport(
        "URL",
        "",
        "QmWmyoMoctfbAaiEs65a7i6wrCJYLqJgu4rK9at2bCdXV8"
      )).to.be.revertedWith("Target cannot be empty");
    });
  });

  describe("Validator Management", function () {
    it("Should allow admin to add validators", async function () {
      await expect(phishBlock.addValidator(validator.address))
        .to.emit(phishBlock, "ValidatorAdded")
        .withArgs(validator.address);
      
      expect(await phishBlock.validators(validator.address)).to.equal(true);
    });

    it("Should allow admin to remove validators", async function () {
      await phishBlock.addValidator(validator.address);
      expect(await phishBlock.validators(validator.address)).to.equal(true);
      
      await expect(phishBlock.removeValidator(validator.address))
        .to.emit(phishBlock, "ValidatorRemoved")
        .withArgs(validator.address);
      
      expect(await phishBlock.validators(validator.address)).to.equal(false);
    });

    it("Should not allow non-admin to add validators", async function () {
      await expect(phishBlock.connect(validator).addValidator(reporter.address))
        .to.be.revertedWith("Not an admin");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Add validator and submit a report
      await phishBlock.addValidator(validator.address);
      await phishBlock.connect(reporter).submitReport(
        "URL",
        "https://malicious-site.com",
        "QmWmyoMoctfbAaiEs65a7i6wrCJYLqJgu4rK9at2bCdXV8"
      );
    });

    it("Should allow validators to vote", async function () {
      await expect(phishBlock.connect(validator).vote(1, true))
        .to.emit(phishBlock, "VoteCast")
        .withArgs(1, validator.address, true);
    });

    it("Should not allow non-validators to vote", async function () {
      await expect(phishBlock.connect(reporter).vote(1, true))
        .to.be.revertedWith("Not a validator");
    });

    it("Should not allow voting on invalid report IDs", async function () {
      await expect(phishBlock.connect(validator).vote(999, true))
        .to.be.revertedWith("Invalid report ID");
    });

    it("Should not allow double voting", async function () {
      await phishBlock.connect(validator).vote(1, true);
      await expect(phishBlock.connect(validator).vote(1, false))
        .to.be.revertedWith("Already voted");
    });

    it("Should validate report when threshold is met", async function () {
      // Add more validators
      const [, , , validator2, validator3] = await ethers.getSigners();
      await phishBlock.addValidator(validator2.address);
      await phishBlock.addValidator(validator3.address);
      
      // Vote from 3 validators
      await phishBlock.connect(validator).vote(1, true);
      await phishBlock.connect(validator2).vote(1, true);
      await phishBlock.connect(validator3).vote(1, true);
      
      const report = await phishBlock.getReport(1);
      expect(report.status).to.equal(1); // VALIDATED
    });
  });

  describe("Report Retrieval", function () {
    beforeEach(async function () {
      // Submit a few reports
      await phishBlock.connect(reporter).submitReport(
        "URL",
        "https://malicious-site.com",
        "QmWmyoMoctfbAaiEs65a7i6wrCJYLqJgu4rK9at2bCdXV8"
      );
      
      await phishBlock.connect(reporter).submitReport(
        "WALLET",
        "0x1234567890123456789012345678901234567890",
        "QmHash45678901234567890123456789012345678901"
      );
    });

    it("Should retrieve reports by ID", async function () {
      const report = await phishBlock.getReport(1);
      expect(report.reportType).to.equal("URL");
      expect(report.target).to.equal("https://malicious-site.com");
    });

    it("Should fail when retrieving invalid report IDs", async function () {
      await expect(phishBlock.getReport(999))
        .to.be.revertedWith("Invalid report ID");
    });
  });
});