export const brandTokens = {
  "--brand": "#AE0303",
  "--brand-strong": "#8F0202",
  "--brand-dark": "#430909",
  "--pink": "#FDEBEC",
  "--cream": "#FAF7F5",
  "--ink": "#161110",
  "--muted": "#655F5D",
  "--line": "#E6DED9",
  "--gold": "#F0C96A",
  "--white": "#FFFFFF",
  "--focus": "#0B5FA5",
} as const

export const contrastPairs = [
  { name: "White on brand", foreground: "#FFFFFF", background: "#AE0303", minimum: 7.46 },
  { name: "White on brand-strong", foreground: "#FFFFFF", background: "#8F0202", minimum: 9.64 },
  { name: "White on brand-dark", foreground: "#FFFFFF", background: "#430909", minimum: 12.0 },
  { name: "Brand on white", foreground: "#AE0303", background: "#FFFFFF", minimum: 7.46 },
  { name: "Brand on pink", foreground: "#AE0303", background: "#FDEBEC", minimum: 6.49 },
  { name: "Ink on white", foreground: "#161110", background: "#FFFFFF", minimum: 17.0 },
  { name: "Ink on cream", foreground: "#161110", background: "#FAF7F5", minimum: 16.0 },
  { name: "Muted on white", foreground: "#655F5D", background: "#FFFFFF", minimum: 5.5 },
  { name: "Focus on white", foreground: "#0B5FA5", background: "#FFFFFF", minimum: 6.57 },
  { name: "Gold badge text", foreground: "#684600", background: "#FFF4CD", minimum: 7.0 },
] as const

export const displayFontStack = 'Georgia, "Times New Roman", serif'
export const bodyFontStack =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
