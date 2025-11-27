document.addEventListener("DOMContentLoaded", function () {

    /* SHOW POPUP AFTER 5 SECONDS */
    setTimeout(function() {
        if (!localStorage.getItem("wheelPopupSeen")) {
            document.getElementById("wheel-popup-overlay").style.display = "flex";
            localStorage.setItem("wheelPopupSeen", "yes");
        }
    }, 5000);

    /* CLOSE POPUP */
    document.getElementById("wheel-close").onclick = function() {
        document.getElementById("wheel-popup-overlay").style.display = "none";
    };

    /* PRIZES */
    const prizes = [
        "ارسال رایگان",
        "پوچ",
        "۵۰٪ مدرسه مشترک",
        "کتاب عاقلانه",
        "۱۰۰هزار تخفیف",
        "۲۰٪ بدون‌تخفیف",
        "۲۰۰هزار تخفیف",
        "۵۰٪ کارگاه عمومی",
        "آزمون رایگان",
        "دوباره بچرخون"
    ];

    /* DARK RICH COLORS */
const colors = [
    "#10365B",
    "#4C1A24",
    "#0B4F2C",
    "#8C3C1A",
    "#23395B",
    "#5A2E63",
    "#2C2C54",
    "#1E5631",
    "#3C2F2F",
    "#6B4226"
];


    let canvas = document.getElementById("wheelCanvas");
    let ctx = canvas.getContext("2d");

    let userCanSpin = localStorage.getItem("wheelChance") !== "done";
    let extraSpin = false;

    /* DRAW WHEEL */
    function drawWheel() {
        let arc = Math.PI * 2 / prizes.length;

        for (let i = 0; i < prizes.length; i++) {
            let angle = i * arc;

            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(225, 225);
            ctx.arc(225, 225, 225, angle, angle + arc);
            ctx.fill();

            /* BORDER LINE */
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.stroke();

            /* TEXT */
            ctx.save();
            ctx.translate(225, 225);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 17px sans-serif";
            ctx.fillText(prizes[i], 205, 5);
            ctx.restore();
        }
    }

    drawWheel();

    /* SPIN BUTTON */
    document.getElementById("spinBtn").onclick = function() {

        if (!userCanSpin && !extraSpin) {
            document.getElementById("wheel-result").innerHTML =
                "شما قبلاً چرخانده‌اید.";
            return;
        }

        let rotation = 360 * 5 + Math.floor(Math.random() * 360);
        canvas.style.transition = "4s ease-out";
        canvas.style.transform = "rotate(" + rotation + "deg)";

        let arc = 360 / prizes.length;
        let index = Math.floor(((rotation - 90) % 360) / arc);
        if (index < 0) index += prizes.length;

        setTimeout(() => {
            let prize = prizes[prizes.length - 1 - index];

            /* Extra Spin */
            if (prize === "دوباره بچرخون") {
                document.getElementById("wheel-result").innerHTML =
                    "🎉 یک شانس دیگر داری!";
                extraSpin = true;
                return;
            }

            /* Nothing */
            if (prize === "پوچ") {
                document.getElementById("wheel-result").innerHTML =
                    "متأسفانه پوچ شد 😕";
                localStorage.setItem("wheelChance", "done");
                userCanSpin = false;
                return;
            }

            /* DISCOUNT CODE */
            let code = "AM-" + Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

            document.getElementById("wheel-result").innerHTML =
                "🎁 جایزه: <strong>" + prize +
                "</strong><br>کد تخفیف: <strong>" + code + "</strong>";

            localStorage.setItem("wheelChance", "done");
            userCanSpin = false;

        }, 4000);
    };
});
