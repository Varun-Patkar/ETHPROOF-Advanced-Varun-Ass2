//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CryptoWalletInsurance {
    uint contractBalance;
    address payable public policyHolder;
    uint public premiumAmount;
    uint public policyDuration; //expiry time of policy
    uint public insurancePayout;
    uint public balance;
    bool public insuranceClaimed;

    constructor(
        address payable _policyHolder,
        uint _premiumAmount,
        uint _policyDuration,
        uint _insurancePayout
    ) payable {
        policyHolder = _policyHolder;
        premiumAmount = _premiumAmount;
        policyDuration = _policyDuration;
        insurancePayout = _insurancePayout;
        balance = 0;
        insuranceClaimed = false;
    }

    function getObject()
        external
        view
        returns (address, uint, uint, uint, bool, uint)
    {
        return (
            policyHolder,
            premiumAmount,
            policyDuration,
            insurancePayout,
            insuranceClaimed,
            balance
        );
    }

    function payPremium() external payable {
        require(msg.value == premiumAmount, "Incorrect premium amount");
        require(
            msg.sender == policyHolder,
            "Only policy holder can pay premium"
        );
        balance += msg.value;
        //We can invest premium in defi schemes but since this is on testnet
        //we are not doing that
    }

    function claimInsurance() external {
        require(block.timestamp < policyDuration, "Your Policy is expired");
        require(
            msg.sender == policyHolder,
            "Only policy holder can claim insurance"
        );
        require(balance >= insurancePayout, "Insufficient balance");

        //Can add checks to check if wallet is hacked or not.
        //I can't seem to find any way of doing that using just solidity contracts
        //while showing that wallet got hacked in testing

        // Transfer the insurance payout to the policy holder if claim is valid
        policyHolder.transfer(insurancePayout);
        insuranceClaimed = true;
    }

    fallback() external payable {
        contractBalance = address(this).balance;
    }

    receive() external payable {
        contractBalance = address(this).balance;
    }
}
