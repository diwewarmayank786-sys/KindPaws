// Import the database service
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- GLOBAL VARIABLES ---
let allPets = []; // This will be filled from Firebase
const petGrid = document.getElementById("pet-grid-container");
const filterType = document.getElementById("filter-type");
const filterAge = document.getElementById("filter-age");
const filterGender = document.getElementById("filter-gender");

// --- FUNCTION TO DISPLAY PETS ---
function displayPets(petsToDisplay) {
    if (!petGrid) return; // Not on the pets.html page

    petGrid.innerHTML = ""; // Clear the grid

    if (petsToDisplay.length === 0) {
        petGrid.innerHTML = "<p>No pets match your criteria. Try adjusting the filters!</p>";
        return;
    }

    petsToDisplay.forEach((pet) => {
        const petCard = document.createElement("div");
        petCard.classList.add("card", "pet-card");
        petCard.innerHTML = `
            <img src="${pet.image}" alt="A photo of ${pet.name}">
            <div class="pet-card-content">
                <h3>${pet.name}</h3>
                <p><strong>Type:</strong> ${pet.type}</p>
                <p><strong>Age:</strong> ${pet.age} | <strong>Gender:</strong> ${pet.gender}</p>
                <p>${pet.description}</p>
                <a href="contact.html" class="btn">Adopt ${pet.name}</a>
            </div>
        `;
        petGrid.appendChild(petCard);
    });
}

// --- FUNCTION TO APPLY FILTERS ---
function applyFilters() {
    if (!filterType) return; // Not on the pets.html page

    const type = filterType.value;
    const age = filterAge.value;
    const gender = filterGender.value;

    let filteredPets = allPets;

    if (type !== "all") {
      filteredPets = filteredPets.filter((pet) => pet.type === type);
    }
    if (age !== "all") {
      filteredPets = filteredPets.filter((pet) => pet.age === age);
    }
    if (gender !== "all") {
      filteredPets = filteredPets.filter((pet) => pet.gender === gender);
    }

    displayPets(filteredPets);
}

// --- LOAD PETS FROM FIREBASE ---
async function loadPetsFromFirebase() {
    if (!petGrid) return; // Only run this on the pets page
    
    petGrid.innerHTML = "<h3>Loading pets...</h3>";
    
    try {
        const querySnapshot = await getDocs(collection(db, "pets"));
        allPets = []; // Clear the local array
        querySnapshot.forEach((doc) => {
            // Add the pet data AND its ID
            allPets.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("Pets loaded from Firebase:", allPets);
        displayPets(allPets); // Initial display of all pets
    } catch (error) {
        console.error("Error loading pets from Firebase:", error);
        petGrid.innerHTML = "<p>Could not load pets. Please try again later.</p>";
    }
}

// --- INITIALIZE THE PAGE ---
document.addEventListener("DOMContentLoaded", () => {
    // Load pets from database
    loadPetsFromFirebase();

    // Add filter event listeners
    if (filterType && filterAge && filterGender) {
        filterType.addEventListener("change", applyFilters);
        filterAge.addEventListener("change", applyFilters);
        filterGender.addEventListener("change", applyFilters);
    }
});