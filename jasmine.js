/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
  showColors: true
});
jasmine.execute();
