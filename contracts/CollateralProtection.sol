//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CollateralProtection {
    uint contractBalance;
    address payable public borrower;
    uint public premiumAmount;
    uint public collateralValue;
    uint public insurancePercentage;
    bool public insuranceClaimed;
    uint public collateralThreshold;
    uint public balance;

    constructor(
        address payable _borrower,
        uint _premiumAmount,
        uint _loanAmount,
        uint _collateralValue,
        uint _insurancePercentage
    ) payable {
        borrower = _borrower;
        premiumAmount = _premiumAmount;
        collateralValue = _collateralValue;
        insurancePercentage = _insurancePercentage;
        balance = _loanAmount;
        insuranceClaimed = false;
    }

    function getObject()
        external
        view
        returns (address, uint, uint, uint, bool, uint, uint)
    {
        return (
            borrower,
            premiumAmount,
            collateralValue,
            insurancePercentage,
            insuranceClaimed,
            collateralThreshold,
            balance
        );
    }

    function payInterest() external payable {
        require(msg.value == premiumAmount, "Incorrect premium amount");
        require(msg.sender == borrower, "Only borrower can pay interest");
        balance -= msg.value;
    }

    function claimCollateralProtection(uint currentETHValue) external {
        require(msg.sender == borrower, "Only borrower can claim insurance");
        require(
            currentETHValue < collateralThreshold,
            "Collateral value is above threshold"
        );
        borrower.transfer((insurancePercentage * collateralValue) / 100);
        insuranceClaimed = true;
    }

    fallback() external payable {
        contractBalance = address(this).balance;
    }

    receive() external payable {
        contractBalance = address(this).balance;
    }
}
