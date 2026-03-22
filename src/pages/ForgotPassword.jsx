import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true); setError("");
    try {
      await api.post("/forgot-password", { email });
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: 32, fontWeight: 700, marginBottom: 8, color: "#242424" }}>Forgot password?</h1>
        <p style={{ fontSize: 15, color: "#6b6b6b", marginBottom: 32, lineHeight: 1.6 }}>Enter your email and we will send you a link to reset your password.</p>
        {success ? (
          <div style={{ background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 8, padding: "20px 24px" }}>
            <p style={{ fontSize: 16, color: "#1a8917", fontWeight: 600, marginBottom: 8 }}>Email sent!</p>
            <p style={{ fontSize: 14, color: "#6b6b6b" }}>Check your inbox at <strong>{email}</strong> for a password reset link.</p>
          </div>
        ) : (
          <>
            {error && <div style={{ background: "#fff8f8", border: "1px solid #ffd0d0", borderRadius: 6, padding: "12px 16px", fontSize: 14, color: "#c00", marginBottom: 20 }}>{error}</div>}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#242424", display: "block", marginBottom: 8 }}>Email address</label>
              <input type="email" placeholder="Enter your email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "12px 16px", border: "1px solid #e6e6e6", borderRadius: 6, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "13px", background: "#242424", color: "#fff", border: "none", borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}
        <p style={{ fontSize: 14, color: "#9b9b9b", textAlign: "center", marginTop: 24 }}>
          Remember your password? <Link to="/signin" style={{ color: "#242424", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = window.location.pathname.split("/").pop();

  const handleSubmit = async () => {
    if (!password || !confirm) return setError("Please fill all fields");
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    try {
      await api.post(`/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: 32, fontWeight: 700, marginBottom: 8, color: "#242424" }}>Reset password</h1>
        <p style={{ fontSize: 15, color: "#6b6b6b", marginBottom: 32 }}>Enter your new password below.</p>
        {success ? (
          <div style={{ background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 8, padding: "20px 24px" }}>
            <p style={{ fontSize: 16, color: "#1a8917", fontWeight: 600, marginBottom: 8 }}>Password reset!</p>
            <p style={{ fontSize: 14, color: "#6b6b6b", marginBottom: 16 }}>Your password has been updated successfully.</p>
            <Link to="/signin" style={{ padding: "10px 24px", background: "#242424", color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </div>
        ) : (
          <>
            {error && <div style={{ background: "#fff8f8", border: "1px solid #ffd0d0", borderRadius: 6, padding: "12px 16px", fontSize: 14, color: "#c00", marginBottom: 20 }}>{error}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#242424", display: "block", marginBottom: 8 }}>New password</label>
              <input type="password" placeholder="Min 6 characters" value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", border: "1px solid #e6e6e6", borderRadius: 6, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#242424", display: "block", marginBottom: 8 }}>Confirm password</label>
              <input type="password" placeholder="Repeat your password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "12px 16px", border: "1px solid #e6e6e6", borderRadius: 6, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "13px", background: "#242424", color: "#fff", border: "none", borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
