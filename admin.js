import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const logoutButton = document.getElementById("logout-button");
const addPetForm = document.getElementById("add-pet-form");
const adminPetGrid = document.getElementById("admin-pet-grid");

// --- 1. AUTHENTICATION ---

// Protect the page: Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, load the pets
        console.log("User is logged in:", user.email);
        loadPets();
    } else {
        // No user is signed in, redirect to login
        console.log("No user signed in. Redirecting to login.");
        window.location.href = "login.html";
    }
});

// Handle Logout
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out.");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
});


// --- 2. PET MANAGEMENT ---

// Get a reference to the 'pets' collection in Firestore
const petsCollectionRef = collection(db, "pets");

// Load and display all pets
async function loadPets() {
    adminPetGrid.innerHTML = "Loading pets...";
    try {
        const querySnapshot = await getDocs(petsCollectionRef);
        adminPetGrid.innerHTML = ""; // Clear grid
        
        if (querySnapshot.empty) {
            adminPetGrid.innerHTML = "<p>No pets found. Add one above!</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const pet = doc.data();
            const petCard = document.createElement("div");
            petCard.classList.add("card", "pet-card");
            petCard.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <div class="pet-card-content">
                    <h3>${pet.name}</h3>
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <button class="btn delete-btn" data-id="${doc.id}">Delete</button>
                </div>
            `;
            adminPetGrid.appendChild(petCard);
        });

    } catch (error) {
        console.error("Error loading pets: ", error);
        adminPetGrid.innerHTML = "<p>Error loading pets.</p>";
    }
}

// Handle Add Pet form
addPetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Get all values from the form
    const pet = {
        name: document.getElementById("pet-name").value,
        type: document.getElementById("pet-type").value,
        age: document.getElementById("pet-age").value,
        gender: document.getElementById("pet-gender").value,
        image: document.getElementById("pet-image").value,
        description: document.getElementById("pet-description").value,
    };

    try {
        // Add a new document with a generated ID
        const docRef = await addDoc(petsCollectionRef, pet);
        console.log("Pet added with ID: ", docRef.id);
        addPetForm.reset(); // Clear the form
        loadPets(); // Reload the pet list
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// Handle Delete Pet
adminPetGrid.addEventListener("click", async (e) => {
    // Use event delegation to catch clicks on delete buttons
    if (e.target.classList.contains("delete-btn")) {
        const petId = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this pet?")) {
            try {
                await deleteDoc(doc(db, "pets", petId));
                console.log("Pet deleted:", petId);
                loadPets(); // Reload the pet list
            } catch (error) {
                console.error("Error deleting pet:", error);
            }
        }
    }
});