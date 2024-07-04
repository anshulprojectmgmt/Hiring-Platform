
const expressWinston = require('express-winston');
const {transports , format } = require('winston');

const Logger = expressWinston.logger({
    transports : [
      new transports.File({
        level: 'warn',
        filename: 'warningLogs.log'
      }),
    //   new transports.Console(),
    ],
    format: format.combine(
            format.json(),      
            format.colorize(),
            format.timestamp(),
            
    ),
    meta: false,
  })

  module.exports = Logger;