// AI Chat Functionality with jQuery
$(document).ready(function () {
    const $chatButton = $('#aiChatButton');
    const $chatContainer = $('#aiChatContainer');
    const $chatClose = $('#aiChatClose');
    const $chatInput = $('#aiChatInput');
    const $chatSend = $('#aiChatSend');
    const $chatBody = $('#aiChatBody');
    const $typingIndicator = $('#typingIndicator');
    const $bai_script_url = $('#bai-script-url');

    class Decorate {
        // Show typing indicator with enhanced animation
        static showTypingIndicator() {
            // Add typing indicator to chat body
            $chatBody.append($typingIndicator);

            // Show with animation
            setTimeout(() => {
                $typingIndicator.addClass('active');
                // Smooth scroll to bottom
                $chatBody.animate({scrollTop: $chatBody[0].scrollHeight}, 300);
            }, 100);
        }
        // Hide typing indicator with animation
        static hideTypingIndicator() {
            $typingIndicator.removeClass('active');
            setTimeout(() => {
                $typingIndicator.detach();
            }, 300);
        }
        // Add message to chat
        static addMessage(content, sender, is_hello = false) {
            const $messageDiv = $('<div>').addClass(`ai-message ${sender}`);
            const $contentDiv = $('<div>').addClass(`ai-message-content ${is_hello ? 'is_hello' : ''}`).html(content);

            $messageDiv.append($contentDiv);
            $chatBody.append($messageDiv);

            // Scroll to bottom
            $chatBody.animate({scrollTop: $chatBody[0].scrollHeight}, 300);
        }
    }

    // Toggle chat visibility
    $chatButton.on('click', function () {
        $chatContainer.toggleClass('active');
        if ($chatContainer.hasClass('active')) {
            if ($chatBody.find('.is_hello').length === 0) {
                Decorate.showTypingIndicator();
                setTimeout(() => {
                    Decorate.hideTypingIndicator();
                    Decorate.addMessage('Xin chào👋! Tôi là trợ lí Bflow AI. Tôi có thể giúp gì cho bạn?', 'ai', true);
                }, 1000);
            }
            $chatInput.focus();
        }
    });

    // Close chat
    $chatClose.on('click', function () {
        $chatContainer.removeClass('active');
    });

    // Send message on button click
    $chatSend.on('click', function () {
        sendMessage($bai_script_url.attr('data-ask-url'));
    });

    // Auto-resize textarea
    $chatInput.on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Close chat on Escape key
    $(document).on('keydown', function (e) {
        if (e.which === 27 && $chatContainer.hasClass('active')) {
            $chatContainer.removeClass('active');
        }
    });

    async function askAI(userQuestion) {
        const url = `http://127.0.0.1:8010/api/v1/ask?question=${userQuestion}`
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {}
            });
            if (!response.ok) {
                throw new Error(`Lỗi Server: ${response.status}`);
            }
            Decorate.hideTypingIndicator();
            const data = await response.json();
            if (data) {
                Decorate.addMessage(data, 'ai');
                $chatSend.prop('disabled', false);
            } else {

                let aiResponse = data.message
                Decorate.addMessage(aiResponse, 'ai');
                $chatSend.prop('disabled', false);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    }

    // Send message
    async function sendMessage() {
        const message = $chatInput.val().trim();
        if (message) {
            // Add user message
            Decorate.addMessage(message, 'user');
            $chatInput.val('');
            $chatSend.prop('disabled', true);

            // Show typing indicator
            Decorate.showTypingIndicator();

            await askAI(message);
        }
    }
});