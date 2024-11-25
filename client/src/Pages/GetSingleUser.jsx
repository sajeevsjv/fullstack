import axios from "axios";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom"
import { useState, useEffect} from "react";
function GetSingleUser() {

    const {id} = useParams()
    console.log("id :",id);
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log("useEffect rendering");
        async function getsingleuser() {
            console.log("local storage :", localStorage)
            const authToken = localStorage.getItem("authToken");
            console.log("authtoken :", authToken);

            try {
                let response = await axios(`http://localhost:3001/users/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                })

                console.log("new response:", response);

                let user = response.data;
                console.log("user datas", user);
                setData(user);
            }
            catch (error) {
                if (error.response) {
                    let parsed_response = error.response.data;
                    console.log("parsed_response :", parsed_response)
                }
                else {
                    console.log("error :", error);
                }

            }
        }

        getsingleuser();

    }, []);



    return (
        <>  
        <Navbar />
        { data ? 
            <div id="viewuser" className="container1">
                <div className="img-div"><img src= {data.image} alt='img' /></div>
                <div className="line" />
                <div className="text-div"><h4>{data.name}</h4></div>
                <div className="text-div-email"><h4>{data.email}</h4></div>
                <div className="btn-div"><span><button className="btn1" ><ion-icon name="create-outline" /></button></span>
                <span><button className="btn1"><ion-icon name="trash-outline" /></button></span></div>
            </div>
            : <h4>loading data..</h4>}
        </>
    )
}
export default GetSingleUser;