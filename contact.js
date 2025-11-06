// Import the database and functions we need
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Get the form and inputs
const contactForm = document.getElementById("contact-form");
const contactName = document.getElementById("name");
const contactEmail = document.getElementById("email");
const contactMessage = document.getElementById("message");
const submitButton = contactForm.querySelector("button[type='submit']");

// Add the submit event listener
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // This is the most important line! It stops the 404 error.

    // Get the values
    const name = contactName.value;
    const email = contactEmail.value;
    const message = contactMessage.value;

    // Disable the button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
        // Create a new "messages" collection in your database
        const messagesCollectionRef = collection(db, "messages");
        
        // Add the new message document
        await addDoc(messagesCollectionRef, {
            name: name,
            email: email,
            message: message,
            timestamp: serverTimestamp() // Adds the time the message was sent
        });
        
        // Success!
        alert("Message sent successfully! We will get back to you soon.");
        contactForm.reset(); // Clear the form
        
    } catch (error) {
        // Handle errors
        console.error("Error sending message: ", error);
        alert("Error: Could not send message. Please try again.");
    } finally {
        // Re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});