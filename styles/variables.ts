// styles/variables.ts

export const colors = {
  brand: {
    primary: "#4CAF78",     // Verde principal FinIA
    primarySoft: "#7AD9A3", // Verde clarinho para destaques
    primaryMuted: "#E5F6EE" // Fundo suave para áreas em destaque
  },
  background: {
    base: "#F6FBF8",        // Fundo geral do app
    elevated: "#FFFFFF",    // Cards, painéis
    subtle: "#ECF4EF"       // Barras, seções discretas
  },
  text: {
    primary: "#1E1E1E",
    muted: "#6B7280",
    onBrand: "#FFFFFF"
  },
  border: {
    subtle: "#E5E7EB",
    strong: "#D1D5DB"
  },
  status: {
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#0EA5E9"
  }
};

export const radii = {
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  pill: "999px"
};

export const shadows = {
  soft: "0 10px 25px rgba(15, 23, 42, 0.04)",
  medium: "0 18px 45px rgba(15, 23, 42, 0.08)"
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem"
};

export const layout = {
  sidebarWidth: "260px",
  headerHeight: "64px",
  footerHeight: "40px",
  contentMaxWidth: "1200px"
};