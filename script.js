const panels = ["servicePanel","locationPanel","tripPanel","confirmPanel"];
let selectedService = "Ojek";
let selectedBase = 10000;

const services = document.querySelectorAll(".service");
const progressSteps = document.querySelectorAll(".step");

services.forEach(btn => {
  btn.addEventListener("click", () => {
    services.forEach(x => x.classList.remove("selected"));
    btn.classList.add("selected");
    selectedService = btn.dataset.service;
    selectedBase = Number(btn.dataset.base);
  });
});

function showPanel(id, progress) {
  panels.forEach(p => document.getElementById(p).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  progressSteps.forEach((s,i) => s.classList.toggle("active", i < progress));
  window.scrollTo({top:0, behavior:"smooth"});
}

document.getElementById("startBtn").onclick = () => showPanel("locationPanel",2);

document.querySelectorAll(".back").forEach(btn => {
  btn.onclick = () => {
    const target = btn.dataset.back;
    showPanel(target, target === "servicePanel" ? 1 : 2);
  };
});

document.querySelectorAll(".clear").forEach(btn => {
  btn.onclick = () => document.getElementById(btn.dataset.clear).value = "";
});

document.getElementById("routeBtn").onclick = () => {
  const pickup = document.getElementById("pickup").value.trim();
  const destination = document.getElementById("destination").value.trim();

  if (!pickup || !destination) {
    alert("Silakan isi lokasi penjemputan dan tujuan terlebih dahulu.");
    return;
  }

  // Simulasi estimasi agar mockup tetap ringan tanpa API peta.
  const distance = +(2.5 + Math.random() * 4.5).toFixed(1);
  const duration = Math.max(8, Math.round(distance * 2.7));
  const fare = Math.round((selectedBase + distance * 1200) / 1000) * 1000;

  document.getElementById("pickupText").textContent = pickup;
  document.getElementById("destinationText").textContent = destination;
  document.getElementById("distance").textContent = distance.toFixed(1).replace(".", ",") + " km";
  document.getElementById("duration").textContent = duration + " menit";
  document.getElementById("fare").textContent = "Rp" + fare.toLocaleString("id-ID");

  document.getElementById("confirmBtn").dataset.fare = fare;
  showPanel("tripPanel",3);
};

document.getElementById("confirmBtn").onclick = () => {
  const fare = Number(document.getElementById("confirmBtn").dataset.fare);
  document.getElementById("confirmedService").textContent = selectedService;
  document.getElementById("confirmedPickup").textContent = document.getElementById("pickup").value;
  document.getElementById("confirmedDestination").textContent = document.getElementById("destination").value;
  document.getElementById("confirmedFare").textContent = "Rp" + fare.toLocaleString("id-ID");
  showPanel("confirmPanel",4);
};

document.getElementById("newOrderBtn").onclick = () => {
  document.getElementById("destination").value = "";
  showPanel("servicePanel",1);
};
