# HealLink 🫶 - AI-Powered Peer Support for Patients

[![Hackathon Banner](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_photos/003/812/548/datas/full_width.png)](#)

HealLink is a prototype web application designed to connect patients and their families with experienced mentors who have navigated similar health journeys. Using AI-powered semantic search and a real-time chat platform, HealLink provides empathetic, experience-based support to those facing medical procedures.

**[Presentation Slides](https://www.canva.com/design/DAG2MYAfQV4/lr4jgLSW14JwGvymrOByTQ/edit?utm_content=DAG2MYAfQV4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)**

---

## 🚀 The Problem We're Solving

Facing a major medical procedure like an organ transplant can be an isolating and terrifying experience. While doctors provide medical guidance, the emotional and logistical challenges are often best understood by someone who has already been through it.

HealLink addresses this gap by:
*   **Connecting Mentees** (patients about to undergo a procedure) with **Mentors** (volunteers who have recovered).
*   Using AI to find the **most relevant match**, not just by procedure, but by personal experience, interests, and background.
*   Providing a **safe, secure, and real-time chat** platform for one-on-one peer support.
*   Leveraging local AI models to ensure the prototype is **fully functional offline** and respects user privacy.

---

## 🛠️ Tech Stack & Features

This project is a full-stack application built with a modern, decoupled architecture.

| Feature               | Technology/Library                                                              | Description                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🌐 **Frontend**       | ![React](https://img.shields.io/badge/React-Vite-blue?logo=react)                 | A responsive and modern user interface built with Vite for a lightning-fast development experience. Styled with ![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white). |
| ⚙️ **Backend**        | ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)        | A high-performance Python API server that handles all business logic, data, and real-time communication.                                                                     |
| 🧠 **AI Matching**    | ![Hugging Face](https://img.shields.io/badge/HF-SentenceTransformers-yellow)      | User introductions are converted into vector embeddings using the `all-MiniLM-L6-v2` model. This allows for semantic search based on the *meaning* of a user's story.      |
| 💬 **AI Introduction**| ![Ollama](https://img.shields.io/badge/Ollama-Gemma_2B-lightgrey)                 | Google's `gemma:2b` model is served locally via Ollama to generate warm, personalized introductions between a matched mentor and mentee, helping to break the ice.               |
| ⚡ **Vector Search**   | ![FAISS](https://img.shields.io/badge/FAISS-Facebook_AI-blue)                     | An ultra-fast vector similarity search library from Meta AI. It finds the mentor with the closest cosine similarity to the mentee in milliseconds.                               |
| 📨 **Real-Time Chat** | ![WebSockets](https://img.shields.io/badge/-WebSockets-red)                       | FastAPI's native WebSocket support provides a persistent, two-way connection for instant messaging between users.                                                            |
| 🗄️ **Database**      | ![SQLite](https://img.shields.io/badge/SQLite-SQL-blue?logo=sqlite&logoColor=white) | A lightweight, file-based SQL database for storing user profiles and information. Perfect for rapid, dependency-free local deployment.                                       |

---

## 🎬 Demo Video

[<img src="HealLinkPreview.gif" width="100%">](https://youtu.be/vybook6hBqY)

---

## 🔧 Running the Project Locally

You can get the entire HealLink platform running on your machine in just a few steps.

### Prerequisites

1.  **Node.js**: [Download & Install Node.js](https://nodejs.org/) (LTS version recommended).
2.  **Python**: [Download & Install Python 3.10+](https://www.python.org/) (make sure to check "Add Python to PATH").
3.  **Ollama**: [Download & Install Ollama](https://ollama.com/). This will serve our local AI model.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/heallink-project.git
cd heallink-project
```

### Step 2: Set Up the AI Model (Ollama) 🤖

This step downloads the Gemma model so our backend can use it.

1.  Open a new terminal.
2.  Pull the Gemma 2B model:
    ```bash
    ollama pull gemma3n:e2b
    ```
3.  Start the Ollama server and load the model (this will also confirm it works):
    ```bash
    ollama run gemma3n:e2b
    ```
    **➡️ Keep this terminal running!** This is your dedicated AI server.

### Step 3: Set Up and Run the Backend ⚙️

1.  Open a **second terminal** and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a Python virtual environment and activate it:
    ```bash
    # Create the environment
    python -m venv .venv

    # Activate it (Windows)
    .\.venv\Scripts\activate

    # Activate it (macOS/Linux)
    # source .venv/bin/activate
    ```
3.  Install all the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    You should see `Uvicorn running on http://127.0.0.1:8000`.

    **➡️ Keep this terminal running!** This is your API server.

### Step 4: Set Up and Run the Frontend 🌐

1.  Open a **third terminal** and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    Your browser should automatically open to `http://localhost:5173` (or a similar address).

    **➡️ Keep this terminal running!** This is your web app server.

### You're all set! 🎉

You now have three terminals running the complete application stack. You can open `http://localhost:5173` in a normal browser window to create a mentor, and an incognito window to create a mentee and see the real-time matching and chat in action.

---

## 🏆 Hackathon Goals & Future Work

*   [x] **Core Matching Logic**: Successfully implemented semantic search to match users.
*   [x] **Real-Time Communication**: Built a functional WebSocket chat.
*   [x] **Local-First AI**: Integrated Ollama for privacy-focused, offline-capable AI.
*   [ ] **Persist Chat History**: Store chat messages in the database so they can be retrieved later.
*   [ ] **Notifications**: Implement a system to notify a mentor when a new mentee connects.
*   [ ] **Group Chats**: Create support groups for specific procedures.
*   [ ] **Deployment**: Dockerize the application for easy deployment to cloud services.

---

Built with ❤️ by [Ibrahim Faruquee](https://www.linkedin.com/in/ibrahim-f1/), [Ancel Ramdass](https://www.linkedin.com/in/ancel-ramdass/), [John M. Pozo](https://www.linkedin.com/in/john-m-pozo-893740188/).
