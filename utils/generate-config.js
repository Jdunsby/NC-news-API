const fs = require('fs');

const configFileContents = `process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const config = {
  dev: {
    DB_URL: 'mongodb://localhost:27017/nc-news',
    API_URL: 'https://localhost:9090',
    PORT: 9090
  },
  test: {
    DB_URL: 'mongodb://localhost:27017/nc-news-test',
    API_URL: 'https://localhost:9090',
    PORT: 9090,
  },
  production: {
    DB_URL: '' //<<-- Replace this string with the url of your hosted database
  }
};

module.exports = config[process.env.NODE_ENV];`;

const gererateConfig = (configData) => {
  fs.writeFile('config.js', configData, 'utf8', (err) => {
    if(err) console.log('OOPS! something went wrong:', err);
    else console.log('Config file successfully created');
  });
};

if(!process.env.CREATE_CONFIG) console.log('To run this file please use the following command:\n\n    npm run generate-config\n');
else gererateConfig(configFileContents);