import axios from "axios";
import { createContext, useState, useEffect,} from "react";
import { useLocation } from "react-router-dom";
export const UserContext = createContext()

function FetchUserData({ children }) {
    const [data, setData] = useState(null);

    let location = useLocation();
    let currentLocation = location.pathname;

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
                    console.log("parsed_response :", parsed_response)
                }
                else {
                    console.log("error :", error);
                }

            }
        }

        getallusers();

    }, [currentLocation]);

    return (
        <>
            {data ?
                <UserContext.Provider value={{ data }}>
                    {children}
                </UserContext.Provider>
                :
                <UserContext.Provider value={'no data available'}>
                    {children}
                </UserContext.Provider>}
        </>
    )

}

export default FetchUserData;
