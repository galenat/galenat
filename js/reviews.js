const stars = document.querySelectorAll("#starRating span");
const reviewURL = "https://g.page/r/CTvPCgh25HIcEBM/review";

stars.forEach((star, index) => {

  // Hover progresivo
  star.addEventListener("mouseover", () => {
    resetStars();
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add("hovered");
    }
  });

  // Quitar hover al salir
  star.addEventListener("mouseout", () => {
    resetStars();
  });

  // Click redirige
  star.addEventListener("click", () => {
    window.open(reviewURL, "_blank");
  });

});

function resetStars() {
  stars.forEach(star => {
    star.classList.remove("hovered");
  });
}
