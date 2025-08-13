// =============================================
// themes.js – Full Theme Definitions for SoloSchedule (Updated for Better UX/UI Contrast)
// =============================================

window.THEME_PROFILES = {
  beauty: {
    name: "Beauty & Nails",
    key: "beauty",
    font: "Mulish",
    layout: "beauty",
    colors: {
      primary: "#F06292",
      background: "#FFF5F9",
      text: "#1A1A1A",
      muted: "#DDA9C2",
      accent: "#EC4E82",
      surface: "#FFFFFF",
      success: "#81C784",
      error: "#E57373"
    },
    buttons: {
      style: "rounded-pill",
      borderRadius: "20px",
      fontWeight: "600",
      fontSize: "0.95rem",
      padding: "0.5rem 1rem",
      textTransform: "capitalize"
    },
    components: {
      cardStyle: "glow-shadow",
      calendarStyle: "column-week",
      bookingView: "bubble-blocks",
      actionButtonStyle: "gradient"
    },
    effects: {
      transition: "all 0.25s ease-in-out",
      shadow: "0 3px 8px rgba(240, 98, 146, 0.2)",
      hoverLift: true
    }
  },
  wellness: {
    name: "Health & Wellness",
    key: "wellness",
    font: "Quicksand",
    layout: "wellness",
    colors: {
      primary: "#9C88FF",
      background: "#F3F1FB",
      text: "#1E1E1E",
      muted: "#B5BDC6",
      accent: "#BB8DF5",
      surface: "#FFFFFF",
      success: "#7ED6A3",
      error: "#FF6B6B"
    },
    buttons: {
      style: "soft-rounded",
      borderRadius: "16px",
      fontWeight: "500",
      fontSize: "1rem",
      padding: "0.6rem 1rem",
      textTransform: "none"
    },
    components: {
      cardStyle: "clean",
      calendarStyle: "vertical-day",
      bookingView: "pill-list",
      actionButtonStyle: "filled-soft"
    },
    effects: {
      transition: "0.2s ease",
      shadow: "0 1px 4px rgba(0,0,0,0.05)",
      hoverLift: false
    }
  },
  construction: {
    name: "Construction & Trades",
    key: "construction",
    font: "Barlow Condensed",
    layout: "construction",
    colors: {
      primary: "#F57C00",
      background: "#FFF5DA",
      text: "#2E2E2E",
      muted: "#E6B97E",
      accent: "#FBC02D",
      surface: "#FFF1CC",
      success: "#66BB6A",
      error: "#E53935"
    },
    buttons: {
      style: "block",
      borderRadius: "4px",
      fontWeight: "700",
      fontSize: "1rem",
      padding: "0.75rem",
      textTransform: "uppercase"
    },
    components: {
      cardStyle: "solid",
      calendarStyle: "grid-week",
      bookingView: "simple-blocks",
      actionButtonStyle: "outline"
    },
    effects: {
      transition: "0.1s linear",
      shadow: "none",
      hoverLift: false
    }
  },
  coaching: {
    name: "Coaching & Consulting",
    key: "coaching",
    font: "Lora",
    layout: "coaching",
    colors: {
      primary: "#3F51B5",
      background: "#F1F3FE",
      text: "#1A1A2E",
      muted: "#B8C3ED",
      accent: "#7986CB",
      surface: "#FFFFFF",
      success: "#4DB6AC",
      error: "#FF7043"
    },
    buttons: {
      style: "underline-text",
      borderRadius: "0",
      fontWeight: "400",
      fontSize: "1rem",
      padding: "0.5rem 0",
      textTransform: "none"
    },
    components: {
      cardStyle: "minimal",
      calendarStyle: "list-agenda",
      bookingView: "timeline",
      actionButtonStyle: "text"
    },
    effects: {
      transition: "0.3s ease",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      hoverLift: false
    }
  },
  tech: {
    name: "Digital & Tech",
    key: "tech",
    font: "JetBrains Mono",
    layout: "tech",
    colors: {
      primary: "#00ACC1",
      background: "#E6F9FB",
      text: "#1E2930",
      muted: "#91D4DF",
      accent: "#26C6DA",
      surface: "#FFFFFF",
      success: "#26A69A",
      error: "#FF5252"
    },
    buttons: {
      style: "flat-code",
      borderRadius: "6px",
      fontWeight: "500",
      fontSize: "0.95rem",
      padding: "0.5rem 1rem",
      textTransform: "uppercase"
    },
    components: {
      cardStyle: "code",
      calendarStyle: "kanban",
      bookingView: "dev-cards",
      actionButtonStyle: "monochrome"
    },
    effects: {
      transition: "0.15s ease-out",
      shadow: "0 2px 4px rgba(0,0,0,0.08)",
      hoverLift: false
    }
  },
  freelancer: {
    name: "Neutral Freelancer",
    key: "freelancer",
    font: "Inter",
    layout: "freelancer",
    colors: {
      primary: "#424242",
      background: "#FAFAFA",
      text: "#1F1F1F",
      muted: "#B0B0B0",
      accent: "#606060",
      surface: "#FFFFFF",
      success: "#66BB6A",
      error: "#EF5350"
    },
    buttons: {
      style: "rounded-neutral",
      borderRadius: "10px",
      fontWeight: "500",
      fontSize: "1rem",
      padding: "0.6rem 1rem",
      textTransform: "capitalize"
    },
    components: {
      cardStyle: "subtle",
      calendarStyle: "stacked-day",
      bookingView: "clean-list",
      actionButtonStyle: "neutral"
    },
    effects: {
      transition: "0.2s ease",
      shadow: "0 1px 3px rgba(0,0,0,0.06)",
      hoverLift: false
    }
  }
};
