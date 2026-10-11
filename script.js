document.addEventListener("DOMContentLoaded", function () {


// Get all screens
const intro = document.getElementById("intro");
const wish = document.getElementById("wish");
const memories = document.getElementById("memories");
const finalScreen = document.getElementById("final");

// Get buttons
const startBtn = document.getElementById("startBtn");
const memoriesBtn = document.getElementById("memoriesBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const replayBtn = document.getElementById("replayBtn");

// Get photo and video elements
const photoWrap = document.getElementById("photoWrap");
const slidePhoto = document.getElementById("slidePhoto");
const videoWrap = document.getElementById("videoWrap");
const slideVideo = document.getElementById("slideVideo");

const caption = document.getElementById("caption");
const slideCounter = document.getElementById("slideCounter");
const bgMusic = document.getElementById("bgMusic");

// All slides
const slides = [
    {
        type: "image",
        src: "images/photo1.JPG",
        caption: "A little moment to remember ♡"
    },
    {
        type: "image",
        src: "images/photo2.JPG",
        caption: "A memory worth keeping ✿"
    },
    {
        type: "image",
        src: "images/photo3.JPG",
        caption: "Keep that lovely smile forever ✨"
    },
    {
        type: "image",
        src: "images/photo4.JPG",
        caption: "More lovely moments ahead ♡"
    },
    {
        type: "video",
        src: "videos/birthday.mp4",
        caption: "A little video surprise for you! 💗"
    }
];

let currentSlide = 0;

// Show a screen
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(function (item) {
        item.classList.remove("active");
    });

    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Play background music
function playMusic() {
    if (bgMusic && slides[currentSlide].type !== "video") {
        bgMusic.play().catch(function (error) {
            console.log("Background music needs user interaction:", error);
        });
    }
}

// Stop background music
function stopMusic() {
    if (bgMusic) {
        bgMusic.pause();
    }
}

// Floating hearts
function createHeart() {
    const heartsContainer = document.getElementById("hearts");

    if (!heartsContainer) return;

    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "💕";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (14 + Math.random() * 20) + "px";
    heart.style.animationDuration = (5 + Math.random() * 5) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(function () {
        heart.remove();
    }, 10000);
}

setInterval(createHeart, 650);

// Open birthday wish
startBtn.addEventListener("click", function () {
    showScreen(wish);
    playMusic();
});

// Open memories
memoriesBtn.addEventListener("click", function () {
    currentSlide = 0;
    renderSlide();
    showScreen(memories);
});

// Display current slide
function renderSlide() {
    const slide = slides[currentSlide];

    // Stop and reset previous video
    slideVideo.pause();
    slideVideo.oncanplay = null;
    slideVideo.onerror = null;
    slideVideo.removeAttribute("src");
    slideVideo.load();

    // Control background music depending on slide
    if (slide.type === "video") {
        stopMusic();
    } else {
        playMusic();
    }

    if (slide.type === "image") {

        videoWrap.classList.add("hidden");
        photoWrap.classList.remove("hidden");

        slidePhoto.src = slide.src;
        slidePhoto.alt = "Birthday memory " + (currentSlide + 1);

    } else if (slide.type === "video") {

        photoWrap.classList.add("hidden");
        videoWrap.classList.remove("hidden");

        // Load the video
        slideVideo.src = slide.src;
        slideVideo.load();

        // Try to play the video when ready
        slideVideo.oncanplay = function () {
            slideVideo.play().catch(function (error) {
                console.log("Press the video Play button:", error);
            });
        };

        // Handle video loading errors
        slideVideo.onerror = function () {
            console.error("Video failed to load:", slideVideo.error);
            caption.textContent =
                "Video could not load. Check videos/birthday.mp4";
        };
    }

    // Update caption and counter
    caption.textContent = slide.caption;

    slideCounter.textContent =
        (currentSlide + 1) + " / " + slides.length;

    // Update Next button
    if (currentSlide === slides.length - 1) {
        nextBtn.textContent = "Finish 💗";
    } else {
        nextBtn.textContent = "Next →";
    }

    // Update Previous button
    if (currentSlide === 0) {
        prevBtn.textContent = "← Back";
    } else {
        prevBtn.textContent = "← Previous";
    }
}

// Next button
nextBtn.addEventListener("click", function () {

    if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide();
    } else {
        slideVideo.pause();
        stopMusic();
        showScreen(finalScreen);
    }

});

// Previous button
prevBtn.addEventListener("click", function () {

    if (currentSlide > 0) {
        currentSlide--;
        renderSlide();
    } else {
        slideVideo.pause();
        showScreen(wish);
        playMusic();
    }

});

// Replay the birthday surprise
replayBtn.addEventListener("click", function () {
    slideVideo.pause();
    currentSlide = 0;
    renderSlide();
    showScreen(intro);
});


});
