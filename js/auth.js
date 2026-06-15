import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const registerBtn =
document.getElementById("registerBtn");

if(registerBtn){

registerBtn.addEventListener("click",
async () => {

const name =
document.getElementById("name").value;

const mobile =
document.getElementById("mobile").value;

const address =
document.getElementById("address").value;

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try {

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(
doc(db,"customers",
userCredential.user.uid),
{
name:name,
email:email,
mobile:mobile,
address:address,
// password:password,
createdAt:new Date()
}
);



alert("Account Created Successfully");

await signOut(auth);

window.location.href = "login.html";

}
catch(error){

alert(error.message);

}

});
}
export { auth, db };