# 🌿 AgriTree — AI-Powered Botanical Intelligence
https://sandesh-cyber.github.io/AgriTree-AI-Plant-Intelligence/

AgriTree is an award-winning, cinematic scrollytelling landing page and interactive analysis console for next-generation agricultural edge computing. It showcases deep learning computer vision pipelines, real-time chlorophyll synthesis modeling, and automated irrigation management.

---

## 🚀 Key Features

### 1. Optical Edge Inference Scan
* Interactive laser sweep bar with real-time mockup diagnostics compiler logs console (`edge_inference.log`).
* Demonstrates how quantized deep CNN models identify leaf venation and crop species on-device.

### 2. Plant Growth storytelling Canvas
* HTML5 canvas frame-by-frame rendering synced directly with Lenis smooth scrolling and GSAP.
* Staggered character entrance reveals with blur-in transitions tracking early germination and photosynthesis phases.

### 3. Panning S-Curve Technology Path
* An Awwwards-quality custom viewport track that pans horizontally and vertically as you scroll.
* Overlapping liquid glass islands with slow breathing morph shape keyframes.
* Glowing botanical vines with animated light trails continuously firing electrical pulses along the path.

### 4. Pathogen Diagnostics Compare
* Pinned leaf blight compare slider containing necrotizing infection overlays, Alternaria Solani diagnosis cards, and treated state checkmarks.

### 5. Horizontal Partners Carousel & Luxury FAQs
* Magazine-inspired horizontal slide deck highlighting customer testimonials.
* Minimalist line-divider FAQ accordions with height transition animations and rotating chevrons.

---

## 🛠️ Technology Stack

* **Core Frontend**: HTML5, CSS3 (Vanilla CSS with CSS variables).
* **Smooth Scrolling**: Lenis Scroll.
* **Animation Suite**: GSAP, ScrollTrigger.
* **Typography Refinement**: SplitType (character and word staggers).
* **Backend Server**: Python, Flask (serves core assets and renders routes).

---

## 📂 Project Structure

```bash
├── assets/
│   ├── css/
│   │   ├── style.css       # Core stylesheets & scrollytelling grid system
│   │   └── loader.css      # Intro liquid mask typography loader
│   ├── js/
│   │   ├── script.js       # GSAP timelines, compare slider, & magnetic hover engine
│   │   └── loader.js       # Entry entrance preloader & entrance animations
│   ├── images/
│   │   └── plant-frames/   # 240 high-resolution render frames for growth sequence
│   └── templates/
│       └── plant_anylser_dashboard.html  # Interactive specimen analysis console
├── backend/
│   └── app.py              # Flask server and routing controller
├── index.html              # Main scrollytelling landing page
└── README.md               # Documentation
```

---

## 💻 Local Setup & Execution

### Prerequisites
* Python 3.9+ installed on your system.

### 1. Install Dependencies
Create a virtual environment and run the Flask server:
```bash
# Navigate to the workspace directory
cd plant-anyalser

# Create and activate virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install Flask
pip install Flask
```

### 2. Run the Development Server
```bash
python backend/app.py
```

### 3. View the Site
Open your browser and navigate to:
* **Landing Page**: `http://localhost:5000/`
* **Analysis Console**: `http://localhost:5000/assets/templates/plant_anylser_dashboard.html`

---

## 🎨 Interactive Animation Guide

### Magnetic CTA Physics
We implement distance-aware magnetic pull on `.magnetic-btn` selectors. As the cursor nears a button, the button translates in 3D space toward the pointer:
```javascript
gsap.to(btn, {
  x: x * 0.35,
  y: y * 0.35,
  rotateX: -y * 0.05,
  rotateY: x * 0.05,
  ease: 'power2.out',
  duration: 0.5
});
```
On mouseleave, a spring wobble resets the coordinates back to base:
```javascript
ease: 'elastic.out(1.1, 0.6)'
```

### SplitType Word Protection
To prevent characters from wrapping in the middle of words (e.g. `Botanical Inte-lligence` wrapping mid-letter), typography staggers are split using `{ types: 'words,chars' }` with CSS rules:
```css
.word {
    display: inline-block;
    white-space: nowrap;
}
```
This forces the browser to wrap only on word boundaries while maintaining individual letter spans for GSAP stagger entries.
