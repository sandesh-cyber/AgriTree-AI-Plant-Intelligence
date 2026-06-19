/* =========================================================
   AGRITREE — REAL AI PLANT ANALYZER
   Combined OLD + NEW Logic
   File: plant_analyzer.js
========================================================= */

"use strict";

/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let selectedFile = null;
let currentScientificName = null;
let wikiCache = null;

/* =========================================================
   SHORTHAND SELECTORS
========================================================= */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* =========================================================
   ELEMENT REFERENCES
========================================================= */

const fileInput = document.getElementById("fileInput");
const scanBtn = document.getElementById("scanPlantBtn");
const selectBtn = document.getElementById("selectFilesBtn");

const previewImage = document.getElementById("previewImage");

const plantNameEl = document.getElementById("plantName");
const scientificNameEl = document.getElementById("scientificName");
const confidenceEl = document.getElementById("confidenceScore");

const descriptionEl = document.getElementById("description");
const familyEl = document.getElementById("family");
const originEl = document.getElementById("origin");
const toxicityEl = document.getElementById("toxicity");

const vitalityBar = document.getElementById("vitalityBar");

/* =========================================================
   SIDEBAR TOGGLE
========================================================= */

(function initSidebar() {

    const toggle = $("#sidebarToggle");
    const sidebar = $("#sidebar");

    if (!toggle || !sidebar) return;

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

})();

/* =========================================================
   CATEGORY PILLS
========================================================= */

(function initCategoryPills() {

    const pills = $$(".pill");

    pills.forEach((pill) => {

        pill.addEventListener("click", () => {

            pills.forEach((p) => p.classList.remove("active"));

            pill.classList.add("active");

        });

    });

})();

/* =========================================================
   FILE SELECT
========================================================= */

selectBtn.addEventListener("click", () => {
    fileInput.click();
});

/* =========================================================
   IMAGE INPUT
========================================================= */

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast("Please upload valid image", "error");

        return;
    }

    selectedFile = file;

    showPreview(file);

});

/* =========================================================
   DRAG & DROP
========================================================= */

(function initDragDrop() {

    const uploadCard = $("#uploadCard");

    if (!uploadCard) return;

    ["dragenter", "dragover"].forEach((eventName) => {

        uploadCard.addEventListener(eventName, (e) => {

            e.preventDefault();

            uploadCard.classList.add("drag-active");

        });

    });

    ["dragleave", "drop"].forEach((eventName) => {

        uploadCard.addEventListener(eventName, (e) => {

            e.preventDefault();

            uploadCard.classList.remove("drag-active");

        });

    });

    uploadCard.addEventListener("drop", (e) => {

        const file = e.dataTransfer.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            showToast("Invalid image file", "error");

            return;
        }

        selectedFile = file;

        showPreview(file);

    });

})();

/* =========================================================
   SHOW IMAGE PREVIEW
========================================================= */

