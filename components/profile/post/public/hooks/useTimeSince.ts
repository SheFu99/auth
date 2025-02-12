import { format, differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export function useTimeSince(date) {
    const now = new Date();
    const createdDate = new Date(date);

    const formattedDate = format(createdDate, 'dd.MM.yy');
    // const years = differenceInYears(now, createdDate);
    // if (years > 0) return `${years} years ago (since ${formattedDate})`;

    const months = differenceInMonths(now, createdDate);
    if (months > 0) return `Here from: ${formattedDate}`;

    const days = differenceInDays(now, createdDate);
    if (days > 0) return `Here from: ${formattedDate}`;

    const hours = differenceInHours(now, createdDate);
    if (hours > 0) return ` ${formattedDate}`;

    const minutes = differenceInMinutes(now, createdDate);
    if (minutes > 0) return `Here from: ${formattedDate}`;

    return `just now`;
}
