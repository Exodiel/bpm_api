import * as moment from 'moment-timezone';

export const getDateWithTime = () => {
  const actualDate = moment()
    .tz('America/Guayaquil')
    .format('YYYY-MM-DD HH:mm');

  return actualDate;
};

export const getActualYear = () => {
  const actualYear = moment().tz('America/Guayaquil').format('YYYY');

  return actualYear;
};

export const getActualMonth = () => {
  const actualMonth = moment().tz('America/Guayaquil').format('MM');

  return actualMonth;
};
