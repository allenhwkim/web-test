'use strict';
var fs = require('fs');
var Scenario = require('./../../lib/scenario');
var Status = require('./../../lib/status');
var Reporter = require('./../../lib/reporter');

describe('Reporter', () => {
  
  let reporter;
  
  beforeEach( () => {
    spyOn(fs, "accessSync").and.returnValue(true);
    spyOn(fs, "readFileSync").and.returnValue(`
scenario 1
  test case 1
    test step 1
    test step 2
    `);
    
    reporter = new Reporter('aFile');
  });
  
  describe('#init', () => {
    it('should init from a file', () => {
      expect(reporter.scenario.name).toBe('scenario 1');
    });
  });
  
  describe('#start', () => {
    it('should set a scenario started', () => {
      reporter.start(Scenario.SCENARIO);
      expect(reporter.scenario.status).toBe(Status.STARTED);
    });
    it('should set a testcase started', () => {
      reporter.start(Scenario.TESTCASE, 'test case 1');
      expect(reporter.scenario.testCases[0].status).toBe(Status.STARTED);
    });
    it('should set a teststep started', () => {
      reporter.start(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[0].status).toBe(Status.STARTED);
      reporter.start(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[1].status).toBe(Status.STARTED);
    });
  });

  describe('#pass', () => {
    it('should set a scenario succeeded', () => {
      reporter.pass(Scenario.SCENARIO);
      expect(reporter.scenario.status).toBe(Status.PASS);
    });
    it('should set a testcase succeeded', () => {
      reporter.start(Scenario.TESTCASE, 'test case 1');
      reporter.pass(Scenario.TESTSTEP);
      reporter.pass(Scenario.TESTCASE, 'test case 1');
      expect(reporter.scenario.testCases[0].status).toBe(Status.PASS);
    });
    it('should set a teststep succeeded', () => {
      reporter.pass(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[0].status).toBe(Status.PASS);
      reporter.pass(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[1].status).toBe(Status.PENDING);
    });
  });

  describe('#fail', () => {
    it('should set a scenario error', () => {
      reporter.fail(Scenario.SCENARIO);
      expect(reporter.scenario.status).toBe(Status.FAIL);
    });
    it('should set a testcase error', () => {
      reporter.fail(Scenario.TESTCASE, 'test case 1');
      expect(reporter.scenario.testCases[0].status).toBe(Status.FAIL);
    });
    it('should set a teststep error', () => {
      reporter.fail(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[0].status).toBe(Status.FAIL);
      reporter.fail(Scenario.TESTSTEP);
      expect(reporter.scenario.testCases[0].testSteps[1].status).toBe(Status.PENDING);
    });
  });
});
