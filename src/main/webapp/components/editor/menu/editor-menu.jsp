<div class="editor-menu" tabindex="-1">
  <div class="editor-touch-toolbar" aria-label="Editor quick actions">
    <button id="toolbar-editor-clear" class="editor-touch-button" type="button" title="Clear source code">Clear</button>
    <button id="toolbar-editor-paste-render" class="editor-touch-button" type="button" title="Paste from clipboard and render">Paste + Render</button>
    <button
      id="toolbar-editor-paste-render-copy-svg"
      class="editor-touch-button"
      type="button"
      title="Paste, render, and copy SVG"
    >
      Paste + Render + Copy SVG
    </button>
  </div>
  <div class="menu-kebab">
    <div class="kebab-circle"></div>
    <div class="kebab-circle"></div>
    <div class="kebab-circle"></div>
    <div class="kebab-circle"></div>
    <div class="kebab-circle"></div>
  </div>
  <div class="menu-items">
    <input
      id="menu-item-editor-code-copy"
      class="menu-item"
      type="image"
      alt="copy"
      title="Copy code"
      src="assets/actions/copy.svg"
    />
    <input
      class="menu-item"
      type="image"
      alt="import"
      title="Import diagram"
      src="assets/actions/upload.svg"
      onclick="openModal('diagram-import')"
    />
    <input
      class="menu-item"
      type="image"
      alt="export"
      title="Export diagram"
      src="assets/actions/download.svg"
      onclick="openModal('diagram-export')"
    />
  </div>
</div>
