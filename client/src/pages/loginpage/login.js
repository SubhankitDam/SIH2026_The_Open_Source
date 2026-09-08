import React, { useEffect, useRef, useState } from "react";
import './login.css';


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const LoginPage = () => {
  const [mode, setMode] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [documents, setDocuments] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // -----------------------------
  // Input handlers
  // -----------------------------

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Manual document upload
  // -----------------------------

  const handleFiles = (files) => {
    const selectedFiles = Array.from(files);

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}: unsupported file type.`);
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}: file must be smaller than 10MB.`);
        return false;
      }

      return true;
    });

    const newDocuments = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      source: "upload",
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setDocuments((previous) => [...previous, ...newDocuments]);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeDocument = (id) => {
    setDocuments((previous) => {
      const documentToRemove = previous.find((doc) => doc.id === id);

      if (documentToRemove?.preview) {
        URL.revokeObjectURL(documentToRemove.preview);
      }

      return previous.filter((doc) => doc.id !== id);
    });
  };

  // -----------------------------
  // Camera / Scanner
  // -----------------------------

  const openScanner = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is not supported by this browser."
      );
      setScannerOpen(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;
      setScannerOpen(true);

      // Give React time to render video element.
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(error);

      setCameraError(
        "Unable to access your camera. Please allow camera permission and try again."
      );

      setScannerOpen(true);
    }
  };

  const closeScanner = () => {
    stopCamera();
    setScannerOpen(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureDocument = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError("Camera is not ready yet. Please try again.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `scanned-document-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        const scannedDocument = {
          id: `scan-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          source: "scanner",
          preview: URL.createObjectURL(file),
        };

        setDocuments((previous) => [
          ...previous,
          scannedDocument,
        ]);

        closeScanner();
      },
      "image/jpeg",
      0.92
    );
  };

  useEffect(() => {
    return () => {
      stopCamera();

      documents.forEach((document) => {
        if (document.preview) {
          URL.revokeObjectURL(document.preview);
        }
      });
    };
  }, []);

  // -----------------------------
  // Submit
  // -----------------------------

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    console.log("Login data:", loginData);

    // Connect this to your login API.
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Registration data:", registerData);
    console.log("Medical documents:", documents);

    // Example:
    // const formData = new FormData();
    // formData.append("firstName", registerData.firstName);
    // formData.append("lastName", registerData.lastName);
    // documents.forEach(doc => formData.append("documents", doc.file));
    //
    // Send FormData to your backend here.
  };

  return (
    <div className="auth-page">

      {/* ================================
          LEFT IMAGE SECTION
      ================================= */}

      <section className="auth-visual">

        <div className="visual-overlay"></div>

        <div className="visual-content">
          <div className="brand-mark">
            <span>+</span>
          </div>

          <p className="visual-label">
            YOUR HEALTH. OUR PRIORITY.
          </p>

          <h1>
            ArogyaAI that
            <br />
            puts you first.
          </h1>

          <p className="visual-description">
            Securely manage your healthcare journey, access
            your medical information, and stay connected with
            the care you deserve.
          </p>

          <div className="trust-badge">
            <div className="trust-icon">✓</div>

            <div>
              <strong>Secure Healthcare</strong>
              <span>
                Your information deserves to be protected.
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ================================
          RIGHT AUTH SECTION
      ================================= */}

      <section className="auth-panel">

        <div className="auth-container">

          <div className="mobile-logo">
            <div className="brand-mark">
              <span>+</span>
            </div>

            <strong>ArogyaAI</strong>
          </div>

          <div className="auth-heading">
            <span className="small-label">
              WELCOME TO ArogyaAI
            </span>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to securely access your healthcare account."
                : "Create an account to manage your healthcare information."}
            </p>
          </div>

          {/* Tabs */}

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {/* ================================
              LOGIN FORM
          ================================= */}

          {mode === "login" && (
            <form
              className="auth-form"
              onSubmit={handleLoginSubmit}
            >

              <div className="form-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <label className="checkbox-row">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <button className="submit-button" type="submit">
                Sign In
                <span>→</span>
              </button>

              <div className="form-footer">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => setMode("register")}
                >
                  Create one
                </button>
              </div>

            </form>
          )}

          {/* ================================
              REGISTRATION FORM
          ================================= */}

          {mode === "register" && (
            <form
              className="auth-form register-form"
              onSubmit={handleRegisterSubmit}
            >

              <div className="two-columns">

                <div className="form-field">
                  <label htmlFor="firstName">
                    First name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">
                    Last name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

              </div>

              <div className="two-columns">

                <div className="form-field">
                  <label htmlFor="register-email">
                    Email address
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 555 000 0000"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

              </div>

              <div className="two-columns">

                <div className="form-field">
                  <label htmlFor="register-password">
                    Password
                  </label>

                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

              </div>

              {/* DOCUMENT UPLOAD */}

              <div className="documents-section">

                <div className="documents-header">
                  <div>
                    <h3>Medical documents</h3>

                    <p>
                      Upload previous reports or prescriptions.
                    </p>
                  </div>

                  <span className="optional">
                    Optional
                  </span>
                </div>

                <div className="upload-options">

                  {/* Manual upload */}

                  <label className="upload-card">

                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileInput}
                    />

                    <div className="upload-icon">
                      ↑
                    </div>

                    <div>
                      <strong>
                        Upload documents
                      </strong>

                      <span>
                        PDF, JPG, PNG up to 10MB
                      </span>
                    </div>

                  </label>

                  {/* Scanner */}

                  <button
                    type="button"
                    className="scanner-card"
                    onClick={openScanner}
                  >
                    <div className="scanner-icon">
                      ▣
                    </div>

                    <div>
                      <strong>
                        Scan document
                      </strong>

                      <span>
                        Use your camera
                      </span>
                    </div>
                  </button>

                </div>

                {/* Uploaded documents */}

                {documents.length > 0 && (
                  <div className="document-list">

                    {documents.map((document) => (
                      <div
                        className="document-item"
                        key={document.id}
                      >

                        <div className="document-preview">

                          {document.preview ? (
                            <img
                              src={document.preview}
                              alt=""
                            />
                          ) : (
                            <span>PDF</span>
                          )}

                        </div>

                        <div className="document-info">
                          <strong>
                            {document.name}
                          </strong>

                          <span>
                            {document.source === "scanner"
                              ? "Scanned document"
                              : "Uploaded document"}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="remove-document"
                          onClick={() =>
                            removeDocument(document.id)
                          }
                          aria-label={`Remove ${document.name}`}
                        >
                          ×
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              <label className="terms-row">

                <input type="checkbox" required />

                <span>
                  I agree to the{" "}
                  <a href="#terms">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#privacy">Privacy Policy</a>.
                </span>

              </label>

              <button
                type="submit"
                className="submit-button"
              >
                Create Account
                <span>→</span>
              </button>

              <div className="form-footer">
                Already have an account?

                <button
                  type="button"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </div>

            </form>
          )}

        </div>

      </section>

      {/* ================================
          SCANNER MODAL
      ================================= */}

      {scannerOpen && (
        <div className="scanner-modal">

          <div className="scanner-dialog">

            <div className="scanner-header">
              <div>
                <span className="small-label">
                  DOCUMENT SCANNER
                </span>

                <h3>Scan your document</h3>
              </div>

              <button
                type="button"
                onClick={closeScanner}
                className="close-scanner"
              >
                ×
              </button>
            </div>

            {cameraError ? (
              <div className="camera-error">
                <div>!</div>
                <p>{cameraError}</p>

                <button
                  type="button"
                  onClick={closeScanner}
                  className="secondary-action"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="camera-container">

                  <video
                    ref={videoRef}
                    playsInline
                    muted
                  />

                  <div className="scan-frame">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <p>
                    Position the document inside the frame
                  </p>

                </div>

                <canvas
                  ref={canvasRef}
                  className="hidden-canvas"
                />

                <div className="scanner-actions">

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={closeScanner}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="capture-button"
                    onClick={captureDocument}
                  >
                    <span className="capture-icon"></span>
                    Capture
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default LoginPage;