document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    
    let conversationHistory = [];
    let currentQuestion = 0;
    let score = 0;
    let quizData = [];

    sendBtn.addEventListener('click', async () => {
        const userText = userInput.value.trim();
        if (!userText) return;

        appendMessage('user', userText);
        userInput.value = '';

        try {
            if (quizData.length === 0) {
                const aiResponse = await getQuizQuestions(userText);
                if (aiResponse && aiResponse.questions) {
                    quizData = aiResponse.questions;
                    showQuestion();
                } else {
                    appendMessage('ai', 'Sorry, I could not generate a quiz.');
                }
            } else {
                processAnswer(userText);
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            appendMessage('ai', 'An error occurred while fetching the quiz.');
        }
    });

    function appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', sender);
        messageContainer.innerText = message;
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getQuizQuestions(topic) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a quiz master. Generate a 5-question multiple-choice quiz on a given topic.' },
                        { role: 'user', content: `Generate a quiz on ${topic} in JSON format with "questions" array, where each object has "question", "options", and "correctAnswer" fields.` }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error('Failed to fetch AI response');

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return null;
        }
    }

    function showQuestion() {
        if (currentQuestion < quizData.length) {
            const question = quizData[currentQuestion];
            appendMessage('ai', `Question: ${question.question}`);
            question.options.forEach((option, index) => {
                appendMessage('ai', `${String.fromCharCode(65 + index)}) ${option}`);
            });
            appendMessage('ai', "Select an answer (A, B, C, or D).");
        } else {
            appendMessage('ai', `Quiz Over! 🎉 Your score: ${score}/${quizData.length}`);
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
});
