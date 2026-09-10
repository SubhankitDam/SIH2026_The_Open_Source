import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// React: the library itself.
// useEffect: run side effects (things outside React, like the camera or cleanup) when the component mounts/unmounts.
// useRef: keep a mutable value (like a DOM element or a timer ID) that persists across renders WITHOUT causing a re-render when it changes.
// useState: keep a piece of data ("state") that DOES cause a re-render when it changes.

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — the largest a single uploaded document is allowed to be, in bytes (10 * 1024 * 1024 = 10,485,760 bytes).

const allowedTypes = [ // whitelist of MIME types the file-upload input will accept.
    "application/pdf",  // PDF documents
    "image/jpeg",        // JPG/JPEG images
    "image/png",          // PNG images
    "image/webp",          // WebP images
]; // any file whose "type" is not in this array gets rejected by handleFiles().

const LoginPage = () => { // the main component — everything below runs every time this component renders.

    const navigate = useNavigate ()
    const [mode, setMode] = useState("login");
    // mode: which form is currently visible — either "login" or "register".
    // setMode: the function used to change it (e.g. when the user clicks a tab).

    const [loginData, setLoginData] = useState({ // holds the current values of the login form
        loginId: "", // stores the 9-digit login ID entered by the user
        phone: "", // stores the registered phone number entered by the user (used together with loginId for 2FA lookup)
    });

    const [registerData, setRegisterData] = useState({ // holds all the current values of the registration form, one key per input.
        firstName: "",       // registrant's first name
        lastName: "",         // registrant's last name
        email: "",              // registrant's email address
        phone: "",               // registrant's phone number
        password: "",             // chosen password
        confirmPassword: "",       // re-typed password, used to confirm it matches
    });

    const [documents, setDocuments] = useState([]);
    // documents: an array of uploaded/scanned document objects (see handleFiles / captureDocument for their shape).
    // Starts empty; grows as the user uploads files or scans documents during registration.

    const [scannerOpen, setScannerOpen] = useState(false);
    // scannerOpen: whether the camera/scanner modal is currently shown on screen.

    const [cameraError, setCameraError] = useState("");
    // cameraError: holds a human-readable error message if the camera can't be accessed; empty string means "no error".

    const [notification, setNotification] = useState(null); // { type: "success" | "error", message: string } | null
    // notification: the toast currently being shown (or null if none). Read by the JSX near the top of the return().

    const videoRef = useRef(null);
    // videoRef: a reference to the <video> DOM element used to show the live camera feed in the scanner modal.

    const canvasRef = useRef(null);
    // canvasRef: a reference to the hidden <canvas> DOM element used to "grab" a still frame from the video for capture.

    const streamRef = useRef(null);
    // streamRef: holds the active MediaStream object (the raw camera feed) so it can be stopped later (stopCamera()).

    const notificationTimeoutRef = useRef(null);
    // notificationTimeoutRef: holds the setTimeout ID for the currently-scheduled auto-dismiss of the toast,
    // so a new notification can cancel/replace any previous pending dismissal.

    // -----------------------------
    // Notifications
    // -----------------------------

    const showNotification = (type, message) => { // call this anywhere to pop up a toast, e.g. showNotification("success", "Done!")
        if (notificationTimeoutRef.current) { // if a previous toast's auto-dismiss timer is still pending...
            clearTimeout(notificationTimeoutRef.current); // ...cancel it so it doesn't hide the NEW toast early.
        }

        setNotification({ type, message }); // store the new toast in state, which makes React render it.

        notificationTimeoutRef.current = setTimeout(() => { // schedule the toast to disappear automatically...
            setNotification(null); // ...by clearing the notification state...
        }, 4000); // ...after 4000ms (4 seconds).
    };

    const dismissNotification = () => { // called when the user clicks the toast's "×" close button.
        if (notificationTimeoutRef.current) { // if there's a pending auto-dismiss timer...
            clearTimeout(notificationTimeoutRef.current); // ...cancel it (no need to fire later, we're dismissing now).
        }

        setNotification(null); // hide the toast immediately.
    };

    // -----------------------------
    // Input handlers
    // -----------------------------

    const handleLoginChange = (e) => { // fires on every keystroke in the login form (identifier or password field)
        setLoginData({ // update the loginData state
            ...loginData, // keep all existing field values unchanged
            [e.target.name]: e.target.value, // overwrite only the field that changed, using the input's "name" attribute (identifier or password)
        });
    };

    const handleRegisterChange = (e) => { // fires on every keystroke/change in ANY registration field (name, email, phone, passwords).
        setRegisterData({ // update the registerData state
            ...registerData, // spread: copy every existing field so they aren't lost
            [e.target.name]: e.target.value, // computed property name: only the field matching this input's "name" attribute gets the new value
        });
    };

    // -----------------------------
    // Manual document upload
    // -----------------------------

    const handleFiles = (files) => { // files: a FileList (from an <input type="file"> or drag-and-drop) — receives whatever the user picked.
        const selectedFiles = Array.from(files); // convert the array-like FileList into a real Array so we can use .filter/.map on it.

        const validFiles = selectedFiles.filter((file) => { // keep only files that pass both checks below.
            if (!allowedTypes.includes(file.type)) { // reject if the file's MIME type isn't PDF/JPEG/PNG/WebP.
                alert(`${file.name}: unsupported file type.`); // tell the user which file failed and why.
                return false; // exclude this file from validFiles.
            }

            if (file.size > MAX_FILE_SIZE) { // reject if the file is bigger than the 10MB limit.
                alert(`${file.name}: file must be smaller than 10MB.`); // tell the user which file failed and why.
                return false; // exclude this file from validFiles.
            }

            return true; // file passed both checks — keep it.
        });

        const newDocuments = validFiles.map((file) => ({ // turn each raw File into our own "document" object shape for display/state.
            id: `${file.name}-${file.lastModified}-${Math.random()}`, // a (probably) unique ID combining name, last-modified time, and a random number.
            name: file.name, // original filename, shown in the UI.
            size: file.size, // file size in bytes (not currently displayed, but available).
            type: file.type, // MIME type, e.g. "image/png" or "application/pdf".
            file, // the actual File object itself, kept so it can be sent to the backend later (e.g. via FormData).
            source: "upload", // marks this document as coming from manual upload (vs. "scanner").
            preview: file.type.startsWith("image/") // only images get a visual preview...
                ? URL.createObjectURL(file) // ...create a temporary local URL pointing at the file's bytes, used as an <img src>.
                : null, // PDFs (or anything non-image) get no preview thumbnail.
        }));

        setDocuments((previous) => [...previous, ...newDocuments]); // append the newly validated documents to whatever was already in state.
    };

    const handleFileInput = (e) => { // the onChange handler wired directly to the <input type="file"> element.
        handleFiles(e.target.files); // hand off the FileList to the shared validation/processing logic above.
        e.target.value = ""; // reset the input's value so selecting the SAME file again still fires onChange next time.
    };

    const removeDocument = (id) => { // called when the user clicks the "×" on a document in the list, passing that document's id.
        setDocuments((previous) => { // use the functional form of setState so we always work off the latest documents array.
            const documentToRemove = previous.find((doc) => doc.id === id); // find the document object matching this id.

            if (documentToRemove?.preview) { // if it has a preview URL (i.e. it was an image)...
                URL.revokeObjectURL(documentToRemove.preview); // ...free the browser memory that URL was holding, since it's no longer needed.
            }

            return previous.filter((doc) => doc.id !== id); // return a new array with that document removed.
        });
    };

    // -----------------------------
    // Camera / Scanner
    // -----------------------------

    const openScanner = async () => { // called when the user clicks the "Scan document" card; async because getUserMedia() is a Promise-based API.
        setCameraError(""); // clear any previous camera error before trying again.

        if (!navigator.mediaDevices?.getUserMedia) { // feature-detect: does this browser even support camera access?
            setCameraError( // if not, set a friendly error message...
                "Camera access is not supported by this browser."
            );
            setScannerOpen(true); // ...and still open the modal so the error message is visible to the user.
            return; // stop here — no point trying to access a camera that doesn't exist.
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ // ask the browser/user for permission to use the camera.
                video: { // we want video (not audio).
                    facingMode: { // prefer a specific camera direction...
                        ideal: "environment", // ...specifically the rear/back camera (better for scanning documents), but not a hard requirement.
                    },
                },
                audio: false, // we don't need the microphone at all.
            });

            streamRef.current = stream; // save the live stream so it can be stopped later.
            setScannerOpen(true); // show the scanner modal now that we have camera access.

            // Give React time to render video element.
            setTimeout(() => { // wait briefly so React has actually painted the <video> element (it didn't exist until setScannerOpen above).
                if (videoRef.current) { // make sure the video element exists (it should, after the render).
                    videoRef.current.srcObject = stream; // attach the live camera stream to the <video> element so it displays.
                    videoRef.current.play(); // start playback (some browsers need this called explicitly).
                }
            }, 100); // 100ms delay — a small buffer for the render/DOM update to complete.
        } catch (error) { // getUserMedia() rejects if the user denies permission, no camera exists, etc.
            console.error(error); // log the raw error for developers/debugging.

            setCameraError( // show a user-friendly message instead of the raw technical error.
                "Unable to access your camera. Please allow camera permission and try again."
            );

            setScannerOpen(true); // still open the modal so the error message (handled in the JSX) is visible.
        }
    };

    const closeScanner = () => { // called when the user cancels/closes the scanner modal.
        stopCamera(); // release the camera hardware and stream.
        setScannerOpen(false); // hide the modal.
    };

    const stopCamera = () => { // shared cleanup logic for turning off the camera completely.
        if (streamRef.current) { // only do work if there's actually an active stream.
            streamRef.current.getTracks().forEach((track) => { // a MediaStream can have multiple tracks (video, audio)...
                track.stop(); // ...stop each one, which turns off the camera's "in use" indicator.
            });

            streamRef.current = null; // clear the ref now that the stream is no longer valid/usable.
        }

        if (videoRef.current) { // if the <video> element currently exists...
            videoRef.current.srcObject = null; // ...detach the stream from it so it stops showing the last frame.
        }
    };

    const captureDocument = () => { // called when the user clicks "Capture" while the camera preview is showing.
        const video = videoRef.current; // grab the live <video> DOM element.
        const canvas = canvasRef.current; // grab the hidden <canvas> DOM element used to render a still frame.

        if (!video || !canvas) return; // safety check — bail out if either element isn't mounted yet.

        const width = video.videoWidth; // the camera feed's actual pixel width (not the CSS display size).
        const height = video.videoHeight; // the camera feed's actual pixel height.

        if (!width || !height) { // videoWidth/videoHeight are 0 until the stream has actually started producing frames.
            setCameraError("Camera is not ready yet. Please try again."); // tell the user to wait a moment and retry.
            return; // stop — nothing to capture yet.
        }

        canvas.width = width; // resize the canvas to match the camera's real resolution...
        canvas.height = height; // ...so the captured image isn't stretched or cropped.

        const context = canvas.getContext("2d"); // get the 2D drawing API for this canvas.

        context.drawImage(video, 0, 0, width, height); // draw the CURRENT video frame onto the canvas, effectively taking a "screenshot".

        canvas.toBlob( // convert the canvas's pixel data into an actual image file (Blob), asynchronously via callback.
            (blob) => { // this callback runs once the Blob is ready.
                if (!blob) return; // safety check — bail if conversion somehow failed.

                const file = new File( // wrap the Blob in a File object so it behaves just like a manually-uploaded file.
                    [blob], // the file's binary content.
                    `scanned-document-${Date.now()}.jpg`, // give it a unique-ish filename using the current timestamp.
                    {
                        type: "image/jpeg", // mark its MIME type as JPEG.
                    }
                );

                const scannedDocument = { // build the same "document" shape used for manual uploads, so both can be displayed identically.
                    id: `scan-${Date.now()}`, // unique ID based on the capture timestamp.
                    name: file.name, // the generated filename.
                    size: file.size, // size of the captured image in bytes.
                    type: file.type, // "image/jpeg".
                    file, // the actual File object, for later upload to the backend.
                    source: "scanner", // marks this as coming from the camera (vs. "upload"), used to label it differently in the UI.
                    preview: URL.createObjectURL(file), // create a local preview URL so the thumbnail can be shown immediately.
                };

                setDocuments((previous) => [ // add the newly captured document to the existing list.
                    ...previous, // keep everything already there...
                    scannedDocument, // ...and append the new one.
                ]);

                closeScanner(); // automatically close the scanner modal after a successful capture.
            },
            "image/jpeg", // tell toBlob() to encode the output as a JPEG...
            0.92 // ...at 92% quality (a balance between file size and image sharpness).
        );
    };

    useEffect(() => { // runs once when the component mounts (empty dependency array [] below), and its return value runs on UNmount.
        return () => { // this is the CLEANUP function — React calls it when the component is removed from the page.
            stopCamera(); // make sure the camera is released if the user navigates away while it's on.

            if (notificationTimeoutRef.current) { // if a toast auto-dismiss timer is still pending...
                clearTimeout(notificationTimeoutRef.current); // ...cancel it so it doesn't try to update state after unmount.
            }

            documents.forEach((document) => { // loop over every document currently in state...
                if (document.preview) { // ...and for any that have a preview URL (created with URL.createObjectURL)...
                    URL.revokeObjectURL(document.preview); // ...free that browser memory to avoid leaking it.
                }
            });
        };
    }, []); // empty array = this effect's setup runs only once (on mount); cleanup runs only once (on unmount).

    // -----------------------------
    // Submit
    // -----------------------------

    // MOCK MODE — for demoing without a live backend.
    // Maps the login ID's 3-digit role prefix (matches the real users.login_id
    // format we designed: 101=patient, 102=doctor, 103=nurse, 104=admin) to a
    // dashboard route. Set to false once /api/v1/auth/login is actually wired up.
    const MOCK_MODE = true;

    const ROLE_PREFIX_TO_ROUTE = {
        "101": "/patient/dashboard",
        "102": "/doctor/dashboard",
        "103": "/nurse/dashboard",
        "104": "/admin/dashboard", // not built yet, included for completeness
    };

    const handleLoginSubmit = async (e) => { // fires when the login form is submitted; async so we can eventually "await" a real API call.
        e.preventDefault(); // stop the browser from doing a full page reload/navigation on form submit.

        const loginPayload = { // build the object that will be sent to the login API — matches POST /api/v1/auth/login's expected body.
            loginId: loginData.loginId.trim(), // the 9-digit login ID the user typed.
            phone: loginData.phone.trim(), // the registered phone number the user typed.
        };

        try { // wrap the (future) API call so any failure can be caught and shown as an error toast.

            if (MOCK_MODE) {
                // ---- Fake the login entirely, no backend involved ----
                const prefix = loginPayload.loginId.slice(0, 3); // first 3 digits = role prefix
                const route = ROLE_PREFIX_TO_ROUTE[prefix];

                if (!loginPayload.loginId || loginPayload.loginId.length !== 9 || !route) {
                    throw new Error("Enter a valid 9-digit login ID (e.g. 101482913 for a patient demo).");
                }

                showNotification("success", "Login successful! Redirecting...");
                setTimeout(() => navigate(route), 800); // small delay so the toast is visible before navigating
                return;
            }

            // ---- Real backend call (enable once /api/v1/auth/login is ready) ----
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginPayload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message || "Invalid credentials. Please try again.");
            }

            const { token, role } = await response.json();
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            showNotification("success", "Login successful! Redirecting...");
            navigate(`/${role}/dashboard`);
        } catch (error) { // this block runs if the (future) fetch call above throws.
            showNotification( // show a red error toast instead.
                "error",
                error.message || "Login failed. Please check your details and try again." // use the thrown error's message, or a generic fallback.
            );
        }
    };

    const handleRegisterSubmit = async (e) => { // fires when the registration form is submitted.
        e.preventDefault(); // stop the default full-page-reload form submission behavior.

        if ( // check whether the two password fields match before doing anything else.
            registerData.password !==
            registerData.confirmPassword
        ) {
            showNotification("error", "Passwords do not match."); // show a red error toast...
            return; // ...and stop the submission entirely — don't proceed to "register" the user.
        }

        try { // wrap the (future) API call so failures surface as an error toast.
            console.log("Registration data:", registerData); // placeholder: logs the form fields for debugging.
            console.log("Medical documents:", documents); // placeholder: logs the uploaded/scanned documents for debugging.

            // Example:
            // const formData = new FormData();
            // formData.append("firstName", registerData.firstName);
            // formData.append("lastName", registerData.lastName);
            // documents.forEach(doc => formData.append("documents", doc.file));
            //
            // const response = await fetch("/api/auth/register", {
            //     method: "POST",
            //     body: formData,
            // });
            //
            // if (!response.ok) {
            //     const errorBody = await response.json().catch(() => null);
            //     throw new Error(errorBody?.message || "Registration failed. Please try again.");
            // }

            showNotification("success", "Account created successfully!"); // green success toast (currently always runs — no real API call yet).
        } catch (error) { // runs if the (future) fetch call above throws.
            showNotification( // show a red error toast.
                "error",
                error.message || "Registration failed. Please try again." // thrown error's message, or a generic fallback.
            );
        }
    };

    return ( // everything below is JSX — it describes the UI that gets rendered to the page.

        <div className="auth-page"> {/* outermost wrapper for the whole login/register screen */}

            <style>{` /* an inline <style> tag so the toast has working CSS even without a separate stylesheet file */
                .app-notification {
                    position: fixed; /* stays in place on screen even if the page scrolls */
                    top: 20px; /* 20px from the top of the viewport */
                    right: 20px; /* 20px from the right of the viewport */
                    z-index: 1000; /* sit above almost everything else on the page */
                    display: flex; /* lay out icon/message/close button in a row */
                    align-items: center; /* vertically center them */
                    gap: 10px; /* space between icon, message, and close button */
                    padding: 14px 16px; /* inner spacing of the toast box */
                    border-radius: 10px; /* rounded corners */
                    max-width: 360px; /* don't let the toast grow too wide */
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* soft drop shadow for a "floating" look */
                    font-size: 14px; /* toast text size */
                    animation: app-notification-in 0.2s ease-out; /* play the slide/fade-in animation when it appears */
                }

                .app-notification.success { /* extra styling applied only when type === "success" */
                    background: #ecfdf3; /* light green background */
                    border: 1px solid #a6f4c5; /* green border */
                    color: #05603a; /* dark green text */
                }

                .app-notification.error { /* extra styling applied only when type === "error" */
                    background: #fef3f2; /* light red background */
                    border: 1px solid #fecdca; /* red border */
                    color: #912018; /* dark red text */
                }

                .app-notification .notification-icon { /* the circular ✓ / ! badge */
                    display: inline-flex; /* flex so the symbol inside can be centered */
                    align-items: center; /* vertical centering */
                    justify-content: center; /* horizontal centering */
                    width: 20px; /* fixed circle size */
                    height: 20px;
                    border-radius: 50%; /* makes it a circle */
                    font-weight: bold; /* bold ✓ / ! symbol */
                    flex-shrink: 0; /* never let it shrink to make room for the message text */
                }

                .app-notification.success .notification-icon { /* circle colors for the success variant */
                    background: #a6f4c5;
                    color: #05603a;
                }

                .app-notification.error .notification-icon { /* circle colors for the error variant */
                    background: #fecdca;
                    color: #912018;
                }

                .app-notification .notification-message { /* the actual text of the toast */
                    flex: 1; /* take up remaining horizontal space, pushing the close button to the right */
                }

                .app-notification .notification-close { /* the "×" dismiss button */
                    background: none; /* no button background */
                    border: none; /* no button border */
                    cursor: pointer; /* show a hand cursor on hover */
                    font-size: 18px; /* size of the × symbol */
                    line-height: 1; /* tighten vertical spacing */
                    color: inherit; /* match the toast's text color (green or red) */
                    opacity: 0.6; /* slightly faded by default */
                    padding: 0; /* no extra button padding */
                }

                .app-notification .notification-close:hover { /* on hover... */
                    opacity: 1; /* ...become fully opaque, hinting it's clickable */
                }

                @keyframes app-notification-in { /* defines the "slide down + fade in" animation used above */
                    from {
                        opacity: 0; /* start invisible */
                        transform: translateY(-8px); /* start slightly above its final position */
                    }
                    to {
                        opacity: 1; /* end fully visible */
                        transform: translateY(0); /* end at its normal position */
                    }
                }
            `}</style>

            {/* ================================
          NOTIFICATION TOAST
      ================================= */}

            {notification && ( // only render the toast markup at all if "notification" is not null.
                <div
                    className={`app-notification ${notification.type}`} // combines the base class with "success" or "error" for styling.
                    role="status" // accessibility: tells assistive tech this is a status message.
                    aria-live="polite" // accessibility: announces the toast to screen readers without interrupting the user.
                >
                    <span className="notification-icon"> {/* the circular badge */}
                        {notification.type === "success" ? "✓" : "!"} {/* checkmark for success, exclamation for error */}
                    </span>

                    <span className="notification-message"> {/* the toast's text content */}
                        {notification.message} {/* whatever message string was passed to showNotification() */}
                    </span>

                    <button
                        type="button" // prevents this button from accidentally submitting any surrounding <form>.
                        className="notification-close"
                        onClick={dismissNotification} // clicking it hides the toast immediately.
                        aria-label="Dismiss notification" // accessible label since the visible content is just "×".
                    >
                        × {/* the visual close icon */}
                    </button>
                </div>
            )}

            {/* ================================
          LEFT IMAGE SECTION
      ================================= */}

            <section className="auth-visual"> {/* the decorative left-hand marketing panel */}

                <div className="visual-overlay"></div> {/* a color/gradient overlay drawn on top of the background image, for readability */}

                <div className="visual-content"> {/* holds the logo, headline, and description text over the overlay */}
                    <div className="brand-mark"> {/* small logo badge */}
                        <span>+</span> {/* the "+" symbol used as a simple healthcare-style logo */}
                    </div>

                    <p className="visual-label"> {/* small eyebrow/kicker text above the headline */}
                        YOUR HEALTH. OUR PRIORITY.
                    </p>

                    <h1> {/* main marketing headline */}
                        ArogyaAI that
                        <br /> {/* forces a line break inside the heading */}
                        puts you first.
                    </h1>

                    <p className="visual-description"> {/* supporting paragraph under the headline */}
                        Securely manage your healthcare journey, access
                        your medical information, and stay connected with
                        the care you deserve.
                    </p>

                    <div className="trust-badge"> {/* small "trust" callout box */}
                        <div className="trust-icon">✓</div> {/* checkmark icon */}

                        <div>
                            <strong>Secure Healthcare</strong> {/* bold heading of the trust badge */}
                            <span>
                                Your information deserves to be protected. {/* supporting text of the trust badge */}
                            </span>
                        </div>
                    </div>
                </div>

            </section>

            {/* ================================
          RIGHT AUTH SECTION
      ================================= */}

            <section className="auth-panel"> {/* the right-hand panel containing the actual login/register forms */}

                <div className="auth-container"> {/* inner width-constrained wrapper for the form content */}

                    <div className="mobile-logo"> {/* logo shown only on small/mobile screens (via CSS), since the left panel is likely hidden there */}
                        <div className="brand-mark">
                            <span>+</span>
                        </div>

                        <strong>ArogyaAI</strong> {/* brand name text next to the mobile logo */}
                    </div>

                    <div className="auth-heading"> {/* the heading block above the tabs/forms */}
                        <span className="small-label">
                            WELCOME TO ArogyaAI {/* small eyebrow text */}
                        </span>

                        <h2>
                            {mode === "login" // conditional (ternary) text: changes the heading based on which form is active.
                                ? "Welcome back"
                                : "Create your account"}
                        </h2>

                        <p>
                            {mode === "login" // conditional subtext, same idea as above.
                                ? "Sign in to securely access your healthcare account."
                                : "Create an account to manage your healthcare information."}
                        </p>
                    </div>

                    {/* Tabs */}

                    <div className="auth-tabs"> {/* the Login / Register tab switcher */}
                        <button
                            type="button" // not a submit button — just toggles UI state.
                            className={mode === "login" ? "active" : ""} // highlights this tab when it's the current mode.
                            onClick={() => setMode("login")} // switch to the login form when clicked.
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={mode === "register" ? "active" : ""} // highlights this tab when it's the current mode.
                            onClick={() => setMode("register")} // switch to the register form when clicked.
                        >
                            Register
                        </button>
                    </div>

                    {/* ================================
              LOGIN FORM
          ================================= */}

                    {mode === "login" && ( // only render this <form> block when mode is "login".
                        <form
                            className="auth-form"
                            onSubmit={handleLoginSubmit} // calls our submit handler instead of doing a normal page-reload submit.
                        >

                            <div className="form-field"> {/* wrapper for the login ID input */}
                                <label htmlFor="login-id"> {/* label linked to the input below via htmlFor/id */}
                                    Login ID
                                </label>

                                <input
                                    id="login-id" // matches the label's htmlFor so clicking the label focuses this input
                                    type="text" // text, not number, so a leading digit is never accidentally stripped
                                    inputMode="numeric" // hints mobile devices to show a numeric keypad
                                    pattern="[0-9]{9}" // 9-digit numeric login ID, matches the users.login_id format
                                    maxLength={9}
                                    name="loginId" // must match the loginData key so handleLoginChange updates the right field
                                    placeholder="Enter your 9-digit Login ID" // reflects the actual login_id format
                                    value={loginData.loginId} // controlled input bound to loginData.loginId
                                    onChange={handleLoginChange} // updates loginData.loginId on every keystroke
                                    required // form cannot be submitted while this field is empty
                                />
                            </div>

                            <div className="form-field"> {/* wrapper for the phone number field */}
                                <div className="field-header"> {/* row containing the label + "forgot login ID" link, side by side */}
                                    <label htmlFor="login-phone">
                                        Phone Number
                                    </label>

                                    <button
                                        onClick={() => navigate('/forgot')}
                                        type="button" // not a submit button — presumably opens a "forgot login ID" flow (not implemented here).
                                        className="forgot-password"
                                    >
                                        Forgot login ID?
                                    </button>
                                </div>

                                <input
                                    id="login-phone" // matches the label's htmlFor
                                    type="tel" // appropriate input type for a phone number
                                    name="phone" // matches the loginData key
                                    placeholder="Enter your registered phone number"
                                    value={loginData.phone} // controlled input bound to loginData.phone
                                    onChange={handleLoginChange} // updates loginData.phone on every keystroke
                                    required // must be filled in before submitting
                                />
                            </div>

                            <p className="otp-hint"> {/* reuses the existing .otp-hint style from App.css for a small informational note */}
                                We'll verify this is really you — OTP-based verification is coming soon.
                            </p>

                            <button className="submit-button" type="submit"> {/* the actual login submit button */}
                                Sign In
                                <span>→</span> {/* decorative arrow icon */}
                            </button>

                            <div className="form-footer"> {/* small text below the form linking to the register form */}
                                Don't have an account?
                                <button
                                    type="button" // just switches UI mode, doesn't submit anything.
                                    onClick={() => setMode("register")} // switch to the registration form.
                                >
                                    Create one
                                </button>
                            </div>

                        </form>
                    )}

                    {/* ================================
              REGISTRATION FORM
          ================================= */}

                    {mode === "register" && ( // only render this <form> block when mode is "register".
                        <form
                            className="auth-form register-form"
                            onSubmit={handleRegisterSubmit} // calls our register submit handler.
                        >

                            <div className="two-columns"> {/* lays first/last name inputs side-by-side */}

                                <div className="form-field">
                                    <label htmlFor="firstName">
                                        First name
                                    </label>

                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName" // matches registerData.firstName
                                        placeholder="John"
                                        value={registerData.firstName} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.firstName
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
                                        name="lastName" // matches registerData.lastName
                                        placeholder="Doe"
                                        value={registerData.lastName} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.lastName
                                        required
                                    />
                                </div>

                            </div>

                            <div className="two-columns"> {/* lays email + phone inputs side-by-side */}

                                <div className="form-field">
                                    <label htmlFor="register-email">
                                        Email address
                                    </label>

                                    <input
                                        id="register-email"
                                        type="email" // gives basic built-in email format validation/keyboard on mobile.
                                        name="email" // matches registerData.email
                                        placeholder="you@example.com"
                                        value={registerData.email} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.email
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="phone">
                                        Phone number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel" // hints a numeric/phone keyboard on mobile devices.
                                        name="phone" // matches registerData.phone
                                        placeholder="+1 555 000 0000"
                                        value={registerData.phone} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.phone
                                        required
                                    />
                                </div>

                            </div>

                            <div className="two-columns"> {/* lays password + confirm-password inputs side-by-side */}

                                <div className="form-field">
                                    <label htmlFor="register-password">
                                        Password
                                    </label>

                                    <input
                                        id="register-password"
                                        type="password" // masks input
                                        name="password" // matches registerData.password
                                        placeholder="Create password"
                                        value={registerData.password} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.password
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="confirmPassword">
                                        Confirm password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password" // masks input
                                        name="confirmPassword" // matches registerData.confirmPassword
                                        placeholder="Repeat password"
                                        value={registerData.confirmPassword} // controlled input
                                        onChange={handleRegisterChange} // updates registerData.confirmPassword
                                        required
                                    />
                                </div>

                            </div>

                            {/* DOCUMENT UPLOAD */}

                            <div className="documents-section"> {/* the whole "medical documents" upload area */}

                                <div className="documents-header"> {/* title + "Optional" badge, side by side */}
                                    <div>
                                        <h3>Medical documents</h3>

                                        <p>
                                            Upload previous reports or prescriptions.
                                        </p>
                                    </div>

                                    <span className="optional">
                                        Optional {/* indicates this section isn't required to register */}
                                    </span>
                                </div>

                                <div className="upload-options"> {/* the two side-by-side cards: manual upload vs. camera scan */}

                                    {/* Manual upload */}

                                    <label className="upload-card"> {/* clicking anywhere on this label opens the file picker, because it wraps the file input */}

                                        <input
                                            type="file" // native file picker
                                            multiple // allow selecting more than one file at once
                                            accept=".pdf,.jpg,.jpeg,.png,.webp" // hints the OS file picker to only show these types (UI-level only, not a hard restriction).
                                            onChange={handleFileInput} // runs validation + adds the files to state.
                                        />

                                        <div className="upload-icon">
                                            ↑ {/* up-arrow icon suggesting "upload" */}
                                        </div>

                                        <div>
                                            <strong>
                                                Upload documents
                                            </strong>

                                            <span>
                                                PDF, JPG, PNG up to 10MB {/* tells the user the accepted formats/size limit */}
                                            </span>
                                        </div>

                                    </label>

                                    {/* Scanner */}

                                    <button
                                        type="button" // doesn't submit the form — just opens the camera modal.
                                        className="scanner-card"
                                        onClick={openScanner} // requests camera access and opens the scanner modal.
                                    >
                                        <div className="scanner-icon">
                                            ▣ {/* icon suggesting a scanner/viewfinder */}
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

                                {documents.length > 0 && ( // only render the list if at least one document has been added.
                                    <div className="document-list">

                                        {documents.map((document) => ( // render one row per document in state.
                                            <div
                                                className="document-item"
                                                key={document.id} // React needs a stable, unique "key" for each item in a list.
                                            >

                                                <div className="document-preview"> {/* thumbnail area */}

                                                    {document.preview ? ( // if there's a preview URL (i.e. it's an image)...
                                                        <img
                                                            src={document.preview} // ...show the actual image thumbnail.
                                                            alt="" // empty alt because the filename text next to it already describes it (decorative image).
                                                        />
                                                    ) : ( // otherwise (e.g. a PDF, which has no image preview)...
                                                        <span>PDF</span> // ...just show a "PDF" text label instead.
                                                    )}

                                                </div>

                                                <div className="document-info"> {/* filename + source label */}
                                                    <strong>
                                                        {document.name} {/* the document's filename */}
                                                    </strong>

                                                    <span>
                                                        {document.source === "scanner" // shows a different caption depending on how it was added.
                                                            ? "Scanned document"
                                                            : "Uploaded document"}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button" // doesn't submit the form — just removes this one document.
                                                    className="remove-document"
                                                    onClick={() =>
                                                        removeDocument(document.id) // removes this specific document by its id.
                                                    }
                                                    aria-label={`Remove ${document.name}`} // accessible label describing exactly what this × button does.
                                                >
                                                    ×
                                                </button>

                                            </div>
                                        ))}

                                    </div>
                                )}

                            </div>

                            <label className="terms-row"> {/* terms-of-service checkbox + its label text, wrapped together */}

                                <input type="checkbox" required /> {/* must be checked before the form can submit (native HTML validation) */}

                                <span>
                                    I agree to the{" "} {/* {" "} inserts an explicit space that JSX would otherwise collapse */}
                                    <a href="#terms">Terms of Service</a>{" "}
                                    and{" "}
                                    <a href="#privacy">Privacy Policy</a>.
                                </span>

                            </label>

                            <button
                                type="submit" // this one DOES submit the form, triggering handleRegisterSubmit.
                                className="submit-button"
                            >
                                Create Account
                                <span>→</span> {/* decorative arrow icon */}
                            </button>

                            <div className="form-footer"> {/* small text linking back to the login form */}
                                Already have an account?

                                <button
                                    type="button" // just switches UI mode, doesn't submit anything.
                                    onClick={() => setMode("login")} // switch back to the login form.
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

            {scannerOpen && ( // only render the camera modal at all while scannerOpen is true.
                <div className="scanner-modal"> {/* full-screen dark overlay behind the modal */}

                    <div className="scanner-dialog"> {/* the actual modal box */}

                        <div className="scanner-header"> {/* title + close button row */}
                            <div>
                                <span className="small-label">
                                    DOCUMENT SCANNER
                                </span>

                                <h3>Scan your document</h3>
                            </div>

                            <button
                                type="button"
                                onClick={closeScanner} // stops the camera and hides the modal.
                                className="close-scanner"
                            >
                                {/* intentionally empty — likely styled with a CSS/background-image "×" icon */}
                            </button>
                        </div>

                        {cameraError ? ( // if there was a problem accessing the camera...
                            <div className="camera-error"> {/* ...show an error state instead of the live camera view. */}
                                <div>!</div> {/* warning icon */}
                                <p>{cameraError}</p> {/* the specific error message set in openScanner()'s catch block */}

                                <button
                                    type="button"
                                    onClick={closeScanner} // just closes the modal since there's nothing else to do.
                                    className="secondary-action"
                                >
                                    Close
                                </button>
                            </div>
                        ) : ( // otherwise (no error) show the actual live camera scanning UI.
                            <>
                                <div className="camera-container"> {/* holds the live video feed + overlay frame */}

                                    <video
                                        ref={videoRef} // lets openScanner()/stopCamera() control this element directly.
                                        playsInline // prevents iOS Safari from forcing fullscreen video playback.
                                        muted // required by most browsers to allow autoplay.
                                    />

                                    <div className="scan-frame"> {/* a decorative rectangular guide overlaid on the video */}
                                        <span></span> {/* likely styled as one of the frame's four corner brackets */}
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <p>
                                        Position the document inside the frame {/* instructs the user how to line up their document */}
                                    </p>

                                </div>

                                <canvas
                                    ref={canvasRef} // used internally by captureDocument() to grab a still frame; never shown to the user.
                                    className="hidden-canvas" // styled with display:none (or similar) in the CSS.
                                />

                                <div className="scanner-actions"> {/* Cancel / Capture buttons row */}

                                    <button
                                        type="button"
                                        className="secondary-action"
                                        onClick={closeScanner} // cancels scanning without saving anything.
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="capture-button"
                                        onClick={captureDocument} // grabs the current video frame and saves it as a document.
                                    >
                                        <span className="capture-icon"></span> {/* decorative camera-shutter icon */}
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

export default LoginPage; // makes this component importable elsewhere, e.g. `import LoginPage from "./LoginPage"`.
