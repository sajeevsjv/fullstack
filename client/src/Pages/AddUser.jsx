import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AddUser() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        name: "",
        email: "",
        file: ""
    });

    const [error, setError] = useState({
        name_error: "",
        email_error: "",
        file_error: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({ ...prevData, [name]: value }))
        validateInput(name, value);
    }

    const handleFileChange = (e) => {
        setInputData((prevData) => ({ ...prevData, file: e.target.files[0] }))

    }

    // Validation function
    const validateInput = (field, value) => {
        let message = "";
        const nameReg = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
        const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let isValid = true;

        if (field === "name") {
            if (!value) {
                message = "Name is required!";
            } else if (!nameReg.test(value)) {
                message = "Invalid name format!";
            }
            setError((prev) => ({ ...prev, name_error: message }));
            return isValid = false;;
        }

        if (field === "email") {
            if (!value) {
                message = "Email is required!";
            } else if (!emailReg.test(value)) {
                message = "Invalid email format!";
            }
            setError((prev) => ({ ...prev, email_error: message }));
           return isValid = false;
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       if( error.name_error || error.email_error) {
        return;
       }

        if (inputData.file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64string = e.target.result;

                setInputData((prevData) => ({ ...prevData, file: base64string }));
                // data.append('file', base64string);
                await sendUserdata({
                    name: inputData.name,
                    email: inputData.email,
                    image: base64string
                })

            }
            const file = inputData.file;
            reader.readAsDataURL(file);

        }
        else {
          await sendUserdata({
                name: inputData.name,
                email: inputData.email,
                image: ""
            })
        }

        async function sendUserdata(data) {
            try {
                console.log("data :", data);
                console.log("data from fun :", data);
                const authToken = localStorage.getItem("authToken");
                let response = await axios({
                    method: 'POST',
                    url: "http://localhost:3001/users",
                    headers: {
                        'Content-Type': "application/json",
                        "Authorization": `bearer ${authToken}`
                    },

                    data: {
                        name : data.name,
                        email : data.email,
                        image : data.image
                    }
                })

                const parsed_response = response.data;
                console.log("parsed_response :", parsed_response);
                alert(parsed_response);
                navigate('/getallusers');

            }
            catch (error) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    const parsed_response = error.response.data;
                    console.log("Response:", parsed_response);
                    alert(parsed_response.message);

                } else {
                    // Something happened in setting up the request
                    console.log("Error:", error.message);
                }
            }

        }
    }
    return (
        <>
            <div className="container">
                <div className="form-container">
                    <form onSubmit={handleSubmit} id='addform' method="POST">
                        <div>
                            <span className="login-txt">ADD.USER</span>
                        </div>
                        <div className="form-row">
                            <input type="text" name="name" id="name" onChange={handleChange} placeholder="Name" />
                            <span className="clienterr" id="name-err" >{error.name_error}</span>
                        </div>
                        <div className="form-row">
                            <input type="email" name="email" id="email" onChange={handleChange} placeholder="Email" />
                            <span className="clienterr" id="email-err" >{error.email_error}</span>
                        </div>
                        <div className="form-row">
                            <input type="file" accept='.png, .jpg, .jpeg, .svg' name="imgfile" onChange={handleFileChange} id="dp" />
                            <span className="clienterr" id="file-err" ></span>
                        </div>
                        <div className="login-btn">
                            <button type='submit'>
                                <ion-icon name="person-add" /> Add
                            </button>
                        </div>
                    </form>
                    <div className="img-section">
                        <span>Add User</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;