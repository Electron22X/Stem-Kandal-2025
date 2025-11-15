var imageCards = document.getElementById("imageCards");
var buttonNext = document.getElementById("nextButton");
var buttonPrev = document.getElementById("previousButton"); 
const imageLinks = [
  "assets/robot1.jpg",
  "assets/robot2.jpg",
  "assets/robot3.jpg",
  "assets/robot4.jpg",
  "assets/robot6.jpg",
  "assets/robot7.jpg",
];
var indexImages = 0;
var imageInfo = document.getElementById("imageInfo");

// NEW: Shorter, focused engineering descriptions
const infoTexts = [
    "Art: Our robot look clean and cool. not too small and not too big. The sleek black and silver color scheme gives it a modern, high-tech vibe.",
    "Design: this is show the designer smart thinking. this Design make easy to service and repair. The top cover can be removed quickly to access internal components, reducing downtime during maintenance. Design use 101% of his brain, jk.",
    "Mechanics: The mechanical design focuses on robustness and ease of maintenance. Key components are easily accessible, and the structure is optimized for durability and performance.",
    "Stability and Mobility: The low center of gravity and wide wheelbase enhance stability on uneven terrain. Large, rugged wheels provide excellent traction and maneuverability across various lawn conditions.",
    "Durability: This robot use the strongest materials in the world Fe (iron),It can withstand tough conditions. We use high-quality, weather-resistant materials to ensure the robot can handle various outdoor conditions, including rain, sun, and temperature fluctuations.",
    "Safety: The underside is a durable protective shell for the cutting system (concept). Reinforced edges and dark color emphasize separation and user safety from moving parts."
];

// --- Core Functions ---

function updateImageInfo(){
    // Use the current indexImages to look up the correct text.
    imageInfo.textContent = infoTexts[indexImages];
}

function changeImageCards(){
    // 1. Update the image source
    imageCards.src = imageLinks[indexImages];
    // 2. Update the descriptive text for the new image
    updateImageInfo(); 
}


// --- Button Handlers ---

previousButton.onclick = function(){
    if(indexImages <= 0){
        // Loop back to the last image
        indexImages = imageLinks.length - 1; 
    } else {
        // Go to the previous image
        indexImages -= 1;
    }
    changeImageCards();
}

nextButton.onclick = function(){
    if(indexImages >= imageLinks.length - 1){
        // Loop back to the first image
        indexImages = 0; 
    } else {
        // Go to the next image
        indexImages += 1;
    } 
    changeImageCards();
}

// Initial call to display the first image and text when the page loads
changeImageCards();