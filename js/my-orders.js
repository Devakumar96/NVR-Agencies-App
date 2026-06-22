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
            
          <div class="order-item">

    <div class="order-top">

        <img
            src="assets/images/water-can.png"
            alt="Water Can"
            class="order-product-img">

        <div class="order-details">

            <h5>
                💧 ${order.quantity} Water Can(s)
            </h5>

            <p>
                ${order.customerName}
            </p>

            <p>
                ${order.mobile}
            </p>

        </div>

    </div>

    <hr>

    <p>

        <strong>Address:</strong>

        ${order.address}

    </p>

    <div class="d-flex justify-content-between align-items-center">

        <span class="badge bg-primary">

            ${order.status}

        </span>

        <a
            href="tel:8098274492"
            class="btn btn-sm btn-success">

            <i class="bi bi-telephone-fill"></i>

            Contact

        </a>

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
ordersContainer.innerHTML += `

<div class="order-item">

    <div class="order-top">

        <img
            src="assets/images/water-can.png"
            alt="Water Can"
            class="order-product-img">

        <div class="order-details">

            <h5>
                Water Can Order
            </h5>

            <p>
                Qty: ${order.quantity}
            </p>

            <p>
                ${orderDate}
            </p>

        </div>

        <span class="status-badge status-pending">

            ${order.status}

        </span>

    </div>

    <hr>

    <p class="order-address">

        <i class="bi bi-geo-alt-fill"></i>

        ${order.address}

    </p>

    <div class="order-actions">

        <a
            href="tel:8098274492"
            class="btn btn-call">

            <i class="bi bi-telephone-fill"></i>

            Contact for Order

        </a>

    </div>

</div>

`;

ordersContainer.innerHTML = `

<div class="empty-orders">

    <img
        src="assets/images/no-orders.png"
        class="empty-order-img">

    <h4>
        No Orders Found
    </h4>

    <p>
        Start shopping and place your first order.
    </p>

    <a
        href="shop.html"
        class="btn hero-btn">

        Shop Now

    </a>

</div>

`;