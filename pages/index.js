import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Home = () => {
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
				<title>Home</title>
			</Head>
			<h1 className="text-blue-700 text-5xl font-bold text-center m-16">
				<a href="/">Insurance Provider App</a>
			</h1>
			<div className="flex flex-col items-center justify-center mt-48 mb-4">
				<h1 className="text-blue-700 text-4xl font-bold text-center">
					Please Select Your Insurance Type
				</h1>
			</div>
			<form className="w-full" method="post">
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/4 px-3"></div>
					<div className="w-full md:w-1/4 px-3">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							htmlFor="type"
						>
							Insurance Type
						</label>
						<div className="relative">
							<select
								className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								id="type"
								onChange={handleInput}
								defaultValue={"DEFAULT"}
							>
								<option value="DEFAULT" disabled hidden>
									Select
								</option>
								<option value="0">Crypto Wallet Insurance</option>
								<option value="1">
									Collateral Protection for Crypto Backed Loans
								</option>
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
					<div className="w-full md:w-1/4 px-3">
						<button
							className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center my-5 w-full"
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
					<div className="w-full md:w-1/4 px-3"></div>
				</div>
			</form>
		</>
	);
};

export default Home;
