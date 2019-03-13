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

const { newLayerCaptureGroup } = require("./helpers/logger-groups");

const newLayerLogger = RequestLogger(newLayerCaptureGroup);

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

const addLayer = Selector("#addLayer");

fixture`Test Leaflet Maps on addLayer (1/6)`
  .page`http://localhost:3001/sandbox/`
  .requestHooks(mockResponseA)
  .requestHooks(mockResponseB)
  .requestHooks(mockResponseC)
  .requestHooks(mockResponseD)
  .requestHooks(newLayerLogger);

test('Query param "act" must equal "statechange"...', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "act",
        expect: "statechange",
        debug: true
      })
    )
    .ok();
});

test('Query param "bbox" must contain four coordinates', async t => {
  await t
    .click(addLayer)

    .expect(checkValidBoundingBox({ logger: newLayerLogger, param: "bbox" }))
    .ok();
});

test('Query param "cat" must equal "layersession"', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "cat",
        expect: "layersession"
      })
    )
    .ok();
});

test('Query param "cp" must match the centre point of the map', async t => {
  await t
    .click(addLayer)

    .expect(
      checkMapCenter({
        logger: newLayerLogger,
        param: "cp"
      })
    )
    .ok();
});

test('Query param "id" must match layer id', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "id",
        expect: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      })
    )
    .ok();
});

test('Query param "url" must match url of tilelayer', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "url",
        expect: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      })
    )
    .ok();
});

test('Query param "intr" must be "true"', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({ logger: newLayerLogger, param: "intr", expect: "true" })
    )
    .ok();
});

test('Query param "lbl" must be "active"', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({ logger: newLayerLogger, param: "lbl", expect: "active" })
    )
    .ok();
});

test('Query param "lib" must be "leaflet"', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "lib",
        expect: "leaflet"
      })
    )
    .ok();
});

test('Query param "mid" must be "Leaflet Map"', async t => {
  await t
    .click(addLayer)

    .expect(
      checkForString({
        logger: newLayerLogger,
        param: "mid",
        expect: "Leaflet Map"
      })
    )
    .ok();
});

test('Query param "msid" must exist', async t => {
  await t
    .click(addLayer)

    .expect(checkUUID({ logger: newLayerLogger, param: "msid" }))
    .ok();
});

test('Query param "srs" must be undefined', async t => {
  await t
    .click(addLayer)

    .expect(checkUndefined({ logger: newLayerLogger, param: "srs" }))
    .ok();
});

test('Query param "srst" must be undefined', async t => {
  await t
    .click(addLayer)

    .expect(checkUndefined({ logger: newLayerLogger, param: "srst" }))
    .ok();
});

test('Query param "tcp" must be undefined', async t => {
  await t
    .click(addLayer)

    .expect(checkUndefined({ logger: newLayerLogger, param: "tcp" }))
    .ok();
});

test('Query param "turl" must be undefined', async t => {
  await t
    .click(addLayer)

    .expect(checkUndefined({ logger: newLayerLogger, param: "turl" }))
    .ok();
});

test('Query param "vle" must be undefined', async t => {
  await t
    .click(addLayer)

    .expect(checkUndefined({ logger: newLayerLogger, param: "vle" }))
    .ok();
});

test('Query param "t" must be equivalent to the time of the action', async t => {
  await t
    .click(addLayer)

    .expect(checkWithinTime({ logger: newLayerLogger, param: "t" }))
    .ok();
});

test('Query param "tid" must match the tracking code in play', async t => {
  await t
    .click(addLayer)
    .expect(
      checkTrackingCode({
        logger: newLayerLogger,
        param: "tid"
      })
    )
    .ok();
});

test('Query param "zm" must match the proper zoom level', async t => {
  await t
    .click(addLayer)

    .expect(checkZoomLevel({ logger: newLayerLogger, param: "zm" }))
    .ok();
});
