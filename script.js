let bmpWidth = 0;
let bmpHeight = 0;
let canvasCreated = false;
let canvasCount = 2;
let pixelMaps = [];
let pixelMap = [];
let currentCanvas = 0;
let animating = false;
let animationHandler;
let animationCurrentFrame = 0;

$(document).ready(function () {
  $("#btnEncode-0").click(function () {
    $("#txtarea-canvas-encoded-0").val("");
    binArr = $("#txtarea-canvas-0").val().replace(/\n/g, "").replace(/0b/g, "").split(",");
    let isDim = $('#chkIncludeDim-0').prop('checked');
    let isHex = $('#chkValInHex-0').prop('checked');
    let encString = encode(binArr, bmpWidth, bmpHeight, isDim, isHex);
    $("#txtarea-canvas-encoded-0").val(encString);
  });



  $("#btnAnimate").click(function () {
    if (!canvasCreated) {
      alert("Found no canvas/frame")
      return;
    }

    if (!animating) {
      $("#btnAnimate").html("Stop Animation");
      $(".divAnimationContainer").show();
      animationHandler = setInterval(animate, 50);
      animating = true;
    } else {
      $("#btnAnimate").html("Animate");
      $(".divAnimationContainer").hide();
      animating = false;
      animationCurrentFrame = 0;
      clearInterval(animationHandler);
    }
  });


  $("#btnCreateNewCanvas").click(function () {
    if (animating) {
      alert("Please stop Animation first");
      return;
    }
    if (canvasCreated) {
      if (!confirm("Canvas already created. Do you want to clear the canvas and create new?")) {
        return;
      } else {
        clearCanvas();
      }
    } // end if canvasCreated
    bmpWidth = $("#txtBmpWidth").val().trim() || 0;
    bmpHeight = $("#txtBmpHeight").val().trim() || 0;
    // bmpWidth = 4;
    // bmpHeight = 4;
    // let sampleMap = ["0b0001,0b0010,0b0100,0b1000", "0b1000,0b0100,0b0010,0b0001"];
    if (bmpWidth == 0 || bmpHeight == 0 || !$.isNumeric(bmpWidth) || !$.isNumeric(bmpHeight)) {
      alert("Width/Height must be numeric and greater than zero!")
    } else {
      canvasCreated = true;
      for (c = 0; c < canvasCount; c++) {
        // initPixelMap(bmpWidth, bmpHeight, c, sampleMap[c]);
        initPixelMap(bmpWidth, bmpHeight, c); // init pixel map array with zero value
        createNewBmpCanvas(bmpWidth, bmpHeight, c); //init canvas table 
        updateBmpCanvas(c); //  update canvas table from pixel map array
      }
    }
  }); // end event click btnCreateNewCanvas

  $(".text-area-canvas").on("keyup", function () {
    textToPixMapArr(this.id);
    updateBmpCanvas(this.id.split("-")[2]);
    $("#txtarea-canvas-encoded-0").val("");
  }); // end event keyup text-area-canvas
  


}); // end document ready


function createNewBmpCanvas(width, height, canvasId) {
  for (j = 0; j < height; j++) {
    let tableId = "table-canvas-" + canvasId;
    row = document.getElementById(tableId).insertRow(j);
    for (i = 0; i < width; i++) {
      var cell = row.insertCell(i);
      var pixelCellClass = "pixel-" + i + "-" + j;
      cell.className = pixelCellClass;
      cell.title = i + "," + j;
      cell.bgColor = "#ffffff"; // initial cell color is white
      let colr = pixelMaps[canvasId][j][i] == 1 ? "#000000" : "#ffffff"; // determine canvas table cell color
      $("#" + tableId + " ." + pixelCellClass).css('background-color', colr); // update canvas table cell color
      pixMapArrToText(canvasId); // update canvas code textarea

      let mouseDownReleased = true;

      $(cell).bind("click", function () {
        updateBmpCodes(canvasId, this.className);
        updateBmpCanvas(canvasId);
        pixMapArrToText(canvasId);
      }); // end event binding click


      // $(cell).bind("mousedown", function () {
      //   updateBmpCodes(canvasId, this.className);
      //   updateBmpCanvas(canvasId);
      //   pixMapArrToText(canvasId);
      //   mouseDownReleased = false;
      // });

      // $(cell).bind("mouseup", function () {
      //   mouseDownReleased = true;
      // });

      // $(cell).bind("mouseover", function () {
      //   $("#lblPixelUnderCursor").text(this.className);
      //   if (!mouseDownReleased) {
      //     updateBmpCodes(canvasId, this.className);
      //     updateBmpCanvas(canvasId);
      //     pixMapArrToText(canvasId);
      //   }
      // });

      $(cell).bind("mouseout", function () {
        $("#lblPixelUnderCursor").text("");
      });

    } // i width
  } // j height
}; // end function createNewBmpCanvas

