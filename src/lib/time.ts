import { formatDistanceToNow, formatDate as formatDateFn } from "date-fns";

export const formatDateTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export const formatDate = (timestamp: number): string => {
  return formatDateFn(new Date(timestamp), "yyyy-MM-dd");
};
