import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const placeOrderBtn = document.getElementById("placeOrderBtn");

let currentUser = null;

// Check login status
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        console.log("Logged In:", user.email);

    } else {

        console.log("No User Logged In");

        alert("Please login first");

        window.location.href = "login.html";

    }

});
let customerData = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    try {

        const customerRef =
        doc(db, "customers", user.uid);

        const customerDoc =
        await getDoc(customerRef);

        if (customerDoc.exists()) {

            const customerData =
            customerDoc.data();

           document.getElementById("customerName").value =
        customerData.name || "";

    document.getElementById("mobile").value =
        customerData.mobile || "";

    document.getElementById("address").value =
        customerData.address || "";

    console.log("Customer Loaded:", customerData);

        }

    }
    catch(error){

        console.error(error);

    }

});
// Place order
placeOrderBtn.addEventListener("click", async () => {

    if (!currentUser) {

        alert("User not logged in");
        return;

    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const quantity =
        document.getElementById("quantity").value;

    // Validation
    if (
        !customerName ||
        !mobile ||
        !address ||
        !quantity
    ) {

        alert("Please fill all fields");
        return;

    }

    try {

        await addDoc(
            collection(db, "orders"),
            {
                customerId: currentUser.uid,
                customerEmail: currentUser.email,

                customerName: customerName,
                mobile: mobile,
                address: address,

                quantity: Number(quantity),

                status: "Pending",

                createdAt: serverTimestamp()
            }
        );

        alert("Order Placed Successfully");

        // Clear form
        document.getElementById("customerName").value = "";
        document.getElementById("mobile").value = "";
        document.getElementById("address").value = "";
        document.getElementById("quantity").value = "1";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});