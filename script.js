// ================================
// MOBILE MENU
// ================================
const DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1KYjXpWfuLpC5SSRADwwYXgRbrvkhEVOQ";
const DOWNLOAD_FALLBACK_URL = "https://wa.me/6285882220910";
const ORDER_API_URL =
  window.ALPENA_ORDER_API_URL ||
  "https://script.google.com/macros/s/AKfycbwQ0Ou8_VjAxXzpKokA1HdKtiJIj6s7VOmX9h6bJ_zteVoMJbwkqVwQ56kUqgX4J_xeFQ/exec";

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

// ================================
// ORDER NOTA
// ================================
const orderForm = document.getElementById("orderNotaForm");
const orderSubmitButton = document.getElementById("orderSubmitButton");
const orderHelperText = document.getElementById("orderHelperText");
const orderResult = document.getElementById("orderResult");
const orderResultTitle = document.getElementById("orderResultTitle");
const orderResultText = document.getElementById("orderResultText");
const orderDetailLink = document.getElementById("orderDetailLink");
const orderPdfLink = document.getElementById("orderPdfLink");
const orderErrorBox = document.getElementById("orderErrorBox");
const amountInput = document.getElementById("price_amount");

function formatRupiahInput(value) {
  const digits = String(value || "").replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  return new Intl.NumberFormat("id-ID").format(Number(digits));
}

function clearOrderErrors() {
  document.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });

  document.querySelectorAll(".order-field").forEach((node) => {
    node.classList.remove("has-error");
  });

  if (orderErrorBox) {
    orderErrorBox.hidden = true;
    orderErrorBox.textContent = "";
  }
}

function setFieldError(name, message) {
  const field = orderForm?.querySelector(`[name="${name}"]`);
  const errorNode = document.querySelector(`[data-error-for="${name}"]`);

  if (field) {
    field.closest(".order-field")?.classList.add("has-error");
  }

  if (errorNode) {
    errorNode.textContent = message;
  }
}

function buildSheetPayload(payload) {
  const paymentTypeLabel =
    payload.payment_type === "renewal"
      ? "Perpanjangan Lisensi"
      : "ALPENA Pro";

  const amountLabel = payload.price_amount
    ? `Rp ${formatRupiahInput(payload.price_amount)}`
    : "-";

  const notes = [
    `Jenis pembayaran: ${paymentTypeLabel}`,
    `Nominal: ${amountLabel}`,
    `NPSN: ${payload.npsn || "-"}`,
    `Tahun anggaran: ${payload.budget_year || "-"}`,
    `Kecamatan: ${payload.school_district || "-"}`,
    `Kabupaten: ${payload.school_regency || "-"}`,
    `Nama kepala sekolah: ${payload.principal_name || "-"}`,
    `NIP kepala sekolah: ${payload.principal_nip || "-"}`,
    `Email sekolah: ${payload.school_email || "-"}`,
    `Email operator: ${payload.operator_email || "-"}`,
    `NIP operator: ${payload.operator_nip || "-"}`,
    `Metode pembayaran: ${payload.payment_method || "-"}`,
  ].join(" | ");

  return {
    submittedAt: new Date().toISOString(),
    name: payload.operator_name || "",
    school: payload.school_name || "",
    role: "Operator / Pemesan",
    city: [payload.school_district, payload.school_regency]
      .filter(Boolean)
      .join(", "),
    phone: payload.operator_whatsapp || "",
    email: payload.operator_email || payload.school_email || "",
    package: paymentTypeLabel,
    devices: "1 komputer",
    notes,
    source: "publish-temp-order-nota",
    pageUrl: window.location.href,
  };
}

if (amountInput) {
  amountInput.addEventListener("input", (event) => {
    const caretAtEnd =
      event.target.selectionStart === event.target.value.length;
    event.target.value = formatRupiahInput(event.target.value);
    if (caretAtEnd) {
      const end = event.target.value.length;
      event.target.setSelectionRange(end, end);
    }
  });
}

if (orderForm) {
  if (orderHelperText) {
    orderHelperText.textContent =
      "Form ini akan mengirim data order ke spreadsheet ALPENA melalui Google Apps Script.";
  }

  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearOrderErrors();

    const formData = new FormData(orderForm);
    const payload = Object.fromEntries(formData.entries());
    payload.price_amount = String(payload.price_amount || "").replace(
      /[^\d]/g,
      ""
    );
    const sheetPayload = buildSheetPayload(payload);

    if (orderSubmitButton) {
      orderSubmitButton.disabled = true;
      orderSubmitButton.textContent = "Mengirim Order...";
    }

    try {
      const response = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sheetPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (orderErrorBox) {
          orderErrorBox.hidden = false;
          orderErrorBox.textContent =
            result.message ||
            "Order tidak dapat dikirim ke spreadsheet. Periksa kembali konfigurasi Apps Script.";
        }
        return;
      }

      if (orderResultTitle) {
        orderResultTitle.textContent = "Order berhasil dikirim";
      }
      if (orderResultText) {
        orderResultText.textContent =
          "Data order untuk " +
          (sheetPayload.school || "sekolah") +
          " sudah dikirim ke spreadsheet ALPENA dan siap ditindaklanjuti.";
      }
      if (orderDetailLink) {
        orderDetailLink.href = "#kontak";
        orderDetailLink.textContent = "Buka Kontak ALPENA";
      }
      if (orderPdfLink) {
        orderPdfLink.href = "#download";
        orderPdfLink.textContent = "Lanjut ke Download Demo";
      }
      if (orderResult) {
        orderResult.hidden = false;
      }
      orderForm.reset();
      if (amountInput) {
        amountInput.value = "";
      }
    } catch (error) {
      if (orderErrorBox) {
        orderErrorBox.hidden = false;
        orderErrorBox.textContent =
          "Gagal menghubungi endpoint spreadsheet. Pastikan Apps Script sudah terdeploy sebagai Web App dan dapat diakses.";
      }
    } finally {
      if (orderSubmitButton) {
        orderSubmitButton.disabled = false;
        orderSubmitButton.textContent = "Buat Order & Nota";
      }
    }
  });
}
