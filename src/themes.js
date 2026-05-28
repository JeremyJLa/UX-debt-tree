// Each theme defines the page background and the SVG tree colours.
// `fill`/`emptyFill` are [r, g, b] in 0–1 range used in feColorMatrix.
// `gradient` is the CSS background for the page wrapper.
// `bg` is the extracted mid-point colour used for text, buttons, swatches.

export const THEMES = [
  {
    id: 'periwinkle',
    label: 'Periwinkle',
    bg: '#8994be',
    button: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    gradient: 'linear-gradient(135deg, #7080b8 0%, #8994be 50%, #a8b4d4 100%)',
    gradientStops: [
      { offset: '0%',   color: '#7080b8' },
      { offset: '50%',  color: '#8994be' },
      { offset: '100%', color: '#a8b4d4' },
    ],
    fill:         [0.74, 0.77, 0.86],
    outline:      '#9aa4bc',
    emptyFill:    [0.64, 0.68, 0.78],
    emptyOutline: '#7880a0',
  },
  {
    id: 'forest',
    label: 'Forest',
    bg: '#4a6741',
    button: 'linear-gradient(135deg, #22c55e, #16a34a)',
    gradient: 'linear-gradient(135deg, #344e2e 0%, #4a6741 50%, #637d54 100%)',
    gradientStops: [
      { offset: '0%',   color: '#344e2e' },
      { offset: '50%',  color: '#4a6741' },
      { offset: '100%', color: '#637d54' },
    ],
    fill:         [0.66, 0.78, 0.64],
    outline:      '#7a9a78',
    emptyFill:    [0.52, 0.63, 0.50],
    emptyOutline: '#5a7a58',
  },
  {
    id: 'dusk',
    label: 'Dusk',
    bg: '#8c5a38',
    button: 'linear-gradient(135deg, #f97316, #ea580c)',
    gradient: 'linear-gradient(135deg, #6e3e22 0%, #8c5a38 50%, #b07a52 100%)',
    gradientStops: [
      { offset: '0%',   color: '#6e3e22' },
      { offset: '50%',  color: '#8c5a38' },
      { offset: '100%', color: '#b07a52' },
    ],
    fill:         [0.91, 0.82, 0.69],
    outline:      '#c4a070',
    emptyFill:    [0.78, 0.68, 0.56],
    emptyOutline: '#a08050',
  },
  {
    id: 'ink',
    label: 'Ink',
    bg: '#2c3e50',
    button: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    gradient: 'linear-gradient(135deg, #18262e 0%, #2c3e50 50%, #3e5870 100%)',
    gradientStops: [
      { offset: '0%',   color: '#18262e' },
      { offset: '50%',  color: '#2c3e50' },
      { offset: '100%', color: '#3e5870' },
    ],
    fill:         [0.69, 0.75, 0.82],
    outline:      '#8898b0',
    emptyFill:    [0.56, 0.62, 0.70],
    emptyOutline: '#6878a0',
  },
]

export const DEFAULT_THEME = THEMES[0]
