/**
 * Format money values
 */
export const formatMoney = (amount) => {
  if (!amount) return "KSH 0";
  return `KSH ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format multiplier values
 */
export const formatMultiplier = (value, decimals = 2) => {
  if (!value) return "1.00x";
  return `${parseFloat(value).toFixed(decimals)}x`;
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-KE") + " " + date.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  // Kenya phone format: 254... or +254... or 07...
  const phoneRegex = /^(?:\+254|254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  let formatted = phone.replace(/\D/g, "");
  if (formatted.startsWith("254")) {
    return formatted;
  }
  if (formatted.startsWith("0")) {
    return "254" + formatted.substring(1);
  }
  return formatted;
};

/**
 * Calculate winnings
 */
export const calculateWinnings = (betAmount, multiplier, commission = 0.05) => {
  const gross = betAmount * multiplier;
  const net = gross - betAmount; // Profit
  const tax = net * commission;
  return {
    gross,
    net,
    tax,
    final: gross - tax,
  };
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    open: "text-green-400 bg-green-900/30",
    running: "text-yellow-400 bg-yellow-900/30",
    crashed: "text-red-400 bg-red-900/30",
    closed: "text-gray-400 bg-gray-700/30",
    won: "text-green-400 bg-green-900/30",
    lost: "text-red-400 bg-red-900/30",
  };
  return colors[status] || colors.closed;
};

/**
 * Delay promise
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
