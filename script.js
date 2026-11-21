// Store the category buttons and the result text.
const categoryButtons = document.querySelectorAll(".category-button");
const categoryResult = document.querySelector("#categoryResult");
const studyList = document.querySelector("#studyList");

const studies = [
  {
    title: "CED-01",
    category: "CED",
    overview: "IP: Crohn disease maintenance study",
    recruiting: true,
    details: "A maintenance study for adults with Crohn disease."
  },
  {
    title: "CED-02",
    category: "CED",
    overview: "IP: Ulcerative colitis treatment study",
    recruiting: false,
    details: "A treatment study for adults with ulcerative colitis."
  },
  {
    title: "Liver-01",
    category: "Liver",
    overview: "IP: Metabolic liver disease study",
    recruiting: true,
    details: "A study evaluating metabolic liver disease treatments."
  },
  {
    title: "Liver-02",
    category: "Liver",
    overview: "IP: Chronic hepatitis study",
    recruiting: false,
    details: "A study for patients with chronic hepatitis."
  },
  {
    title: "Esophagus-01",
    category: "Esophagus",
    overview: "IP: Eosinophilic esophagitis study",
    recruiting: true,
    details: "A study for adults with eosinophilic esophagitis."
  },
  {
    title: "Esophagus-02",
    category: "Esophagus",
    overview: "IP: Reflux symptom treatment study",
    recruiting: false,
    details: "A treatment study for adults with reflux symptoms."
  }
];

// Render only the studies that belong to the selected category.
function showStudies(category) {
  studyList.innerHTML = "";

  for (let index = 0; index < studies.length; index++) {
    const study = studies[index];

    if (study.category === category) {
      const statusSymbol = study.recruiting ? "✓" : "✕";
      const statusText = study.recruiting ? "Recruiting" : "Not recruiting";
      const studyItem = document.createElement("article");

      studyItem.className = "study-item";
      studyItem.innerHTML =
        '<div class="study-main">' +
          "<h3>" + study.title + "</h3>" +
          '<p class="study-category">' + study.category + "</p>" +
          "<p>" + study.overview + "</p>" +
        "</div>" +
        '<div class="study-status ' +
          (study.recruiting ? "recruiting" : "not-recruiting") +
          '" aria-label="' + statusText + '">' +
          '<span aria-hidden="true">' + statusSymbol + "</span>" +
          "<small>" + statusText + "</small>" +
        "</div>" +
        '<button class="details-button" type="button">Details</button>' +
        '<div class="study-details" hidden>' +
          "<h4>Study details</h4>" +
          "<p>" + study.details + "</p>" +
          '<button class="close-details-button" type="button">Back to list</button>' +
        "</div>";

      studyList.appendChild(studyItem);
      addDetailsBehavior(studyItem);
    }
  }
}

// Open or close the details area inside one study row.
function addDetailsBehavior(studyItem) {
  const detailsButton = studyItem.querySelector(".details-button");
  const closeButton = studyItem.querySelector(".close-details-button");
  const details = studyItem.querySelector(".study-details");

  detailsButton.addEventListener("click", function () {
    details.hidden = false;
    detailsButton.hidden = true;
  });

  closeButton.addEventListener("click", function () {
    details.hidden = true;
    detailsButton.hidden = false;
  });
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
    showStudies(button.dataset.category);
  });
});