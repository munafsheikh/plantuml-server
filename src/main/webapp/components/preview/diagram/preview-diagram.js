/*********************
* Preview Diagram JS *
**********************/

const DIAGRAM_SCALE_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

function getCurrentDiagramScale() {
  return Number(document.appData?.diagramScale || 1);
}

function updateScaleControls(type, scale) {
  const select = document.getElementById("diagram-scale-select");
  const scaleControls = document.getElementsByClassName("diagram-scale-btn");
  if (select) {
    select.value = String(scale);
    if (select.value !== String(scale)) {
      select.value = "1";
    }
    select.disabled = !["png", "svg"].includes(type);
  }
  for (const button of scaleControls) {
    button.disabled = !["png", "svg"].includes(type);
  }
}

function setDiagramScale(scale, { type = undefined } = {}) {
  const container = document.getElementById("diagram");
  const png = document.getElementById("diagram-png");
  const svg = document.getElementById("diagram-svg");
  const diagramType = type || container?.getAttribute("data-diagram-type") || "png";
  const newScale = Math.max(0.5, Math.min(3, Number(scale) || 1));
  document.appData.diagramScale = newScale;

  if (png) {
    png.style.width = "";
    png.style.maxWidth = "100%";
  }
  if (svg) {
    svg.style.width = "";
    svg.style.maxWidth = "100%";
  }

  if (diagramType === "png" && png) {
    png.style.width = `${Math.round(newScale * 100)}%`;
    png.style.maxWidth = "none";
  }
  if (diagramType === "svg" && svg) {
    svg.style.width = `${Math.round(newScale * 100)}%`;
    svg.style.maxWidth = "none";
  }

  updateScaleControls(diagramType, newScale);
}

function scaleDiagramToFitWidth() {
  const container = document.getElementById("diagram");
  const type = container?.getAttribute("data-diagram-type") || "png";
  const contentWidth = container?.clientWidth || 1;
  if (type === "png") {
    const png = document.getElementById("diagram-png");
    const naturalWidth = png?.naturalWidth || 1;
    return setDiagramScale(contentWidth / naturalWidth, { type });
  }
  if (type === "svg") {
    const svg = document.getElementById("diagram-svg");
    const svgWidth = svg?.viewBox?.baseVal?.width || svg?.getBoundingClientRect().width || 1;
    return setDiagramScale(contentWidth / svgWidth, { type });
  }
}

function initializeDiagramScaleControls() {
  function getNearestScale(scale) {
    return DIAGRAM_SCALE_STEPS.reduce((acc, step) => {
      return Math.abs(step - scale) < Math.abs(acc - scale) ? step : acc;
    }, 1);
  }
  function adjustScale(offset) {
    const current = getNearestScale(getCurrentDiagramScale());
    const currentIndex = DIAGRAM_SCALE_STEPS.indexOf(current);
    const nextIndex = Math.min(DIAGRAM_SCALE_STEPS.length - 1, Math.max(0, currentIndex + offset));
    setDiagramScale(DIAGRAM_SCALE_STEPS[nextIndex]);
  }

  document.getElementById("btn-scale-down")?.addEventListener("click", () => adjustScale(-1));
  document.getElementById("btn-scale-up")?.addEventListener("click", () => adjustScale(1));
  document.getElementById("btn-scale-fit")?.addEventListener("click", scaleDiagramToFitWidth);
  document.getElementById("diagram-scale-select")?.addEventListener("change", ({ target }) => {
    setDiagramScale(Number(target.value));
  });
}

async function initializeDiagram() {
  if (document.appConfig.diagramPreviewType !== "png") {
    // NOTE: "png" is preloaded from the server
    return setDiagram(
      document.appConfig.diagramPreviewType,
      document.appData.encodedDiagram,
      document.appData.index
    );
  }
}

async function setDiagram(type, encodedDiagram, index) {
  const container = document.getElementById("diagram");
  const png = document.getElementById("diagram-png");
  const txt = document.getElementById("diagram-txt");
  const pdf = document.getElementById("diagram-pdf");
  // NOTE: the map and svg elements will be overwitten, hence can not be cached

  async function requestDiagram(type, encodedDiagram, index) {
    return makeRequest("GET", buildUrl(type, encodedDiagram, index));
  }
  function setDiagramMap(mapString) {
    const mapEl = document.getElementById("plantuml_map");
    const mapBtn = document.getElementById("map-diagram-link");
    if (mapString) {
      const div = document.createElement("div");
      div.innerHTML = mapString;
      mapEl.parentNode.replaceChild(div.firstChild, mapEl);
      setVisibility(mapBtn, true);
    } else {
      removeChildren(mapEl);
      setVisibility(mapBtn, false);
    }
  }
  function setSvgDiagram(svgString) {
    const svgEl = document.getElementById("diagram-svg");
    const div = document.createElement("div");
    div.innerHTML = svgString;
    const newSvg = div.querySelector("svg");
    newSvg.id = "diagram-svg";
    newSvg.classList = svgEl.classList;
    newSvg.style.cssText = svgEl.style.cssText;
    svgEl.parentNode.replaceChild(newSvg, svgEl);
  }
  function setDiagramVisibility(type) {
    const map = document.getElementById("plantuml_map");
    const svg = document.getElementById("diagram-svg");
    container.setAttribute("data-diagram-type", type);
    setVisibility(png, type === "png");
    setVisibility(map, type === "png");
    setVisibility(svg, type === "svg");
    setVisibility(txt, type === "txt");
    setVisibility(pdf, type === "pdf");
    setDiagramScale(getCurrentDiagramScale(), { type });
  }
  // update diagram
  try {
    if (type === "png") {
      png.src = buildUrl("png", encodedDiagram, index);
      const map = await requestDiagram("map", encodedDiagram, index);
      setDiagramMap(map);
    } else if (type === "svg") {
      const svg = await requestDiagram("svg", encodedDiagram, index);
      setSvgDiagram(svg);
    } else if (type === "txt") {
      txt.innerHTML = await requestDiagram("txt", encodedDiagram, index);
    } else if (type === "pdf") {
      pdf.data = buildUrl("pdf", encodedDiagram, index);
    } else {
      const message = "unknown diagram type: " + type;
      (console.error || console.log)(message);
      return Promise.reject(message);
    }
    setDiagramVisibility(type);
  } catch (e) {
    // This should only happen if for example a broken diagram is requested.
    // Therefore, since the error message is already included in the response image, prevent further error messages.
    //(console.error || console.log)(e);
  }
}
