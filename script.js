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

const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");
const pickupInput = document.getElementById("pickup");

locationBtn.addEventListener("click", () => {

  if (!navigator.geolocation) {
    locationStatus.textContent =
      "Browser Anda tidak mendukung GPS.";
    return;
  }

  locationStatus.textContent =
    "📡 Sedang mengambil lokasi GPS...";

  locationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      locationStatus.textContent =
        "✓ Lokasi GPS berhasil ditemukan";

      locationBtn.textContent =
        "✓ Lokasi Saya Digunakan";

      // Mengubah koordinat GPS menjadi nama lokasi
      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );

        const data = await response.json();

        if (data.display_name) {
          pickupInput.value = data.display_name;
        } else {
          pickupInput.value =
            `${latitude}, ${longitude}`;
        }

      } catch (error) {

        console.error(error);

        pickupInput.value =
          `${latitude}, ${longitude}`;

        locationStatus.textContent =
          "✓ GPS ditemukan, tetapi nama lokasi tidak tersedia.";
      }

      locationBtn.disabled = false;
    },

    (error) => {

      locationBtn.disabled = false;

      switch (error.code) {

        case error.PERMISSION_DENIED:
          locationStatus.textContent =
            "❌ Akses lokasi ditolak. Silakan izinkan GPS.";
          break;

        case error.POSITION_UNAVAILABLE:
          locationStatus.textContent =
            "❌ Lokasi tidak tersedia.";
          break;

        case error.TIMEOUT:
          locationStatus.textContent =
            "❌ Waktu pengambilan lokasi habis.";
          break;

        default:
          locationStatus.textContent =
            "❌ Terjadi kesalahan saat mengambil lokasi.";
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
});

document.getElementById("newOrderBtn").onclick = () => {
  document.getElementById("destination").value = "";
  showPanel("servicePanel",1);
};
