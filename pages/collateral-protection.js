import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const CollateralProtection = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({});
	const [loader, setLoader] = useState(false);

	const handleInput = (e) => {
		const fieldName = e.target.id;
		const fieldValue = e.target.value;
		setFormData((prevState) => ({
			...prevState,
			[fieldName]: fieldValue,
		}));
	};

	const submitForm = async (e) => {
		e.preventDefault();
		setLoader(true);
		if (formData.type === "0") {
			router.push("/crypto-wallet-insurance");
		} else {
			router.push("/collateral-protection");
		}
		setLoader(false);
	};

	return (
		<>
			<Head>
				<title>Collateral Protection</title>
			</Head>
			<h1 className="text-blue-700 text-5xl font-bold text-center m-16">
				<a href="/">Insurance Provider App</a>
			</h1>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-blue-700 text-4xl font-bold text-center m-4">
					Collateral Protection for Crypto Backed Loans
				</h1>
			</div>
		</>
	);
};

export default CollateralProtection;
