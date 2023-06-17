# Insurance Provider - ETHPROOF Advanced Varun Ass2

## Problem Statement

Using Solidity - create an insurance provider protocol. The insurance mechanism is simple. Users of an insurance platform provide liquidity to cover damage in the case of an insured event, and they themselves receive interest for providing liquidity. You can refer to Etherisc for some inspiration

You will have to build 2 main components of the insurance:

1. Crypto wallet insurance: You will have to build an insurance protocol that helps owners of smart contract wallets stay protected from hackers. The owners will be paying an insurance amount per month, set by the protocol. You can choose to invest the insurance amount in other DeFi schemes.
2. Collateral protection for crypto backed loans: Based on the insurance policy the user has chosen, you can decide to give back the entire loan or % of the loan when the collateral value drops.

In order to pass the assessment, complete the following steps:

1. Create separate Solidity contracts for both insurance types.
2. Have clearly defined policies (a minimum of two different types) for each insurance type.
3. Follow the factory contract model where for each user, a separate insurance contract is deployed.
4. Users should be able to pay the premium and claim the insurance with the required checks.

You are recommended to use Testnet for testing purposes.

## Assessment Requirements

There are four requirements for the assessment:

1. Submit your project on GitHub.
2. You will include a README.md file in your project's GitHub repository (root folder). The README should provide a concise and clear overview of your project's purpose and functionality. This will help other developers understand the motivation behind your project and how to use it.
3. Record a video of 5 min or less. Loom is a free online tool you could use. In the video, provide a code walk-through where you share your screen and explain the code. During the code walk-through, run your code and explain the resulting output.
4. Make sure your video includes a demo of your code (on CLI or GUI) to show the working of it in a test environment

## Getting Started

### Installation & Testing

- Clone the repository on your local machine

```
git clone https://github.com/Varun-Patkar/ETHPROOF-Advanced-Varun-Ass2.git
```

- Install all node dependencies

```
npm install
```

- Deploy the test blockchain using hardhat

```
npx hardhat node
```

- Deploy the contract on the blockchain using the deploy.js script

```
npx hardhat run scripts/deploy.js --network localhost
```

- Finally, Start the next.js development live server

```
npm run dev
```

## Help

- You may get the error 'Nonce too high'. This can be readily fixed by going to Metamask (or your other wallet) and clearing activity and nonce data.

## Authors

- [Varun Anand Patkar](https://github.com/Varun-Patkar)

## License

This project is licensed under the MIT License - see the LICENSE file for details
