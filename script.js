// Store the category buttons and the result text.
const categoryButtons = document.querySelectorAll(".category-button");
const categoryResult = document.querySelector("#categoryResult");
const studyList = document.querySelector("#studyList");

const studies = [
  {
    title: "CED-01",
    category: "CED",
    overview: "IP: Crohn disease maintenance study",
    recruiting: true
  },
  {
    title: "CED-02",
    category: "CED",
    overview: "IP: Ulcerative colitis treatment study",
    recruiting: false
  },
  {
    title: "Liver-01",
    category: "Liver",
    overview: "IP: Metabolic liver disease study",
    recruiting: true
  },
  {
    title: "Liver-02",
    category: "Liver",
    overview: "IP: Chronic hepatitis study",
    recruiting: false
  },
  {
    title: "Esophagus-01",
    category: "Esophagus",
    overview: "IP: Eosinophilic esophagitis study",
    recruiting: true
  },
  {
    title: "Esophagus-02",
    category: "Esophagus",
    overview: "IP: Reflux symptom treatment study",
    recruiting: false
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
        "</div>";

      studyList.appendChild(studyItem);
    }
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
    showStudies(button.dataset.category);
  });
});