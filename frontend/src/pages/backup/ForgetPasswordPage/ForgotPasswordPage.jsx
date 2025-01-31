import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPasswordPage.css';
import { fetchSecurityQuestions, verifyAnswers } from './forgotPasswordUtils';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({ answer1: '', answer2: '' });
  const [password, setPassword] = useState(''); // State to store the password
  const [countdown, setCountdown] = useState(10); // Countdown timer for redirecting
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            navigate('/login'); // Redirect to login page after countdown.
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, navigate]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError('');
    const { questions, error } = await fetchSecurityQuestions(email);
    if (questions) {
      setQuestions(questions);
      setStep(2);
    } else {
      setError(error);
    }
  };

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    setError('');
    const { correct, password, error } = await verifyAnswers(email, answers);
    console.log("correct :"+correct + "password :"+password +"error: "+error);
    if (correct) {
      setPassword(password); // Store the password
      console.log(password);
      setMessage('Password has been retrieved.');
      setStep(3); // Proceed to the final step
    } else {
      setError(error); // Show error message
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        {step === 1 && (
          <>
            <h1 className="forgot-password-title">Forgot Password</h1>
            {message && <p className="forgot-password-message success">{message}</p>}
            {error && <p className="forgot-password-message error">{error}</p>}
            <form onSubmit={handleSubmitEmail}>
              <div className="forgot-password-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">
                Next
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="forgot-password-title">Answer Recovery Questions</h1>
            {error && <p className="forgot-password-message error">{error}</p>}
            <form onSubmit={handleSubmitAnswers}>
              <div className="forgot-password-field">
                <label>{questions.question1}</label>
                <input
                  type="text"
                  name="answer1"
                  value={answers.answer1}
                  onChange={handleAnswerChange}
                  required
                />
              </div>
              <div className="forgot-password-field">
                <label>{questions.question2}</label>
                <input
                  type="text"
                  name="answer2"
                  value={answers.answer2}
                  onChange={handleAnswerChange}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">
                Submit
              </button>
            </form>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="forgot-password-title">Password Retrieved</h1>
            <p className="forgot-password-password">
              Your password is: <strong>{password}</strong>
            </p>
            <p className="forgot-password-redirect">
              Redirecting to login page in {countdown} seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
