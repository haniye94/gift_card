document.addEventListener('DOMContentLoaded', () => {
    console.log("پروژه لندینگ پیج هدیه پلاس اصلاح و بارگذاری شد.");
    
    // مدیریت باز و بسته شدن بخش سوالات متداول (FAQ Accordion)
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", function () {
            const currentItem = this.parentElement;
            const currentIcon = this.querySelector(".faq-icon");
            const isOpen = currentItem.classList.contains("active");

            // ۱. بستن تمام آکاردئون‌های دیگر به جز آیتمی که کاربر روی آن کلیک کرده است
            document.querySelectorAll(".accordion-item").forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove("active");
                    const icon = item.querySelector(".faq-icon");
                    if (icon) icon.textContent = "+";
                }
            });

            // ۲. باز یا بسته کردن آیتم فعلی به صورت مستقل
            if (isOpen) {
                currentItem.classList.remove("active");
                currentIcon.textContent = "+";
            } else {
                currentItem.classList.add("active");
                currentIcon.textContent = "−"; // علامت منهای استاندارد
            }
        });
    });
});