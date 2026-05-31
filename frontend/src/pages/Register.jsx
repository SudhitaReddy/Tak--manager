import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(
        "Registration successful. Please login."
      );

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="left-panel">
        <h1>Task Manager</h1>
        <p>
          Organize tasks efficiently and
          track progress in real time.
        </p>
      </div>

      <div className="right-panel">
        <div className="register-card">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <button type="submit">
              Create Account
            </button>
          </form>

          <p className="login-link">
            Already have an account?
            <Link to="/"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;