const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  if (input.value.trim() == "") {
    input.classList.add("is-empty");
  } else {
    input.classList.remove("is-empty");
  }
  input.addEventListener("input", (e) => {
    if (e.target.value.trim() == "") {
      input.classList.add("is-empty");
    } else {
      input.classList.remove("is-empty");
    }
  });
});
