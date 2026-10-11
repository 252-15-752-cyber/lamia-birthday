
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. GET HTML ELEMENTS
    // =========================

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


    // =========================
    // 2. SLIDE DATA
    // =========================

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

    // Identifies the latest image-loading request.
    // This prevents an older image request from updating
    // the current slide after the user clicks Next quickly.
    let imageRequestId = 0;


    // =========================
    // 3. SCREEN NAVIGATION
    // =========================

    function showScreen(screen) {

        document.querySelectorAll(".screen").forEach(function (item) {
            item.classList.remove("active");
        });

        if (screen) {
            screen.classList.add("active");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =========================
    // 4. BACKGROUND MUSIC
    // =========================

    function playMusic() {

        if (!bgMusic) return;

        if (slides[currentSlide].type === "video") {
            return;
        }

        bgMusic.play().catch(function (error) {
            console.log("Music playback requires user interaction:", error);
        });
    }


    function stopMusic() {

        if (bgMusic) {
            bgMusic.pause();
        }
    }


    // =========================
    // 5. FLOATING HEARTS
    // =========================

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


    // =========================
    // 6. START BUTTON
    // =========================

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            showScreen(wish);
            playMusic();
        });
    }


    // =========================
    // 7. OPEN MEMORIES
    // =========================

    if (memoriesBtn) {
        memoriesBtn.addEventListener("click", function () {

            currentSlide = 0;

            renderSlide();

            showScreen(memories);

            playMusic();
        });
    }


    // =========================
    // 8. RENDER SLIDE
    // =========================

    function renderSlide() {

        const slide = slides[currentSlide];

        if (!slide) return;

        // A new render invalidates previous image requests.
        imageRequestId++;

        const thisRequestId = imageRequestId;

        // Stop and reset the video.
        slideVideo.pause();

        slideVideo.oncanplay = null;
        slideVideo.onerror = null;

        slideVideo.removeAttribute("src");
        slideVideo.load();

        // Clear previous image handlers.
        slidePhoto.onload = null;
        slidePhoto.onerror = null;


        // Update slide counter.
        slideCounter.textContent =
            (currentSlide + 1) + " / " + slides.length;


        // Update button labels.
        nextBtn.textContent =
            currentSlide === slides.length - 1
                ? "Finish 💗"
                : "Next →";

        prevBtn.textContent =
            currentSlide === 0
                ? "← Back"
                : "← Previous";


        // =========================
        // IMAGE SLIDE
        // =========================

        if (slide.type === "image") {

            // Show image and hide video.
            videoWrap.classList.add("hidden");
            photoWrap.classList.remove("hidden");

            // Update caption and alternative text.
            caption.textContent = slide.caption;

            slidePhoto.alt = "Birthday memory " + (currentSlide + 1);

            // Prevent the previous image from remaining visible
            // while the next image is loading.
            slidePhoto.removeAttribute("src");

            // Build the URL relative to the current website.
            // The unique query value helps bypass stale image cache.
            const imageUrl = new URL(slide.src, document.baseURI);

            imageUrl.searchParams.set("refresh", Date.now().toString());

            // Handle successful image loading.
            slidePhoto.onload = function () {

                // Ignore outdated image requests.
                if (thisRequestId !== imageRequestId) {
                    return;
                }

                // Make sure the current slide still matches.
                if (slides[currentSlide] !== slide) {
                    return;
                }

                caption.textContent = slide.caption;

                console.log("Image loaded successfully:", slide.src);
            };


            // Handle failed image loading.
            slidePhoto.onerror = function () {

                if (thisRequestId !== imageRequestId) {
                    return;
                }

                console.error("Image failed to load:", imageUrl.href);

                caption.textContent =
                    "Image could not load: " + slide.src;
            };


            // Load the selected image.
            slidePhoto.src = imageUrl.href;

            // Play background music on image slides.
            playMusic();

        }


        // =========================
        // VIDEO SLIDE
        // =========================

        else if (slide.type === "video") {

            // Show video and hide image.
            photoWrap.classList.add("hidden");
            videoWrap.classList.remove("hidden");

            // Stop background music.
            stopMusic();

            caption.textContent = slide.caption;

            // Load the selected video.
            slideVideo.src = new URL(
                slide.src,
                document.baseURI
            ).href;


            slideVideo.onerror = function () {

                console.error(
                    "Video failed to load:",
                    slideVideo.error
                );

                caption.textContent =
                    "Video could not load. Check videos/birthday.mp4";
            };


            slideVideo.oncanplay = function () {

                slideVideo.play().catch(function (error) {
                    console.log(
                        "Press the video Play button:",
                        error
                    );
                });
            };


            slideVideo.load();
        }
    }


    // =========================
    // 9. NEXT BUTTON
    // =========================

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


    // =========================
    // 10. PREVIOUS BUTTON
    // =========================

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {

            if (currentSlide > 0) {

                currentSlide--;

                renderSlide();

            }
        });
    }


    // =========================
    // 11. REPLAY BUTTON
    // =========================

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


    // =========================
    // 12. INITIAL SETUP
    // =========================

    // Start from the intro screen.
    showScreen(intro);

    // Prepare the first slide.
    renderSlide();

});

