// ================================
// MOBILE MENU
// ================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ================================
// AUTO YEAR FOOTER
// ================================
const yearNow = document.getElementById("yearNow");
if (yearNow) {
  yearNow.textContent = new Date().getFullYear();
}

// ================================
// DOWNLOAD BUTTON GUARD
// ================================
const downloadBtn = document.getElementById("downloadButton");

if (downloadBtn) {
  downloadBtn.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (!href || href === "#") {
      e.preventDefault();
      alert("Link download belum diisi");
    }
  });
}

// ================================
// LOAD SCREENSHOTS
// ================================
const screenshots = [
  {
    id: "shot1Preview",
    file: "assets/dashboard.png",
  },
  {
    id: "shot2Preview",
    file: "assets/penerimaan.png",
  },
  {
    id: "shot3Preview",
    file: "assets/pengeluaran.png",
  },
  {
    id: "shot4Preview",
    file: "assets/laporan.png",
  },
];

screenshots.forEach((item) => {
  const el = document.getElementById(item.id);
  if (!el) return;

  const img = new Image();
  img.src = item.file;

  img.onload = () => {
    el.innerHTML = "";
    el.appendChild(img);
  };
});
