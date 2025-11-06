// Import Firebase auth functions and the 'auth' service from our config
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

const registerForm = document.getElementById("register-form");
const registerEmail = document.getElementById("register-email");
const registerPass = document.getElementById("register-password");
const registerError = document.getElementById("register-error");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from reloading page

    const email = registerEmail.value;
    const password = registerPass.value;

    // Use the Firebase function to create a new user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log("User registered and logged in:", user.email);
            
            // Redirect to the admin panel
            window.location.href = "admin.html";
        })
        .catch((error) => {
            // Handle errors
            console.error("Register error:", error.message);
            if (error.code === "auth/email-already-in-use") {
                registerError.textContent = "Error: This email is already in use.";
            } else if (error.code === "auth/weak-password") {
                registerError.textContent = "Error: Password should be at least 6 characters.";
            } else {
                registerError.textContent = "Error: Could not create account.";
            }
        });
});