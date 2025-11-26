document.addEventListener("DOMContentLoaded", function () {

    /* POPUP DELAY */
    setTimeout(function() {
        if (!localStorage.getItem("wheelPopupSeen")) {
            document.getElementById("wheel-popup-overlay").style.display = "flex";
            localStorage.setItem("wheelPopupSeen", "yes");
        }
    }, 5000);

    document.getElementById("wheel-close").onclick = function() {
        document.getElementById("wheel-popup-overlay").style.display = "none";
    };

    const prizes = [
        "ارسال رایگان",
        "پوچ",
        "50٪ تخفیف مدرسه زندگی مشترک",
        "کتاب عاقلانه به شیوه بزرگان",
        "100 هزار تومان تخفیف",
        "20٪ تخفیف برای بدون‌تخفیف‌ها",
        "200 هزار تومان تخفیف",
        "50٪ تخفیف کارگاه عمومی",
        "آزمون رایگان",
        "دوباره بچرخون"
    ];

    const colors = [
        "#FF7676", "#FFD36E", "#8CE990", "#6EC9FF", "#FF9ACD",
        "#B28DFF", "#FF8C42", "#42E5F5", "#FF5E78", "#7DFF86"
    ];

    let canvas = document.getElementById("wheelCanvas");
    let ctx = canvas.getContext("2d");
    let userCanSpin = localStorage.getItem("wheelChance") !== "done";
    let extraSpin = false;

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
            ctx.font = "15px sans-serif";
            ctx.fillText(prizes[i], 205, 5);
            ctx.restore();
        }
    }
    drawWheel();

    document.getElementById("spinBtn").onclick = function() {

        if (!userCanSpin && !extraSpin) {
            document.getElementById("wheel-result").innerHTML = "شما قبلاً چرخانده‌اید.";
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

            if (prize === "دوباره بچرخون") {
                document.getElementById("wheel-result").innerHTML = "تبریک! یک بار دیگر بچرخان 🎉";
                extraSpin = true;
                return;
            }

            if (prize === "پوچ") {
                document.getElementById("wheel-result").innerHTML = "متأسفانه پوچ شد 😕";
                localStorage.setItem("wheelChance", "done");
                userCanSpin = false;
                return;
            }

            let code = "AM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

            document.getElementById("wheel-result").innerHTML =
                "🎁 جایزه: <strong>" + prize + "</strong><br>کد: <strong>" + code + "</strong>";

            localStorage.setItem("wheelChance", "done");
            userCanSpin = false;

        }, 4000);
    };
});
