import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./style.scss";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (requestToken) => {
    console.log("response", requestToken);
    localStorage.setItem("requestToken", requestToken);

    // // set API request token in the axios instance
    // request.setHeader("Authorization", `Bearer ${requestToken.data.jwtToken}`);

    navigate("/");
  };

  const handleGoogleLogin = (googleResponse) => {
    fetch("https://localhost:7164/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: googleResponse.code }),
    })
      .then((response) => response.json())
      .then((data) => {
        handleLoginSuccess(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      console.error("Google login failed");
    },
    flow: "auth-code",
  });

  return (
    <>
      <div>
        <h1>Workout Tracker</h1>
        <div className="login-fields-container">
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
