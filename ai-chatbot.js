document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ AI Chatbot Loaded");

    // Get elements
    const chatContainer = document.getElementById('chatMessages'); // Fixed ID
    const inputField = document.getElementById('userInput'); // Fixed ID
    const sendButton = document.getElementById('sendBtn'); // Fixed ID

    // Ensure elements exist
    if (!chatContainer || !inputField || !sendButton) {
        console.error("🚨 Missing elements in HTML. Check IDs!");
        return;
    }

    let conversationHistory = [];
    let currentQuestion = 0;
    let score = 0;
    let quizData = [];

    // API Key (Ensure this is stored securely, not in frontend)
    const OPENAI_API_KEY = "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";

    // Send message event listener
    sendButton.addEventListener('click', async () => {
        const userInput = inputField.value.trim();
        if (userInput) {
            appendMessage('user', userInput);
            inputField.value = ''; // Clear input field

            if (quizData.length === 0) {
                const aiResponse = await getQuizQuestions(userInput);
                if (aiResponse && aiResponse.questions) {
                    quizData = aiResponse.questions;
                    showQuestion();
                } else {
                    appendMessage('ai', 'Sorry, I could not generate a quiz.');
                }
            } else {
                processAnswer(userInput);
            }
        }
    });

    // Append message to chat window
    function appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', sender);
        messageContainer.innerText = message;
        chatContainer.appendChild(messageContainer);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
    }

    // Fetch quiz questions
    async function getQuizQuestions(topic) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a quiz master. Generate a quiz with 5 multiple-choice questions on the topic. Return the response as a JSON object.' },
                        { role: 'user', content: `Generate a quiz on ${topic} and return in JSON format: { "questions": [ { "question": "What is X?", "options": ["A", "B", "C", "D"], "correctAnswer": "B" } ] }` }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error('Failed to fetch AI response');

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            return null;
        }
    }

    // Display next quiz question
    function showQuestion() {
        if (currentQuestion < quizData.length) {
            const question = quizData[currentQuestion];
            appendMessage('ai', `Question ${currentQuestion + 1}: ${question.question}`);
            question.options.forEach((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // Convert index (0-3) to A-D
                appendMessage('ai', `${optionLetter}) ${option}`);
            });
            appendMessage('ai', "Please select an answer (A, B, C, or D).");
        } else {
            showResults();
        }
    }

    // Process user's answer
    function processAnswer(userAnswer) {
        if (currentQuestion > 0) {
            const question = quizData[currentQuestion - 1];
            const correctLetter = question.correctAnswer;
            if (userAnswer.toUpperCase() === correctLetter) {
                score++;
                appendMessage('ai', `Correct! ✅`);
            } else {
                appendMessage('ai', `Wrong! ❌ The correct answer was ${correctLetter}.`);
            }
            currentQuestion++;
            showQuestion();
        }
    }

    // Show quiz results
    function showResults() {
        appendMessage('ai', `Quiz Over! 🎉 Your score: ${score}/${quizData.length}`);
    }
});
