export default function formatNumberToShow(number) {
  if (number < 1000) {
    return number.toString(); // Return the number as is if it's less than 1000
  } else if (number < 1000000) {
    // Convert to K format (thousands)
    return (number / 1000).toFixed(1) + "K";
  } else {
    // Convert to M format (millions)
    return (number / 1000000).toFixed(1) + "M";
  }
}
