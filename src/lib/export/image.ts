/** Export the graph SVG as a PNG entirely in the browser. */
const GRAPH_STYLES = `
  .word-graph__link { stroke: rgba(140, 175, 205, 0.32); stroke-linecap: round; }
  .word-graph__link--active { stroke: rgba(72, 221, 245, 0.9); }
  .word-graph__link--dim { opacity: 0.18; }
  .word-graph__node-core { fill: currentColor; fill-opacity: 0.85; stroke: rgba(255,255,255,0.4); }
  .word-graph__node-center { fill: rgba(255,255,255,0.9); }
  .word-graph__label { fill:#e2ecf5; font-family: monospace; font-size:11px; paint-order:stroke; stroke:#050608; stroke-width:3px; }
  .word-graph__selection-ring { fill:none; stroke:currentColor; }
`;

export async function exportGraphPng(
  svg: SVGSVGElement | null,
  filename = 'yourvisualizer-graph.png',
): Promise<boolean> {
  if (!svg) return false;

  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width * 2));
  clone.setAttribute('height', String(height * 2));
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = GRAPH_STYLES;
  clone.insertBefore(style, clone.firstChild);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

  try {
    const image = new Image();
    image.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to render graph image.'));
      image.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const context = canvas.getContext('2d');
    if (!context) return false;

    context.fillStyle = '#080b10';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
