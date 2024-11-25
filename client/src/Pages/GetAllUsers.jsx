import Navbar from "./Navbar"
import { useNavigate} from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";

function GetAllUsers() {
    console.log("component rendering..")
    
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    
    function sendId(id){
        navigate(`/getsingleuser/${id}`)

    }

    useEffect(() => {
        async function getallusers() {
            console.log("local storage :", localStorage)
            const authToken = localStorage.getItem("authToken");
            console.log("authtoken :", authToken);

            try {
                let response = await axios("http://localhost:3001/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                })

                console.log("new response:", response);

                let datas = response.data;
                console.log("datassss", datas);
                setData(datas);


            }
            catch (error) {
                if (error.response) {
                    let parsed_response = error.response.data;
                    console.log("parsed_response :", parsed_response);
                    return;
                }
                else {
                    console.log("error :", error);
                }

            }
        }

        getallusers();

    }, []);

    return (
        <>
            <Navbar />
            {data ?
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {data.map((dt) => {
                                return (
                                    <tr key={dt._id} >
                                        <td>{dt.name}</td>
                                        <td>{dt.email}</td>
                                        <td><button onClick={()=>{sendId(dt._id)}}>View</button></td>
                                        <td><button>Delete</button></td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
                : <h1>Loading..</h1>
            }
        </>
    )
}
export default GetAllUsers;

