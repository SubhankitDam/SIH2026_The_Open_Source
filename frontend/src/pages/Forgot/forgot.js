// Import React and the useState hook from React.
import React, { useState } from "react";



// Create the ForgotPassword functional component.
const ForgotPassword = () => {
  // Store the current step of the forgot-password process.
  // Step 1 = User ID and phone number.
  // Step 2 = OTP verification.
  // Step 3 = New password.
  const [step, setStep] = useState(1);

  // Store the User ID entered by the user.
  const [userId, setUserId] = useState("");

  // Store the phone number entered by the user.
  const [phoneNumber, setPhoneNumber] = useState("");

  // Store the OTP entered by the user.
  const [otp, setOtp] = useState("");

  // Store the new password entered by the user.
  const [newPassword, setNewPassword] = useState("");

  // Store the confirmation password.
  const [confirmPassword, setConfirmPassword] = useState("");

  // Store validation or API error messages.
  const [error, setError] = useState("");

  // Store success messages.
  const [message, setMessage] = useState("");

  // Store loading state while an API request is running.
  const [loading, setLoading] = useState(false);

  // Store whether the new password should be visible.
  const [showPassword, setShowPassword] = useState(false);

  // Store whether the confirmation password should be visible.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle submission of the User ID and phone number form.
  const handleSendOtp = async (event) => {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Clear previous error messages.
    setError("");

    // Clear previous success messages.
    setMessage("");

    // Validate the User ID field.
    if (!userId.trim()) {
      // Show an error if User ID is empty.
      setError("Please enter your User ID.");

      // Stop further execution.
      return;
    }

    // Validate the phone number field.
    if (!phoneNumber.trim()) {
      // Show an error if phone number is empty.
      setError("Please enter your phone number.");

      // Stop further execution.
      return;
    }

    // Validate that the phone number contains exactly 10 digits.
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      // Show an error for an invalid phone number.
      setError("Please enter a valid 10-digit phone number.");

      // Stop further execution.
      return;
    }

    // Start the loading state.
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // Replace this mock request with your real backend API.
      // ---------------------------------------------------------

      // Example:
      // const response = await fetch("/api/auth/forgot-password/send-otp", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userId,
      //     phoneNumber,
      //   }),
      // });

      // Simulate an API request for demonstration purposes.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show a success message.
      setMessage("OTP has been sent to your registered phone number.");

      // Move the user to the OTP verification step.
      setStep(2);
    } catch (apiError) {
      // Display a generic error message if the API fails.
      setError("Unable to send OTP. Please try again.");
    } finally {
      // Stop the loading state.
      setLoading(false);
    }
  };

  // Handle OTP verification.
  const handleVerifyOtp = async (event) => {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Clear previous messages.
    setError("");
    setMessage("");

    // Validate the OTP.
    if (!/^[0-9]{6}$/.test(otp)) {
      // Display an error if the OTP is not exactly 6 digits.
      setError("Please enter a valid 6-digit OTP.");

      // Stop further execution.
      return;
    }

    // Start the loading state.
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // Replace this mock request with your real backend API.
      // ---------------------------------------------------------

      // Example:
      // const response = await fetch("/api/auth/forgot-password/verify-otp", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userId,
      //     phoneNumber,
      //     otp,
      //   }),
      // });

      // Simulate an API request.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Move the user to the password reset step.
      setStep(3);

      // Display a success message.
      setMessage("OTP verified successfully.");
    } catch (apiError) {
      // Display an error when OTP verification fails.
      setError("Invalid or expired OTP.");
    } finally {
      // Stop the loading state.
      setLoading(false);
    }
  };

  // Handle the new password submission.
  const handleResetPassword = async (event) => {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Clear previous messages.
    setError("");
    setMessage("");

    // Check whether the password is long enough.
    if (newPassword.length < 8) {
      // Display a password validation error.
      setError("Password must contain at least 8 characters.");

      // Stop further execution.
      return;
    }

    // Check whether both passwords match.
    if (newPassword !== confirmPassword) {
      // Display an error if passwords do not match.
      setError("Passwords do not match.");

      // Stop further execution.
      return;
    }

    // Start the loading state.
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // Replace this mock request with your real backend API.
      // ---------------------------------------------------------

      // Example:
      // const response = await fetch("/api/auth/forgot-password/reset", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userId,
      //     otp,
      //     newPassword,
      //   }),
      // });

      // Simulate an API request.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Display the success message.
      setMessage("Password reset successfully. You can now log in.");

      // Clear the password fields.
      setNewPassword("");

      // Clear the confirmation password field.
      setConfirmPassword("");
    } catch (apiError) {
      // Display an error if password reset fails.
      setError("Unable to reset password. Please try again.");
    } finally {
      // Stop the loading state.
      setLoading(false);
    }
  };

  // Return the forgot-password UI.
  return (
    // Main page wrapper.
    <div className="forgot-password-page">

      {/* Forgot-password card. */}
      <div className="forgot-password-card">

        {/* Application logo or brand name. */}
        <div className="brand">
          {/* Brand icon. */}
          <div className="brand-icon">🔐</div>

          {/* Brand title. */}
          <h1>Account Recovery</h1>
        </div>

        {/* Main heading. */}
        <h2>Forgot Password?</h2>

        {/* Description changes according to the current step. */}
        <p className="description">
          {step === 1 &&
            "Enter your User ID and registered phone number to continue."}

          {step === 2 &&
            "Enter the 6-digit OTP sent to your registered phone number."}

          {step === 3 &&
            "Create a new secure password for your account."}
        </p>

        {/* Step indicator. */}
        <div className="step-indicator">

          {/* First step indicator. */}
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <small>Account</small>
          </div>

          {/* Connector between step one and two. */}
          <div className={`step-line ${step >= 2 ? "active" : ""}`} />

          {/* Second step indicator. */}
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <small>Verify</small>
          </div>

          {/* Connector between step two and three. */}
          <div className={`step-line ${step >= 3 ? "active" : ""}`} />

          {/* Third step indicator. */}
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <small>Password</small>
          </div>
        </div>

        {/* Display an error message when one exists. */}
        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        {/* Display a success message when one exists. */}
        {message && (
          <div className="alert success-alert">
            {message}
          </div>
        )}

        {/* ------------------------------------------------------ */}
        {/* STEP 1 - USER ID AND PHONE NUMBER                      */}
        {/* ------------------------------------------------------ */}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>

            {/* User ID field group. */}
            <div className="form-group">

              {/* User ID label. */}
              <label htmlFor="userId">User ID</label>

              {/* User ID input. */}
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="Enter your User ID"
                autoComplete="username"
              />
            </div>

            {/* Phone number field group. */}
            <div className="form-group">

              {/* Phone number label. */}
              <label htmlFor="phoneNumber">Phone Number</label>

              {/* Phone number input. */}
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                placeholder="Enter 10-digit phone number"
                inputMode="numeric"
                autoComplete="tel"
              />
            </div>

            {/* Send OTP button. */}
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {/* Change button text while request is running. */}
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ------------------------------------------------------ */}
        {/* STEP 2 - OTP VERIFICATION                              */}
        {/* ------------------------------------------------------ */}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>

            {/* OTP field group. */}
            <div className="form-group">

              {/* OTP label. */}
              <label htmlFor="otp">Verification Code</label>

              {/* OTP input. */}
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="otp-input"
              />
            </div>

            {/* Phone number hint. */}
            <p className="otp-hint">
              OTP sent to ******{phoneNumber.slice(-4)}
            </p>

            {/* Verify OTP button. */}
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {/* Change button text while request is running. */}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Back button. */}
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                // Return to the first step.
                setStep(1);

                // Clear any previous errors.
                setError("");

                // Clear any previous messages.
                setMessage("");
              }}
            >
              Back
            </button>
          </form>
        )}

        {/* ------------------------------------------------------ */}
        {/* STEP 3 - NEW PASSWORD                                  */}
        {/* ------------------------------------------------------ */}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>

            {/* New password field group. */}
            <div className="form-group">

              {/* New password label. */}
              <label htmlFor="newPassword">New Password</label>

              {/* Password input wrapper. */}
              <div className="password-wrapper">

                {/* New password input. */}
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                {/* Password visibility button. */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {/* Display the appropriate icon. */}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password field group. */}
            <div className="form-group">

              {/* Confirm password label. */}
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              {/* Confirm password input wrapper. */}
              <div className="password-wrapper">

                {/* Confirm password input. */}
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />

                {/* Confirm password visibility button. */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label="Toggle confirmation password visibility"
                >
                  {/* Display the appropriate icon. */}
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password requirements. */}
            <div className="password-requirements">

              {/* Requirements title. */}
              <strong>Password requirements</strong>

              {/* Minimum length requirement. */}
              <span>• At least 8 characters</span>

              {/* Recommendation for uppercase characters. */}
              <span>• Include uppercase and lowercase letters</span>

              {/* Recommendation for numbers and special characters. */}
              <span>• Include a number and special character</span>
            </div>

            {/* Reset password button. */}
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {/* Change button text while request is running. */}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Login link. */}
        <div className="login-link">
          <span>Remember your password?</span>

          {/* Replace this with React Router navigation if required. */}
          <button type="button">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the component so it can be used in App.jsx.
export default ForgotPassword;