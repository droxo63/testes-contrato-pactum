const { reporter, flow, mock, handler } = require('pactum');
const pf = require('pactum-flow-plugin');


function addFlowReporter() {
  pf.config.url = 'http://localhost:8081'; // pactum flow server url
  pf.config.projectId = 'loja-ebac-api';
  pf.config.projectName = 'Loja EBAC API';
  pf.config.version = '1.0.0    ';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
 
});
