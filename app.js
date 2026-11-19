const UNITS = {
  length: { m: 1, km: 0.001, cm: 100, mm: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144 },
  weight: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
  tempCtoF: (c) => c * 9/5 + 32,
  tempFtoC: (f) => (f - 32) * 5/9,
  tempCtoK: (c) => c + 273.15,
  tempKtoC: (k) => k - 273.15,
  currency: { usd: 1, idr: 15600, eur: 1.07, jpy: 155 },
  digital: { bit: 1, byte: 8, kb: 8*1024, mb: 8*1024*1024, gb: 8*1024*1024*1024, tb: 8*1024*1024*1024*1024 }
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function convert(type, from, to, value) {
  if (type === "tempCtoF") return UNITS.tempCtoF(value);
  if (type === "tempFtoC") return UNITS.tempFtoC(value);
  if (type === "tempCtoK") return UNITS.tempCtoK(value);
  if (type === "tempKtoC") return UNITS.tempKtoC(value);
  if (type === "digital") {
    const fromBase = UNITS.digital[from];
    const toBase = UNITS.digital[to];
    return value * fromBase / toBase;
  }
  const fromBase = UNITS[type][from];
  const toBase = UNITS[type][to];
  return value * fromBase / toBase;
}

function $sel(s) { return document.querySelector(s); }
function formatNum(n) { return Number(n.toFixed(4)); }

function renderResult(type, from, to, value, result) {
  $("#from").textContent = `${from.toUpperCase()} → ${to.toUpperCase()}`;
  $("#to").textContent = formatNum(result);
  $("#result").classList.add("result--show");
}

function init() {
  // Set default values
  $("#fromUnit").value = "m";
  $("#toUnit").value = "km";
  $("#fromValue").value = "1";

  $("#convertBtn").addEventListener("click", () => {
    const type = $("#type").value;
    const from = $("#fromUnit").value;
    const to = $("#toUnit").value;
    const value = parseFloat($("#fromValue").value) || 0;
    const result = convert(type, from, to, value);
    renderResult(type, from, to, value, result);
  });

  // Dynamic unit list based on type
  function updateUnits() {
    const type = $("#type").value;
    const units = type === "digital" ? Object.keys(UNITS.digital) :
                  type.includes("temp") ? ["C", "F", "K"] :
                  type === "length" ? Object.keys(UNITS.length) :
                  type === "weight" ? Object.keys(UNITS.weight) :
                  type === "currency" ? Object.keys(UNITS.currency) : [];
    const fromSelect = $("#fromUnit");
    const toSelect = $("#toUnit");
    fromSelect.innerHTML = units.map(u => `<option value="${u}">${u.toUpperCase()}</option>`).join("");
    toSelect.innerHTML = units.map(u => `<option value="${u}">${u.toUpperCase()}</option>`).join("");
    // set defaults
    fromSelect.value = type === "digital" ? "byte" : type === "currency" ? "usd" : type === "length" ? "m" : type === "weight" ? "kg" : "C";
    toSelect.value = type === "digital" ? "kb" : type === "currency" ? "idr" : type === "length" ? "km" : type === "weight" ? "g" : "F";
  }

  updateUnits();
  $("#type").addEventListener("change", updateUnits);
}

document.addEventListener("DOMContentLoaded", init);