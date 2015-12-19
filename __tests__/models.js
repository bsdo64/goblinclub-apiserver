jest.dontMock("express");
var express = require('express');
console.log(express());

describe("jest", function () {
  it("can require express", function () {
    expect(function () {
      var app = express();
    }).not.toThrow();
  });
});