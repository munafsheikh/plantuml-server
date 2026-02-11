/*****************
* Editor Menu JS *
******************/

function initEditorMenu() {
  function copyCodeToClipboard() {
    const range = document.editor.getModel().getFullModelRange();
    document.editor.focus();
    document.editor.setSelection(range);
    const code = document.editor.getValue();
    navigator.clipboard?.writeText(code).catch(() => {});
  }

  async function renderCode(code, sender = "editor-toolbar") {
    document.appConfig.autoRefreshState = "started";
    const numberOfDiagramPages = getNumberOfDiagramPagesFromCode(code);
    let index = document.appData.index;
    if (index === undefined || numberOfDiagramPages === 1) {
      index = undefined;
    } else if (index >= numberOfDiagramPages) {
      index = numberOfDiagramPages - 1;
    }
    const encodedDiagram = await makeRequest("POST", "coder", { data: code });
    sendMessage({
      sender,
      data: { encodedDiagram, numberOfDiagramPages, index },
      synchronize: true,
    });
    return encodedDiagram;
  }

  async function clearCodeAndRender() {
    setEditorValue(document.editor, "", {
      suppressEditorChangedMessage: true,
      forceMoveMarkers: true,
    });
    await renderCode("");
  }

  async function pasteAndRender() {
    const text = await navigator.clipboard?.readText?.();
    if (typeof text !== "string") {
      return undefined;
    }
    setEditorValue(document.editor, text, {
      suppressEditorChangedMessage: true,
      forceMoveMarkers: true,
    });
    return renderCode(text);
  }

  async function pasteRenderAndCopySvg() {
    const encodedDiagram = await pasteAndRender();
    if (!encodedDiagram) {
      return;
    }
    const svg = await makeRequest("GET", buildUrl("svg", encodedDiagram, document.appData.index));
    navigator.clipboard?.writeText(svg).catch(() => {});
  }

  // add listener
  document.getElementById("menu-item-editor-code-copy").addEventListener("click", copyCodeToClipboard);
  document.getElementById("toolbar-editor-clear")?.addEventListener("click", clearCodeAndRender);
  document.getElementById("toolbar-editor-paste-render")?.addEventListener("click", () => pasteAndRender());
  document.getElementById("toolbar-editor-paste-render-copy-svg")?.addEventListener("click", () => pasteRenderAndCopySvg());
}
