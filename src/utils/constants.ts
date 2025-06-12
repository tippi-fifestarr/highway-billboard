// Contract address and other constants
export const CONTRACT_ADDRESS = "0x24051bca580d28e80a340a17f87c99def0cc0bde05f9f9d88e8eebdfad1cfb03";
export const MODULE_NAME = "billboard";

// Highway theme colors
export const COLORS = {
  // Primary Colors
  highwayAsphalt: "#333333",        // Dark road surface
  highwayLineYellow: "#FFCC00",     // Yellow lane divider
  highwayLineWhite: "#FFFFFF",      // White lane marker
  highwayShoulder: "#A9A9A9",       // Road shoulder

  // Sign Colors
  highwaySignBlue: "#0066CC",       // Informational signs
  highwaySignGreen: "#006633",      // Directional signs
  highwaySignRed: "#CC0000",        // Warning/stop signs
  highwaySignOrange: "#FF6600",     // Construction/caution
  highwaySignBrown: "#8B4513",      // Recreational/scenic
  highwaySignWhite: "#FFFFFF",      // Text on signs
  highwaySignBlack: "#000000",      // Border on signs

  // Accent Colors
  gasGaugeEmpty: "#FF0000",         // Empty fuel
  gasGaugeHalf: "#FFCC00",          // Half fuel
  gasGaugeFull: "#00CC00",          // Full fuel
  headlightGlow: "#FFFFCC",         // Highlight effect
  nightSky: "#0A1929",              // Dark mode background
};

// Network configuration
export const NETWORK = {
  name: "testnet",
  fullnodeUrl: "https://fullnode.testnet.aptoslabs.com/v1",
};

// Maximum APT amount for "full tank" in the gas gauge
export const MAX_APT_DISPLAY = 10;

// API key for Aptos Build Gas Station
// Use environment variable to avoid exposing the key in the code
// Log the environment variable to debug
console.log('Environment variable:', process.env.NEXT_PUBLIC_APTOS_API_KEY);
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY || "";