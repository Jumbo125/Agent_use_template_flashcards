// Store the category buttons and the result text.
const categoryButtons = document.querySelectorAll(".category-button");
const categoryResult = document.querySelector("#categoryResult");
const studyList = document.querySelector("#studyList");
const backToCategories = document.querySelector("#backToCategories");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const openLogin = document.querySelector("#openLogin");
const studyAdminActions = document.querySelector("#studyAdminActions");
const openUserPanelButton = document.querySelector("#openUserPanelButton");
const userAccountForm = document.querySelector("#userAccountForm");
const userAccountMessage = document.querySelector("#userAccountMessage");
const addStudyButton = document.querySelector("#addStudyButton");
const downloadStudiesButton = document.querySelector("#downloadStudiesButton");
const studyForm = document.querySelector("#studyForm");
const studyModalTitle = document.querySelector("#studyModalTitle");
let studies = [];
let users = [];
let loggedIn = false;
let authToken = "";

// Load login credentials from a JSON file.
function loadUsers() {
  users = [];
}

// Convert a password to a SHA-256 hexadecimal hash.
async function hashPassword(password) {
  const passwordBytes = new TextEncoder().encode(password);
  const hashBytes = await crypto.subtle.digest("SHA-256", passwordBytes);
  const hashArray = Array.from(new Uint8Array(hashBytes));

  return hashArray
    .map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    })
    .join("");
}

// Check the entered credentials against the JSON data.
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const passwordHash = await hashPassword(password);

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      passwordSha256: passwordHash
    })
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }
      return response.json();
    })
    .then(function (loginData) {
      authToken = loginData.token;
      loggedIn = true;
      sessionStorage.setItem("loggedInUser", loginData.username);
      sessionStorage.setItem("loggedInRole", loginData.role);
      sessionStorage.setItem("authToken", authToken);
      updateLoginButton();
      loginMessage.textContent = "";
      loginForm.reset();

      const loginModal = bootstrap.Modal.getInstance(
        document.querySelector("#loginModal")
      );
      loginModal.hide();
    })
    .catch(function (error) {
      loginMessage.textContent = error.message;
    });
});

// Update the Login button after login or logout.
function updateLoginButton() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const loggedInRole = sessionStorage.getItem("loggedInRole");
  authToken = sessionStorage.getItem("authToken") || "";

  if (loggedInUser !== null) {
    loggedIn = true;
    studyAdminActions.hidden = false;
    openUserPanelButton.hidden = loggedInRole !== "admin";
    openLogin.innerHTML =
      '<i class="bi bi-person-check"></i> ' + loggedInUser + " (Logout)";
    openLogin.removeAttribute("data-bs-toggle");
    openLogin.removeAttribute("data-bs-target");
  } else {
    loggedIn = false;
    studyAdminActions.hidden = true;
    openUserPanelButton.hidden = true;
    openLogin.innerHTML = '<i class="bi bi-person"></i> Login';
    openLogin.setAttribute("data-bs-toggle", "modal");
    openLogin.setAttribute("data-bs-target", "#loginModal");
  }

  const selectedCategory = document.querySelector(".category-button.selected");
  if (selectedCategory !== null) {
    showStudies(selectedCategory.dataset.category);
  }
}

// Log out the current user.
openLogin.addEventListener("click", function () {
  if (loggedIn) {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInRole");
    sessionStorage.removeItem("authToken");
    authToken = "";
    updateLoginButton();
  }
});

// Open the account settings for the logged-in admin.
openUserPanelButton.addEventListener("click", function () {
  userAccountForm.reset();
  userAccountMessage.textContent = "";
  document.querySelector("#accountUsername").value =
    sessionStorage.getItem("loggedInUser") || "";

  const accountModal = new bootstrap.Modal(
    document.querySelector("#userAccountModal")
  );
  accountModal.show();
});

// Save the account name and optional password hash on the server.
function saveAdminAccount(username, passwordHash) {
  const accountChanges = { username: username };
  if (passwordHash !== "") {
    accountChanges.passwordSha256 = passwordHash;
  }

  return fetch("/api/admin/account", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    body: JSON.stringify(accountChanges)
  })
    .then(function (response) {
      return response.json().then(function (result) {
        if (!response.ok) {
          throw new Error(result.message || "The account could not be saved.");
        }
        return result;
      });
    });
}

// Check the new password and submit the account changes.
userAccountForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.querySelector("#accountUsername").value.trim();
  const password = document.querySelector("#accountPassword").value;
  const passwordConfirm =
    document.querySelector("#accountPasswordConfirm").value;

  if (password !== passwordConfirm) {
    userAccountMessage.textContent = "The passwords do not match.";
    return;
  }

  const passwordHash = password === "" ? "" : await hashPassword(password);
  saveAdminAccount(username, passwordHash)
    .then(function (updatedAccount) {
      sessionStorage.setItem("loggedInUser", updatedAccount.username);
      updateLoginButton();
      userAccountMessage.textContent = "";
      userAccountForm.reset();

      const accountModal = bootstrap.Modal.getInstance(
        document.querySelector("#userAccountModal")
      );
      accountModal.hide();
    })
    .catch(function (error) {
      userAccountMessage.textContent = error.message;
    });
});

// Load all studies from the JSON data file.
function loadStudies() {
  return fetch("/api/studies")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("The study JSON files could not be loaded.");
      }
      return response.json();
    })
    .then(function (loadedStudies) {
      studies = loadedStudies;
    })
    .catch(function (error) {
      categoryResult.textContent = error.message;
    });
}

