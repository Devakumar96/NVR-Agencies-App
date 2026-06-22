import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const welcomeText =
document.getElementById("welcomeText");

const logoutBtn =
document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        welcomeText.innerHTML =
        `Welcome, ${user.email}`;

    } else {

        window.location.href =
        "login.html";

    }

});

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("Logged Out Successfully");

            window.location.href =
            "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}