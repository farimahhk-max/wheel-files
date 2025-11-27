document.addEventListener("DOMContentLoaded", function () {

    /* نمایش پاپ‌آپ بعد از ۵ ثانیه (فقط یک بار برای هر مرورگر) */
    setTimeout(function() {
        if (!localStorage.getItem("wheelPopupSeen")) {
            document.getElementById("wheel-popup-overlay").style.display = "flex";
            localStorage.setItem("wheelPopupSeen", "yes");
        }
    }, 5000);

    /* بستن پاپ‌آپ */
    document.getElementById("wheel-close").onclick = function() {
        document.getElementById("wheel-popup-overlay").style.display = "none";
    };

    /* جوایز */
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

    /* رنگ‌های تیره، شارپ و براق */
    const colors = [
        "#12355B", // سرمه‌ای
        "#61122F", // زرشکی
        "#0F5B36", // زمردی
        "#A8431F", // آجری
        "#1F3F72", // نفتی
        "#5A2E82", // بنفش
        "#243447", // دودی
        "#1F6F4A", // سبز
        "#3F2A2A", // قهوه‌ای
        "#7A4B24"  // قهوه‌ای طلایی
    ];

    let canvas = document.getElementById("wheelCanvas");
    let ctx = canvas.getContext("2d");

    let userCanSpin = localStorage.getItem("wheelChance") !== "done";
    let extraSpin = false;

    /* رسم گردونه */
    function drawWheel() {
        let arc = Math.PI * 2 / prizes.length;

        for (let i = 0; i < prizes.length; i++) {
            let angle = i * arc;

            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(225, 225);
            ctx.arc(225, 225, 225, angle, angle + arc);
            ctx.fill();

            /* خط مرزی بین برش‌ها */
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.stroke();

            /* متن */
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

    /* منطق چرخاندن */
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

            /* دوباره بچرخون */
            if (prize === "دوباره بچرخون") {
                document.getElementById("wheel-result").innerHTML =
                    "🎉 یک شانس دیگر داری!";
                extraSpin = true;
                return;
            }

            /* پوچ */
            if (prize === "پوچ") {
                document.getElementById("wheel-result").innerHTML =
                    "متأسفانه پوچ شد 😕";
                localStorage.setItem("wheelChance", "done");
                userCanSpin = false;
                return;
            }

            /* تولید کد تخفیف */
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
