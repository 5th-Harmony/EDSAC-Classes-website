<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materials - ENIAC Classes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            color: #374151;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
    </style>
</head>
<body class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4 px-6 md:px-12">
        <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">ENIAC Classes</h1>
            <div class="relative w-full md:w-1/2 flex justify-end items-center">
                <a href="index.html" class="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300">Explore Courses</a>
            </div>
        </div>
    </header>

    <main class="flex-grow container mx-auto p-6 md:p-12">
        <h2 class="text-4xl font-extrabold text-gray-800 mb-6 text-center">Learning Materials</h2>
        <p class="text-center text-lg text-gray-600 mb-12">Find and download lecture notes, articles, and supplementary videos for your courses.</p>

        <!-- Materials Grid -->
        <section class="mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="materials-grid">
                <!-- Materials will be dynamically inserted here -->
            </div>
        </section>

        <!-- AI-Powered Tools Section -->
        <section>
            <h2 class="text-3xl font-bold text-gray-800 mb-6">AI-Powered Tools ✨</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Smart Content Summarizer -->
                <div class="bg-white rounded-2xl shadow-md p-8">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-4">Smart Content Summarizer ✨</h3>
                    <p class="text-gray-500 mb-4">Paste a lecture or article below to get a concise summary.</p>
                    <textarea id="summarizerInput" class="w-full h-40 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" placeholder="Paste your text here..."></textarea>
                    <button id="summarizeButton" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-full mt-4 hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                        <span id="summarizeText">Summarize</span>
                        <div id="summarizeSpinner" class="hidden w-5 h-5 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                    </button>
                    <div id="summarizedOutput" class="mt-6 p-4 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-wrap hidden"></div>
                </div>

                <!-- AI Tutor Chatbot -->
                <div class="bg-white rounded-2xl shadow-md p-8 flex flex-col">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-4">AI Tutor Chatbot ✨</h3>
                    <p class="text-gray-500 mb-4">Ask the tutor a question about any topic.</p>
                    <div id="chatbox" class="flex-grow flex flex-col space-y-4 overflow-y-auto h-72 p-4 bg-gray-100 rounded-lg mb-4">
                        <div class="flex justify-start">
                            <div class="bg-indigo-100 text-indigo-800 p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                                Hi there! I'm your AI Tutor. How can I help you today?
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="chatInput" class="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" placeholder="Type your question...">
                        <button id="chatButton" class="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-300">
                            <svg id="chatSendIcon" class="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            <div id="chatSpinner" class="hidden w-6 h-6 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6 mt-12">
        <div class="container mx-auto text-center text-sm">
            <p>&copy; 2025 ENIAC Classes. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Gemini API Configuration
        const API_KEY = ""; // Gemini API key
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
        
        // Sample data for learning materials
        const materials = [
            {
                title: "Introduction to AI: Lecture Notes",
                description: "A summary of the core concepts and history of Artificial Intelligence.",
                type: "PDF",
                icon: "📄",
                link: "#" // Placeholder link
            },
            {
                title: "Data Science Fundamentals Video",
                description: "An introductory video on data cleaning and exploratory data analysis.",
                type: "Video",
                icon: "▶️",
                link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Placeholder link
            },
            {
                title: "Math Quiz on Algebra",
                description: "A short quiz to test your understanding of basic algebra principles.",
                type: "Quiz",
                icon: "📝",
                link: "#" // Placeholder link
            },
            {
                title: "Cloud Computing Whitepaper",
                description: "A detailed document on the benefits and architecture of cloud infrastructure.",
                type: "PDF",
                icon: "📄",
                link: "#" // Placeholder link
            },
            {
                title: "Cybersecurity Tips and Tricks",
                description: "A simple guide to common cybersecurity practices for beginners.",
                type: "PDF",
                icon: "📄",
                link: "#" // Placeholder link
            }
        ];

        // Function to render materials dynamically
        function renderMaterials() {
            const grid = document.getElementById('materials-grid');
            grid.innerHTML = materials.map(material => `
                <div class="material-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <span class="text-4xl">${material.icon}</span>
                            <div class="ml-4">
                                <h3 class="text-xl font-semibold text-gray-900">${material.title}</h3>
                                <p class="text-sm text-gray-500">${material.type} File</p>
                            </div>
                        </div>
                        <p class="text-gray-500 mt-2">${material.description}</p>
                        <a href="${material.link}" class="mt-4 inline-block w-full bg-indigo-600 text-white font-semibold text-center py-2 rounded-full hover:bg-indigo-700 transition duration-300">
                            ${material.type === 'PDF' ? 'Download PDF' : material.type === 'Video' ? 'Watch Video' : 'Start Quiz'}
                        </a>
                    </div>
                </div>
            `).join('');
        }
        
        // Initial render
        document.addEventListener('DOMContentLoaded', renderMaterials);

        // --- Smart Content Summarizer Logic ---
        const summarizeButton = document.getElementById('summarizeButton');
        const summarizeInput = document.getElementById('summarizerInput');
        const summarizedOutput = document.getElementById('summarizedOutput');
        const summarizeSpinner = document.getElementById('summarizeSpinner');
        const summarizeText = document.getElementById('summarizeText');

        summarizeButton.addEventListener('click', async () => {
            const textToSummarize = summarizeInput.value;
            if (textToSummarize.trim() === "") {
                // Using an alternative UI for alert
                const messageDiv = document.createElement('div');
                messageDiv.textContent = 'Please enter some text to summarize.';
                messageDiv.className = 'p-3 bg-red-100 text-red-800 rounded-lg mt-2';
                summarizedOutput.textContent = '';
                summarizedOutput.classList.remove('hidden');
                summarizedOutput.appendChild(messageDiv);
                return;
            }

            // Show loading state
            summarizeText.classList.add('hidden');
            summarizeSpinner.classList.remove('hidden');
            summarizedOutput.textContent = ''; // Clear previous output
            summarizedOutput.classList.add('hidden');

            const prompt = `Summarize the following text:\n\n${textToSummarize}`;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || "No summary could be generated.";
                
                summarizedOutput.textContent = summary;
                summarizedOutput.classList.remove('hidden');
            } catch (error) {
                console.error("Error summarizing content:", error);
                summarizedOutput.textContent = 'An error occurred while generating the summary. Please try again.';
                summarizedOutput.classList.remove('hidden');
            } finally {
                // Hide loading state
                summarizeText.classList.remove('hidden');
                summarizeSpinner.classList.add('hidden');
            }
        });

        // --- AI Tutor Chatbot Logic ---
        const chatInput = document.getElementById('chatInput');
        const chatButton = document.getElementById('chatButton');
        const chatbox = document.getElementById('chatbox');
        const chatSendIcon = document.getElementById('chatSendIcon');
        const chatSpinner = document.getElementById('chatSpinner');

        let chatHistory = [{
            role: "model",
            parts: [{ text: "Hi there! I'm your AI Tutor. Ask me anything about the materials on this page or any other topic." }]
        }];

        const sendMessage = async () => {
            const userMessage = chatInput.value.trim();
            if (userMessage === "") return;

            // Add user message to chatbox
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'flex justify-end';
            userMessageDiv.innerHTML = `<div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-br-none max-w-[80%]">${userMessage}</div>`;
            chatbox.appendChild(userMessageDiv);
            chatbox.scrollTop = chatbox.scrollHeight;

            chatInput.value = '';

            // Show loading state
            chatButton.disabled = true;
            chatSendIcon.classList.add('hidden');
            chatSpinner.classList.remove('hidden');

            chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

            const payload = {
                contents: chatHistory,
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                const tutorResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

                // Add tutor response to chatbox
                const tutorMessageDiv = document.createElement('div');
                tutorMessageDiv.className = 'flex justify-
