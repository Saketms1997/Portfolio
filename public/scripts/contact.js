document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  fetch("http://localhost:3000/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("responseMessage").textContent = data.message;
    })
    .catch(() => {
      document.getElementById("responseMessage").textContent =
        "Error sending message.";
    });
});
