// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PhishBlock {
    struct Report {
        uint256 id;
        address reporter;
        string reportType; // "URL" or "WALLET"
        string target; // The malicious URL or wallet address
        string ipfsHash; // IPFS hash of detailed report data
        uint256 timestamp;
        ReportStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
    }
    
    enum ReportStatus { PENDING, VALIDATED, REJECTED, DISPUTED }
    
    mapping(uint256 => Report) public reports;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => bool) public validators;
    mapping(address => bool) public admin;
    
    uint256 public reportCount;
    uint256 public constant VALIDATION_THRESHOLD = 3;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    // Emergency pause functionality
    bool public paused = false;
    
    event ReportSubmitted(uint256 indexed reportId, address indexed reporter, string target);
    event VoteCast(uint256 indexed reportId, address indexed voter, bool support);
    event ReportValidated(uint256 indexed reportId, ReportStatus status);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event PausedStateChanged(bool paused);
    
    modifier onlyValidator() {
        require(validators[msg.sender] || admin[msg.sender], "Not a validator");
        _;
    }
    
    modifier onlyAdmin() {
        require(admin[msg.sender], "Not an admin");
        _;
    }
    
    // Emergency pause modifier
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor() {
        admin[msg.sender] = true;
    }
    
    // Emergency pause function
    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }
    
    function submitReport(
        string memory _reportType,
        string memory _target,
        string memory _ipfsHash
    ) external whenNotPaused returns (uint256) {
        require(bytes(_reportType).length > 0, "Report type cannot be empty");
        require(bytes(_target).length > 0, "Target cannot be empty");
        require(
            keccak256(abi.encodePacked(_reportType)) == keccak256(abi.encodePacked("URL")) ||
            keccak256(abi.encodePacked(_reportType)) == keccak256(abi.encodePacked("WALLET")),
            "Invalid report type"
        );
        
        // Additional validation for URL format
        if (keccak256(abi.encodePacked(_reportType)) == keccak256(abi.encodePacked("URL"))) {
            require(bytes(_target).length > 4, "URL too short");
            require(
                keccak256(abi.encodePacked(_target[0], _target[1], _target[2], _target[3])) == keccak256(abi.encodePacked("h", "t", "t", "p")) ||
                keccak256(abi.encodePacked(_target[0], _target[1], _target[2], _target[3], _target[4])) == keccak256(abi.encodePacked("h", "t", "t", "p", "s")),
                "Invalid URL format"
            );
        }
        
        // Additional validation for wallet address format
        if (keccak256(abi.encodePacked(_reportType)) == keccak256(abi.encodePacked("WALLET"))) {
            require(bytes(_target).length == 42, "Invalid wallet address length");
            require(_target[0] == "0" && _target[1] == "x", "Invalid wallet address format");
        }
        
        // Validate IPFS hash format (should start with Qm and be of appropriate length)
        require(bytes(_ipfsHash).length > 40 && bytes(_ipfsHash).length < 50, "Invalid IPFS hash length");
        require(_ipfsHash[0] == "Q" && _ipfsHash[1] == "m", "Invalid IPFS hash format");
        
        reportCount++;
        
        reports[reportCount] = Report({
            id: reportCount,
            reporter: msg.sender,
            reportType: _reportType,
            target: _target,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            status: ReportStatus.PENDING,
            votesFor: 0,
            votesAgainst: 0
        });
        
        emit ReportSubmitted(reportCount, msg.sender, _target);
        return reportCount;
    }
    
    function vote(uint256 _reportId, bool _support) external whenNotPaused onlyValidator {
        require(_reportId > 0 && _reportId <= reportCount, "Invalid report ID");
        require(!hasVoted[_reportId][msg.sender], "Already voted");
        require(reports[_reportId].status == ReportStatus.PENDING, "Voting closed");
        require(block.timestamp <= reports[_reportId].timestamp + VOTING_PERIOD, "Voting period expired");
        
        hasVoted[_reportId][msg.sender] = true;
        
        if (_support) {
            reports[_reportId].votesFor++;
        } else {
            reports[_reportId].votesAgainst++;
        }
        
        emit VoteCast(_reportId, msg.sender, _support);
        
        // Check if validation threshold is met
        if (reports[_reportId].votesFor >= VALIDATION_THRESHOLD) {
            reports[_reportId].status = ReportStatus.VALIDATED;
            emit ReportValidated(_reportId, ReportStatus.VALIDATED);
        } else if (reports[_reportId].votesAgainst >= VALIDATION_THRESHOLD) {
            reports[_reportId].status = ReportStatus.REJECTED;
            emit ReportValidated(_reportId, ReportStatus.REJECTED);
        }
    }
    
    function addValidator(address _validator) external whenNotPaused onlyAdmin {
        require(_validator != address(0), "Invalid address");
        validators[_validator] = true;
        emit ValidatorAdded(_validator);
    }
    
    function removeValidator(address _validator) external whenNotPaused onlyAdmin {
        require(_validator != address(0), "Invalid address");
        validators[_validator] = false;
        emit ValidatorRemoved(_validator);
    }
    
    function getReport(uint256 _reportId) external view returns (Report memory) {
        require(_reportId > 0 && _reportId <= reportCount, "Invalid report ID");
        return reports[_reportId];
    }
    
    function getReportsByStatus(ReportStatus _status) external view returns (Report[] memory) {
        uint256 count = 0;
        
        // Count reports with the specified status
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].status == _status) {
                count++;
            }
        }
        
        // Create array with the exact size needed
        Report[] memory result = new Report[](count);
        uint256 index = 0;
        
        // Fill the array with reports
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].status == _status) {
                result[index] = reports[i];
                index++;
            }
        }
        
        return result;
    }
    
    function getReportCountByStatus(ReportStatus _status) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].status == _status) {
                count++;
            }
        }
        return count;
    }
}