const TAU = Math.PI * 2;
const CUTOFF = 0.04;

export const LEVELS = 40;

export function parseColor(value) {
  const v = String(value).trim();

  if (v[0] === "#") {
    let hex = v.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  const parts = v.match(/[\d.]+/g);
  if (parts && parts.length >= 3) {
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
  }

  return [128, 128, 128];
}

export function clonePalette(palette) {
  return {
    base: palette.base.slice(),
    lit: palette.lit.slice(),
    peak: palette.peak.slice(),
  };
}

function mix(a, b, k) {
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

function css(color) {
  return (
    "rgb(" +
    Math.round(color[0]) +
    "," +
    Math.round(color[1]) +
    "," +
    Math.round(color[2]) +
    ")"
  );
}

export function buildLut(palette) {
  const lut = [];

  for (let i = 0; i < LEVELS; i++) {
    const k = i / (LEVELS - 1);
    const color =
      k < 0.65
        ? mix(palette.base, palette.lit, k / 0.65)
        : mix(palette.lit, palette.peak, (k - 0.65) / 0.35);
    lut.push(css(color));
  }

  return lut;
}

export function stepPalette(current, target) {
  let changed = false;
  const keys = ["base", "lit", "peak"];

  for (let k = 0; k < keys.length; k++) {
    const cur = current[keys[k]];
    const tar = target[keys[k]];

    for (let i = 0; i < 3; i++) {
      const d = tar[i] - cur[i];

      if (d !== 0) {
        changed = true;
        cur[i] = Math.abs(d) < 0.5 ? tar[i] : cur[i] + d * 0.12;
      }
    }
  }

  return changed;
}

export function createLayout(width, height, spacing, ratio) {
  const small = width < 640;
  const gap = small ? spacing * 0.8 : spacing;
  const cols = Math.ceil(width / gap) + 1;
  const rows = Math.ceil(height / gap) + 1;
  const scale = Math.max(0.55, Math.min(1.2, width / 1200));
  const offX = (width - (cols - 1) * gap) / 2;
  const offY = (height - (rows - 1) * gap) / 2;

  const px = new Float32Array(cols);
  const py = new Float32Array(rows);

  for (let c = 0; c < cols; c++) {
    px[c] = Math.round((offX + c * gap) * ratio) / ratio;
  }
  for (let r = 0; r < rows; r++) {
    py[r] = Math.round((offY + r * gap) * ratio) / ratio;
  }

  return {
    width: width,
    height: height,
    ratio: ratio,
    cols: cols,
    rows: rows,
    px: px,
    py: py,
    radius: small ? 1.1 : 1.3,
    grow: small ? 1.1 : 1.45,
    pointerRadius: 60 * Math.max(0.75, scale),
    levels: new Float32Array(cols * rows),
  };
}

export function createRenderer(makeCanvas) {
  let layout = null;
  let lut = null;
  let base = null;
  let sprites = null;
  let cell = 0;

  function paintBase() {
    const w = Math.round(layout.width * layout.ratio);
    const h = Math.round(layout.height * layout.ratio);

    if (!base || base.width !== w || base.height !== h) {
      base = makeCanvas(w, h);
    }

    const bctx = base.getContext("2d");
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, w, h);
    bctx.setTransform(layout.ratio, 0, 0, layout.ratio, 0, 0);
    bctx.fillStyle = lut[0];
    bctx.beginPath();

    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.cols; c++) {
        bctx.moveTo(layout.px[c] + layout.radius, layout.py[r]);
        bctx.arc(layout.px[c], layout.py[r], layout.radius, 0, TAU);
      }
    }

    bctx.fill();
  }

  function paintSprites() {
    cell = Math.ceil((layout.radius + layout.grow + 1) * 2 * layout.ratio);
    if (cell % 2) {
      cell += 1;
    }

    if (
      !sprites ||
      sprites.width !== cell * LEVELS ||
      sprites.height !== cell
    ) {
      sprites = makeCanvas(cell * LEVELS, cell);
    }

    const sctx = sprites.getContext("2d");
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, sprites.width, sprites.height);

    for (let i = 0; i < LEVELS; i++) {
      const radius =
        (layout.radius + (i / (LEVELS - 1)) * layout.grow) * layout.ratio;
      sctx.fillStyle = lut[i];
      sctx.beginPath();
      sctx.arc(i * cell + cell / 2, cell / 2, radius, 0, TAU);
      sctx.fill();
    }
  }

  return {
    resize: function (width, height, ratio, spacing) {
      layout = createLayout(width, height, spacing, ratio);
      if (lut) {
        paintBase();
        paintSprites();
      }
    },

    setLut: function (nextLut) {
      lut = nextLut;
      if (layout) {
        paintBase();
        paintSprites();
      }
    },

    draw: function (ctx, pointer, dt, fade) {
      if (!layout || !lut) {
        return false;
      }

      const px = layout.px;
      const py = layout.py;
      const cols = layout.cols;
      const rows = layout.rows;
      const levels = layout.levels;
      const half = cell / layout.ratio / 2;
      const size = cell / layout.ratio;
      const pr2 = layout.pointerRadius * layout.pointerRadius;
      const keep = Math.exp(-dt / fade);
      let lit = false;

      ctx.clearRect(0, 0, layout.width, layout.height);
      ctx.drawImage(base, 0, 0, layout.width, layout.height);

      for (let row = 0; row < rows; row++) {
        const y = py[row];

        for (let col = 0; col < cols; col++) {
          const x = px[col];
          const i = row * cols + col;
          let level = levels[i] * keep;

          if (pointer.inside) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < pr2 * 9) {
              const g = 0.95 * Math.exp(-d2 / (2 * pr2));

              if (g > level) {
                level = g;
              }
            }
          }

          if (level < CUTOFF) {
            levels[i] = 0;
            continue;
          }

          levels[i] = level;
          lit = true;

          const index = Math.min(LEVELS - 1, (level * (LEVELS - 1) + 0.5) | 0);

          ctx.drawImage(
            sprites,
            index * cell,
            0,
            cell,
            cell,
            x - half,
            y - half,
            size,
            size,
          );
        }
      }

      return lit;
    },
  };
}
