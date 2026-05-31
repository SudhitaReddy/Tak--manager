import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify(res.data)
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="branding">
        <h1>TASK MANAGER</h1>
        <h2>POS SYSTEM</h2>

        <p>
          Organize, Track and Manage
          Tasks Efficiently
        </p>
      </div>

      <div className="login-panel">
        <div className="login-box">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button type="submit">
              Login
            </button>
          </form>

          <p>
            New User?
            <Link to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;