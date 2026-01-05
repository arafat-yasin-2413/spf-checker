import { useState } from "react";
import Loader from "./components/Loader";

function App() {
	const [domain, setDomain] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [spfData, setSpfData] = useState([]);

	const [expandedInclude, setExpandedInclude] = useState({});
	const [expandedRedirect, setExpandedRedirect] = useState({});

	const fetchSpf = async (url) => {
		const res = await fetch(url);
		const data = await res.json();
		if (!res.ok) throw new Error(data.message);
		return data;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSpfData([]);
		setExpandedInclude({});
		setExpandedRedirect({});

		if (!domain.trim()) {
			setError("Please enter a valid domain");
			return;
		}

		try {
			setLoading(true);
			const data = await fetchSpf(`http://localhost:5000/spf?domain=${domain}`);
			setSpfData(data.spfData);
		} catch (err) {
			setError(err.message || "Lookup failed");
		} finally {
			setLoading(false);
		}
	};

	const toggleInclude = async (inc) => {
		if (expandedInclude[inc]) {
			setExpandedInclude((prev) => {
				const copy = { ...prev };
				delete copy[inc];
				return copy;
			});
			return;
		}

		const data = await fetchSpf(`http://localhost:5000/spf/resolve?domain=${inc}`);
		setExpandedInclude((prev) => ({
			...prev,
			[inc]: data.spfData,
		}));
	};

	const toggleRedirect = async (red) => {
		if (expandedRedirect[red]) {
			setExpandedRedirect((prev) => {
				const copy = { ...prev };
				delete copy[red];
				return copy;
			});
			return;
		}

		const data = await fetchSpf(`http://localhost:5000/spf/resolve?domain=${red}`);
		setExpandedRedirect((prev) => ({
			...prev,
			[red]: data.spfData,
		}));
	};

	const renderSpfNode = (item, level = 0) => {
		const marginLeft = `${level * 1.5}rem`;

		return (
			<div
				key={item.record + level}
				style={{ marginLeft }}
				className="mt-3 border-l-2 border-gray-300 pl-3 max-w-full">
				<pre className="bg-gray-100 p-2 rounded text-sm wrap-break-words overflow-x-auto">
					{item.record}
				</pre>

				{item.includes.length === 0 && !item.redirect && (
					<p className="text-xs text-gray-500 mt-1">No includes or redirects</p>
				)}

				{/* INCLUDE */}
				{item.includes.map((inc) => (
					<div key={inc} className="mt-2">
						<button
							onClick={() => toggleInclude(inc)}
							className="flex items-center gap-1 text-sm px-3 py-1 rounded-full
						 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition cursor-pointer w-full sm:w-auto">
							<span>{expandedInclude[inc] ? "▾" : "▸"}</span>
							<span>{inc}</span>
						</button>

						{expandedInclude[inc] &&
							expandedInclude[inc].map((r) => renderSpfNode(r, level + 1))}
					</div>
				))}

				{/* REDIRECT */}
				{item.redirect && (
					<div className="mt-2">
						<button
							onClick={() => toggleRedirect(item.redirect)}
							className="flex items-center gap-1 text-sm px-3 py-1 rounded-full
						 bg-purple-100 text-purple-700 hover:bg-purple-200 transition cursor-pointer w-full sm:w-auto">
							<span>{expandedRedirect[item.redirect] ? "▾" : "▸"}</span>
							<span>{item.redirect}</span>
						</button>

						{expandedRedirect[item.redirect] &&
							expandedRedirect[item.redirect].map((r) => renderSpfNode(r, level + 1))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-5 sm:p-8 overflow-x-auto">
				<h1 className="text-2xl font-bold text-center mb-6">SPF Checker</h1>

				<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
					<input
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
						placeholder="example.com"
						className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black w-full"
					/>
					<button className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer w-full sm:w-auto mt-2 sm:mt-0">
						Check
					</button>
				</form>

				{loading && <Loader />}
				{error && <p className="text-sm text-red-600 mt-4">{error}</p>}

				{/* SPF RESULTS */}
				{spfData.map((item, idx) => (
					<div
						key={idx}
						className="mt-6 border rounded-lg p-4 bg-gray-50 overflow-x-auto">
						<p className="text-sm font-semibold mb-2">Main SPF Record</p>
						{renderSpfNode(item)}
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
