const msInSecond = 1000;
const msInMinute = msInSecond * 60;
const msInHour = msInMinute * 60;
const msInDay = msInHour * 24;
const msInMonth = msInDay * 30;
const msInYear = msInMonth * 12;

export function decodeEntities(str: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

export function formatDistanceToNow(date: Date | number) {
  const distance = Math.abs(Date.now() - Number(date));
  if (distance < msInMinute) return `${Math.floor(distance / msInSecond)}s`;
  if (distance < msInHour) return `${Math.floor(distance / msInMinute)}m`;
  if (distance < msInDay) return `${Math.floor(distance / msInHour)}h`;
  if (distance < msInMonth) return `${Math.floor(distance / msInDay)}d`;
  if (distance < msInYear) return `${Math.floor(distance / msInMonth)}mo`;
  return `${Math.floor(distance / msInYear)}y`;
}

export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
