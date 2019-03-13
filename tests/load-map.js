import { RequestLogger, RequestMock } from "testcafe";

const {
  checkForString,
  checkValidBoundingBox,
  checkUndefined,
  checkWithinTime,
  checkZoomLevel,
  checkMapCenter,
  checkTrackingCode,
  checkUUID
} = require("./helpers");

const { newMapCaptureGroup } = require("./helpers/logger-groups");

const logger = RequestLogger(newMapCaptureGroup);

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

fixture`Test Leaflet Maps on load(3/6)`.page`http://localhost:3001/sandbox/`

  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(logger);

test("Must trigger one outgoing request", async t => {
  await t
    .expect(logger.count(() => true))
    .eql(1, "Was unable to detect any outgoing requests", { timeout: 2500 });
});

test('Query param "act" must equal "mapload"', async t => {
  await t
    .expect(checkForString({ logger, param: "act", expect: "mapload" }))
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t.expect(checkValidBoundingBox({ logger, param: "bbox" })).ok();
});

test('Query param "cat" must equal "map"', async t => {
  await t.expect(checkForString({ logger, param: "cat", expect: "map" })).ok();
});

test('Query param "cp" must match the current center point on the map', async t => {
  await t

    .expect(
      checkMapCenter({
        logger,
        param: "cp"
      })
    )
    .ok();
});

test('Query param "intr" must be "true"', async t => {
  await t
    .expect(checkForString({ logger, param: "intr", expect: "true" }))
    .ok();
});

test('Query param "lbl" must be "mapsession"', async t => {
  await t
    .expect(checkForString({ logger, param: "lbl", expect: "mapsession" }))
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .expect(checkForString({ logger, param: "lib", expect: "leaflet" }))
    .ok();
});

test('Query param "mid" must be "Leaflet Map"', async t => {
  await t
    .expect(checkForString({ logger, param: "mid", expect: "Leaflet Map" }))
    .ok();
});

test('Query param "msid" must exist', async t => {
  await t.expect(checkUUID({ logger, param: "msid" })).ok();
});

test('Query param "srs" must be undefined', async t => {
  await t.expect(checkUndefined({ logger, param: "srs" })).ok();
});

test('Query param "srst" must be undefined', async t => {
  await t.expect(checkUndefined({ logger, param: "srst" })).ok();
});

test('Query param "tcp" must be undefined', async t => {
  await t.expect(checkUndefined({ logger, param: "tcp" })).ok();
});

test('Query param "turl" must be undefined', async t => {
  await t.expect(checkUndefined({ logger, param: "turl" })).ok();
});

test('Query param "vle" must be undefined', async t => {
  await t.expect(checkUndefined({ logger, param: "vle" })).ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t.expect(checkWithinTime({ logger, param: "t" })).ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t

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

    .expect(checkZoomLevel({ logger, param: "zm" }))
    .ok('Query param "zm" must match the proper zoom level');
});
