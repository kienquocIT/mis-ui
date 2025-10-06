$(document).ready(function () {
    let useTest = false;
    let testHour = 12;

    function updateSunMoon() {
        const now = new Date();
        const hour = useTest ? testHour : (now.getHours() + now.getMinutes() / 60);

        const $sun = $("#sun");
        const $moon = $("#moon");
        const $page = $("#idxPageContent");

        const w = $(window).width();
        const h = $(window).height();

        if (hour >= 5 && hour < 19) {
            // SUN (5h → 19h)
            let progress = (hour - 5) / 14; // 0 → 1 (14h ban ngày)
            const x = w * progress - 80;
            const y = h * (0.75 - 0.75 * Math.sin(progress * Math.PI));

            $sun.css({
                "transform": `translate(${x}px, ${y}px)`,
                "opacity": 1
            });
            $moon.css("opacity", 0);

            $('#employee-current-fullname').addClass('text-primary').removeClass('text-white');
            $('#employee-current-company').addClass('text-primary').removeClass('text-white');
            $page.find('p').addClass('text-muted').removeClass('text-black');
        } else {
            // MOON (19h → 5h)
            let nightHour = hour < 5 ? hour + 24 : hour; // đưa về 19h–29h
            let progress = (nightHour - 19) / 10; // 0 → 1 (10h ban đêm)

            const x = w * (1 - progress) - 80;
            const y = h * (0.35 - 0.35 * Math.sin(progress * Math.PI));

            $moon.css({
                "transform": `translate(${x}px, ${y}px)`,
                "opacity": 1
            });
            $sun.css("opacity", 0);

            $('#employee-current-fullname').removeClass('text-primary').addClass('text-white');
            $('#employee-current-company').removeClass('text-primary').addClass('text-white');
            $page.find('p').removeClass('text-muted').addClass('text-black');
        }


        // ---------------- Cấu hình màu nền theo thời gian ----------------
        const phases = [
            {
                range: [5, 7], // Bình minh
                page: "linear-gradient(135deg, #ff9a9e, #fecf6a)"
            },
            {
                range: [7, 16], // Ban ngày
                page: "linear-gradient(to top, #ffffff, #b5e8ff, #c3d9ff)"
            },
            {
                range: [16, 19], // Hoàng hôn
                page: "linear-gradient(to top, #ffdeb7, #ffcdd2, #d1c4e9)"
            },
            {
                range: [19, 24], // Ban đêm
                page: "linear-gradient(to top, #a7bfe8, #517fa4, #243949)"
            },
            {
                range: [0, 5], // Rạng sáng
                page: "linear-gradient(to top, #243949, #517fa4, #a7bfe8)"
            }
        ];

        for (let phase of phases) {
            if (hour >= phase.range[0] && hour < phase.range[1]) {
                $page.css("background", phase.page);
                break;
            }
        }
    }


    function applyTestTime(timeStr) {
        const parts = timeStr.split(":");
        testHour = parseInt(parts[0]) + parseInt(parts[1]) / 60;
        useTest = true;
        $("#timeSlider").val(testHour);  // đồng bộ slider
        updateSliderLabel(testHour);
        updateSunMoon();
    }

    function applySliderTime(val) {
        testHour = parseFloat(val);
        useTest = true;
        updateSliderLabel(testHour);
        updateSunMoon();
    }

    function updateSliderLabel(hourVal) {
        let h = Math.floor(hourVal);
        let m = Math.round((hourVal - h) * 60);
        if (m < 10) m = "0" + m;
        $("#sliderVal").text(`${h}:${m}`);
    }

    function useRealTime() {
        useTest = false;
        updateSunMoon();
    }

    $("#btnMorning").on("click", () => applyTestTime("06:00"));
    $("#btnNoon").on("click", () => applyTestTime("12:00"));
    $("#btnEvening").on("click", () => applyTestTime("18:00"));
    $("#btnNight").on("click", () => applyTestTime("21:00"));
    $("#btnReal").on("click", useRealTime);

    $("#timeSlider").on("input", function () {
        applySliderTime(this.value);
    });

    updateSunMoon();
    setInterval(updateSunMoon, 60000);
});
