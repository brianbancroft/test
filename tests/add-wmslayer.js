import { RequestLogger, RequestMock, Selector } from "testcafe";

const {
  checkForString,
  checkValidBoundingBox,
  checkUndefined,
  checkWithinTime,
  checkMapCenter,
  checkZoomLevel,
  checkTrackingCode,
  checkUUID
} = require("./helpers");

const { wmsLayerCaptureGroup } = require("./helpers/logger-groups");

const logger = RequestLogger(wmsLayerCaptureGroup);

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

const addWMSLayer = Selector("#addWMSLayer");

fixture`Test Leaflet Maps for WMS Load (2/6)`
  .page`http://localhost:3001/sandbox/`
  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(logger);

test("Must trigger one outgoing request", async t => {
  await t
    .click(addWMSLayer)
    .expect(logger.count(() => true))
    .eql(1, "Was unable to detect any outgoing requests", { timeout: 2500 });
});

test('Query param "act" must equal "statechange"', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkForString({ logger, param: "act", expect: "statechange" }))
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkValidBoundingBox({ logger, param: "bbox" }))
    .ok();
});

test('Query param "cat" must equal "layersession"', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkForString({ logger, param: "cat", expect: "layersession" }))
    .ok();
});

test('Query param "cp" must match the current center point on the map', async t => {
  await t
    .click(addWMSLayer)

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
    .click(addWMSLayer)

    .expect(checkForString({ logger, param: "intr", expect: "true" }))
    .ok();
});

test('Query param "lbl" must be "active"', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkForString({ logger, param: "lbl", expect: "active" }))
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkForString({ logger, param: "lib", expect: "leaflet" }))
    .ok();
});

test('Query param "mid" must be "Leaflet Map"', async t => {
  await t
    .click(addWMSLayer)
    .expect(checkForString({ logger, param: "mid", expect: "Leaflet Map" }))
    .ok();
});

test('Query param "msid" must exist', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUUID({ logger, param: "msid" }))
    .ok();
});

test('Query param "lsid" must exist', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUUID({ logger, param: "lsid" }))
    .ok();
});

test('Query param "srs" must be undefined', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUndefined({ logger, param: "srs" }))
    .ok();
});

test('Query param "srst" must be undefined', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUndefined({ logger, param: "srst" }))
    .ok();
});

test('Query param "tcp" must be undefined', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUndefined({ logger, param: "tcp" }))
    .ok();
});

test('Query param "turl" must be undefined', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUndefined({ logger, param: "turl" }))
    .ok();
});

test('Query param "vle" must be undefined', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkUndefined({ logger, param: "vle" }))
    .ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkWithinTime({ logger, param: "t" }))
    .ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t
    .click(addWMSLayer)

    .expect(
      checkTrackingCode({
        logger,
        param: "tid"
      })
    )
    .ok();
});

test('Query param "url" must match the name of the tilelayer', async t => {
  await t
    .click(addWMSLayer)

    .expect(
      checkForString({
        logger,
        param: "url",
        expect: "http://maps.geogratis.gc.ca/wms/canvec_en?layers=land,hydro"
      })
    )
    .ok();
});

test('Query param "zm" must match the proper zoom level', async t => {
  await t
    .click(addWMSLayer)

    .expect(checkZoomLevel({ logger, param: "zm" }))
    .ok('Query param "zm" must match the proper zoom level');
});
