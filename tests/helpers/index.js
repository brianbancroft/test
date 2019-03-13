/*
                            HELPERS

    Checks for values based on either inputs, or the UI map examples
*/

import queryString from 'query-string';
import { Selector } from 'testcafe';
import { isUUID } from 'validator';

const centerCoordinate = async () => await Selector('#mapCenter').value;
const zoomLevel = async () => await Selector('#zoomLevel').value;
const boundingBox = async () => await Selector('#mapBounds').value;
const trackingCode = async () => await Selector('#trackingCode').value;
const markerLocation = async () => await Selector('#markerLocation').value;

// Takes a request and returns an object of the query params
const queryParams = record => queryString.parse(record.request.url.split('?')[1]);

// Abstract away long parts of checking query param strings.
const checkForString = ({ logger, param, expect, debug } = {}) =>
  logger.contains(record => {
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expect);
      console.log('Actual -> ', actual);
    }
    return actual === expect;
  });

const checkIsNumber = ({ logger, param, debug } = {}) =>
  logger.contains(record => {
    const actual = queryParams(record)[param];

    if (debug) {
      const expected = 'a number';
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return !isNaN(actual);
  });

const checkValidBoundingBox = ({ logger, param, debug } = {}) =>
  logger.contains(async record => {
    const expected = await boundingBox();
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return expected === actual;
  });

const checkUndefined = ({ logger, param, debug } = {}) =>
  logger.contains(record => {
    const expected = 'undefined or null';
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return !actual || actual === 'undefined';
  });

const checkExists = ({ logger, param, debug } = {}) =>
  logger.contains(record => {
    const actual = queryParams(record)[param];

    if (debug) {
      const expected = 'it exists!';
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return actual;
  });

// Assumption: Default time within 1 minute (1000ms * 60s)
/*
  Math: delta_t represents time between t_now and t_click.
  Should be less than 1000ms * 60s (1min).
  Can be adjusted.

  (t_now - t_click ≥ delta_t) ≡ (t_now - delta_t ≥ t_click)
*/

const checkWithinTime = ({ logger, param, timeInMs, debug } = {}) =>
  logger.contains(record => {
    const deltaT = 60000; // Defaults to 1 minute
    const expected = Date.now() - (timeInMs || deltaT);
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected. Should be less than Actual. -> ', expected);
      console.log('Actual -> ', actual);
    }

    return expected <= actual;
  });

const checkMapCenter = ({ logger, param, debug } = {}) =>
  logger.contains(async record => {
    const expected = await centerCoordinate();
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return actual === expected;
  });

const checkZoomLevel = ({ logger, param, debug } = {}) =>
  logger.contains(async record => {
    const expected = await zoomLevel();
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return actual === expected;
  });

const checkTrackingCode = ({ logger, param, debug } = {}) =>
  logger.contains(async record => {
    const expected = await trackingCode();
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return actual === expected;
  });

const checkUUID = ({ logger, param, debug } = {}) =>
  logger.contains(record => {
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> a UUID string');
      console.log('Actual -> ', actual);
    }
    return isUUID(actual);
  });

const checkMarkerLocation = ({ logger, param, debug } = {}) =>
  logger.contains(async record => {
    const expected = await markerLocation();
    const actual = queryParams(record)[param];

    if (debug) {
      console.log('Expected -> ', expected);
      console.log('Actual -> ', actual);
    }

    return actual === expected;
  });

module.exports = {
  checkForString,
  checkIsNumber,
  checkValidBoundingBox,
  checkWithinTime,
  checkExists,
  checkUndefined,
  checkMapCenter,
  checkZoomLevel,
  checkTrackingCode,
  checkMarkerLocation,
  checkUUID
};
