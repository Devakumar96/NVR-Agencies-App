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


const selectedProduct =
JSON.parse(
    localStorage.getItem(
        "selectedProduct"
    )
);
const quantityInput =
document.getElementById("quantity");

const totalAmountInput =
document.getElementById("totalAmount");

function updateTotalAmount(){

    if(!selectedProduct){

        console.log("No product selected");

        return;
    }

    const quantity =
    parseInt(quantityInput.value) || 1;

    const price =
    parseFloat(selectedProduct.price) || 0;

    const total =
    quantity * price;

    totalAmountInput.value =
    "₹" + total;

    console.log(
        "Qty:",
        quantity,
        "Price:",
        price,
        "Total:",
        total
    );
}

quantityInput.addEventListener(
    "input",
    updateTotalAmount
);

quantityInput.addEventListener(
    "keyup",
    updateTotalAmount
);

updateTotalAmount();
console.log(selectedProduct);

if(selectedProduct){

    document.getElementById(
        "selectedProductImage"
    ).src =
    selectedProduct.image;

    document.getElementById(
        "selectedProductName"
    ).textContent =
    selectedProduct.name;

    document.getElementById(
        "selectedProductPrice"
    ).textContent =
    "₹" + selectedProduct.price;

    document.getElementById(
        "selectedProductDescription"
    ).textContent =
    selectedProduct.description;

}


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

        const totalAmount = 
        document.getElementById("totalAmount").value.replace("₹", "").trim();

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
                
                totalAmount : Number(quantity) * Number(selectedProduct.price),
                status: "Pending",

                createdAt: serverTimestamp()
            }
        );

       

        const adminNumber = "916369986828";

const whatsappMessage =

`🚚 NEW ORDER

👤 Customer: ${customerName}

📱 Mobile: ${mobile}


📦 Quantity: ${quantity}

💵 Total Amount: ₹${totalAmount}

📍 Address:
${address}

📌 Status: Pending

🕒 Order Time:
${new Date().toLocaleString()}

Please process this order.`;

 alert("Order Placed Successfully");

window.location.href =
`https://wa.me/${adminNumber}?text=${encodeURIComponent(whatsappMessage)}`;



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