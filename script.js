
document.addEventListener("DOMContentLoaded", function () {

    // Elements
    const intro = document.getElementById("intro");
    const wish = document.getElementById("wish");
    const memories = document.getElementById("memories");
    const finalScreen = document.getElementById("final");

    const startBtn = document.getElementById("startBtn");
    const memoriesBtn = document.getElementById("memoriesBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const replayBtn = document.getElementById("replayBtn");

    const photoWrap = document.getElementById("photoWrap");
    const slidePhoto = document.getElementById("slidePhoto");
    const videoWrap = document.getElementById("videoWrap");
    const slideVideo = document.getElementById("slideVideo");

    const caption = document.getElementById("caption");
    const slideCounter = document.getElementById("slideCounter");
    const bgMusic = document.getElementById("bgMusic");

    // Slides
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

    // Background music
    function playMusic() {
        if (bgMusic && slides[currentSlide].type !== "video") {
            bgMusic.play().catch(function (error) {
                console.log("Music playback requires user interaction:", error);
            });
        }
    }

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

    // Start
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

    // Render current slide
    function renderSlide() {
        const slide = slides[currentSlide];

        // Stop and reset the video
        slideVideo.pause();
        slideVideo.oncanplay = null;
        slideVideo.onerror = null;
        slideVideo.removeAttribute("src");
        slideVideo.load();

        // Remove old image event handlers
        slidePhoto.onload = null;
        slidePhoto.onerror = null;

        // Music control
        if (slide.type === "video") {
            stopMusic();
        } else {
            playMusic();
        }

        // Image slide
        if (slide.type === "image") {

            videoWrap.classList.add("hidden");
            photoWrap.classList.remove("hidden");

            slidePhoto.alt = "Birthday memory " + (currentSlide + 1);

            // Show the correct caption after image loads
            slidePhoto.onload = function () {
                caption.textContent = slide.caption;
            };

            // Show an error if the image cannot load
            slidePhoto.onerror = function () {
                console.error("Image failed to load:", slidePhoto.src);
                caption.textContent = "Could not load image: " + slide.src;
            };

            // Load the selected image
            slidePhoto.src = slide.src;

            // Update caption immediately as well
            caption.textContent = slide.caption;

        } else {

            // Video slide
            photoWrap.classList.add("hidden");
            videoWrap.classList.remove("hidden");

            slideVideo.onerror = function () {
                console.error("Video failed to load:", slideVideo.error);
                caption.textContent =
                    "Video could not load. Check videos/birthday.mp4";
            };

            slideVideo.oncanplay = function () {
                slideVideo.play().catch(function (error) {
                    console.log("Press the video Play button:", error);
                });
            };

            slideVideo.src = slide.src;
            slideVideo.load();

            caption.textContent = slide.caption;
        }

        // Slide counter
        slideCounter.textContent =
            (currentSlide + 1) + " / " + slides.length;

        // Next button label
        nextBtn.textContent =
            currentSlide === slides.length - 1 ? "Finish 💗" : "Next →";

        // Previous button label
        prevBtn.textContent =
            currentSlide === 0 ? "← Back" : "← Previous";
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

