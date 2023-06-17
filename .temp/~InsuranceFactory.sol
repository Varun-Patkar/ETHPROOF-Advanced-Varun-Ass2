//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./~CryptoWalletInsurance.sol";
import "./~CollateralProtection.sol";

contract InsuranceFactory {
    mapping(address => address) public ownerWalletInsuranceContracts;
    mapping(address => address) public ownerCollateralProtectionContracts;
    address[] public deployedWalletInsuranceContracts;
    address[] public deployedCollateralProtectionContracts;

    function createWalletInsuranceContract(
        address payable policyHolder,
        uint premiumAmount,
        uint policyDuration,
        uint insurancePayout,
        uint policyType
    ) external {
        address newWalletInsuranceContract = address(
            new CryptoWalletInsurance(
                policyHolder,
                premiumAmount,
                policyDuration,
                insurancePayout,
                policyType
            )
        );
        ownerWalletInsuranceContracts[
            policyHolder
        ] = newWalletInsuranceContract;
        deployedWalletInsuranceContracts.push(newWalletInsuranceContract);
    }

    function createCollateralProtectionContract(
        address payable borrower,
        uint loanAmount,
        uint collateralValue,
        uint insurancePercentage,
        uint policyType
    ) external {
        address newCollateralProtectionContract = address(
            new CollateralProtection(
                borrower,
                loanAmount,
                collateralValue,
                insurancePercentage,
                policyType
            )
        );
        ownerCollateralProtectionContracts[
            borrower
        ] = newCollateralProtectionContract;
        deployedCollateralProtectionContracts.push(
            newCollateralProtectionContract
        );
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
}
