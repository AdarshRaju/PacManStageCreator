const mainGridContainer = document.getElementById("mainGridContainer");
const playMode = document.getElementById("playMode");
const designMode = document.getElementById("designMode");
const saveGridPattern = document.getElementById("saveGridPattern");
const loadGridPattern = document.getElementById("loadGridPattern");
const gridsize = 25;
let mouseDown = false;

const rowDiv = document.createElement("div");
rowDiv.classList.add("rows");

for (let j = 0; j < gridsize; j++) {
  const colDiv = document.createElement("div");
  colDiv.classList.add("columns");
  colDiv.classList.add("cells");
  rowDiv.appendChild(colDiv);
  console.log("inner loop was run");
}

for (let i = 0; i < gridsize; i++) {
  const cloneRoWDiv = rowDiv.cloneNode(true);
  mainGridContainer.appendChild(cloneRoWDiv);
}

//#region Temporary grid designer logic

mainGridContainer.addEventListener("mousedown", () => {
  mouseDown = true;
  console.log("mousedown was triggered");
});
mainGridContainer.addEventListener("mouseup", () => {
  mouseDown = false;
});

function handleMouse(cell) {
  if (cell.classList.contains("pathCell")) {
    cell.classList.remove("pathCell");
  } else {
    cell.classList.add("pathCell");
  }
}
const cells = document.getElementsByClassName("cells");
[...cells].forEach((cell) => {
  cell.addEventListener("mouseenter", (e) => {
    if (mouseDown) {
      handleMouse(cell);
    }
  });
  cell.addEventListener("click", (e) => {
    handleMouse(cell);
  });
});

// #region to find all the selected cells

let pathCells = document.getElementsByClassName("pathCell");

let coorSelCells = [];

function findpathCells() {
  coorSelCells = [];
  [...pathCells].forEach((cellDOM) => {
    const rowDOM = cellDOM.parentElement;
    const colNum = [...rowDOM.children].indexOf(cellDOM);
    const rowNum = [...rowDOM.parentElement.children].indexOf(rowDOM);
    coorSelCells.push([rowNum, colNum]);
  });
  return coorSelCells;
}

saveGridPattern.addEventListener("click", async () => {
  const pathCellsGrid = JSON.stringify(findpathCells());
  const options = {
    suggestedName: "test.txt",
    startIn: "desktop",
    types: [
      {
        description: "text file",
        accept: { "application/json": [".json"] },
      },
    ],
  };
  try {
    const handle = await window.showSaveFilePicker(options);
    const writable = await handle.createWritable({ keepExistingData: true });
    const file = await handle.getFile();
    await writable.seek(file.size);
    await writable.write(pathCellsGrid);
    await writable.close();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("User has cancelled the Save File operation");
    } else {
      console.error(err);
    }
  }
});

loadGridPattern.addEventListener("click", async () => {
  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      startIn: "desktop",
      types: [
        {
          description: "grid coordinates in json array format",
          accept: { "application/json": [".txt"] },
        },
      ],
    });
    const file = await handle.getFile();
    const text = await file.text();

    let jsonExtract;

    try {
      jsonExtract = JSON.parse(text);
    } catch {
      console.error("Selected file's content is not in a valid JSON format");
    }
    [...pathCells].forEach((selCell) => {
      selCell.classList.remove("pathCell");
    });
    jsonExtract.forEach((mainCoorArr) => {
      mainGridContainer.children[mainCoorArr[0]].children[
        mainCoorArr[1]
      ].classList.add("pathCell");
    });
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("User has cancelled the Select File operation ");
    } else {
      console.error(err);
    }
  }
});

// #endregion to find all the selected cells

//#endregion Temporary grid designer logic
