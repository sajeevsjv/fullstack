import { useNavigate } from "react-router-dom";
import axios from 'axios';
function Login() {

    const navigate = useNavigate()

    const LoginFunction = async (e) => {
        e.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById("pass").value;

        let datas = {
            email,
            password
        }

        console.log("datas from login :", datas);



        try {

            let response = await axios({
                method: 'POST',
                url: "http://localhost:3001/login",
                data: datas
            })


            if (response.status === 200) {
                let parsed_response = await response.data;
                console.log("parsed_response :", parsed_response);
                let data = parsed_response.data;
                alert(parsed_response.message)

                // saving token into browsers local storage
                localStorage.setItem('authToken', parsed_response.data.token);
                let id = data._id;
                console.log('ID from login :', id);
                console.log(localStorage);
                let user_type = data.user_type;
                console.log("user_type :", user_type);
                let is_password_reset = data.is_password_reset;
                let employee_user_type = "66f420a7384f7819814abf1a";
                if (user_type === employee_user_type) {
                    if (is_password_reset === false) {
                        alert("Reset password to continue");
                        window.location.href = "ResetPassword.html"
                    }
                    else {
                        window.location.href = `usershomepage.html?id=${id}`
                    }

                }
                else {
                    navigate("getallusers");
                }

            }
            else {
                let parsed_response = await response.data;
                console.log("message :", parsed_response.message);
                alert(parsed_response.message);
            }
        }
        catch (error) {
            console.log("error :", error);
        }

    }


    return (
        <>
            <div className="container">
                <div className="form-container">
                    <form onSubmit={LoginFunction}>
                        <div>
                            <span className="login-txt">Login</span>
                        </div>
                        <div className="form-row">
                            <input type="email" name="email" id="email" placeholder="Email" />
                            <span className="clienterr" id="email-err"></span>
                        </div>
                        <div className="form-row">
                            <input type="password" name="password" id="pass" placeholder="Password" />
                            <span className="clienterr" id="pass-err"></span>
                        </div>
                        <div className="login-btn">
                            <button>
                                Login
                            </button>
                        </div>
                        <div className="line">
                            <div className="or">
                                <span>OR</span>
                            </div>
                        </div>
                        <div className="pass">
                            <a className="forgot-pass" href="/" >
                                Forgot password?
                            </a>
                        </div>
                    </form>
                    <div className="img-section">
                        <span>Welcome back</span>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Login;