$(document).ready(function () {
    let useTest = false;
    let testHour = 12;
    
    const $page = $("#idxPageContent");

    function updateBg() {
        const now = new Date();
        const hour = useTest ? testHour : (now.getHours() + now.getMinutes() / 60);

        // --- BAN NGÀY ---
        if (hour >= 5 && hour < 19) {
            $page.removeClass("night").addClass("day");
            $('#employee-current-fullname, #employee-current-company')
                .addClass('text-black').removeClass('text-white');
        }
        // --- BAN ĐÊM ---
        else {
            $page.removeClass("day").addClass("night");
            $('#employee-current-fullname, #employee-current-company')
                .removeClass('text-black').addClass('text-white');
        }

        const phases = [
            {range: [5, 7], page: "linear-gradient(135deg, #f2d7c2 0%, #e8bfae 30%, #d6a5c0 70%, #bfa0d5 100%)"},
            {range: [7, 16], page: "linear-gradient(135deg, #d6ecfa 0%, #a3d5f7 30%, #7fbce9 60%, #5aa3d6 100%)"},
            {range: [16, 19], page: "linear-gradient(135deg, #f2d7c2 0%, #e8bfae 30%, #d6a5c0 70%, #bfa0d5 100%)"},
            {range: [19, 24], page: "linear-gradient(135deg, #232946 0%, #2e3a59 50%, #44576d 100%)"},
            {range: [0, 5], page: "linear-gradient(135deg, #232946 0%, #2e3a59 50%, #44576d 100%)"},
        ];

        for (let phase of phases) {
            if (hour >= phase.range[0] && hour < phase.range[1]) {
                $page.css("background", phase.page);
                break;
            }
        }
    }

    updateBg();
    setInterval(updateBg, 60 * 1000);
})
