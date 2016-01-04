/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var Jasmine = require('jasmine');
var reporters = require('jasmine-reporters');
var terminalReporter = new reporters.TerminalReporter({
  verbosity: 5,
  color: true,
  showStack: true
});
var jasmine = new Jasmine();

jasmine.addReporter(terminalReporter);
jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
  showColors: true
});
jasmine.execute();
