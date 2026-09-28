<<<<<<< HEAD
AI-Powered Browser
==================

Overview
--------
AI-Powered Browser is a research-style browser built using Electron, FastAPI, and modern AI tools.  
The system integrates a Chromium-based browser with an AI engine capable of understanding commands, automating browsing tasks, and performing visual analysis using computer vision modules.

This project demonstrates the integration of:
• Browser engineering
• AI agents
• automation systems
• LLM APIs
• computer vision

It is designed as a portfolio-level AI engineering project.

------------------------------------------------------------

Key Features
------------
1. AI Command Interface
   Users can type or speak commands such as:
   "open youtube"
   "search AI browser"
   "summarize this page"

2. AI Engine
   FastAPI backend that processes commands using LLM APIs.

3. Browser Automation
   Automated browsing using Playwright.

4. Voice Assistant
   Voice commands using Web Speech API.

5. Computer Vision Module
   ORB feature detection and OpenCV integration.

6. Modular Architecture
   Clean folder structure separating browser engine, AI engine, frontend, and vision systems.

------------------------------------------------------------

Technology Stack
----------------

Frontend
• HTML
• CSS
• TailwindCSS
• JavaScript

Browser Engine
• Electron
• Chromium

AI Backend
• Python
• FastAPI
• GROQ LLM API

Automation
• Playwright

Computer Vision
• OpenCV
• ORB feature detection

Utilities
• dotenv
• requests
• numpy

------------------------------------------------------------

Project Folder Structure
------------------------

AI-Browser
│
├── electron
│   ├── main.js
│   ├── preload.js
│   ├── windowManager.js
│   └── browserControls.js
│
├── frontend
│   ├── index.html
│   ├── components
│   ├── scripts
│   └── styles
│
├── ai-engine
│   ├── app.py
│   ├── agents
│   ├── commands
│   └── llm
│
├── automation
│   ├── playwright_agent.py
│   └── web_actions.py
│
├── vision
│   ├── orb3d
│   └── opencv
│
├── config
│   ├── settings.py
│   ├── browser_config.json
│   └── ai_config.json
│
├── tests
│   ├── ai_tests.py
│   ├── browser_tests.js
│   └── vision_tests.py
│
├── requirements.txt
├── package.json
└── README.md

------------------------------------------------------------

Installation
------------

1. Clone the repository

git clone https://github.com/your-username/ai-browser.git

cd ai-browser


2. Install Python dependencies

pip install -r requirements.txt


3. Install Playwright browsers

playwright install


4. Install Electron dependencies

npm install


------------------------------------------------------------

Environment Variables
---------------------

Create a `.env` file in the project root:

GROQ_API_KEY=your_api_key_here


------------------------------------------------------------

Running the System
------------------

Step 1: Start the AI Engine

uvicorn ai-engine.app:app --reload


Step 2: Start the Browser

npm start


------------------------------------------------------------

Testing
-------

AI Engine Test

python tests/ai_tests.py


Automation Test

python tests/automation_test.py


Vision Test

python tests/vision_tests.py


------------------------------------------------------------

Example Commands
----------------

open youtube

open github

search artificial intelligence browser

summarize this page


------------------------------------------------------------

Future Improvements
-------------------

• Autonomous AI web agents  
• Page summarization with RAG  
• Gesture control for browser navigation  
• Knowledge graph for browsing history  
• AR/3D browser visualization using ORB-SLAM  

------------------------------------------------------------

Author
------

Dhruv

AI Engineering Project
AI-Powered Browser System
=======
# AI-Browser-Steel
Next Gen AI Powered Browser
>>>>>>> 302dee3be6b15bde1ab2ff410abc6a8b780d6402
