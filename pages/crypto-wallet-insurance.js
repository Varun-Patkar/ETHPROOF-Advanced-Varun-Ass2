import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// the essential modules to interact with frontend are below imported.
// ethers is the core module that makes RPC calls using any wallet provider like Metamask which is esssential to interact with Smart Contract
import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Web3Modal from "web3modal";
// yet another module used to provide rpc details by default from the wallet connected
import WalletConnectProvider from "@walletconnect/web3-provider";
import factoryABI from "../artifacts/contracts/InsuranceFactory.sol/InsuranceFactory.json";
import walletABI from "../artifacts/contracts/CryptoWalletInsurance.sol/CryptoWalletInsurance.json";

const CryptoWalletInsurance = () => {
	const factoryAddress = process.env.CONTRACT_ADDRESS;
	const factoryAbi = factoryABI.abi;
	const walletAbi = walletABI.abi;

	const [provider, setProvider] = useState();
	const router = useRouter();
	const [data, setData] = useState({
		insuranceAmount: ["100", "50"],
		premiumAmount: ["10", "5"],
	});
	const [formData, setFormData] = useState({});
	const [polType, setPolType] = useState(0);
	const [loader, setLoader] = useState(false);
	const [walletObj, setWalletObj] = useState();
	const [myAddress, setMyAddress] = useState();
	const [walletAddr, setWalletAddr] = useState();

	const handleInput = (e) => {
		const fieldName = e.target.id;
		const fieldValue = e.target.value;
		if (fieldName == "policyType") {
			setPolType(parseInt(fieldValue));
		}
		setFormData((prevState) => ({
			...prevState,
			[fieldName]: fieldValue,
		}));
	};

	async function initWallet() {
		try {
			// check if any wallet provider is installed. i.e metamask xdcpay etc
			if (typeof window.ethereum === "undefined") {
				console.log("Please install wallet.");
				alert("Please install wallet.");
				return;
			} else {
				// raise a request for the provider to connect the account to our website
				const web3ModalVar = new Web3Modal({
					cacheProvider: true,
					providerOptions: {
						walletconnect: {
							package: WalletConnectProvider,
						},
					},
				});

				const instanceVar = await web3ModalVar.connect();
				const providerVar = new ethers.providers.Web3Provider(instanceVar);
				setProvider(providerVar);
				const signer = providerVar.getSigner();
				const myAddr = await signer.getAddress();
				setMyAddress(myAddr);
				// initalize smartcontract with the essentials detials.
				const smartContract = new ethers.Contract(
					factoryAddress,
					factoryAbi,
					provider
				);
				const contractWithSigner = smartContract.connect(signer);
				const response =
					await contractWithSigner.getDeployedWalletInsuranceContracts();
				if (response.includes(myAddress)) {
					const resp =
						contractWithSigner.getOwnerWalletInsuranceContract(myAddress);
					setWalletAddr(resp);
					const instanceVar1 = await web3ModalVar.connect();
					const providerVar1 = new ethers.providers.Web3Provider(instanceVar1);
					const signer1 = providerVar1.getSigner();
					// initalize smartcontract with the essentials detials.
					const smartContract1 = new ethers.Contract(
						resp,
						walletAbi,
						providerVar1
					);
					const contractWithSigner1 = smartContract1.connect(signer1);
					const response1 = await contractWithSigner1.getObject();
					const walletBal = await providerVar1.getBalance(walletAddr);
					const walletobj = {
						policyHolder: response1[0],
						premiumAmount: response1[1].toNumber(),
						duration: response1[2].toNumber(),
						insuranceAmount: response1[3].toNumber(),
						insuranceClaimed: response1[4],
						balance: response1[5].toNumber(),
						walletBalance: walletBal,
					};
					setWalletObj(walletobj);
				}
				return;
			}
		} catch (error) {
			console.log(error);
			return;
		}
	}

	const submitForm = async (e) => {
		e.preventDefault();
		setLoader(true);
		if (polType == "0") {
			formData.insuranceAmount = 100;
			formData.premiumAmount = 10;
		} else {
			formData.insuranceAmount = 50;
			formData.premiumAmount = 5;
		}
		if (formData.duration) {
			formData.duration = new Date(
				parseInt(formData.duration) * 2629800000 + Math.floor(Date.now())
			);
		} else {
			alert("Please select duration");
		}
		formData.policyType = parseInt(polType);
		const web3ModalVar = new Web3Modal({
			cacheProvider: true,
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
				},
			},
		});
		const instanceVar = await web3ModalVar.connect();
		const providerVar = new ethers.providers.Web3Provider(instanceVar);
		const signer = providerVar.getSigner();
		// initalize smartcontract with the essentials detials.
		const smartContract = new ethers.Contract(
			factoryAddress,
			factoryAbi,
			providerVar
		);
		const contractWithSigner = smartContract.connect(signer);
		const response = await contractWithSigner.createWalletInsuranceContract(
			myAddr,
			formData.premiumAmount,
			formData.duration,
			formData.insuranceAmount
		);
		setWalletAddr(response);
		const instanceVar1 = await web3ModalVar.connect();
		const providerVar1 = new ethers.providers.Web3Provider(instanceVar1);
		const signer1 = providerVar1.getSigner();
		// initalize smartcontract with the essentials detials.
		const smartContract1 = new ethers.Contract(
			response,
			walletAbi,
			providerVar1
		);
		const contractWithSigner1 = smartContract1.connect(signer1);
		const response1 = await contractWithSigner1.getObject();
		const walletobj = {
			policyHolder: response1[0],
			premiumAmount: response1[1],
			duration: response1[2],
			insuranceAmount: response1[3],
			insuranceClaimed: response1[4],
			balance: response1[5],
		};
		setWalletObj(walletobj);
		setLoader(false);
	};

	const payPremium = async (e) => {
		setLoader(true);
		const web3ModalVar = new Web3Modal({
			cacheProvider: true,
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
				},
			},
		});
		const instanceVar = await web3ModalVar.connect();
		const providerVar = new ethers.providers.Web3Provider(instanceVar);
		const signer = providerVar.getSigner();
		// initalize smartcontract with the essentials detials.
		const smartContract = new ethers.Contract(
			walletAddr,
			walletAbi,
			providerVar
		);
		const contractWithSigner = smartContract.connect(signer);
		const response = await contractWithSigner.payPremium({
			value: ethers.utils.parseEther(walletObj.premiumAmount.toString()),
		});
		initWallet();
		setLoader(false);
	};

	// useEffect(() => {
	// 	initWallet();
	// }, []);

	return (
		<>
			<Head>
				<title>Crypto Wallet Insurance</title>
			</Head>
			<h1 className="text-blue-700 text-5xl font-bold text-center m-16">
				<a href="/">Insurance Provider App</a>
			</h1>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-blue-700 text-4xl font-bold text-center m-4">
					Crypto Wallet Insurance
				</h1>
			</div>
			{walletObj ? (
				<>
					<table class="text-center table-auto text-blue-700 text-3xl m-auto border-separate border-spacing-8">
						<thead>
							<tr class="text-4xl">
								<th class="underline underline-offset-4">#</th>
								<th class="underline underline-offset-4">Criteria</th>
								<th class="underline underline-offset-4">Details</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1.</td>
								<td>Policy Holder</td>
								<td>{walletObj.policyHolder?.slice(0, 15)}...</td>
							</tr>
							<tr>
								<td>2.</td>
								<td>Premium Amount</td>
								<td>{walletObj.premiumAmount} ETH</td>
							</tr>
							<tr>
								<td>3.</td>
								<td>Total Insurance Payout</td>
								<td>{walletObj.insuranceAmount} ETH</td>
							</tr>
							<tr>
								<td>4.</td>
								<td>Insurance Claimed (Y/N)</td>
								<td>
									{walletObj.insuranceClaimed ? (
										<i class="fas fa-check-circle text-green-500"></i>
									) : (
										<i class="fa-solid fa-xmark text-red-500"></i>
									)}
								</td>
							</tr>
							<tr>
								<td>5.</td>
								<td>Insurance Current Balance</td>
								<td>{walletObj.balance} ETH</td>
							</tr>
							<tr>
								<td>6.</td>
								<td>Insurance Expiry Date</td>
								<td>
									{walletObj.duration?.toLocaleString("en-GB", {
										timeZone: "IST",
										hour12: true,
									})}
								</td>
							</tr>
							<tr>
								<td>7.</td>
								<td>Balance of contract (for debugging)</td>
								<td>{walletObj.walletBalance} ETH</td>
							</tr>
						</tbody>
					</table>
					<div className="flex flex-wrap -mx-3 mb-6">
						<div className="w-full md:w-1/5 px-3"></div>
						<div className="w-full md:w-1/5 px-3">
							<button
								className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center my-5 w-full"
								type="button"
								onClick={payPremium}
							>
								{loader ? (
									<svg
										className="animate-spin m-1 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75 text-gray-700"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : (
									<span>Claim Insurance</span>
								)}
							</button>
						</div>
						<div className="w-full md:w-1/5 px-3"></div>
						<div className="w-full md:w-1/5 px-3">
							<button
								className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center my-5 w-full"
								type="button"
								onClick={payPremium}
							>
								{loader ? (
									<svg
										className="animate-spin m-1 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75 text-gray-700"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : (
									<span>Pay Premium</span>
								)}
							</button>
						</div>
						<div className="w-full md:w-1/5 px-3"></div>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center w-8/12 mx-auto my-10">
					<form className="w-full" method="post">
						<div className="flex flex-wrap -mx-3 mb-6">
							<div className="w-full md:w-1/2 px-3">
								<label
									className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="policyType"
								>
									Policy Type
								</label>
								<div className="relative">
									<select
										className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
										id="policyType"
										onChange={handleInput}
										defaultValue={"DEFAULT"}
									>
										<option value="DEFAULT" disabled hidden>
											Select
										</option>
										<option value="0">Policy A</option>
										<option value="1">Policy B</option>
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg
											className="fill-current h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
										</svg>
									</div>
								</div>
							</div>
							<div className="w-full md:w-1/2 px-3">
								<label
									className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="duration"
								>
									Insurance Duration
								</label>
								<div className="relative">
									<select
										className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
										id="duration"
										onChange={handleInput}
										defaultValue={"DEFAULT"}
									>
										<option value="DEFAULT" disabled hidden>
											Select
										</option>
										<option value="3">3 months</option>
										<option value="6">6 months</option>
										<option value="9">9 months</option>
										<option value="12">12 months (1 year)</option>
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg
											className="fill-current h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
										</svg>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap -mx-3 mb-6">
							<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
								<label
									className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="tokenName"
								>
									Premium Amount (per month)
								</label>
								<input
									disabled
									className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
									id="tokenName"
									type="text"
									placeholder="in ETH"
									value={data.premiumAmount[polType] + " ETH"}
								/>
							</div>
							<div className="w-full md:w-1/2 px-3">
								<label
									className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="tokenSymbol"
								>
									Insurance Payout
								</label>
								<input
									disabled
									className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="tokenSymbol"
									type="text"
									placeholder="in ETH"
									value={data.insuranceAmount[polType] + " ETH"}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1">
							<button
								className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center w-3/12 mx-auto"
								type="button"
								onClick={submitForm}
							>
								{loader ? (
									<svg
										className="animate-spin m-1 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75 text-gray-700"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : (
									<span>Submit</span>
								)}
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
};

export default CryptoWalletInsurance;
