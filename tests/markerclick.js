import { RequestLogger, RequestMock, Selector } from "testcafe";

const {
  checkForString,
  checkValidBoundingBox,
  checkExists,
  checkMarkerLocation,
  checkUndefined,
  checkWithinTime,
  checkZoomLevel,
  checkMapCenter,
  checkTrackingCode,
  checkUUID
} = require("./helpers");

const { markerClickCaptureGroup } = require("./helpers/logger-groups");

const logger = RequestLogger(markerClickCaptureGroup);

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

fixture`Test Leaflet Maps on marker click (4/6)`
  .page`http://localhost:3001/sandbox/`

  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(logger);

const addMarker = Selector("#addMarker");
const clickMarker = Selector("#clickMarker");

test("Must trigger one outgoing request", async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(logger.count(() => true))
    .eql(1, "Was unable to detect any outgoing requests", { timeout: 2500 });
});

test('Query param "act" must equal "click"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "act", expect: "click" }))
    .ok();
});

test('Query param "drag" must be set to "false"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "drag", expect: "false" }))
    .ok();
});

test('Query param "cat" must equal "marker"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "cat", expect: "marker" }))
    .ok();
});

test('Query param "intr" must be "true"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "intr", expect: "true" }))
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "lib", expect: "leaflet" }))
    .ok();
});

test('Query param "mid" must be "Leaflet Map"', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkForString({ logger, param: "mid", expect: "Leaflet Map" }))
    .ok();
});

test('Query param "msid" must be a valid UUID', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUUID({ logger, param: "msid" }))
    .ok();
});

test('Query param "srs" must be undefined', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUndefined({ logger, param: "srs" }))
    .ok();
});

test('Query param "srst" must be undefined', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUndefined({ logger, param: "srst" }))
    .ok();
});

test('Query param "tcp" must be undefined', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUndefined({ logger, param: "tcp" }))
    .ok();
});

test('Query param "turl" must be undefined', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUndefined({ logger, param: "turl" }))
    .ok();
});

test('Query param "vle" must be undefined', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkUndefined({ logger, param: "vle" }))
    .ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkWithinTime({ logger, param: "t" }))
    .ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)

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
    .click(addMarker)
    .click(clickMarker)

    .expect(checkZoomLevel({ logger, param: "zm" }))
    .ok();
});

test('Query param "id" must match the marker location', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)

    .expect(checkMarkerLocation({ logger, param: "id" }))
    .ok();
});

test('Query param "pos" must match the marker location', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)

    .expect(checkMarkerLocation({ logger, param: "pos" }))
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkValidBoundingBox({ logger, param: "bbox" }))
    .ok();
});

test('Query param "cp" must match the current center point on the map', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)

    .expect(
      checkMapCenter({
        logger,
        param: "cp"
      })
    )
    .ok();
});

test('Query param "clck" must be true', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkExists({ logger, param: "clck" }))
    .ok();
});

test('Query param "grp" must be a string', async t => {
  await t
    .click(addMarker)
    .click(clickMarker)
    .expect(checkExists({ logger, param: "grp" }))
    .ok();
});
