const DEFAULT_MAPPING = {
  menuColumn: "Categorie",
  pdfColumn: "PieceJointe",
};

const selectEl = document.getElementById("record-select");
const statusEl = document.getElementById("status");
const viewerContainerEl = document.getElementById("viewer-container");
const viewerEl = document.getElementById("pdf-viewer");

let latestRows = [];
let currentMapping = { ...DEFAULT_MAPPING };

function setStatus(message) {
  statusEl.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAttachmentId(pdfCellValue) {
  if (Array.isArray(pdfCellValue)) {
    return pdfCellValue[0] ?? null;
  }
  if (typeof pdfCellValue === "number") {
    return pdfCellValue;
  }
  return null;
}

async function buildAttachmentUrl(attachmentId) {
  if (!attachmentId) {
    return null;
  }

  // Works in Grist custom widgets to authenticate direct attachment access.
  const tokenInfo = await grist.docApi.getAccessToken({ readOnly: true });
  const baseUrl = tokenInfo.baseUrl || window.location.origin;
  const token = tokenInfo.token ? `auth=${encodeURIComponent(tokenInfo.token)}` : "";
  const query = token ? `?${token}` : "";

  return `${baseUrl}/attachments/${attachmentId}/download${query}`;
}

async function showRowPdfByMenuValue(selectedValue) {
  const row = latestRows.find((r) => String(r[currentMapping.menuColumn] ?? "") === selectedValue);

  if (!row) {
    viewerContainerEl.hidden = true;
    viewerEl.removeAttribute("src");
    setStatus("Aucune ligne correspondante.");
    return;
  }

  const attachmentId = getAttachmentId(row[currentMapping.pdfColumn]);
  if (!attachmentId) {
    viewerContainerEl.hidden = true;
    viewerEl.removeAttribute("src");
    setStatus("La ligne sélectionnée ne contient pas de pièce jointe PDF.");
    return;
  }

  const url = await buildAttachmentUrl(attachmentId);
  viewerEl.src = url;
  viewerContainerEl.hidden = false;
  setStatus(`PDF chargé pour « ${selectedValue} ».`);
}

function refreshOptions(rows) {
  const validRows = rows.filter((r) => r[currentMapping.menuColumn] != null && r[currentMapping.menuColumn] !== "");
  latestRows = validRows;

  selectEl.innerHTML = validRows
    .map((row, idx) => {
      const value = String(row[currentMapping.menuColumn]);
      return `<option value="${escapeHtml(value)}" ${idx === 0 ? "selected" : ""}>${escapeHtml(value)}</option>`;
    })
    .join("");

  if (validRows.length === 0) {
    viewerContainerEl.hidden = true;
    viewerEl.removeAttribute("src");
    setStatus("Aucune donnée disponible. Vérifiez les colonnes configurées.");
    return;
  }

  showRowPdfByMenuValue(selectEl.value).catch((error) => {
    console.error(error);
    setStatus("Impossible d'afficher le PDF pour la valeur sélectionnée.");
  });
}

function parseMapping(options) {
  const mapping = options?.columns || {};
  currentMapping = {
    menuColumn: mapping.menuColumn || DEFAULT_MAPPING.menuColumn,
    pdfColumn: mapping.pdfColumn || DEFAULT_MAPPING.pdfColumn,
  };
}

function initStandaloneMock() {
  const mockRows = [
    { Categorie: "Facture Janvier", PieceJointe: [11] },
    { Categorie: "Facture Février", PieceJointe: [13] },
  ];

  parseMapping({});
  refreshOptions(mockRows);
  setStatus(
    "Mode démo local: connectez ce widget à Grist pour afficher de vrais PDFs de pièces jointes."
  );
}

function initGristMode() {
  grist.ready({
    columns: [
      { name: "menuColumn", title: "Colonne du menu déroulant", type: "Text" },
      { name: "pdfColumn", title: "Colonne des pièces jointes PDF", type: "Attachments" },
    ],
    requiredAccess: "read table",
  });

  grist.onOptions((options) => {
    parseMapping(options);
    setStatus(
      `Colonnes configurées: menu « ${currentMapping.menuColumn} », PDF « ${currentMapping.pdfColumn} ».`
    );
  });

  grist.onRecords((records) => {
    refreshOptions(records || []);
  });
}

selectEl.addEventListener("change", () => {
  showRowPdfByMenuValue(selectEl.value).catch((error) => {
    console.error(error);
    setStatus("Erreur lors du chargement du PDF.");
  });
});

if (window.grist && window.grist.docApi) {
  initGristMode();
} else {
  initStandaloneMock();
}
