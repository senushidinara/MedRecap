# 🏥 MedRecap AI

**Gamified, AI-Powered Medical Learning Platform for Clinical Mastery, Wellness, and Accessibility.**

> A specialized medical study aid bridging foundational sciences with clinical application. Ideal for doctors, students, and lifelong learners to quickly recap topics with depth, supported by AI.

---

## 📖 Introduction / Problem Statement

**The Challenge:** Medical students and professionals often struggle to bridge the gap between foundational sciences (anatomy, physiology) and clinical application (pathology, diagnosis) while managing immense cognitive load and stress. The sheer volume of information can lead to burnout, and traditional linear study methods often lack the adaptability required for neurodiverse learners or those needing rapid, context-aware integration.

**The Solution:** **MedRecap AI** solves this by using Google's Gemini 2.5 models to generate adaptive study guides, gamified quizzes, and visual recall exercises in real-time. It creates a personalized, stress-free learning environment that prioritizes retention, mental well-being, and accessibility.

---

## 🌟 Core Pillars

<details>
<summary><strong>1. 🤖 AI for Healthcare</strong></summary>

Leveraging the latest in Generative AI to provide accurate, high-yield medical education.

*   **Real-time Content Generation:** Uses `gemini-2.5-flash` to create study guides, flowcharts, and summaries instantly.
*   **Predictive Study Pathways:** Analyzes user performance to suggest the next logical topic to study, creating a personalized curriculum.
*   **Natural Language Question Answering:** An integrated AI tutor (Learning Chat) answers clinical questions and cites sources using Google Search grounding.
*   **Smart Difficulty Adjustment:** Quizzes adapt dynamically (Easy, Medium, Hard) based on user proficiency.

</details>

<details>
<summary><strong>2. 🧠 Mental Health & Wellness</strong></summary>

Designed specifically to reduce cognitive load and prevent burnout during intense study sessions.

*   **Mental Fatigue Tracker:** A dashboard tool for quick self-assessment of stress and focus levels.
*   **Zen Mode:** A distraction-free "Focus Mode" that removes UI clutter to reduce cognitive overwhelm.
*   **Mindfulness Integration:** Encourages breathing exercises when high stress is reported.
*   **Gamification:** Uses streaks, XP points, and achievements to make studying rewarding rather than draining.

</details>

<details>
<summary><strong>3. ♿ Accessibility & Patient Support</strong></summary>

Ensuring medical education is accessible to all learners, including those with diverse needs.

*   **Text-to-Speech (TTS):** `gemini-2.5-flash-preview-tts` generates natural-sounding audio summaries for auditory learners.
*   **Visual Accessibility:** Built-in **High Contrast Mode** and **Large Text** options for visually impaired users.
*   **Dual Learning Modes:** Splits content into "Foundational" vs. "Clinical" views to help neurodiverse learners connect abstract concepts to concrete applications.
*   **Multi-modal Learning:** Offers text, audio, interactive diagrams, and drawing tools to suit different learning styles.

</details>

<details>
<summary><strong>4. 🌍 Public Health & Community Impact</strong></summary>

Scalable education tools for better-prepared doctors globally.

*   **Global Resource Library:** Integration with standardized clinical guidelines ensures knowledge is applicable worldwide.
*   **Offline-First Design:** The application UI is lightweight and designed to function well in regions with limited internet bandwidth (simulated offline capabilities).
*   **Cloud Syncing:** Progress and streaks are saved (simulated via local storage) to allow continuous learning across sessions.
*   **Population Impact:** By training better doctors faster, the platform aims to improve long-term public health outcomes.

</details>

---

## ✨ Key Features

<details>
<summary><strong>🧠 AI-Powered Study Guides</strong></summary>

*   **Dual-View Learning:** Seamlessly switch between Foundational Sciences (Year 1) and Clinical Application (Year 3).
*   **Mnemonics & High-Yield Key Points:** Automatically generated memory aids for rapid retention.
*   **Mermaid.js Flowcharts:** Visualizes complex pathways (e.g., nervous system tracts) instantly.
*   **Predictive Pathways:** Suggests related topics to build a comprehensive knowledge graph.

