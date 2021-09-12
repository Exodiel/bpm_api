import * as moment from 'moment-timezone';

export const getDateWithTime = () => {
  const actualDate = moment()
    .tz('America/Guayaquil')
    .format('YYYY-MM-DD hh:mm:ss');

  return actualDate;
};
