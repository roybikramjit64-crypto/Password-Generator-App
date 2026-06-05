const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

//Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?";

lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
    const length = Number(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowerscase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    if (!includeLowerscase && !includeUppercase && !includeNumbers && !includeSymbols) {
        alert("Please select at least one char type.");
        return;
    }

    const newPassword = createRandomPassword(length, includeUppercase, includeLowerscase, includeNumbers, includeSymbols);

    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword, includeUppercase, includeLowerscase, includeNumbers, includeSymbols);
}

function updateStrengthMeter(newPassword, includeUppercase, includeLowerscase, includeNumbers, includeSymbols) {
    const passwordLength = newPassword.length;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(newPassword);

    let strengthScore = 0;

    strengthScore += Math.min(newPassword.length * 2, 40);

    if (hasUppercase && includeUppercase) strengthScore += 15;
    if (hasLowercase && includeLowerscase) strengthScore += 15;
    if (hasNumbers && includeNumbers) strengthScore += 15;
    if (hasSymbols && includeSymbols) strengthScore += 15;

    //console.log("Upper:", hasUppercase);
    //console.log("Lower:", hasLowercase);
    //console.log("Numbers:", hasNumbers);
    //console.log("Symbols included in score:", hasSymbols && includeSymbols);
    //console.log("Score before cap:", strengthScore);

    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%";

    //console.log("Raw SS:", strengthScore);
    //console.log("Safe score:", safeScore);
    //console.log("Password Length:", newPassword.length);

    let strengthLabelText = "";
    let barColor = "";

    if (strengthScore <= 40) {
        barColor = "#fc8181";
        strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
        barColor = "#fbd38d";
        strengthLabelText = "Medium";
    } else {
        barColor = "#68d391";
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

function createRandomPassword(length, includeUppercase, includeLowerscase, includeNumbers, includeSymbols) {
    let allCharacters = "";

    if (includeUppercase) {
        allCharacters += uppercaseLetters;
    }
    if (includeLowerscase) {
        allCharacters += lowercaseLetters;
    }
    if (includeNumbers) {
        allCharacters += numberCharacters;
    }
    if (includeSymbols) {
        allCharacters += symbolCharacters;
    }

    let passoword = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        passoword += allCharacters[randomIndex];
    }

    return passoword;
}

window.addEventListener("DOMContentLoaded", makePassword);

copyBtn.addEventListener("click", () => {
    if (!passwordInput.value) return;

    navigator.clipboard.writeText(passwordInput.value).then(() => showCopySuccess()).catch((error) => console.log("Could not copy:", error));
});

function showCopySuccess() {
    //copyBtn.style.display = "none";
    copyBtn.classList.add("success");

    setTimeout(() => {
        //copyBtn.style.display = "block"
        copyBtn.classList.remove("success");
    }, 4000);
}