import { useState } from "react";

function App() {
	
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [spfRecords, setSpfRecords] = useState([]);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");
        setSpfRecords([]);

        if(!domain.trim()){
            setError("Please enter a domain name");
            return ;
        }

        try{
            setLoading(true);
            const res = await fetch(`http://localhost:5000/spf?domain=${domain}`);
            const data = await res.json();

            console.log('-------------printing response --------------')
            console.log(data);
            console.log('---- response ends here ----');
            if(!res.ok){
                throw new Error(data.message);
            }

            setSpfRecords(data.spfRecords);
        }
        catch(err){
            setError(err.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    };

	return (
		<>
            <div>
                SPF checker form
            </div>
        </>
	);
}

export default App;
