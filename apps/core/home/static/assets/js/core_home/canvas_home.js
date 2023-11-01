$('#idx-welcome-txt').text(welcomeTxt);

$('#welcome-close').on('click', function (){
    $(this).closest('#welcome-group').addClass('d-none');
})

$(function () {
    let welcomeGroup = document.getElementById('welcome-group');
    let canvas = document.getElementById('welcome-canvas');
    let context = canvas.getContext('2d');

    let maxHeight = welcomeGroup.offsetHeight - 10;
    let maxWidth = welcomeGroup.offsetWidth - 100;

    let txtColor = '#000000';
    let bgColor = '#ffffff';

    load();

    function drawBG(canvas, context, maxW, maxH) {
        welcomeGroup.style.color = txtColor;
        welcomeGroup.querySelector('h5').style.color = txtColor;
        welcomeGroup.style.backgroundColor = bgColor;

        canvas.width = maxW;
        canvas.height = maxH;

        context.fillStyle = bgColor;
        context.fillRect(0, 0, maxWidth, maxHeight);
    }

    function loadSun() {
        bgColor = '#ffffff';
        txtColor = '#000000';
        drawBG(canvas, context, maxWidth, maxHeight);
        drawSun(
            maxWidth - 100,
            maxHeight / 2,
            20
        )
        drawCloud(
            maxWidth - 100,
            maxHeight / 2 + 20,
            15,
        )
    }

    function drawCloud(x, y, size) {
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.arc(x + size * 2, y, size, 0, Math.PI * 2);
        context.arc(x, y, size, 0, Math.PI * 2);
        context.arc(
            x + size,
            y,
            size * 1.2,
            0,
            Math.PI * 2
        );
        context.fillStyle = '#87CEEB';
        context.fill();
        context.closePath();
    }

    function loadMoon() {
        txtColor = '#000000';
        bgColor = '#d2d2d2';
        drawBG(canvas, context, maxWidth, maxHeight);
        drawMoon(
            maxWidth - 100,
            maxHeight / 2,
            20
        )
    }

    function drawSun(x, y, size) {
        let gradient = context.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, '#ffce01');
        gradient.addColorStop(0.3, '#fcd73d');
        gradient.addColorStop(0.5, '#fae27e');
        gradient.addColorStop(0.7, '#fcefbc');
        gradient.addColorStop(1, bgColor);


        context.beginPath();
        context.arc(x, y, size * 2, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
        context.closePath();

        // sun
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();

    }

    function drawMoon(x, y, size) {
        context.beginPath();
        context.arc(x, y, size, 0, 2 * Math.PI);
        context.fillStyle = "#ffffff";
        context.fill();
        context.closePath();

        // context.globalCompositeOperation = 'destination-out';

        context.beginPath();
        context.arc(x + 5, y - 3, size - 3, 0, 2 * Math.PI);
        context.fillStyle = bgColor;
        context.fill();
        context.closePath();
    }

    function load() {
        if (currentHours >= 6 && currentHours < 18) {
            loadSun();
        } else {
            loadMoon();
        }
    }
})