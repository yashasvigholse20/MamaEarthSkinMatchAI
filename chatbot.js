const apiKey = "AIzaSyCPR29Lkk7wezvnlvwlSu02KvUZJiK8M9s"; // Gemini API Key

document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    let conversationHistory = [];
    const systemInstruction = "You are a professional skincare assistant for MamaEarthSkinMatchAI, a natural and premium skincare brand. Help users choose skincare routines, recommend products based on natural ingredients like aloe, neem, vitamin c, and ceramides. Be friendly, concise, and professional.";

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.style.transform = 'scale(0)';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        setTimeout(() => {
            chatbotToggle.style.transform = 'scale(1)';
        }, 300);
    });

    async function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Append User Message
        appendMessage(message, 'user');
        chatInput.value = '';

        // Append Bot typing indicator
        const typingId = appendTypingIndicator();

        conversationHistory.push({ role: "user", parts: [{ text: message }] });

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: { text: systemInstruction }
                    },
                    contents: conversationHistory,
                    generationConfig: {
                        temperature: 0.7
                    }
                })
            });

            removeTypingIndicator(typingId);

            if (!response.ok) {
                const errData = await response.json();
                console.error("Gemini API Error:", errData);
                if (response.status === 400 && errData.error?.message?.includes("API key not valid")) {
                    appendMessage("Error 400: API key not valid. Please check your Gemini API key.", 'bot');
                } else if (response.status === 429) {
                    appendMessage("Error 429: Too Many Requests. You are hitting the Gemini rate limits.", 'bot');
                } else {
                    appendMessage(`Oops! I received an error (${response.status}) from the AI service. Please try again later.`, 'bot');
                }
                return;
            }

            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;

            appendMessage(botReply, 'bot');
            conversationHistory.push({ role: "model", parts: [{ text: botReply }] });

        } catch (error) {
            removeTypingIndicator(typingId);
            appendMessage("It seems I'm offline. Please make sure you have internet and your API key is correct.", 'bot');
            console.error(error);
        }
    }

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    function appendMessage(text, sender) {
        // Simple Markdown parser for bold text and line breaks
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = id;
        typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';

        // add small style securely inline if not existing
        if (!document.getElementById('typing-style')) {
            const style = document.createElement('style');
            style.id = 'typing-style';
            style.innerHTML = `
                .typing-indicator span { animation: blink 1.4s infinite both; display: inline-block; margin: 0 1px; font-weight: bold; font-size: 1.2rem; }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
            `;
            document.head.appendChild(style);
        }

        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
