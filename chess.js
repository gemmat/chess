var cboard = "";
var moveLen = 0;
var mpoint = 0;
var pi = -1;
var pj = -1;
var mc = [];
var mi = [];
var mj = [];
var mpi = [];
var mpj = [];

var prefs = null;
//Uncomment a following line for Google Gadgets' UserPref.
//var prefs = new gadgets.Prefs();


var coding = {
  r:"bR",n:"bN",b:"bB",q:"bQ",k:"bK",p:"bP",
  R:"wR",N:"wN",B:"wB",Q:"wQ",K:"wK",P:"wP"
};

function init(cb) {
  cboard = cb;
  if (prefs) prefs.set("board", cboard);
	fill();
  moveLen = 0;
  mpoint = 0;
  pi = -1;
  pj = -1;
  mc = [];
  mi = [];
  mj = [];
  mpi = [];
  mpj = [];
	disableButtons();
}

function fill() {
	for(var i = 0; i < 10; i++) {
  	for(var j = 0; j < 8; j++) {
      if (i > 7 && j == 7) continue;
      fillCell(i, j);
	  }
  }
}

function fillCell(i, j) {
  var cpiece = cboard.charAt(i * 8 + j);
  var code = cpiece == " " ? "00" : coding[cpiece];
  document.getElementById("c" + i + j).className = "sprite " + "sprite-" + code + ((i + j) % 2);
}

function updateCharAt(aString, aN, aChar) {
  return aString.substring(0, aN) + aChar + aString.substring(aN + 1);
}

function selectColor(i,j) {
  var elt = document.getElementById("c" + i + j);
  elt.className += (elt.className ? " " : "") + "selected";
}

function onClickBoard(i, j) {
	if (pi == -1) {
    if (!((i == 8 && j == 6) || (i == 9 && j == 6)) && cboard.charAt(i * 8 + j) == " ") return;
		pi = i;
		pj = j;
		selectColor(i,j);
	} else {
    if (i < 8) {
	    mc[mpoint] = cboard.charAt(i * 8 + j);
		  mi[mpoint] = i;
		  mj[mpoint] = j;
		  mpi[mpoint] = pi;
		  mpj[mpoint] = pj;
		  mpoint += 1;
		  moveLen = mpoint;
		  var tochange = cboard.charAt(pi * 8 + pj);
		  cboard = updateCharAt(cboard, i * 8 + j, tochange);
		  if (pi < 8) {
			  cboard = updateCharAt(cboard , pi * 8 + pj, " ");
		  }
      if (prefs) prefs.set("board",cboard);
      fillCell(pi, pj);
      fillCell( i,  j);
		  disableButtons();
    }
    pi = -1;
	}
}

function disableButtons() {
	document.getElementById("prev").disabled = (mpoint == 0);
	document.getElementById("next").disabled = (mpoint == moveLen);
}

function movePrev() {
	if (mpoint > 0) {
		mpoint -= 1;
    if (mpi[mpoint] < 8) {
      var tochange = cboard.charAt(mi[mpoint] * 8 + mj[mpoint]);
      cboard = updateCharAt(cboard, mpi[mpoint] * 8 + mpj[mpoint], tochange);
	  }
		cboard = updateCharAt(cboard, mi[mpoint] * 8 + mj[mpoint], mc[mpoint]);
    if (prefs) prefs.set("board", cboard);
    fillCell(mpi[mpoint], mpj[mpoint]);
    fillCell( mi[mpoint],  mj[mpoint]);
	  disableButtons();
	}
  pi = -1;
}

function moveNext() {
	if (mpoint < moveLen) {
		var tochange = cboard.charAt(mpi[mpoint] * 8 + mpj[mpoint]);
    cboard = updateCharAt(cboard, mi[mpoint] * 8 + mj[mpoint], tochange);
		if (mpi[mpoint]<8) {
			cboard = updateCharAt(cboard ,mpi[mpoint] * 8 + mpj[mpoint], " ");
		}
    if (prefs) prefs.set("board", cboard);
    fillCell( mi[mpoint],  mj[mpoint]);
    fillCell(mpi[mpoint], mpj[mpoint]);
    mpoint += 1;
    disableButtons();
	}
  pi = -1;
}

function positionStart() {
  init("rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNRkqrbnp  KQRBNP  ");
}

function positionClear() {
  init("                                                                kqrbnp  KQRBNP  ");
}

function flipTable(e) {
  var arr = ["board", "bpieces", "wpieces"];
  for (var i = 0; i < arr.length; i++) {
    var elt = document.getElementById(arr[i]);
    while (elt.firstChild) elt.removeChild(elt.firstChild);
  }
  makeTable(document.getElementById("flip").checked);
  fill();
}

function makeTable(aFlip) {
  var ts = [[0,  8, 8, "board"],
            [8,  9, 7, "bpieces"],
            [9, 10, 7, "wpieces"]];
  for (var s = 0; s < ts.length; s++) {
    var t = ts[s];
    var table = document.createElement("table");
    table.setAttribute("cellpadding", 0);
    table.setAttribute("cellspacing", 0);
    for(var i = t[0]; i < t[1]; i++) {
      var tr = document.createElement("tr");
	    for(var j = 0; j < t[2]; j++) {
        var oi, oj;
        if (aFlip) {
          switch (s) {
          case 0: oi = 7 - i; oj = 7 - j; break;
          case 1: oi = i + 1; oj = j;     break;
          case 2: oi = i - 1; oj = j;     break;
          }
        } else {
          oi = i; oj = j;
        }
        var td = document.createElement("td");
        td.setAttribute("id", "c" + oi + oj);
        td.onclick = (function onClickBoardFactory(i, j) {
                        return function(e) {onClickBoard(i, j);};
                      })(oi, oj);
        tr.appendChild(td);
	    }
	    table.appendChild(tr);
    }
    document.getElementById(t[3]).appendChild(table);
  }
}

function main() {
  makeTable(false);
  document.getElementById("start").onclick = positionStart;
  document.getElementById("clear").onclick = positionClear;
  document.getElementById("prev") .onclick = movePrev;
  document.getElementById("next") .onclick = moveNext;
  document.getElementById("flip") .onclick = flipTable;
  var cb = prefs ? prefs.getString("board") : "";
  init(cb.length == 80 ? cb : "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNRkqrbnp  KQRBNP  ");
}

window.onload = main;