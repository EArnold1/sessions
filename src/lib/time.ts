const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function formatDateTime(value: number): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: number): string {
  return dateFormatter.format(new Date(value));
}
