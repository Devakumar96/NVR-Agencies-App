import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const nameField =
document.getElementById("name");

const mobileField =
document.getElementById("mobile");

const addressField =
document.getElementById("address");

const emailField =
document.getElementById("email");

const saveBtn =
document.getElementById("saveBtn");

let currentUser = null;

onAuthStateChanged(auth,
async (user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    currentUser = user;

    try{

        const customerRef =
        doc(db,"customers",user.uid);

        const customerDoc =
        await getDoc(customerRef);

        if(customerDoc.exists()){

            const data =
            customerDoc.data();

            nameField.value =
            data.name || "";

            mobileField.value =
            data.mobile || "";

            addressField.value =
            data.address || "";

            emailField.value =
            data.email || "";

        }

    }
    catch(error){

        console.error(error);

    }

});

saveBtn.addEventListener("click",
async ()=>{

    if(!currentUser){

        return;

    }

    try{

        await updateDoc(
            doc(
                db,
                "customers",
                currentUser.uid
            ),
            {
                name:nameField.value,
                mobile:mobileField.value,
                address:addressField.value
            }
        );

        alert(
            "Profile Updated Successfully"
        );

    }
    catch(error){

        alert(error.message);

    }

});