import { RequestLogger, RequestMock, Selector } from "testcafe";
// const queryString = require('query-string')

const {
  checkForString,
  checkValidBoundingBox,
  checkUUID,
  checkUndefined,
  checkWithinTime,
  checkMapCenter,
  checkZoomLevel,
  checkTrackingCode
} = require("./helpers");

const { mapPanCaptureGroup } = require("./helpers/logger-groups");

const logger = RequestLogger(mapPanCaptureGroup);

let mockResponseA = RequestMock()
  .onRequestTo("http://a-test.test.com/store/a.gif")
  .respond("ok", 200);

let mockResponseB = RequestMock()
  .onRequestTo("http://b-test.test.com/store/a.gif")
  .respond("ok", 200);

let mockResponseC = RequestMock()
  .onRequestTo("http://c-test.test.com/store/a.gif")
  .respond("ok", 200);

let mockResponseD = RequestMock()
  .onRequestTo("http://d-test.test.com/store/a.gif")
  .respond("ok", 200);

const panMap = Selector("#panMap");

fixture`Test on pan Leaflet Maps (5/6)`.page`http://localhost:3001/sandbox/`

  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(logger);

test("Must trigger one outgoing request", async t => {
  await t
    .click(panMap)
    .expect(logger.count(() => true))
    .eql(1, "Was unable to detect any outgoing requests", { timeout: 2500 });
});

test('Query param "lbl" must be "pan"', async t => {
  await t
    .click(panMap)

    .expect(checkForString({ logger, param: "lbl", expect: "pan" }))
    .ok();
});

test('Query param "act" must equal "mapactivity"', async t => {
  await t
    .click(panMap)
    .expect(checkForString({ logger, param: "act", expect: "mapactivity" }))
    .ok();
});

test('Query param "cat" must equal "map"', async t => {
  await t
    .click(panMap)
    .expect(checkForString({ logger, param: "cat", expect: "map" }))
    .ok();
});

test('Query param "intr" must be "true"', async t => {
  await t
    .click(panMap)
    .expect(checkForString({ logger, param: "intr", expect: "true" }))
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .click(panMap)
    .expect(checkForString({ logger, param: "lib", expect: "leaflet" }))
    .ok();
});

test('Query param "msid" must be a valid UUID', async t => {
  await t
    .click(panMap)
    .expect(checkUUID({ logger, param: "msid" }))
    .ok();
});

test('Query param "srs" must be undefined', async t => {
  await t
    .click(panMap)
    .expect(checkUndefined({ logger, param: "srs" }))
    .ok();
});

test('Query param "srst" must be undefined', async t => {
  await t
    .click(panMap)
    .expect(checkUndefined({ logger, param: "srst" }))
    .ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t
    .click(panMap)
    .expect(checkWithinTime({ logger, param: "t" }))
    .ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t
    .click(panMap)

    .expect(
      checkTrackingCode({
        logger,
        param: "tid"
      })
    )
    .ok();
});

test('Query param "zm" must match the proper zoom level', async t => {
  await t
    .click(panMap)

    .expect(checkZoomLevel({ logger, param: "zm" }))
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t
    .click(panMap)
    .expect(checkValidBoundingBox({ logger, param: "bbox" }))
    .ok();
});

test('Query param "cp" must match the current center point on the map', async t => {
  await t
    .click(panMap)

    .expect(
      checkMapCenter({
        logger,
        param: "cp"
      })
    )
    .ok();
});
