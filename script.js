// ================================
// MOBILE MENU
// ================================
const DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1qdt16Ci-Jvi9Pcvp3irxWtlHuQpaUWlO";
const DOWNLOAD_FALLBACK_URL = "https://wa.me/6283165155005";

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navLinks && mobileMenuBtn) {
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
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
const downloadHelperText = document.getElementById("downloadHelperText");

if (downloadBtn) {
  const hasDownloadUrl = Boolean(DOWNLOAD_URL.trim());

  if (hasDownloadUrl) {
    downloadBtn.href = DOWNLOAD_URL;
    downloadBtn.target = "_blank";
    downloadBtn.rel = "noopener noreferrer";

    if (downloadHelperText) {
      downloadHelperText.textContent =
        "Tombol di atas akan membuka link download demo resmi ALPENA.";
    }
  } else {
    downloadBtn.href = DOWNLOAD_FALLBACK_URL;
    downloadBtn.target = "_blank";
    downloadBtn.rel = "noopener noreferrer";
    downloadBtn.textContent = "Minta Link Download Demo";

    if (downloadHelperText) {
      downloadHelperText.textContent =
        "Link download final belum diisi. Untuk sementara, tombol di atas mengarah ke WhatsApp agar pengunjung tetap bisa meminta file demo.";
    }
  }
}
