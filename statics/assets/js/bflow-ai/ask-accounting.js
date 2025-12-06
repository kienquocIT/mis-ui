// AI Chat Functionality with jQuery - Streaming Version
$(document).ready(function () {
    // CẤU HÌNH URL API (Hãy đảm bảo port khớp với FastAPI server của bạn)
    const API_URL = "/api/ai-bflow/accounting-ask";

    const $chatButton = $('#aiChatButton');
    const $chatContainer = $('#aiChatContainer');
    const $chatClose = $('#aiChatClose');
    const $chatInput = $('#aiChatInput');
    const $chatSend = $('#aiChatSend');
    const $chatBody = $('#aiChatBody');
    const $typingIndicator = $('#typingIndicator');

    class Decorate {
        static typingTimer = null;

        // Hiển thị trạng thái đang xử lý
        static showTypingIndicator() {
            let $textSpan = $typingIndicator.find('.typing-text');

            // Tạo thẻ text nếu chưa có
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

            // 1. Trạng thái đầu tiên
            $textSpan.text("Đang phân tích...");

            // Reset timer cũ nếu có
            if (this.typingTimer) clearTimeout(this.typingTimer);

            // 2. Trạng thái sau 2.5 giây nếu server chưa phản hồi
            this.typingTimer = setTimeout(() => {
                if ($typingIndicator.hasClass('active')) {
                    $textSpan.text("Vui lòng đợi...");
                }
            }, 2500);

            // Hiển thị ra giao diện
            $chatBody.append($typingIndicator);
            setTimeout(() => {
                $typingIndicator.addClass('active');
                $chatBody.animate({scrollTop: $chatBody[0].scrollHeight}, 300);
            }, 100);
        }

        // Ẩn trạng thái đang xử lý
        static hideTypingIndicator() {
            // Hủy timer đổi chữ ngay lập tức
            if (this.typingTimer) {
                clearTimeout(this.typingTimer);
                this.typingTimer = null;
            }

            $typingIndicator.removeClass('active');
            // Detach khỏi DOM sau khi animation fadeOut xong (giả lập 300ms)
            setTimeout(() => {
                $typingIndicator.detach();
            }, 300);
        }

        // Thêm tin nhắn tĩnh (User hoặc thông báo lỗi)
        static addMessage(content, sender, is_hello = false) {
            const $messageDiv = $('<div>').addClass(`ai-message ${sender}`);
            // white-space: pre-wrap giữ định dạng xuống dòng
            const $contentDiv = $('<div>')
                .addClass(`ai-message-content ${is_hello ? 'is_hello' : ''}`)
                .css('white-space', 'pre-wrap')
                .html(content);

            $messageDiv.append($contentDiv);
            $chatBody.append($messageDiv);
            $chatBody.animate({scrollTop: $chatBody[0].scrollHeight}, 300);
        }

        /**
         * Khởi tạo bong bóng chat RỖNG cho AI để chuẩn bị nhận Stream
         * @returns {jQuery} Đối tượng DOM để append text vào
         */
        static initStreamingMessage(sender) {
            const $messageDiv = $('<div>').addClass(`ai-message ${sender}`);
            const $contentDiv = $('<div>')
                .addClass('ai-message-content')
                .css('white-space', 'pre-wrap'); // Quan trọng để hiển thị Markdown/Text đẹp

            $messageDiv.append($contentDiv);
            $chatBody.append($messageDiv);

            // Scroll xuống dưới cùng
            $chatBody.animate({scrollTop: $chatBody[0].scrollHeight}, 300);

            return $contentDiv;
        }
    }

    // --- Event Listeners ---

    $chatButton.on('click', function () {
        $chatContainer.toggleClass('active');
        if ($chatContainer.hasClass('active')) {
            // Nếu chưa có tin nhắn chào thì hiển thị
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

    $chatClose.on('click', function () {
        $chatContainer.removeClass('active');
    });

    $chatSend.on('click', function () {
        sendMessage();
    });

    // Auto-resize textarea
    $chatInput.on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Enter để gửi, Shift+Enter xuống dòng
    $chatInput.on('keydown', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $chatSend.click();
        }
    });

    // ESC để đóng
    $(document).on('keydown', function (e) {
        if (e.which === 27 && $chatContainer.hasClass('active')) {
            $chatContainer.removeClass('active');
        }
    });

    // --- Core Logic: Ask AI with Streaming ---

    async function askAI(userQuestion) {
        const url = `${API_URL}?question=${encodeURIComponent(userQuestion)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Lỗi Server: ${response.status}`);
            }

            // --- TRỌNG TÂM YÊU CẦU CỦA BẠN ---
            // 1. Chỉ ẩn 'Đang phân tích...' khi kết nối thành công và bắt đầu nhận dữ liệu
            Decorate.hideTypingIndicator();

            // 2. Tạo bong bóng chat mới ngay lập tức
            const $streamingContent = Decorate.initStreamingMessage('ai');

            // 3. Đọc luồng dữ liệu (Stream)
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Giải mã byte thành text
                const chunk = decoder.decode(value, { stream: true });

                // Nhả từng chữ vào bong bóng chat
                // Dùng createTextNode để tránh lỗi XSS và hiển thị đúng ký tự đặc biệt
                $streamingContent.append(document.createTextNode(chunk));

                // Tự động cuộn xuống nếu nội dung dài ra
                $chatBody.scrollTop($chatBody[0].scrollHeight);
            }

            // Hoàn tất
            $chatSend.prop('disabled', false);

        } catch (error) {
            console.error("Lỗi kết nối:", error);
            Decorate.hideTypingIndicator(); // Ẩn loading nếu lỗi
            Decorate.addMessage("Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.", 'ai');
            $chatSend.prop('disabled', false);
        }
    }

    async function sendMessage() {
        const message = $chatInput.val().trim();
        if (message) {
            // 1. Hiển thị tin nhắn User
            Decorate.addMessage(message, 'user');

            // 2. Khóa input và nút gửi
            $chatInput.val('');
            $chatInput.css('height', 'auto');
            $chatSend.prop('disabled', true);

            // 3. Hiển thị 'Đang phân tích...' NGAY LẬP TỨC
            Decorate.showTypingIndicator();

            // 4. Gửi request
            await askAI(message);
        }
    }
});