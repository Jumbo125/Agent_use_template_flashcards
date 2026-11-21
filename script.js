// Store the category buttons and the result text.
const categoryButtons = document.querySelectorAll(".category-button");
const categoryResult = document.querySelector("#categoryResult");

// Mark the clicked category as selected and show its name.
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    categoryButtons.forEach(function (categoryButton) {
      categoryButton.classList.remove("selected");
    });

    button.classList.add("selected");
    categoryResult.textContent =
      "Selected category: " + button.dataset.category;
  });
});