document.addEventListener("DOMContentLoaded", function () {

    /* POPUP DELAY */
    setTimeout(function() {
        if (!localStorage.getItem("wheelPopupSeen")) {
            document.getElementById("wheel-popup-overlay").style.display = "flex";
            localStorage.setItem("wheelPopupSeen", "yes");
        }
    }, 5000);

    /* CLOSE BUTTON */
    document.getElementById("wheel-close").onclick = function() {
        document.getElementById("wheel-popup-overlay").style.display = "none";
    };

    /* SHORTENED LABELS FOR BETTER FIT */
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

    /* DARK + NEON COLORS */
    const colors = [
        "#ff1744",
        "#d500f9",
        "#651fff",
        "#00b0ff",
        "#00e5ff",
        "#1de9b6",
        "#76ff03",
        "#ffea00",
        "#ff9100",
        "#ff3d00"
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

            ctx.save();
            ctx.translate(225, 225);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText(prizes[i], 195, 5);
            ctx.restore();
        }
    }

    drawWheel();

    /* HANDLE SPIN BUTTON */
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

            /* EXTRA SPIN */
            if (prize === "دوباره بچرخون") {
                document.getElementById("wheel-result").innerHTML =
                    "🎉 یک شانس دیگر داری!";
                extraSpin = true;
                return;
            }

            /* LOSE */
            if (prize === "پوچ") {
                document.getElementById("wheel-result").innerHTML =
                    "متأسفانه پوچ شد 😕";
                localStorage.setItem("wheelChance", "done");
                userCanSpin = false;
                return;
            }

            /* GENERATE DISCOUNT CODE */
            let code = "AM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

            document.getElementById("wheel-result").innerHTML =
                "🎁 جایزه: <strong>" + prize +
                "</strong><br>کد تخفیف: <strong>" + code + "</strong>";

            localStorage.setItem("wheelChance", "done");
            userCanSpin = false;

        }, 4000);
    };
});
