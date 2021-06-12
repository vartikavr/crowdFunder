pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaignAddress = new Campaign(minimum, msg.sender);
        //make a new instance of campaign
        //with minimum contribution as "minimum" variable
        //and address of user as msg.sender

        deployedCampaigns.push(newCampaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minContribution;
    Request[] public requests;
    mapping(address => bool) public contributors;
    uint256 public contributorCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minValue, address creatorAddress) public {
        manager = creatorAddress;
        minContribution = minValue; //in wei
    }

    function getCampaignSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minContribution,
            this.balance,
            requests.length,
            contributorCount,
            manager
        );
    }

    function contribute() public payable {
        require(msg.value >= minContribution); //amount in wei
        if (!contributors[msg.sender]) {
            contributors[msg.sender] = true;
            contributorCount++;
        }
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({ //Request({}) => create a new instance of a request
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            //here no need to initialize approvals mapping, since we only have to initialze value types,
            //not necessary for a refernce type like mapping
        });

        //Alternative syntax: (not suggested)
        //Request(description, value, recipient, false); => according to order in decralation of Request

        requests.push(newRequest);
    }

    function approveRequest(uint256 requestIndex) public {
        Request storage request = requests[requestIndex];

        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 requestIndex) public restricted {
        Request storage request = requests[requestIndex];

        require((contributorCount / 2) < request.approvalCount);
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
