//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CollateralProtection {
    address payable public borrower;
    uint public loanAmount;
    uint public collateralValue;
    uint public insurancePercentage;
    bool public insuranceClaimed;

    constructor(
        address payable _borrower,
        uint _loanAmount,
        uint _collateralValue,
        uint _insurancePercentage
    ) {
        borrower = _borrower;
        loanAmount = _loanAmount;
        collateralValue = _collateralValue;
        insurancePercentage = _insurancePercentage;
        insuranceClaimed = false;
    }

    function claimCollateralProtection() external {
        require(!insuranceClaimed, "Insurance already claimed");
        uint collateralThreshold = (loanAmount * insurancePercentage) / 100;
        require(
            collateralValue < collateralThreshold,
            "Collateral value not dropped below threshold"
        );

        insuranceClaimed = true;
        // Perform necessary actions to return the loan or % of the loan to the borrower
    }
}