// Render only the studies that belong to the selected category.
function showStudies(category) {
  studyList.innerHTML = "";

  for (let index = 0; index < studies.length; index++) {
    const study = studies[index];

    if (study.category === category) {
      const statusIcon = study.recruiting ? "bi-check-circle-fill" : "bi-x-circle-fill";
      const statusText = study.recruiting ? "Recruiting" : "Not recruiting";
      const studyItem = document.createElement("article");

      studyItem.className = "study-item list-group-item";
      studyItem.innerHTML =
        '<div class="study-main">' +
          "<h3 class=\"h6 mb-1\">" + study.title + "</h3>" +
          '<span class="badge study-category mb-1">' + study.category + "</span>" +
          '<p class="small text-secondary mb-0">' + study.overview + "</p>" +
        "</div>" +
        '<div class="study-status ' +
          (study.recruiting ? "recruiting" : "not-recruiting") +
          '" aria-label="' + statusText + '">' +
          '<i class="bi ' + statusIcon + ' fs-4" aria-hidden="true"></i>' +
          "<small>" + statusText + "</small>" +
        "</div>" +
        '<button class="details-button btn btn-outline-secondary btn-sm" type="button">Details</button>' +
        '<div class="study-details" hidden>' +
          "<h4 class=\"h6\">Study details</h4>" +
          "<p>" + study.details + "</p>" +
          '<button class="close-details-button btn btn-sm btn-secondary" type="button">Back to list</button>' +
        "</div>";

      if (loggedIn) {
        studyItem.innerHTML =
          studyItem.innerHTML +
          '<button class="edit-study-button btn btn-outline-primary btn-sm" type="button">' +
            '<i class="bi bi-pencil"></i> Edit' +
          "</button>";
      }

      studyList.appendChild(studyItem);
      addDetailsBehavior(studyItem, index);
    }
  }
}

// Open or close the details area inside one study row.
function addDetailsBehavior(studyItem, studyIndex) {
  const detailsButton = studyItem.querySelector(".details-button");
  const closeButton = studyItem.querySelector(".close-details-button");
  const details = studyItem.querySelector(".study-details");
  const editButton = studyItem.querySelector(".edit-study-button");

  detailsButton.addEventListener("click", function () {
    details.hidden = false;
    detailsButton.hidden = true;
  });

  closeButton.addEventListener("click", function () {
    details.hidden = true;
    detailsButton.hidden = false;
  });

  if (editButton !== null) {
    editButton.addEventListener("click", function () {
      openStudyForm(studyIndex);
    });
  }
}

// Mark the clicked category as selected and show matching studies.
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    categoryButtons.forEach(function (categoryButton) {
      categoryButton.classList.remove("selected");
    });

    button.classList.add("selected");
    categoryResult.textContent =
      "Selected category: " + button.dataset.category;
    backToCategories.hidden = false;
    studiesLoaded.then(function () {
      showStudies(button.dataset.category);
    });
  });
});

// Return from the study list to the category selection.
backToCategories.addEventListener("click", function () {
  categoryButtons.forEach(function (categoryButton) {
    categoryButton.classList.remove("selected");
  });

  studyList.innerHTML = "";
  categoryResult.textContent = "Please select a category.";
  backToCategories.hidden = true;
});

// Reset the form and open it in add mode.
addStudyButton.addEventListener("click", function () {
  studyForm.reset();
  document.querySelector("#studyIndex").value = "-1";
  studyModalTitle.textContent = "Add study";
});

// Fill the form and open it in edit mode.
function openStudyForm(studyIndex) {
  const study = studies[studyIndex];

  document.querySelector("#studyIndex").value = studyIndex;
  document.querySelector("#studyTitle").value = study.title;
  document.querySelector("#studyCategory").value = study.category;
  document.querySelector("#studyOverview").value = study.overview;
  document.querySelector("#studyDetails").value = study.details;
  document.querySelector("#studyRecruiting").checked = study.recruiting;
  studyModalTitle.textContent = "Edit study";

  const studyModal = new bootstrap.Modal(
    document.querySelector("#studyModal")
  );
  studyModal.show();
}

// Save a new or edited study in local JSON storage.
studyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const studyIndex = Number(document.querySelector("#studyIndex").value);
  const savedStudy = {
    title: document.querySelector("#studyTitle").value,
    category: document.querySelector("#studyCategory").value,
    overview: document.querySelector("#studyOverview").value,
    recruiting: document.querySelector("#studyRecruiting").checked,
    details: document.querySelector("#studyDetails").value
  };

  const requestUrl =
    studyIndex === -1
      ? "/api/studies"
      : "/api/studies/" + studyIndex;
  const requestMethod =
    studyIndex === -1 ? "POST" : "PUT";

  fetch(requestUrl, {
    method: requestMethod,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    body: JSON.stringify(savedStudy)
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("The study could not be saved.");
      }
      return response.json();
    })
    .then(function () {
      return fetch("/api/studies");
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (loadedStudies) {
      studies = loadedStudies;

      const studyModal = bootstrap.Modal.getInstance(
        document.querySelector("#studyModal")
      );
      studyModal.hide();

      const selectedCategory =
        document.querySelector(".category-button.selected");
      if (selectedCategory !== null) {
        showStudies(selectedCategory.dataset.category);
      }
    })
    .catch(function (error) {
      window.alert(error.message);
    });
});

// Download the current studies as a JSON file.
downloadStudiesButton.addEventListener("click", function () {
  const jsonText = JSON.stringify(studies, null, 2);
  const dataBlob = new Blob([jsonText], { type: "application/json" });
  const downloadLink = document.createElement("a");

  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = "studies.json";
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
});

const studiesLoaded = loadStudies();
loadUsers();
updateLoginButton();