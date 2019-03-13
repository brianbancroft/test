import { RequestLogger, RequestMock, Selector } from "testcafe";
// const queryString = require('query-string')

const {
  checkForString,
  checkValidBoundingBox,
  checkUndefined,
  checkWithinTime,
  checkZoomLevel,
  checkTrackingCode,
  checkUUID
} = require("./helpers");

const { mapZoomCaptureGroup } = require("./helpers/logger-groups");

const logger = RequestLogger(mapZoomCaptureGroup);

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

const zoomMap = Selector("#zoomMap");

fixture`Testing on zoom for Leaflet Maps (6/6)`
  .page`http://localhost:3001/sandbox/`

  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(logger);

test("Must trigger one outgoing request", async t => {
  await t
    .click(zoomMap)

    .expect(logger.count(() => true))
    .eql(1, "Was unable to detect any outgoing requests", { timeout: 2500 });
});

test('Query param "lbl" must be "zoom"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "lbl", expect: "zoom" }))
    .ok();
});

test('Query param "act" must equal "mapactivity"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "act", expect: "mapactivity" }))
    .ok();
});

test('Query param "cat" must equal "map"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "cat", expect: "map" }))
    .ok();
});

test('Query param "intr" must be "true"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "intr", expect: "true" }))
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "lib", expect: "leaflet" }))
    .ok();
});

test('Query param "mid" must be "Leaflet Map"', async t => {
  await t
    .click(zoomMap)

    .expect(checkForString({ logger, param: "mid", expect: "Leaflet Map" }))
    .ok();
});

test('Query param "msid" must be a valid UUID', async t => {
  await t
    .click(zoomMap)

    .expect(checkUUID({ logger, param: "msid" }))
    .ok();
});

test('Query param "srs" must be undefined', async t => {
  await t
    .click(zoomMap)

    .expect(checkUndefined({ logger, param: "srs" }))
    .ok();
});

test('Query param "srst" must be undefined', async t => {
  await t
    .click(zoomMap)

    .expect(checkUndefined({ logger, param: "srst" }))
    .ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t
    .click(zoomMap)

    .expect(checkWithinTime({ logger, param: "t" }))
    .ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t
    .click(zoomMap)

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
    .click(zoomMap)

    .expect(checkZoomLevel({ logger, param: "zm" }))
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t
    .click(zoomMap)

    .expect(checkValidBoundingBox({ logger, param: "bbox" }))
    .ok();
});
