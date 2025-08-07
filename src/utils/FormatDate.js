export default function formatDate(mongoDate) {
  if (!mongoDate) {
    return null;
  }

  const date = new Date(mongoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const convertToISODate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");

  const isoFormattedDate = `${year}-${month}-${day}`;

  const date = new Date(isoFormattedDate);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  return date;
};
