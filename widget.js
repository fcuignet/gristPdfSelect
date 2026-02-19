const DEFAULT_MAPPING = {
  menuColumn: "Categorie",
  pdfColumn: "PieceJointe",
};

const menuColumnSelectEl = document.getElementById("menu-column-select");
const pdfColumnSelectEl = document.getElementById("pdf-column-select");
const recordSelectEl = document.getElementById("record-select");
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

function getRowColumns(rows) {
  const names = new Set();
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      if (!key.startsWith("_")) {
        names.add(key);
      }
    });
  });
  return [...names];
}

function setSelectOptions(selectElement, options, preferredValue) {
  if (!options.length) {
    selectElement.innerHTML = "";
    return null;
  }

  const finalValue = options.includes(preferredValue) ? preferredValue : options[0];
  selectElement.innerHTML = options
    .map((name) => {
      const selected = name === finalValue ? "selected" : "";
      return `<option value="${escapeHtml(name)}" ${selected}>${escapeHtml(name)}</option>`;
    })
    .join("");

  selectElement.value = finalValue;
  return finalValue;
}

async function buildAttachmentUrl(attachmentId) {
  if (!attachmentId) {
    return null;
  }

  const tokenInfo = await grist.docApi.getAccessToken({ readOnly: true });
  const baseUrl = tokenInfo.baseUrl || window.location.origin;
  const token = tokenInfo.token ? `auth=${encodeURIComponent(tokenInfo.token)}` : "";
  const query = token ? `?${token}` : "";

  return `${baseUrl}/attachments/${attachmentId}/download${query}`;
}

function getSelectedRow() {
  const selectedValue = recordSelectEl.value;
  return latestRows.find((row) => String(row[currentMapping.menuColumn] ?? "") === selectedValue);
}

async function showCurrentSelectionPdf() {
  const row = getSelectedRow();
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
    setStatus("La ligne sélectionnée ne contient pas de pièce jointe PDF dans cette colonne.");
    return;
  }

  const url = await buildAttachmentUrl(attachmentId);
  viewerEl.src = url;
  viewerContainerEl.hidden = false;
  setStatus(
    `PDF chargé pour « ${recordSelectEl.value} » depuis la colonne « ${currentMapping.pdfColumn} ».`
  );
}

function refreshRecordSelect() {
  const validRows = latestRows.filter(
    (row) => row[currentMapping.menuColumn] != null && row[currentMapping.menuColumn] !== ""
  );

  recordSelectEl.innerHTML = validRows
    .map((row, idx) => {
      const value = String(row[currentMapping.menuColumn]);
      return `<option value="${escapeHtml(value)}" ${idx === 0 ? "selected" : ""}>${escapeHtml(value)}</option>`;
    })
    .join("");

  if (!validRows.length) {
    viewerContainerEl.hidden = true;
    viewerEl.removeAttribute("src");
    setStatus("Aucun enregistrement trouvé pour la colonne menu sélectionnée.");
    return;
  }

  showCurrentSelectionPdf().catch((error) => {
    console.error(error);
    setStatus("Impossible d'afficher le PDF pour cette sélection.");
  });
}

function refreshColumnsAndRecords(rows) {
  latestRows = rows || [];
  const columns = getRowColumns(latestRows);

  if (!columns.length) {
    menuColumnSelectEl.innerHTML = "";
    pdfColumnSelectEl.innerHTML = "";
    recordSelectEl.innerHTML = "";
    viewerContainerEl.hidden = true;
    viewerEl.removeAttribute("src");
    setStatus("Aucune donnée disponible.");
    return;
  }

  const selectedMenuColumn = setSelectOptions(menuColumnSelectEl, columns, currentMapping.menuColumn);
  const selectedPdfColumn = setSelectOptions(pdfColumnSelectEl, columns, currentMapping.pdfColumn);

  currentMapping.menuColumn = selectedMenuColumn;
  currentMapping.pdfColumn = selectedPdfColumn;

  refreshRecordSelect();
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
    { Categorie: "Facture Janvier", PieceJointe: [11], AutrePdf: [17] },
    { Categorie: "Facture Février", PieceJointe: [13], AutrePdf: [] },
  ];

  parseMapping({});
  refreshColumnsAndRecords(mockRows);
  setStatus("Mode démo local: connectez ce widget à Grist pour afficher de vrais PDFs.");
}

function initGristMode() {
  grist.ready({
    columns: [
      { name: "menuColumn", title: "Colonne menu par défaut", type: "Text" },
      { name: "pdfColumn", title: "Colonne PDF par défaut", type: "Attachments" },
    ],
    requiredAccess: "read table",
  });

  grist.onOptions((options) => {
    parseMapping(options);
    if (latestRows.length) {
      refreshColumnsAndRecords(latestRows);
    }
  });

  grist.onRecords((records) => {
    refreshColumnsAndRecords(records || []);
  });
}

menuColumnSelectEl.addEventListener("change", () => {
  currentMapping.menuColumn = menuColumnSelectEl.value;
  refreshRecordSelect();
});

pdfColumnSelectEl.addEventListener("change", () => {
  currentMapping.pdfColumn = pdfColumnSelectEl.value;
  showCurrentSelectionPdf().catch((error) => {
    console.error(error);
    setStatus("Erreur lors du chargement du PDF.");
  });
});

recordSelectEl.addEventListener("change", () => {
  showCurrentSelectionPdf().catch((error) => {
    console.error(error);
    setStatus("Erreur lors du chargement du PDF.");
  });
});

if (window.grist && window.grist.docApi) {
  initGristMode();
} else {
  initStandaloneMock();
}
