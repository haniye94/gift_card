document.addEventListener('DOMContentLoaded', () => {
    // فرم‌ها
    const loginForm = document.getElementById('loginForm');
    const otpForm1 = document.getElementById('otpForm1');
    const profileForm = document.getElementById('profileForm');
    const otpForm2 = document.getElementById('otpForm2');

    // اینپوت‌ها و نگه‌دارنده‌ها
    const phoneNumberInput = document.getElementById('phoneNumber');
    const phonePlaceholder1 = document.getElementById('phonePlaceholder1');
    const phonePlaceholder2 = document.getElementById('phonePlaceholder2');

    const toPersianDigits = (str) => {
        const id = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/[0-9]/g, (w) => fa[id.indexOf(w)]);
    };

    // ==========================================================================
    // مدیریت خطاهای مرحله اول (شماره تماس)
    // ==========================================================================
    phoneNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = value;
        
        // پاک کردن خطا به محض شروع به تایپ مجدد کاربر
        document.getElementById('phoneError').textContent = "";
        phoneNumberInput.classList.remove('input-field-error');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawPhone = phoneNumberInput.value.trim();
        const errorDiv = document.getElementById('phoneError');

        if (!rawPhone) {
            errorDiv.textContent = "لطفاً شماره تماس خود را وارد کنید.";
            phoneNumberInput.classList.add('input-field-error');
            return;
        }

        if (rawPhone.length !== 11 || !rawPhone.startsWith('09')) {
            errorDiv.textContent = "شماره تماس وارد شده معتبر نیست. باید ۱۱ رقم و با ۰۹ آغاز شود.";
            phoneNumberInput.classList.add('input-field-error');
            return;
        }

        // انتقال به مراحل بعدی در صورت صحیح بودن شماره
        const persianPhone = toPersianDigits(rawPhone);
        if (parseInt(rawPhone.slice(-1)) % 2 === 0) {
            phonePlaceholder1.textContent = persianPhone;
            goToStep(2);
        } else {
            phonePlaceholder2.textContent = persianPhone;
            goToStep(4);
        }
    });

    // ==========================================================================
    // مدیریت خطاهای مراحل ۲ و ۴ (کدهای OTP پنج رقمی)
    // ==========================================================================
    const setupOtpValidation = (containerSelector, formElement, errorId, nextStepCallback) => {
        const fields = document.querySelectorAll(`${containerSelector} .otp-field`);
        const errorDiv = document.getElementById(errorId);
        
        fields.forEach((field, index) => {
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                errorDiv.textContent = ""; // پاک کردن خطا
                field.classList.remove('input-field-error');
                
                if (e.target.value.length === 1 && index < fields.length - 1) {
                    fields[index + 1].focus();
                }
            });

            field.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    fields[index - 1].focus();
                }
            });
        });

        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let isComplete = true;
            
            fields.forEach(f => {
                if (!f.value.trim()) {
                    isComplete = false;
                    f.classList.add('input-field-error');
                }
            });

            if (!isComplete) {
                errorDiv.textContent = "لطفاً کد تایید را به طور کامل وارد کنید.";
            } else {
                nextStepCallback();
            }
        });
    };

    setupOtpValidation('#step2', otpForm1, 'otp1Error', () => goToStep(3));
    setupOtpValidation('#step4', otpForm2, 'otp2Error', () => alert('خوش آمدید!'));

    // ==========================================================================
    // مدیریت خطاهای مرحله سوم (نام و نام خانوادگی)
    // ==========================================================================
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');

    firstNameInput.addEventListener('input', () => {
        firstNameError.textContent = "";
        firstNameInput.classList.remove('input-field-error');
    });

    lastNameInput.addEventListener('input', () => {
        lastNameError.textContent = "";
        lastNameInput.classList.remove('input-field-error');
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasError = false;

        if (!firstNameInput.value.trim()) {
            firstNameError.textContent = "لطفاً نام خود را وارد کنید.";
            firstNameInput.classList.add('input-field-error');
            hasError = true;
        }

        if (!lastNameInput.value.trim()) {
            lastNameError.textContent = "لطفاً نام خانوادگی خود را وارد کنید.";
            lastNameInput.classList.add('input-field-error');
            hasError = true;
        }

        if (!hasError) {
            alert('ثبت‌نام با موفقیت تکمیل شد.');
        }
    });
});

function goToStep(stepNumber) {
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        const firstInput = targetStep.querySelector('input');
        if (firstInput) firstInput.focus();
    }
}