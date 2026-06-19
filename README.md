# 🌱 AgriTree – AI Powered Plant Identification Platform

AgriTree is a web application that helps users identify plants and analyze plant health using Artificial Intelligence.

The idea behind this project is simple: take a photo of a plant, upload it to the platform, and instantly receive information about the plant species, along with useful details such as its scientific name, description, origin, family, and care recommendations.

This project was built to make plant knowledge more accessible to students, gardeners, farmers, and plant enthusiasts.

---

## Features

### 🌿 Plant Identification

Upload a plant image and identify the plant species using AI-powered image recognition.

### 🔍 Plant Information

Get useful information about identified plants, including:

* Common Name
* Scientific Name
* Plant Family
* Origin
* Description
* Care Instructions
* Toxicity Information

### 🩺 Plant Disease Analysis

Analyze plant health and detect possible diseases from uploaded images.

### 👨‍🌾 User-Friendly Experience

Information can be presented for different user types:

* Child
* Farmer
* Gardener
* Home User

### 📱 Responsive Design

The website is fully responsive and works across desktops, tablets, and mobile devices.

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Font Awesome
* Google Fonts (Inter)

### Backend

* Python
* Flask
* Flask-CORS

### APIs

* PlantNet API (Plant Identification)
* Plant.id API (Plant Disease Analysis)
* Wikipedia API (Additional Plant Information)

---

## Project Structure

```plaintext
AgriTree/
│
├── index.html
│
├── assets/
│   ├── css/
│       ├── style.css
│       └── plant_analyzer.css
│   ├── js/
│       ├── script.js
│       └── plant_analyzer.js
│   ├──templates/
│       ├── dashboard.html
│
├── backend/
│   ├── app.py
│   └── .env
│
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AgriTree.git
cd AgriTree
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate the environment:

Windows:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install flask flask-cors requests python-dotenv
```

### 4. ## API Setup

This project uses the PlantNet API for plant identification.

Before running the project, you need to create your own PlantNet API key.

### PlantNet API

1. Visit the official PlantNet website:

   https://plantnet.org/en/

2. Create an account.

3. Generate your API key from the PlantNet developer portal.

4. Add the key to your `.env` file:

```env
PLANTNET_KEY=YOUR_PLANTNET_API_KEY
```

### Plant.id API

This project also uses Plant.id for plant disease analysis.

1. Create an account at:

https://web.plant.id/

2. Generate your API key.

3. Add it to your `.env` file:

```env
PLANT_ID_KEY=YOUR_PLANT_ID_API_KEY
```

### 5. Run the Application

```bash
python app.py
```

The server will start at:

```plaintext
http://127.0.0.1:5000
```

---

## Future Improvements

Some features planned for future versions:

* User authentication
* Personal plant collection
* Plant care reminders
* Plant growth tracking
* Multi-language support
* AI chatbot for gardening assistance
* Cloud database integration

---

## Why I Built This Project

I built AgriTree as a learning project to explore web development, AI APIs, and plant recognition technologies. The goal was to create something practical that could help users quickly identify plants and understand their health using simple image uploads.

This project also helped me gain experience with frontend development, Flask backend development, API integration, and responsive UI design.

---

## Author

Sandesh Garde

Computer Science Student & Web Developer

Passionate about building useful software, AI-powered applications, and technology-driven solutions that solve real-world problems.

---

## License

This project is created for educational and learning purposes.
