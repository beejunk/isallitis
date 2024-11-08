/**
 * Central Standard Time offset from GMT
 */
const OFFSET = "-05:00";

/**
 * @param {number} dateElement
 * @returns {string}
 */
function pad(dateElement) {
  return String(dateElement).padStart(2, "0");
}

/**
 * Converts the blog entry time to a `Date` object in GMT with
 * the appropriate CST offset.
 *
 * @param {Object} entryData
 * @param {number} entryData.year
 * @param {number} entryData.month
 * @param {number} entryData.day
 * @param {number} entryData.hour
 * @param {number} entryData.minute
 * @returns {Date}
 */
export function toDate(entryData) {
  const { year, month, day, hour, minute } = entryData;
  const dateStr = `${year}-${pad(month)}-${pad(day)}`;
  const timeStr = `${pad(hour)}:${pad(minute)}:00.000${OFFSET}`;

  return new Date(`${dateStr}T${timeStr}`);
}

/**
 * @typedef {Object} EntryDate
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 */

/**
 * @param {string} entryISOString
 * @returns {EntryDate}
 */
export function getEntryDateParams(entryISOString) {
  const entryDate = new Date(entryISOString);
  const day = entryDate.getDate();
  const month = entryDate.getMonth() + 1;
  const year = entryDate.getFullYear();

  return { day, month, year };
}