</details>

<details>
<summary><strong>🎮 Gamified Learning & Active Recall</strong></summary>

*   **Matching Games:** Drag-and-drop mini-games for terminology and definitions.
*   **Visual Recall:** AI-generated anatomical diagrams with hide/reveal functionality for self-testing.
*   **Interactive Sketchpad:** A digital whiteboard to draw and reinforce spatial memory of anatomical structures.

</details>

<details>
<summary><strong>📝 Smart Quiz System</strong></summary>

*   **Clinical Vignettes:** Generates USMLE-style case questions on the fly.
*   **Adaptive Difficulty:** 
    *   *Easy:* Basic fact recall.
    *   *Medium:* Clinical correlation.
    *   *Hard:* Complex reasoning and obscure presentations.
*   **AI Analytics Dashboard:** Visualizes progress, streaks, topics mastered, and mastery levels.

</details>

<details>
<summary><strong>💬 AI Tutor & Search Grounding</strong></summary>

*   **Context-Aware Chat:** Ask follow-up questions about the specific topic being studied.
*   **Google Search Integration:** The AI uses the `googleSearch` tool to find and cite real-world sources, ensuring up-to-date clinical information.

</details>

---

## 🏗️ Architecture

<details>
<summary><strong>🧩 System Flow (Mermaid Diagram)</strong></summary>

```mermaid
graph TD
    User[User] -->|Selects Topic| UI[React UI]
    UI -->|Request Content| Service[Gemini Service]
    
    subgraph "Google Gemini API"
        Service -->|Text Generation| Flash[Gemini 2.5 Flash]
        Service -->|Diagram Generation| Imagen[Gemini 2.5 Flash Image]
        Service -->|Audio Generation| TTS[Gemini 2.5 TTS]
        Service -->|Search Grounding| Search[Google Search Tool]
    end
    
    Flash -->|JSON Study Guide + Predictive Pathway| UI
    Imagen -->|Anatomy Diagrams| UI
    TTS -->|Audio Summary| UI
    Search -->|Cited Sources| UI
    
    UI -->|Render| Guide[Study View]
    Guide -->|Toggle| Zen[Zen Mode]
    Guide -->|Check| Mood[Mood Tracker]
    Guide -->|Play| Quiz[Adaptive Quiz]
```

</details>

<details open>
<summary><strong>🛠️ Tech Stack</strong></summary>

*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **AI Logic**: `gemini-2.5-flash` (Content Generation, Quiz Logic, Chat)
*   **AI Vision**: `gemini-2.5-flash-image` (Anatomy Diagrams)
*   **AI Voice**: `gemini-2.5-flash-preview-tts` (Accessibility/TTS)
*   **Visualization**: Mermaid.js (Process Flows), HTML5 Canvas (Sketchpad)
*   **Icons**: Lucide React

</details>

---

## 🚀 How to Use

1.  **Check In**: Use the **Mental Fatigue Tracker** on the dashboard to assess your focus.
2.  **Search**: Enter any medical topic (e.g., "Circle of Willis" or "Myocardial Infarction").
3.  **Listen**: Click the **Listen** button to hear an AI-narrated summary (Text-to-Speech).
4.  **Focus**: Toggle **Zen Mode** or **High Contrast** via Settings to reduce overwhelm.
5.  **Study**: Review the Dual-View content, play the Matching Game, or use the Sketchpad.
6.  **Visual Recall**: Click "Visualize Anatomy" to generate a diagram, then toggle visibility to test yourself.
7.  **Quiz**: Select "Hard" difficulty to test your clinical reasoning with AI-generated vignettes.
8.  **Ask**: Use the floating "Ask Tutor" button to clarify doubts with cited sources.
9.  **Track**: Watch your **XP and Streaks** grow on the dashboard.
