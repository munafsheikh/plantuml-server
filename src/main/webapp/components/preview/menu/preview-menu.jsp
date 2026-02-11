<div class="preview-menu">
  <div class="diagram-links flex-columns">
    <span>View as:</span>
    <a class="diagram-link" data-img-type="png" href="png/<%= diagramUrl %>" title="View diagram as PNG">
      <img src="assets/file-types/png.svg" alt="PNG" />
    </a>
    <a class="diagram-link" data-img-type="svg" href="svg/<%= diagramUrl %>" title="View diagram as SVG">
      <img src="assets/file-types/svg.svg" alt="SVG" />
    </a>
    <a class="diagram-link" data-img-type="txt" href="txt/<%= diagramUrl %>" title="View diagram as ASCII Art">
      <img src="assets/file-types/ascii.svg" alt="ASCII Art" />
    </a>
    <a class="diagram-link" data-img-type="pdf" href="pdf/<%= diagramUrl %>" title="View diagram as PDF">
      <img src="assets/file-types/pdf.svg" alt="PDF" />
    </a>
    <a
      id="map-diagram-link"
      class="diagram-link"
      data-img-type="map"
      href="map/<%= diagramUrl %>"
      title="View diagram as Map Data"
      <% if (!hasMap) { %>
        style="display: none;"
      <% } %>
    >
        <img src="assets/file-types/map.svg" alt="MAP" />
    </a>
    <div class="diagram-scale-controls" aria-label="Diagram scale controls">
      <button id="btn-scale-down" class="diagram-scale-btn" type="button" title="Decrease diagram scale">-</button>
      <select id="diagram-scale-select" title="Diagram scale">
        <option value="0.5">50%</option>
        <option value="0.75">75%</option>
        <option value="1" selected>100%</option>
        <option value="1.25">125%</option>
        <option value="1.5">150%</option>
        <option value="2">200%</option>
        <option value="3">300%</option>
      </select>
      <button id="btn-scale-up" class="diagram-scale-btn" type="button" title="Increase diagram scale">+</button>
      <button id="btn-scale-fit" class="diagram-scale-btn" type="button" title="Fit diagram to available width">Fit</button>
    </div>
    <div class="flex-main menu-r">
      <div class="btn-float-r">
        <input
          id="btn-settings"
          class="btn-settings"
          type="image"
          src="assets/actions/settings.svg"
          alt="settings"
          onclick="openModal('settings')"
        />
        <input
          id="btn-undock"
          class="btn-dock"
          type="image"
          src="assets/actions/undock.svg"
          alt="undock"
        />
        <input
          id="btn-dock"
          class="btn-dock"
          type="image"
          src="assets/actions/dock.svg"
          alt="dock"
          onclick="window.close();"
          style="display: none;"
        />
      </div>
    </div>
  </div>
</div>