function showPreview(file) {

    const reader = new FileReader();

    reader.onload = (e) => {

        previewImage.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

/* =========================================================
   SCAN BUTTON
========================================================= */

scanBtn.addEventListener("click", identifyPlant);

/* =========================================================
   IDENTIFY PLANT
========================================================= */

async function identifyPlant() {

    if (!selectedFile) {

        showToast("Upload image first", "error");

        return;
    }

    try {

        startScanningUI();

        const formData = new FormData();

        formData.append("image", selectedFile);

        const response = await fetch(
            "http://127.0.0.1:5000/identify",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!data.results || !data.results.length) {

            showToast("Plant not recognized", "error");

            return;
        }

        const best = data.results[0];

        currentScientificName =
            best.species.scientificNameWithoutAuthor;

        /* ==========================
           BASIC DATA
        ========================== */

        plantNameEl.innerText =
            best.species.commonNames?.[0] || "Unknown Plant";

        scientificNameEl.innerText =
            currentScientificName;

        const confidence =
            Math.round(best.score * 100);

        confidenceEl.innerText =
            confidence + "%";

        animateMatchCircle(confidence);

        /* ==========================
           FETCH WIKIPEDIA
        ========================== */

        wikiCache =
            await fetchWikipediaData(currentScientificName);

        if (wikiCache) {

            populatePlantData(wikiCache);

        }

        showToast(
            `Plant Identified: ${plantNameEl.innerText}`,
            "success"
        );

    } catch (err) {

        console.error(err);

        showToast(
            "Error identifying plant",
            "error"
        );

    } finally {

        stopScanningUI();

    }

}

/* =========================================================
   WIKIPEDIA FETCH
========================================================= */

async function fetchWikipediaData(scientificName) {

    try {

        const title =
            scientificName.replaceAll(" ", "_");

        const url =
            `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

        const res = await fetch(url);

        const data = await res.json();

        return {

            text: data.extract || "",

            image: data.thumbnail?.source || null

        };

    } catch (err) {

        console.error(err);

        return null;
    }

}

/* =========================================================
   POPULATE UI
========================================================= */

function populatePlantData(wiki) {

    const text = wiki.text;

    descriptionEl.innerText =
        cleanDescription(text);

    familyEl.innerText =
        extractFamily(text);

    originEl.innerText =
        extractOrigin(text);

    toxicityEl.innerText =
        detectToxicity(text);

    generateCareTips(text);

}

/* =========================================================
   HELPERS
========================================================= */

function cleanDescription(text) {

    if (!text)
        return "Description not available.";

    return (
        text.split(". ").slice(0, 2).join(". ") + "."
    );

}

function extractFamily(text) {

    const match =
        text.match(/family\s+([A-Z][a-zA-Z]+)/);

    return match ? match[1] : "Not Available";

}

function extractOrigin(text) {

    const match =
        text.match(/native to ([^.,]+)/i);

    return match ? match[1] : "Not Available";

}

function detectToxicity(text) {

    if (/toxic|poisonous/i.test(text)) {

        return "Toxic to Pets";
    }

    if (/edible|food|eaten/i.test(text)) {

        return "Safe / Edible";
    }

    return "Unknown";

}

/* =========================================================
   CARE TIPS
========================================================= */

function generateCareTips(text) {

    const careList =
        document.querySelector(".care-list");

    if (!careList) return;

    careList.innerHTML = "";

    const tips = [];

    if (/tropical/i.test(text)) {

        tips.push("Warm humid climate");

    }

    if (/tree/i.test(text)) {

        tips.push("Needs space to grow");

    }

    tips.push("Indirect sunlight");
    tips.push("Water regularly");

    tips.forEach((tip) => {

        const li = document.createElement("li");

        li.className = "care-item";

        li.innerHTML = `
            <span class="care-icon">🌿</span>
            ${tip}
        `;

        careList.appendChild(li);

    });

}

/* =========================================================
   MATCH CIRCLE ANIMATION
========================================================= */

function animateMatchCircle(percent = 98) {

    const circle =
        document.querySelector(".match-progress");

    if (!circle) return;

    const radius = 26;

    const circumference =
        2 * Math.PI * radius;

    const offset =
        circumference -
        (percent / 100) * circumference;

    circle.style.strokeDasharray =
        circumference;

    circle.style.strokeDashoffset =
        circumference;

    setTimeout(() => {

        circle.style.transition =
            "stroke-dashoffset 1.5s ease";

        circle.style.strokeDashoffset =
            offset;

    }, 100);

}

/* =========================================================
   VITALITY BAR
========================================================= */

function animateVitalityBar() {

    if (!vitalityBar) return;

    vitalityBar.style.width = "0%";

    setTimeout(() => {

        vitalityBar.style.width = "85%";

    }, 300);

}

/* =========================================================
   SCANNING UI
========================================================= */

function startScanningUI() {

    scanBtn.disabled = true;

    scanBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Scanning...
    `;

}

function stopScanningUI() {

    scanBtn.disabled = false;

    scanBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3"
            stroke="currentColor" stroke-width="2"/>
        </svg>
        Scan Plant
    `;

}

/* =========================================================
   FADE IN ANIMATION
========================================================= */

(function initFadeIn() {

    const fadeEls = $$(".fade-in");

    const observer =
        new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        });

    fadeEls.forEach((el) => {

        observer.observe(el);

    });

})();

/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "success") {

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "12px";
    toast.style.background =
        type === "success"
            ? "#0f8f5b"
            : "#d33";
    toast.style.color = "#fff";
    toast.style.zIndex = "9999";
    toast.style.fontWeight = "600";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    animateMatchCircle(98);

    animateVitalityBar();

    console.log(
        "🌿 AgriTree AI Plant Analyzer Ready"
    );

});