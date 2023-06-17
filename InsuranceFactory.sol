//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CryptoWalletInsurance.sol";
import "./CollateralProtection.sol";

contract InsuranceFactory {
    uint contractBalance;
    address payable public owner;
    mapping(address => address) public ownerWalletInsuranceContracts;
    mapping(address => address) public ownerCollateralProtectionContracts;
    address[] public deployedWalletInsuranceContracts;
    address[] public deployedCollateralProtectionContracts;

    constructor() payable {
        contractBalance = msg.value;
        owner = payable(msg.sender);
    }

    function createWalletInsuranceContract(
        address payable policyHolder,
        uint premiumAmount,
        uint policyDuration,
        uint insurancePayout
    ) external returns (address) {
        address newWalletInsuranceContract = address(
            new CryptoWalletInsurance(
                policyHolder,
                premiumAmount,
                policyDuration,
                insurancePayout
            )
        );
        ownerWalletInsuranceContracts[
            policyHolder
        ] = newWalletInsuranceContract;
        deployedWalletInsuranceContracts.push(newWalletInsuranceContract);
        payable(newWalletInsuranceContract).transfer(400);
        return newWalletInsuranceContract;
    }

    function createCollateralProtectionContract(
        address payable borrower,
        uint premiumAmount,
        uint loanAmount,
        uint collateralValue,
        uint insurancePercentage
    ) external returns (address) {
        address newCollateralProtectionContract = address(
            new CollateralProtection(
                borrower,
                premiumAmount,
                loanAmount,
                collateralValue,
                insurancePercentage
            )
        );
        ownerCollateralProtectionContracts[
            borrower
        ] = newCollateralProtectionContract;
        deployedCollateralProtectionContracts.push(
            newCollateralProtectionContract
        );
        payable(newCollateralProtectionContract).transfer(400);
        return newCollateralProtectionContract;
    }

    function getDeployedWalletInsuranceContracts()
        external
        view
        returns (address[] memory)
    {
        return deployedWalletInsuranceContracts;
    }

    function getDeployedCollateralProtectionContracts()
        external
        view
        returns (address[] memory)
    {
        return deployedCollateralProtectionContracts;
    }

    function getOwnerWalletInsuranceContract(
        address policyHolder
    ) external view returns (address) {
        return ownerWalletInsuranceContracts[policyHolder];
    }

    function getOwnerCollateralProtectionContract(
        address borrower
    ) external view returns (address) {
        return ownerCollateralProtectionContracts[borrower];
    }

    fallback() external payable {
        contractBalance = address(this).balance;
    }

    receive() external payable {
        contractBalance = address(this).balance;
    }
}
