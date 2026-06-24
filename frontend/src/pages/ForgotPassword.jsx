import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Lock } from 'lucide-react';
import { loginStyles } from '../assets/dummyStyles';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send reset email');
        return;
      }

      setMessage(data.message || 'If an account exists, a reset link has been sent.');
      setSubmitted(true);
      setEmail('');
      
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please try again.');
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
                  <Mail className={loginStyles.headingIconInner} />
                </span>
                <span className={loginStyles.headingText}>Forgot Password?</span>
              </h2>

              <p className={loginStyles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <label className={loginStyles.label}>
                    <span className={loginStyles.labelText}>Email Address</span>
                    <div className={loginStyles.inputContainer}>
                      <span className={loginStyles.inputIcon}>
                        <Mail className={loginStyles.inputIconInner} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`${loginStyles.input} ${loginStyles.inputNormal}`}
                        required
                      />
                    </div>
                    {error && (
                      <p className={loginStyles.errorText}>{error}</p>
                    )}
                  </label>

                  <div className={loginStyles.buttonsContainer}>
                    <button
                      type="submit"
                      disabled={loading}
                      className={loginStyles.submitButton}
                    >
                      {loading ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className={loginStyles.submitButtonIcon} />
                          <span className={loginStyles.submitButtonText}>Send Reset Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: '#f0fff4',
                    border: '1px solid #9ae6b4',
                    marginBottom: '16px'
                  }}>
                    <p style={{ color: '#38a169', margin: 0 }}>
                      <strong>✓ Email Sent!</strong>
                    </p>
                    <p style={{ color: '#38a169', margin: '8px 0 0 0', fontSize: '14px' }}>
                      {message}
                    </p>
                  </div>
                  
                  <div className={loginStyles.buttonsContainer}>
                    <button
                      onClick={() => navigate('/login')}
                      className={loginStyles.submitButton}
                    >
                      <span className={loginStyles.submitButtonText}>Return to Login</span>
                    </button>
                  </div>
                </div>
              )}

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

export default ForgotPassword;