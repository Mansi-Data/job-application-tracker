
// Get HTML elements
const applicationForm = document.getElementById("applicationForm");
const companyInput = document.getElementById("company");
const positionInput = document.getElementById("position");
const dateInput = document.getElementById("applicationDate");
const statusInput = document.getElementById("status");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEdit = document.getElementById("cancelEdit");

const applicationList = document.getElementById("applicationList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const sortDate = document.getElementById("sortDate");

// Load saved applications
let applications = JSON.parse(
    localStorage.getItem("applications")
) || [];
let editingId = null;

// Save applications in browser storage
function saveApplications() {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}

// Update dashboard numbers
function updateStatistics() {
    document.getElementById("totalCount").textContent =
        applications.length;

    document.getElementById("appliedCount").textContent =
        applications.filter(app => app.status === "Applied").length;

    document.getElementById("interviewCount").textContent =
        applications.filter(app => app.status === "Interview").length;

    document.getElementById("selectedCount").textContent =
        applications.filter(app => app.status === "Selected").length;
}

// Display applications
function displayApplications() {
    applicationList.replaceChildren();

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.company.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            app.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });
    const sortedApplications = [...filteredApplications].sort((a, b) => {

    if (sortDate.value === "newest") {
        return new Date(b.date) - new Date(a.date);
    }

    return new Date(a.date) - new Date(b.date);

    });

    if (filteredApplications.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No applications found.";
        applicationList.appendChild(message);
    }

    sortedApplications.forEach(app => {
        const card = document.createElement("div");
        card.className = "application-card";

        const heading = document.createElement("h3");
        heading.textContent = app.company;

        const position = document.createElement("p");
        position.textContent = "Position: " + app.position;

        const date = document.createElement("p");
        date.textContent = "Date: " + app.date;

        const status = document.createElement("p");

        status.textContent = app.status;

        status.className = "status-badge " + app.status.toLowerCase();

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = app.id;
        deleteButton.className = "delete-button";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.dataset.id = app.id;

        card.append(
            heading,
            position,
            date,
            status,
            editButton,
            deleteButton
        );

        applicationList.appendChild(card);
    });

    updateStatistics();
}

// Add or update an application
applicationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (editingId !== null) {

        // Update existing application
        const app = applications.find(
            item => item.id === editingId
        );

        app.company = companyInput.value.trim();
        app.position = positionInput.value.trim();
        app.date = dateInput.value;
        app.status = statusInput.value;

        editingId = null;

        formTitle.textContent = "Add New Application";
        submitButton.textContent = "Add Application";
        cancelEdit.style.display = "none";

    } else {

        // Create new application
        const newApplication = {
            id: Date.now().toString(),
            company: companyInput.value.trim(),
            position: positionInput.value.trim(),
            date: dateInput.value,
            status: statusInput.value
        };

        applications.push(newApplication);
    }

    saveApplications();
    displayApplications();

    applicationForm.reset();

});

// Search applications
searchInput.addEventListener("input", displayApplications);


// Filter applications
filterStatus.addEventListener("change", displayApplications);


// Sort applications
sortDate.addEventListener("change", displayApplications);


// Handle Edit and Delete buttons
applicationList.addEventListener("click", function(event) {

    const applicationId = event.target.dataset.id;

    // Edit application
    if (event.target.classList.contains("edit-button")) {

        const app = applications.find(
            item => item.id === applicationId
        );

        if (!app) return;

        companyInput.value = app.company;
        positionInput.value = app.position;
        dateInput.value = app.date;
        statusInput.value = app.status;

        editingId = app.id;

        formTitle.textContent = "Edit Application";
        submitButton.textContent = "Update Application";
        cancelEdit.style.display = "inline-block";

        applicationForm.scrollIntoView({
            behavior: "smooth"
        });
    }


    // Delete application
    if (event.target.classList.contains("delete-button")) {

        applications = applications.filter(
            app => app.id !== applicationId
        );

        saveApplications();
        displayApplications();
    }

});


// Cancel editing
cancelEdit.addEventListener("click", function() {

    editingId = null;

    applicationForm.reset();

    formTitle.textContent = "Add New Application";
    submitButton.textContent = "Add Application";

    cancelEdit.style.display = "none";

});



// Show saved applications when page opens
displayApplications();
