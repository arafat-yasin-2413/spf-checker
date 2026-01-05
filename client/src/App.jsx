import { useState } from "react";
import Loader from "./components/Loader";

function App() {
	const [domain, setDomain] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [spfRecords, setSpfRecords] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSpfRecords([]);

		if (!domain.trim()) {
			setError("Please enter a domain name");
			return;
		}

		try {
			setLoading(true);
			const res = await fetch(`http://localhost:5000/spf?domain=${domain}`);
			const data = await res.json();

			console.log("-------------printing response --------------");
			console.log(data);
			console.log("---- response ends here ----");
			if (!res.ok) {
				throw new Error(data.message);
			}

			setSpfRecords(data.spfRecords);
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
				<div className="w-full max-w-md bg-white rounded-xl shadowlg p-6">
					<h1 className="text-2xl font-bold text-center mb-6">SPF Checker</h1>

					<form onSubmit={handleSubmit} className="flex gap-2">
						<input
							type="text"
							placeholder="example.com"
							value={domain}
							onChange={(e) => setDomain(e.target.value)}
							className="flex-1 border rounded-md px-3 py-2 focus:outline-none fucus:ring-2 focus:ring-indigo-500"
						/>

						<button
							type="submit"
							className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
							Check
						</button>
					</form>

					{loading && (
						<Loader></Loader>
					)}

					{error && <p className="text-sm text-red-600 mt-4 font-semibold">{error}</p>}

					{spfRecords.length > 0 && (
						<div className="mt-6">
							<h3 className="font-semibold mb-2">SPF Records:</h3>
							{spfRecords.map((record, idx) => (
								<pre
									key={idx}
									className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto mb-2">
									{record}
								</pre>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
