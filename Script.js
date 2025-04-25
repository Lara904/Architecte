document.addEventListener("DOMContentLoaded", function () {
    console.log("Script chargé avec succès");

    /*** 1. CARROUSEL D'IMAGES ***/
    const slides = document.querySelectorAll(".carousel-slide");
    const carousel = document.querySelector(".carousel");
    let currentSlide = 0;
    let autoSlide;
    let isPaused = false;

    // Ajout dynamique des flèches si elles n'existent pas
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "⟨";
    prevBtn.className = "carousel-nav prev";
    prevBtn.setAttribute("aria-label", "Image précédente");

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "⟩";
    nextBtn.className = "carousel-nav next";
    nextBtn.setAttribute("aria-label", "Image suivante");

    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? "1" : "0";
            slide.setAttribute("aria-hidden", i === index ? "false" : "true");
            slide.style.transition = "opacity 1s ease-in-out";
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startCarousel() {
        autoSlide = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 4000);
    }

    function stopCarousel() {
        clearInterval(autoSlide);
    }

    // Events
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    carousel.addEventListener("mouseenter", () => isPaused = true);
    carousel.addEventListener("mouseleave", () => isPaused = false);

    showSlide(currentSlide);
    startCarousel();

    /*** 2. AFFICHAGE DES PROJETS ***/
    const projetsContainer = document.getElementById("projets-container");

    fetch("./projets.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur de chargement du fichier JSON");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                projetsContainer.innerHTML = "<p>Aucun projet disponible.</p>";
                return;
            }

            projetsContainer.innerHTML = "";

            data.forEach((projet) => {
                const projetDiv = document.createElement("div");
                projetDiv.classList.add("projet");
                projetDiv.setAttribute("tabindex", "0");
                projetDiv.setAttribute("aria-label", `Projet : ${projet.titre}`);

                projetDiv.innerHTML = `
                    <img src="${projet.image}" alt="${projet.titre}">
                    <h3>${projet.titre}</h3>
                    <p>${projet.description}</p>
                `;

                projetDiv.style.opacity = "0";
                projetDiv.style.transform = "translateY(20px)";
                projetDiv.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";

                projetsContainer.appendChild(projetDiv);
            });

            // Effet de scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            }, { threshold: 0.2 });

            document.querySelectorAll(".projet").forEach((projet) => {
                observer.observe(projet);
            });
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des projets:", error);
            projetsContainer.innerHTML = "<p>Erreur lors du chargement des projets.</p>";
        });

    /*** 3. FORMULAIRE DE CONTACT ***/
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const formMessage = document.getElementById("form-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            formMessage.textContent = "Veuillez remplir tous les champs.";
            formMessage.style.color = "red";
            formMessage.classList.remove("hidden");
            return;
        }

        console.log("Nom:", name);
        console.log("Email:", email);
        console.log("Message:", message);

        formMessage.textContent = "Votre message a bien été envoyé !";
        formMessage.style.color = "green";
        formMessage.classList.remove("hidden");
        formMessage.setAttribute("aria-live", "polite");

        submitBtn.style.background = "green";
        submitBtn.textContent = "Envoyé !";

        setTimeout(() => {
            form.reset();
            submitBtn.style.background = "#007bff";
            submitBtn.textContent = "Envoyer";
            formMessage.classList.add("hidden");
        }, 3000);
    });
});