module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4CAF78",
          soft: "#7AD9A3",
          muted: "#E5F6EE",
        },
        background: {
          base: "#F6FBF8",
          elevated: "#FFFFFF",
          subtle: "#ECF4EF",
        },
        text: {
          base: "#1E1E1E",
          muted: "#6B7280",
        },
        status: {
          success: "#22C55E",
          danger: "#EF4444",
          warning: "#F59E0B",
          info: "#0EA5E9",
        },
        border: {
          subtle: "#E5E7EB",
          strong: "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 10px 25px rgba(15, 23, 42, 0.04)",
        medium: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
      maxWidth: {
        content: "1200px",
      },
  },
}  }