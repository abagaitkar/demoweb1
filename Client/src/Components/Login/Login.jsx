import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import frontImage from "../../assets/images/image2.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true"); // Store authentication status
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.log(err);
    }
  };

  console.log(import.meta.env.VITE_APP_BASE_URL_PRODUCTION);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row justify-content-between align-items-center w-100">
        <div className="col-md-6 text-center mb-4 d-none d-md-block">
          <img
            className="img-fluid"
            src={frontImage}
            alt="Login Illustration"
            width="400"
            height="250"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
        <div className="col-md-6">
          <div className="border p-4 shadow bg-body-tertiary rounded">
            <h1 className="text-center mb-4">Login</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
