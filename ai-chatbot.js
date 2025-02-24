// ai_chatbot.js

async function initializeChatbot() {
    const chatContainer = document.getElementById('chatContainer');
    const inputField = document.getElementById('inputField');
    const sendButton = document.getElementById('sendButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContainer = document.getElementById('resultContainer');

    let conversationHistory = [];
    let currentQuestion = 0;
    let score = 0;
    let quizData = [];

    
    const OPENAI_API_KEY = "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";

    sendButton.addEventListener('click', async () => {
        const userInput = inputField.value.trim();
        if (userInput) {
            appendMessage('user', userInput);
            inputField.value = '';
            loadingIndicator.style.display = 'block';

            try {
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
            } catch (error) {
                console.error('Error fetching AI response:', error);
                appendMessage('ai', 'An error occurred while fetching the quiz.');
            } finally {
                loadingIndicator.style.display = 'none';
            }
        }
    });

    function appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', sender);
        messageContainer.innerText = message;
        chatContainer.appendChild(messageContainer);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function getQuizQuestions(topic) {
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
        try {
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    function showQuestion() {
        if (currentQuestion < quizData.length) {
            const question = quizData[currentQuestion];
            appendMessage('ai', `Question: ${question.question}`);
            question.options.forEach((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // Convert index (0-3) to A-D
                appendMessage('ai', `${optionLetter}) ${option}`);
            });
            appendMessage('ai', "Please select an answer (A, B, C, or D).");
        } else {
            showResults();
        }
    }

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

    function showResults() {
        appendMessage('ai', `Quiz Over! 🎉 Your score: ${score}/${quizData.length}`);
        resultContainer.innerText = `Your score: ${score} out of ${quizData.length}`;
    }
}

document.addEventListener('DOMContentLoaded', initializeChatbot);
