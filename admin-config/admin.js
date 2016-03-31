/**
 * Created by dobyeongsu on 2016. 3. 30..
 */

var express = require('express');
var app = express();

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

app.listen(3005);