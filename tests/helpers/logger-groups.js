/*
   The following are the regex capture groups
   used to search for outgoing network requests
   in the e2e test suite.
*/

exports.newLayerCaptureGroup = /test.com.*layersession.*act=statechange/;
exports.wmsLayerCaptureGroup = /test.com.*act=statechange.*wms/;
exports.newMapCaptureGroup = /test.com.*mapload/;
exports.markerClickCaptureGroup = /test.com.*click/;
exports.mapPanCaptureGroup = /test.com.*pan/;
exports.mapZoomCaptureGroup = /test.com.*zoom/;
exports.layerLoadCaptureGroup = /test.com.*layerload/;
