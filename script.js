let bmpWidth = 0;
let bmpHeight = 0;
let canvasCreated = false;
let canvasCount = 2;
let pixelMaps = [];
let pixelMap = [];


$(document).ready(function () {
  $("#btnCreateCanvas").click(function () {
    

    bmpWidth = $("#txtBmpWidth").val().trim() || 0;
    bmpHeight = $("#txtBmpHeight").val().trim() || 0;

    if (bmpWidth == 0 || bmpHeight == 0 || !$.isNumeric(bmpWidth) || !$.isNumeric(bmpHeight)) {
      alert("Width/Height must be numeric and greater than zero!")
    } else {
      canvasCreated = true;
      initEmptyPixelMapArr(bmpWidth, bmpHeight);
    }

  });
});


function createNewBmpCanvas(width, height, canvasId) {

}

function editBmp(canvasId) {

}

function updateBmpCodes(canvasId) {

}

function updateBmpCanvas(canvasId) {

}
function loadBmpCodeFile(canvasId, filename) {

}

function clearCanvas(canvasId) {

}

function saveBmpCodeFile(canvasId, filename) {

}

function initPixelMap(bmpWidth, bmpHeight, pixelMapStr="") {
  let initWith = 0;
  pixelMap = new Array(bmpHeight);
  for (var i = 0; i < bmpHeight; i++) {
    pixelMap[i] = new Array(bmpWidth);
    for (j = 0; j < bmpWidth; j++) {
      pixelMap[i][j] = initWith;
    }
  }
}; // end function initPixelMap

// for (k = 0; k < canvasCount; k++) {
//   pixelMaps[k] = pixelMapArray;
// }