// canvas table to pixel map array
function updateBmpCodes(canvasId, className) {
  let pixelLabel = className.split('-');;
  let y = pixelLabel[1];
  let x = pixelLabel[2];
  pixelMaps[canvasId][x][y] = pixelMaps[canvasId][x][y] == 1 ? 0 : 1;
  // console.log(pixelMaps[canvasId][x][y]);

}; // end function updateBmpCodes

// pixel map array to canvas table 
function updateBmpCanvas(canvasId) {
  let colr = ["#ffffff", "#000000"];
  for (x = 0; x < bmpWidth; x++) {
    for (y = 0; y < bmpHeight; y++) {
      $("#table-canvas-" + canvasId + " ." + "pixel-" + x + "-" + y).css('background-color', colr[pixelMaps[canvasId][y][x]]);
    }
  }
}; // end function updateBmpCanvas


function animate() {
  $("#table-animation tr").remove();
  $("#table-animation").html($("#table-canvas-" + animationCurrentFrame).html());
  animationCurrentFrame = animationCurrentFrame == 0 ? 1 : 0;
}; // end function updateBmpCanvas

function pixMapArrToText(canvasId) {
  let fullText = ""
  for (x = 0; x < bmpHeight; x++) {
    let textLine = "";
    for (y = 0; y < bmpWidth; y++) {
      textLine += "" + pixelMaps[canvasId][x][y];
    }
    if (fullText != "") fullText += ",\n";
    fullText += "0b" + textLine;
    $("#txtarea-canvas-" + canvasId).val(fullText);
  }
}; // end function pixMapArrToText

function textToPixMapArr(canvasCodetextAreaId) {

  fullText = $("#" + canvasCodetextAreaId).val().replace(/0b/g, "").replace(/\n/g, "");
  fullTextLen = fullText.replace(/,/g, "").length;
  scanLines = fullText.split(",");


  if (fullTextLen != bmpHeight * bmpWidth) {
    $("#" + canvasCodetextAreaId).css('color', "#ff0000");
    return;
  } else {
    $("#" + canvasCodetextAreaId).css('color', "#000000");
  }

  for (i = 0; i < scanLines.length; i++) {
    for (j = 0; j < scanLines[i].length; j++) {
      pixelMaps[canvasCodetextAreaId.split("-")[2]][i][j] = scanLines[i][j];
    }
  }
  // console.log(scanLines);
  // console.log(pixelMaps);
}; // end function textToPixMapArr

function clearCanvas(canvasId) {
  canvasCreated = false;
  pixelMaps = [];
  pixelMap = [];
  pixelMaps.length = 0;
  pixelMap.length = 0;
  $("#table-canvas-0 tr").remove();
  $("#table-canvas-1 tr").remove();
  $("#table-animation tr").remove();
  $("#txtarea-canvas-0").val("");
  $("#txtarea-canvas-1").val("");
  $("#txtarea-canvas-0").css('color', "#000000");
  $("#txtarea-canvas-1").css('color', "#000000");
}; // end function clearCanvas



function initPixelMap(bmpWidth, bmpHeight, canvasNo, pixelMapStr = "") {
  let initWith = [];
  if (pixelMapStr == "") {
    initWith[0] = 0;
  } else {
    initWith = pixelMapStr.trim().split(",");
  }

  pixelMap = [];
  for (var i = 0; i < bmpHeight; i++) {
    pixelMap[i] = [];
    for (j = 0; j < bmpWidth; j++) {
      pixelMap[i][j] = 2;
      if (initWith.length == 1) {
        pixelMap[i][j] = initWith[0];
      } else {
        pixelMap[i][j] = initWith[i].charAt(j + 2).trim();
      }
    }
  }
  // console.log(pixelMap);
  pixelMaps[canvasNo] = pixelMap;
}; // end function initPixelMap

function encode(binaryArray, width, height, withDim, asHex) {
  // console.log(binaryArray);
  let iWidth = width;
  let iHeight = height;
  let rebin = "";
  let out = ""
  let noHorzByte = Math.ceil(iWidth / 8);
  let noVertByte = iHeight;
  for (let y = 0; y < noVertByte; y++) {
    for (let x = 0; x < noHorzByte; x++) {
      let curByteStartX = 8 * x;
      rebin = "";
      for (let curBitPos = 0; curBitPos < 8; curBitPos++) {
        if (y < binaryArray.length && (curByteStartX + curBitPos) < binaryArray[y].length) {
          rebin = rebin + "" + binaryArray[y][curByteStartX + curBitPos];
        } else {
          rebin = rebin + "" + "0"
        }
      } // next curBitPos
      // console.log(rebin);
      if (out != "") out = out + ",\n"
      if (asHex) {
        out = out + "0x" + parseInt(rebin, 2).toString(16);
      } else { //asBin
        out = out + "0b" + rebin;
      } 
    } // next x
  } // next y
  // console.log(out);
  if (withDim) out = width + "," + height + "," + out;
  return out;
}; //end function encode