# HealLink: AI-Powered Peer Support for Medical Journeys

**HealLink is a prototype web application designed for a hackathon, connecting individuals on similar medical journeys through AI-powered, empathetic matching.**

The platform pairs mentees (patients preparing for or recovering from a procedure) with experienced mentors who have undergone the same experience. By leveraging vector similarity search and a large language model, HealLink aims to create meaningful, supportive connections that go beyond simple diagnosis matching.

---

## The Problem

Navigating a serious medical procedure can be an isolating and frightening experience. While clinical support is crucial, the emotional and practical value of connecting with someone who has "been there" is immeasurable. Finding the right peer mentor—someone with a similar experience, personality, and communication style—is a challenge that technology is uniquely positioned to solve.

## Our Solution

HealLink is a full-stack application that provides:

-   **Empathetic Matching:** Instead of just matching on `procedure: "Lung Transplant"`, our backend uses sentence-transformer embeddings to analyze a user's self-introduction. It finds mentors whose personal stories and interests resonate with the mentee's, leading to a higher chance of a successful connection.
-   **AI-Powered Icebreakers:** To ease the anxiety of the first conversation, we use a locally-served LLM (Gemma:2b via Ollama) to generate a warm, personalized introduction that highlights shared interests and experiences.
-   **Real-Time, Private Chat:** Once matched, users can communicate securely through a real-time, two-way chat interface built with WebSockets.
-   **Simplified UX:** A clean, intuitive interface guides users through a seamless flow from sign-up to chat, ensuring the technology feels supportive, not obstructive.

![HealLink Application Screenshot](https-placeholder-for-screenshot.com/heallink-demo.png) 
*(Note: Replace the above URL with an actual screenshot of your running application.)*

---

## Features

-   **Dual User Roles:** Users can sign up as either a **Mentor** (offering support) or a **Mentee** (seeking support).
-   **Smart Onboarding:** A combined login/signup flow checks if a user's email exists. Returning users are logged in directly, while new users are guided to a comprehensive profile creation page.
-   **Vector Similarity Search:** The backend uses `FAISS` to find the best mentor match based on the cosine similarity of their self-introduction embeddings.
-   **Local LLM Integration:** Uses **Ollama** to serve the `Gemma:2b` model locally, ensuring privacy and offline functionality for generating chat introductions.
-   **Live Two-Way Chat:** A persistent WebSocket connection allows mentors and mentees to chat in real-time.
-   **Mentor Dashboard:** Mentors have a dedicated view to see all the mentees who have connected with them.
-   **Dark Mode & Responsive UI:** Built with Tailwind CSS for a modern, accessible user experience.

---

## Tech Stack

| Category      | Technology                                                                                                  | Purpose                                                     |
| :------------ | :---------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **Frontend**  | **React (with Vite)**, **Tailwind CSS**, Axios, Lucide React                                                  | Fast, modern UI with a clean design system.                 |
| **Backend**   | **FastAPI (Python)**, Uvicorn, SQLAlchemy                                                                   | High-performance, asynchronous API for all business logic.  |
| **Database**  | **SQLite**                                                                                                  | Simple, file-based database for easy local deployment.      |
| **AI / ML**   | **Ollama (serving Gemma:2b)**, **Sentence-Transformers**, **FAISS**                                           | Local LLM serving, text embeddings, and vector search.      |
| **Real-Time** | **WebSockets**                                                                                              | Powering the live, two-way chat functionality.              |

---

## Local Deployment Guide

This project is designed to run entirely on your local machine. Follow these steps carefully to get started.

### Prerequisites

1.  **Python 3.10+**: Make sure Python and `pip` are installed.
2.  **Node.js v18+**: Make sure Node.js and `npm` are installed.
3.  **Ollama**: Download and install the Ollama app from [ollama.com](https://ollama.com/).

### Step 1: Set Up the Ollama AI Server

First, we need to download the Gemma model and get the Ollama server running.

1.  **Pull the Gemma Model:** Open a terminal and run:
    ```bash
    ollama pull gemma:2b
    ```
2.  **Run the Model:** Start the server and load the model into memory.
    ```bash
    ollama run gemma:2b
    ```
    You will see a chat prompt. You can now leave this terminal running in the background.

### Step 2: Set Up the FastAPI Backend

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```
2.  **Create and Activate a Virtual Environment:**
    ```bash
    # Create the environment
    python -m venv .venv

    # Activate it (Windows)
    .\.venv\Scripts\activate

    # Activate it (macOS/Linux)
    source .venv/bin/activate
    ```
3.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Start the Backend Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend should now be running at `http://127.0.0.1:8000`.

### Step 3: Set Up the React Frontend

1.  **Open a new terminal.**
2.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```
3.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend should now be running and will automatically open in your browser at `http://localhost:5173`.

### Step 4: Using the Application

You're all set! You now have three processes running: Ollama, the FastAPI backend, and the Vite frontend.

To test the full user flow:
1.  **Create a Mentor:** Open your browser to `http://localhost:5173`. Sign up with a mentor email (e.g., `mentor@example.com`) and fill out the profile as a **Mentor**.
2.  **Create a Mentee:** Open an incognito/private browser window. Navigate to `http://localhost:5173`. Sign up with a different email (e.g., `mentee@example.com`) and fill out the profile as a **Mentee**.
3.  **Find a Match:** As the mentee, click the "Find My Best Match" button.
4.  **Start Chatting:** You will be taken to a chat room with an AI-generated introduction. Go back to the mentor's browser window, refresh the page, and you will see the mentee in your connection list. Click "Chat" to join the conversation.

---

## Future Improvements

This hackathon prototype sets the foundation for a powerful platform. Future enhancements could include:
-   **Persistent Chat History:** Store chat messages in the database so conversations are not lost on logout.
-   **Real-time Notifications:** Implement a notification system to alert a mentor via email or push notification when a new mentee connects.
-   **Expanded Mentor Vetting:** Create an admin interface for vetting and approving mentor applications.
-   **Production Deployment:** Containerize the application with Docker and deploy it to a cloud platform.
-   **Advanced Filtering:** Allow mentees to filter potential mentors by availability, timezone, or other criteria in addition to the AI matching.
-   **Feedback System:** Let mentees and mentors rate their experience to improve the matching algorithm over time.

---
**Built with ❤️ for the community.**
