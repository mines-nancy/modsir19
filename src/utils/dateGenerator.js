import { addDays, eachDayOfInterval, format } from 'date-fns';

export const generateDates = (startDate, numberOfDays) =>
    eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, numberOfDays),
    }).map((date) => format(date, 'dd/MM/yyyy'));
