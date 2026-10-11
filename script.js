
document.addEventListener("DOMContentLoaded", function () {

    // 1. HTML ELEMENTS

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


    // 2. SLIDES

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
    let imageRequestId = 0;


    // 3. SCREEN NAVIGATION

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(function (item) {
            item.classList.remove("active");
        });

        if (screen) {
            screen.classList.add("active");
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    // 4. MUSIC

    function playMusic() {
        if (!bgMusic) return;
        if (slides[currentSlide].type === "video") return;

        bgMusic.play().catch(function (error) {
            console.log("Music needs user interaction:", error);
        });
    }

    function stopMusic() {
        if (bgMusic) {
            bgMusic.pause();
        }
    }


    // 5. FLOATING HEARTS

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


    // 6. START BUTTON

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            showScreen(wish);
            playMusic();
        });
    }


    // 7. OPEN MEMORIES

    if (memoriesBtn) {
        memoriesBtn.addEventListener("click", function () {
            currentSlide = 0;
            renderSlide();
            showScreen(memories);
        });
    }


    // 8. DISPLAY CURRENT SLIDE

    function renderSlide() {
        const slide = slides[currentSlide];
        if (!slide) return;

        // Invalidate any previous image loading request.
        const requestId = ++imageRequestId;

        // Stop and reset the video.
        slideVideo.pause();
        slideVideo.oncanplay = null;
        slideVideo.onerror = null;
        slideVideo.removeAttribute("src");
        slideVideo.load();

        // Update counter and buttons.
        slideCounter.textContent =
            (currentSlide + 1) + " / " + slides.length;

        nextBtn.textContent =
            currentSlide === slides.length - 1 ? "Finish 💗" : "Next →";

        prevBtn.textContent =
            currentSlide === 0 ? "← Back" : "← Previous";

        // IMAGE SLIDE
        if (slide.type === "image") {
            videoWrap.classList.add("hidden");
            photoWrap.classList.remove("hidden");

            caption.textContent = slide.caption;
            slidePhoto.alt = "Birthday memory " + (currentSlide + 1);

            // Hide the previous image until the new one loads.
            slidePhoto.style.visibility = "hidden";

            // Create a separate image loader.
            const loader = new Image();

            loader.onload = function () {
                // Ignore results from an outdated request.
                if (requestId !== imageRequestId) return;
                if (slides[currentSlide] !== slide) return;

                slidePhoto.onload = null;
                slidePhoto.onerror = null;

                // Show the loaded image.
                slidePhoto.src = loader.src;
                slidePhoto.style.visibility = "visible";

                caption.textContent = slide.caption;

                console.log("Displayed image:", slide.src);
            };

            loader.onerror = function () {
                if (requestId !== imageRequestId) return;

                slidePhoto.style.visibility = "visible";
                caption.textContent = "Unable to load: " + slide.src;

                console.error("Image loading failed:", slide.src);
            };

            // Use the exact path of the selected slide.
            // No shared image URL between different slides.
            loader.src = new URL(slide.src, document.baseURI).href;

            playMusic();
        }

        // VIDEO SLIDE
        else if (slide.type === "video") {
            photoWrap.classList.add("hidden");
            videoWrap.classList.remove("hidden");

            stopMusic();
            caption.textContent = slide.caption;

            slideVideo.src = new URL(slide.src, document.baseURI).href;

            slideVideo.onerror = function () {
                caption.textContent =
                    "Video could not load. Check videos/birthday.mp4";

                console.error("Video loading failed:", slideVideo.error);
            };

            slideVideo.oncanplay = function () {
                slideVideo.play().catch(function (error) {
                    console.log("Press Play to watch the video:", error);
                });
            };

            slideVideo.load();
        }
    }


    // 9. NEXT BUTTON

    if (nextBtn) {
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
    }


    // 10. PREVIOUS BUTTON

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            if (currentSlide > 0) {
                currentSlide--;
                renderSlide();
            }
        });
    }


    // 11. REPLAY BUTTON

    if (replayBtn) {
        replayBtn.addEventListener("click", function () {
            slideVideo.pause();
            slideVideo.removeAttribute("src");
            slideVideo.load();

            currentSlide = 0;

            renderSlide();
            showScreen(intro);
            stopMusic();
        });
    }


    // 12. INITIAL SETUP

    slidePhoto.style.visibility = "visible";

    showScreen(intro);
    renderSlide();

});

