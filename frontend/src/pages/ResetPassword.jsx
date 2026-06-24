import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { loginStyles } from '../assets/dummyStyles';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setErr(data?.message || "Reset failed");
        return;
      }

      setMsg(data?.message || "Password reset successful");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      {/* Background bubbles */}
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      <Link to='/login' className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Back to Login</span>
      </Link>

      <div className={loginStyles.formContainer}>
        <div className={loginStyles.formWrapper}>
          <div className={loginStyles.animatedBorder}>
            <div className={loginStyles.formContent}>
              <h2 className={loginStyles.heading}>
                <span className={loginStyles.headingIcon}>
                  <Lock className={loginStyles.headingIconInner} />
                </span>
                <span className={loginStyles.headingText}>Reset Password</span>
              </h2>

              <p className={loginStyles.subtitle}>
                Enter your new password below to reset your account password.
              </p>

              <form onSubmit={handleSubmit}>
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>New Password</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className={`${loginStyles.input} ${loginStyles.passwordInput} ${loginStyles.inputNormal}`}
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className={loginStyles.passwordToggle}
                    >
                      {showPassword ? (
                        <EyeOff className={loginStyles.passwordToggleIcon} />
                      ) : (
                        <Eye className={loginStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>
                </label>

                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Confirm Password</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className={`${loginStyles.input} ${loginStyles.passwordInput} ${loginStyles.inputNormal}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className={loginStyles.passwordToggle}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className={loginStyles.passwordToggleIcon} />
                      ) : (
                        <Eye className={loginStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>
                </label>

                {err && (
                  <p className={loginStyles.submitError}>{err}</p>
                )}

                {msg && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f0fff4',
                    border: '1px solid #9ae6b4',
                    marginBottom: '16px'
                  }}>
                    <p style={{ color: '#38a169', margin: 0 }}>
                      <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      {msg}
                    </p>
                  </div>
                )}

                <div className={loginStyles.buttonsContainer}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={loginStyles.submitButton}
                  >
                    {loading ? (
                      "Resetting..."
                    ) : (
                      <>
                        <Lock className={loginStyles.submitButtonIcon} />
                        <span className={loginStyles.submitButtonText}>Reset Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className={loginStyles.signupContainer}>
                <div className={loginStyles.signupContent}>
                  <span className={loginStyles.signupText}>
                    Remember your password?
                  </span>
                  <Link to='/login' className={loginStyles.signupLink}>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style className={loginStyles.animations}></style>
    </div>
  );
};

export default ResetPassword;