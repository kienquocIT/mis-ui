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
        // Biến lưu trữ ID của timer để có thể hủy khi cần
        static typingTimer = null;

        // Show typing indicator with enhanced animation
        static showTypingIndicator() {
            // 1. Xử lý phần Text hiển thị
            // Tìm thẻ text, nếu chưa có thì tạo mới
            let $textSpan = $typingIndicator.find('.typing-text');
            if ($textSpan.length === 0) {
                $textSpan = $('<span>').addClass('typing-text').css({
                    'display': 'block',
                    'font-size': '12px',
                    'color': '#999',
                    'font-style': 'italic',
                    'margin-left': '5px',
                    'animation': 'fadeIn 0.5s'
                });
                $typingIndicator.find('.typing-bubble').after($textSpan);
            }

            // Set text mặc định ban đầu
            $textSpan.text("Đang phân tích...");

            // Hủy timer cũ nếu còn tồn tại (đề phòng click liên tục)
            if (this.typingTimer) clearTimeout(this.typingTimer);

            // Đặt timer mới: Sau 3 giây đổi text
            this.typingTimer = setTimeout(() => {
                // Chỉ đổi text nếu indicator vẫn đang hiển thị (có class active)
                if ($typingIndicator.hasClass('active')) {
                    $textSpan.text("Bạn đợi tí nhé...");
                }
            }, 3000);

            // 2. Logic hiển thị giao diện cũ của bạn
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
            // Quan trọng: Hủy timer đổi chữ ngay lập tức khi bot đã trả lời
            if (this.typingTimer) {
                clearTimeout(this.typingTimer);
                this.typingTimer = null;
            }

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
                // Giả lập trạng thái đang gõ khi mở lần đầu
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
        // Sửa lại: Gọi hàm sendMessage() chứ không truyền tham số URL vào đây
        // URL được xử lý bên trong hàm askAI hoặc lấy trực tiếp
        sendMessage();
    });

    // Auto-resize textarea
    $chatInput.on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Gửi bằng phím Enter (nhưng Shift+Enter để xuống dòng)
    $chatInput.on('keydown', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $chatSend.click();
        }
    });

    // Close chat on Escape key
    $(document).on('keydown', function (e) {
        if (e.which === 27 && $chatContainer.hasClass('active')) {
            $chatContainer.removeClass('active');
        }
    });

    async function askAI(userQuestion) {
        // Lưu ý: Đảm bảo URL này chính xác với server của bạn
        const url = `http://127.0.0.1:8010/api/v1/ask?question=${encodeURIComponent(userQuestion)}`; // Nên encodeURIComponent câu hỏi
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {}
            });
            if (!response.ok) {
                throw new Error(`Lỗi Server: ${response.status}`);
            }

            // Ẩn loading trước khi hiện tin nhắn
            Decorate.hideTypingIndicator();

            const data = await response.json();

            // Xử lý dữ liệu trả về tùy theo format API của bạn
            if (typeof data === 'string') {
                Decorate.addMessage(data, 'ai');
            } else if (data && data.message) {
                Decorate.addMessage(data.message, 'ai');
            } else {
                Decorate.addMessage(JSON.stringify(data), 'ai');
            }

            $chatSend.prop('disabled', false);

        } catch (error) {
            console.error("Lỗi kết nối:", error);
            Decorate.hideTypingIndicator(); // Ẩn loading nếu lỗi
            Decorate.addMessage("Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.", 'ai');
            $chatSend.prop('disabled', false);
        }
    }

    // Send message
    async function sendMessage() {
        const message = $chatInput.val().trim();
        if (message) {
            // Add user message
            Decorate.addMessage(message, 'user');
            $chatInput.val('');
            // Reset height textarea
            $chatInput.css('height', 'auto');

            $chatSend.prop('disabled', true);

            // Show typing indicator with dynamic text
            Decorate.showTypingIndicator();

            await askAI(message);
        }
    }
});
