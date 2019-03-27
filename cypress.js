const cypress = require('cypress');
const { spawn } = require('child_process');
const server = spawn('npm', ['run', 'start:cy'], {
  shell: true,
});

process.stdout.write('Starting server for cypress tests with stubbing response \n');

server.stdout.on('data', (data) => {
  const asString = data.toString();
  process.stdout.write(asString);

  if (asString.includes('Compiled successfully')) {
    process.stdout.write('Start server successfully');
    process.stdout.write('Executing the cypress tests');

    cypress.run({
      spec: 'cypress/integration/stubbing-response/**/*',
      record: true
    })
      .then((results) => {
        process.stdout.write('Completed');
        process.exit(results.totalFailed);
      })
      .catch((err) => {
        process.stdout.write('Cypress error', err.toString());
        process.exit(1);
      });
  }
});

server.stderr.on('data', (data) => {
  const asString = data.toString();
  if (!asString.includes('Configuration') && !asString.includes('/api')) {
    process.stdout.write(asString);
  }
});

server.on('close', (code) => {
  process.stdout.write('server process closed with code: ', code);
});

server.on('exit', (code) => {
  process.stdout.write('server exited: ', code);
});

process.on('exit', () => {
  process.stdout.write('process exited');
});
