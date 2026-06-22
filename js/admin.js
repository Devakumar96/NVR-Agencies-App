import { auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ordersContainer =
document.getElementById("ordersContainer");

onAuthStateChanged(auth,
async (user)=>{

    if(!user){

        window.location.href =
        "admin-login.html";

        return;

    }

    const adminDoc =
    await getDoc(
        doc(db,"admins",user.email)
    );

    if(!adminDoc.exists()){

        alert("Unauthorized Access");

        window.location.href =
        "index.html";

        return;

    }

    loadOrders();

});

// loadOrders();

async function loadOrders() {

    try {

        const q = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc")
        );

        const snapshot =
        await getDocs(q);

        if(snapshot.empty){

            ordersContainer.innerHTML = `
                <div class="alert alert-info">
                    No Orders Found
                </div>
            `;

            return;
        }

        let html = "";

        snapshot.forEach((document) => {

            const order = document.data();

            let badge = "bg-warning";

            if(order.status === "Delivered"){
                badge = "bg-success";
            }

            if(order.status === "Processing"){
                badge = "bg-info";
            }

            if(order.status === "Cancelled"){
                badge = "bg-danger";
            }

            html += `

            <div class="card shadow-sm mb-3">

                <div class="card-body">

                    <h5>
                        💧 ${order.quantity} Water Can(s)
                    </h5>

                    <p>
                        <strong>Name:</strong>
                        ${order.customerName}
                    </p>

                    <p>
                        <strong>Mobile:</strong>
                        ${order.mobile}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${order.address}
                    </p>

                    <p>

                        <strong>Status:</strong>

                        <span class="badge ${badge}">
                            ${order.status}
                        </span>

                    </p>

                    <select
                        class="form-select mb-2 status-select"
                        data-id="${document.id}">

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Processing">
                            Processing
                        </option>

                        <option value="Out For Delivery">
                            Out For Delivery
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>

                    <button
                        class="btn btn-success update-btn"
                        data-id="${document.id}">
                        Update Status
                    </button>

                </div>

            </div>

            `;

        });

        ordersContainer.innerHTML = html;

        addUpdateEvents();

    }
    catch(error){

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    }

}

function addUpdateEvents(){

    const buttons =
    document.querySelectorAll(".update-btn");

    buttons.forEach((button)=>{

        button.addEventListener("click",
        async ()=>{

            const docId =
            button.dataset.id;

            const select =
            button.parentElement.querySelector(".status-select");

            const newStatus =
            select.value;

            try{

                await updateDoc(
                    doc(db,"orders",docId),
                    {
                        status:newStatus
                    }
                );

                alert("Status Updated");

                loadOrders();

            }
            catch(error){

                alert(error.message);

            }

        });

    });

}

import {
    signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document
.getElementById("logoutBtn")
.addEventListener("click",
async ()=>{

    await signOut(auth);

    window.location.href =
    "admin-login.html";

});


    // <div class="mt-3">

    //     <button
    //         class="btn btn-sm btn-delivered">

    //         Delivered

    //     </button>

    //     <button
    //         class="btn btn-sm btn-pending">

    //         Pending

    //     </button>

    // </div>


const downloadPdfBtn =
document.getElementById(
    "downloadPdfBtn"
);

downloadPdfBtn.addEventListener(
    "click",
    async () => {

        const { jsPDF } =
        window.jspdf;

        const pdf =
        new jsPDF();

        pdf.setFontSize(20);

        pdf.text(
            "NVR Agencies Report",
            20,
            20
        );

        pdf.setFontSize(12);

        pdf.text(
            `Generated: ${new Date().toLocaleString()}`,
            20,
            30
        );

        const customersSnapshot =
        await getDocs(
            collection(db, "customers")
        );

        const ordersSnapshot =
        await getDocs(
            collection(db, "orders")
        );

        pdf.text(
            `Total Customers: ${customersSnapshot.size}`,
            20,
            50
        );

        pdf.text(
            `Total Orders: ${ordersSnapshot.size}`,
            20,
            60
        );

        let y = 90;

        pdf.setFontSize(14);

        pdf.text(
            "Orders List",
            20,
            y
        );

        y += 15;

        pdf.setFontSize(10);

        ordersSnapshot.forEach((doc) => {

            const order =
            doc.data();

            if (y > 270) {

                pdf.addPage();

                y = 20;

            }

            pdf.text(

                `${order.customerName || "N/A"} | ${order.mobile || ""}`,

                20,

                y

            );

            y += 8;

            pdf.text(

                `Qty: ${order.quantity || 0} | Status: ${order.status || "Pending"}`,

                20,

                y

            );

            y += 12;

        });

        pdf.save(
            "NVR-Agencies-Report.pdf"
        );

    }
);

// const downloadPdfBtn =
// document.getElementById(
//     "downloadPdfBtn"
// );

// if(downloadPdfBtn){

//     downloadPdfBtn.addEventListener(
//         "click",
//         async ()=>{

//             // PDF CODE HERE

//         }
//     );

// }