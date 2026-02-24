document.addEventListener("DOMContentLoaded", async () => {
  // Cargar el sidebar desde components/sidebar.html
  const container = document.getElementById("sidebar-component");
  const html = await fetch("sidebar.html").then(res => res.text());
  container.innerHTML = html;

  document.body.classList.add("sidebar-collapsed");

  // Activar el toggle después de insertarlo en el DOM
  const toggleButton = document.querySelector("#toggle-btn");
  const sidebar = document.querySelector("#sidebar");

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-collapsed");
  });
});