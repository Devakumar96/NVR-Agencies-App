import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ordersContainer =
document.getElementById("ordersContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    try {

        const q = query(
            collection(db, "orders"),
            where("customerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot =
        await getDocs(q);

        if (querySnapshot.empty) {

            ordersContainer.innerHTML = `
                <div class="alert alert-info">
                    No Orders Found
                </div>
            `;

            return;
        }

        let html = "";

        querySnapshot.forEach((doc) => {

            const order = doc.data();

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

                        <span class="badge bg-primary">
                            ${order.status}
                        </span>
                    </p>

                </div>

            </div>

            `;

        });

        ordersContainer.innerHTML = html;

    } catch (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    }

});