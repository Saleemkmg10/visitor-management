const API = "/api";

let currentVisitor = null;
let currentVisit = null;

let stompClient = null;


// -----------------------------
// Page Load
// -----------------------------

document.addEventListener("DOMContentLoaded", function () {

    loadHosts();

    document
        .getElementById("checkVisitorButton")
        .addEventListener("click", checkVisitor);

    document
        .getElementById("registerVisitorButton")
        .addEventListener("click", registerVisitor);

    document
        .getElementById("createVisitButton")
        .addEventListener("click", createVisitForExistingVisitor);

    document
        .getElementById("startMeetingButton")
        .addEventListener("click", startMeeting);

    document
        .getElementById("completeMeetingButton")
        .addEventListener("click", completeMeeting);

    document
        .getElementById("exitButton")
        .addEventListener("click", exitVisitor);
});


// -----------------------------
// Load Hosts
// -----------------------------

async function loadHosts() {

    try {

        const response = await fetch(`${API}/hosts`);

        const hosts = await response.json();

        const hostDropdown =
            document.getElementById("host");

        const existingHostDropdown =
            document.getElementById("existingHost");


        hostDropdown.innerHTML =
            '<option value="">Select Host</option>';

        existingHostDropdown.innerHTML =
            '<option value="">Select Host</option>';


        hosts.forEach(host => {

            const option1 =
                document.createElement("option");

            option1.value = host.id;

            option1.textContent =
                `${host.name} (${host.email})`;

            hostDropdown.appendChild(option1);


            const option2 =
                document.createElement("option");

            option2.value = host.id;

            option2.textContent =
                `${host.name} (${host.email})`;

            existingHostDropdown.appendChild(option2);

        });

    } catch (error) {

        console.error("Error loading hosts:", error);

    }
}


// -----------------------------
// Check Visitor
// -----------------------------

async function checkVisitor() {

    const phone =
        document.getElementById("phone").value.trim();


    if (!phone) {

        alert("Please enter phone number");

        return;
    }


    try {

        const response =
            await fetch(`${API}/visitors/phone/${phone}`);


        if (response.ok) {

            const visitor =
                await response.json();

            showExistingVisitor(visitor);

        } else {

            showNewVisitor(phone);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");

    }
}


// -----------------------------
// New Visitor
// -----------------------------

function showNewVisitor(phone) {

    document
        .getElementById("newVisitorSection")
        .classList.remove("hidden");


    document
        .getElementById("existingVisitorSection")
        .classList.add("hidden");


    document
        .getElementById("visitSection")
        .classList.add("hidden");


    document
        .getElementById("newPhone")
        .value = phone;
}


// -----------------------------
// Existing Visitor
// -----------------------------

function showExistingVisitor(visitor) {

    currentVisitor = visitor;


    document
        .getElementById("newVisitorSection")
        .classList.add("hidden");


    document
        .getElementById("existingVisitorSection")
        .classList.remove("hidden");


    document
        .getElementById("visitSection")
        .classList.add("hidden");


    document
        .getElementById("visitorDetails")
        .innerHTML = `
            <p><strong>Name:</strong> ${visitor.name}</p>
            <p><strong>Phone:</strong> ${visitor.phone}</p>
            <p><strong>Email:</strong> ${visitor.email}</p>
        `;
}


// -----------------------------
// Register New Visitor
// -----------------------------

async function registerVisitor() {

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("newPhone").value.trim();

    const email =
        document.getElementById("email").value.trim();


    if (!name || !phone || !email) {

        alert("Please fill all visitor details");

        return;
    }


    const visitorData = {

        name: name,
        phone: phone,
        email: email

    };


    try {

        const response =
            await fetch(`${API}/visitors`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(visitorData)

            });


        if (!response.ok) {

            throw new Error("Visitor registration failed");

        }


        currentVisitor =
            await response.json();


        alert("Visitor registered successfully");


        await createVisitForNewVisitor();


    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}


// -----------------------------
// Create Visit - New Visitor
// -----------------------------

async function createVisitForNewVisitor() {

    const hostId =
        document.getElementById("host").value;

    const purpose =
        document.getElementById("purpose").value.trim();


    if (!hostId || !purpose) {

        alert("Please select host and enter purpose");

        return;
    }


    await createVisit(hostId, purpose);
}


// -----------------------------
// Create Visit - Existing Visitor
// -----------------------------

async function createVisitForExistingVisitor() {

    const hostId =
        document.getElementById("existingHost").value;

    const purpose =
        document.getElementById("existingPurpose").value.trim();


    if (!hostId || !purpose) {

        alert("Please select host and enter purpose");

        return;
    }


    await createVisit(hostId, purpose);
}


// -----------------------------
// Create Visit
// -----------------------------

async function createVisit(hostId, purpose) {

    try {

        connectWebSocket(hostId);


        const url =
            `${API}/visits` +
            `?visitorId=${currentVisitor.id}` +
            `&hostId=${hostId}` +
            `&purpose=${encodeURIComponent(purpose)}`;


        const response =
            await fetch(url, {

                method: "POST"

            });


        if (!response.ok) {

            throw new Error("Unable to create visit");

        }


        currentVisit =
            await response.json();


        showVisitStatus();


    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}


// -----------------------------
// Show Visit Status
// -----------------------------

function showVisitStatus() {

    document
        .getElementById("newVisitorSection")
        .classList.add("hidden");


    document
        .getElementById("existingVisitorSection")
        .classList.add("hidden");


    document
        .getElementById("visitSection")
        .classList.remove("hidden");


    document
        .getElementById("visitStatus")
        .innerText =
        "Status: " + currentVisit.status;
}


// -----------------------------
// Start Meeting
// -----------------------------

async function startMeeting() {

    await updateVisitStatus(
        `${API}/visits/${currentVisit.id}/start`
    );
}


// -----------------------------
// Complete Meeting
// -----------------------------

async function completeMeeting() {

    await updateVisitStatus(
        `${API}/visits/${currentVisit.id}/complete`
    );
}


// -----------------------------
// Exit Visitor
// -----------------------------

async function exitVisitor() {

    await updateVisitStatus(
        `${API}/visits/${currentVisit.id}/exit`
    );
}


// -----------------------------
// Update Visit Status
// -----------------------------

async function updateVisitStatus(url) {

    try {

        const response =
            await fetch(url, {

                method: "PUT"

            });


        if (!response.ok) {

            throw new Error("Unable to update visit");

        }


        currentVisit =
            await response.json();


        showVisitStatus();


    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}


// -----------------------------
// WebSocket
// -----------------------------

function connectWebSocket(hostId) {

    if (stompClient) {

        stompClient.deactivate();

    }


    stompClient =
        new StompJs.Client({

            brokerURL:
                "ws://localhost:8080/ws"

        });


    stompClient.onConnect = function () {

        console.log("WebSocket connected");


        stompClient.subscribe(
            `/topic/host/${hostId}`,
            function (message) {

                document
                    .getElementById("notifications")
                    .innerText =
                    message.body;

            }
        );

    };


    stompClient.onStompError = function (frame) {

        console.error(
            "WebSocket error:",
            frame
        );

    };


    stompClient.activate();
}