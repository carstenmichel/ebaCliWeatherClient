'use strict';

const eba = require('eba-client');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const chalk = require('chalk');
const readline = require('readline');

const figlet = require('figlet');

const dotenv = require('dotenv');

dotenv.config();

const settings = {
  url: 'https://eba.ibm.com/',
  key: process.env.RSAKEY,
  iss: process.env.ISS,
  sub: process.env.SUB,
  name: process.env.NAME,
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let client = new eba.Client(settings.url);

function printForecast(forecasts) {
  forecasts.forEach(element => {
    console.log(chalk.whiteBright('Forecast for: ', element.dow));
    console.log(chalk.yellow('Sunrise: ', element.sunrise)
      , ' ', chalk.red('Sunset: ', element.sunset));
    console.log(chalk.yellow('Moonrise: ', element.moonrise)
      , ' ', chalk.red('Moonset: ', element.moonset));
    console.log('Forecast: ', element.narrative
      , ' Min temp: ', element.min_temp
      , ' Max temp: ', element.max_temp);
  });
}

client.on('message', message => {
  switch (message.name) {
    case 'weather:Forecast':
      console.log(figlet.textSync('Forecast'));
      printForecast(message.data.forecasts);

      break;
    case 'undefined':
      console.log(message.text);
      break;
    default:
      console.log(message.text);
      console.log(chalk.greenBright(JSON.stringify(message.name)));
      console.log(chalk.red(JSON.stringify(message.data)));
      console.dir(message.data, { depth: null, colors: true });
  }
});

client.on('log', text => {
  console.log(chalk.cyan(text));
});

let claims = {
  iss: settings.iss,
  sub: settings.sub,
  name: settings.name,
};

function interact() {
  rl.question('', text => {
    client.ask(text);
    _.defer(interact);
  });
}


let access_token = jwt.sign(claims,
  fs.readFileSync(settings.key),
  { algorithm: 'RS256' });


console.log(chalk.redBright(figlet.textSync('Starting  EBA Client!')));

client
  .start({ access_token })
  .then(() => {
    console.log('type your question or hit Ctrl+D to exit');
    interact();
  })
  .catch(ex => {
    console.error(chalk.red('unable to connect:'));
    console.error(chalk.red(`${ex}`));
    process.exit(1);
  });

rl.on('close', () => client.stop());


