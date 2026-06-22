import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginBtn =
document.getElementById("loginBtn");

loginBtn.addEventListener("click",
async ()=>{

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try{

        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const adminRef =
        doc(db,"admins",email);

        const adminDoc =
        await getDoc(adminRef);

        if(!adminDoc.exists()){

            alert("Access Denied");

            await auth.signOut();

            return;

        }

        window.location.href =
        "admin.html";

    }
    catch(error){

        alert(error.message);

    }

});