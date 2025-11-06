// === IMPORT FIREBASE MODULES ===
import { db, auth } from "./firebase-config.js";
import { collection, getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// === GET ALL THE ELEMENTS ===
// Login Elements
const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

// Main Page Elements
const mainContent = document.getElementById("main-content");
const featuredGrid = document.getElementById("featured-pet-grid");
const logoutButton = document.getElementById("logout-button");

// === 1. THE AUTH "GATEKEEPER" ===
// This runs on page load and checks if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User IS logged in
        console.log("User is logged in:", user.email);
        // Hide the login modal
        loginOverlay.classList.add("hidden");
        // Show the main page content
        mainContent.classList.remove("hidden");
        // Load the featured pets
        loadFeaturedPets();
    } else {
        // User IS NOT logged in
        console.log("User is logged out.");
        // Show the login modal
        loginOverlay.classList.remove("hidden");
        // Hide the main page content
        mainContent.classList.add("hidden");
    }
});

// === 2. LOGIN FORM HANDLER ===
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Success!
            // We don't need to do anything here.
            // The onAuthStateChanged listener (above) will
            // automatically detect the login and show the page.
            loginError.textContent = "";
            loginForm.reset();
        })
        .catch((error) => {
            console.error("Login Error:", error.code);
            loginError.textContent = "Error: Invalid email or password.";
        });
});

// === 3. LOGOUT BUTTON HANDLER ===
logoutButton.addEventListener("click", () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
    });
    // The onAuthStateChanged listener will automatically
    // detect the sign-out and show the login modal.
});

// === 4. LOAD FEATURED PETS (Your existing function) ===
// This will now only run *after* the user is logged in
async function loadFeaturedPets() {
    if (!featuredGrid) return; 

    try {
        const petsCollectionRef = collection(db, "pets");
        const featuredQuery = query(petsCollectionRef, limit(3));
        const querySnapshot = await getDocs(featuredQuery);

        featuredGrid.innerHTML = ""; // Clear "Loading..."

        if (querySnapshot.empty) {
            featuredGrid.innerHTML = "<p>No featured pets. Add some in the Admin Panel!</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const pet = doc.data();
            const petCard = document.createElement("div");
            petCard.classList.add("card", "pet-card");
            petCard.innerHTML = `
                <img src="${pet.image}" alt="A photo of ${pet.name}">
                <div class="pet-card-content">
                    <h3>${pet.name}</h3>
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <p>${pet.description.substring(0, 100)}...</p> 
                    <a href="pets.html" class="btn">Learn More</a>
                </div>
            `;
            featuredGrid.appendChild(petCard);
        });

    } catch (error) {
        console.error("Error loading featured pets:", error);
        featuredGrid.innerHTML = "<p>Could not load featured pets.</p>";
    }
}