const Block = require('./../models/foundations/blockModel');
const Section = require('./../models/foundations/sectionModel');
const Charge = require('./../models/foundations/chargeModel');
const Park = require('./../models/foundations/parkModel');
const Wall = require('./../models/foundations/wallModel');
const Sensor = require('./../models/foundations/sensorModel');
const Vertex = require('./../models/foundations/vertexModel');
const GuidePath = require('./../models/foundations/guidePathModel');

const catchAsync = require('./../utils/catchAsync');

//pre load map's json file and put fondation infomation into MongoDB
const fs = require('fs');

const rawData = fs.readFileSync('./graph.json');
const jsonData = JSON.parse(rawData);
const cells = jsonData['mxGraphModel']['root']['mxCell'];

const getFoundation = (...key) => {
  let foundations = {};
  for (let i = 0; i < cells.length; i++) {
    let cellValue = cells[i]['_attributes']['value'];

    if (!cellValue) continue;

    cellValue = cellValue.split('<span')[0];
    // let isKey2 = true;
    // console.log(key.length);
    // if (key.length === 3) if (!cellValue.includes(key[2])) isKey2 = false;
    if (
      // !cellValue.includes('e') &&
      cellValue.includes(key[0]) &&
      !cellValue.includes(key[1])
    ) {
      let CellMxGeometry = cells[i]['mxGeometry']['_attributes'];

      let x = CellMxGeometry['x'] ? CellMxGeometry['x'] : 0;
      let y = CellMxGeometry['y'] ? CellMxGeometry['y'] : 0;

      x = x / 40;
      y = y / 40;

      let width = CellMxGeometry['width'] / 40;
      let height = CellMxGeometry['height'] / 40;
      if (foundations.hasOwnProperty(cellValue)) {
        cellValue = `${cellValue}_${i}`;
      }
      foundations[cellValue] = {
        startX: x,
        startY: y,
        endX: x + width,
        endY: y + height,
        z: 1,
      };
    }
  }
  return foundations;
};
const getEntry = (key, foundations) => {
  let foundationEntrys = {};
  for (let i = 0; i < cells.length; i++) {
    let cellValue = cells[i]['_attributes']['value'];

    if (!cellValue) continue;

    cellValue = cellValue.split('<span')[0];
    if (cellValue.includes('e') && cellValue.includes(key)) {
      let CellMxGeometry = cells[i]['mxGeometry']['_attributes'];

      let x = CellMxGeometry['x'] ? CellMxGeometry['x'] : 0;
      let y = CellMxGeometry['y'] ? CellMxGeometry['y'] : 0;
      x = x / 40;
      y = y / 40;

      let el = foundations[cellValue.split('e')[0]];
      el['entryX'] = x;
      el['entryY'] = y;
      foundationEntrys[cellValue.split('e')[0]] = el;
    }
  }
  return foundationEntrys;
};
const saveWall = catchAsync(async () => {
  let foundations = getFoundation('w', 'e'); //{}

  //save data
  for (let i in foundations) {
    await Wall.create({
      name: i,
      startX: foundations[i].startX,
      startY: foundations[i].startY,
      endX: foundations[i].endX,
      endY: foundations[i].endY,
      z: foundations[i].z,
    });
  }
  console.log('save Wall');
});
const saveElevator = catchAsync(async () => {
  //lift也等於elevator為了不跟entry的e搞混
  let foundations = getFoundation('l', 'e'); //{}
  let foundationEntrys = getEntry('l', foundations); //{}

  //save data
  for (let i in foundations) {
    await Sensor.create({
      name: i,
      type: 'elevator',
      startX: foundationEntrys[i].startX,
      startY: foundationEntrys[i].startY,
      endX: foundationEntrys[i].endX,
      endY: foundationEntrys[i].endY,
      entryX: foundationEntrys[i].entryX,
      entryY: foundationEntrys[i].entryY,
      z: foundationEntrys[i].z,
      status: 'idle_first',
    });
  }
  console.log('save elevator');
});
const saveCharge = catchAsync(async () => {
  let foundations = getFoundation('c', 'e'); //{}
  let foundationEntrys = getEntry('c', foundations); //{}

  //save data
  for (let i in foundations) {
    await Charge.create({
      name: i,
      startX: foundationEntrys[i].startX,
      startY: foundationEntrys[i].startY,
      endX: foundationEntrys[i].endX,
      endY: foundationEntrys[i].endY,
      entryX: foundationEntrys[i].entryX,
      entryY: foundationEntrys[i].entryY,
      z: foundationEntrys[i].z,
      status: 'idle_first',
    });
  }
  console.log('save charge');
});
const savePark = catchAsync(async () => {
  let foundations = getFoundation('p', 'e'); //{}
  let foundationEntrys = getEntry('p', foundations); //{}

  //save data
  for (let i in foundations) {
    await Park.create({
      name: i,
      startX: foundationEntrys[i].startX,
      startY: foundationEntrys[i].startY,
      endX: foundationEntrys[i].endX,
      endY: foundationEntrys[i].endY,
      entryX: foundationEntrys[i].entryX,
      entryY: foundationEntrys[i].entryY,
      z: foundationEntrys[i].z,
      status: 'idle_first',
    });
  }
  console.log('save park');
});
const saveSection = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      let foundations = getFoundation('s', 'e'); //{}
      let foundationEntrys = getEntry('s', foundations); //{}

      //save data
      for (let i in foundationEntrys) {
        await Section.create({
          name: i,
          entryX: foundationEntrys[i].entryX,
          entryY: foundationEntrys[i].entryY,
          z: foundationEntrys[i].z,
          isEmpty: true,
        });
      }
      console.log('save sections');
      resolve();
    })
  );
};
const saveBlock = catchAsync(async () => {
  let foundations = getFoundation('b', 's'); //{}

  //save data 用mongoose 找出其對應的sction id
  for (let i in foundations) {
    let sections = await Section.find({});
    let blockSections = [];
    for (let j = 0; j < sections.length; j++)
      if (sections[j].name.includes(`${i}s`))
        blockSections.push(sections[j].id);

    await Block.create({
      name: i,
      type: 'storage',
      startX: foundations[i].startX,
      startY: foundations[i].startY,
      endX: foundations[i].endX,
      endY: foundations[i].endY,
      z: foundations[i].z,
      sections: blockSections,
    });
    blockSections = [];
  }

  console.log('save block');
});
const saveVertex = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      let foundations1 = getFoundation('v'); //{}
      let foundations2 = getFoundation('e'); //{}

      //save data
      //save original vertex
      for (let i in foundations1) {
        await Vertex.create({
          x: foundations1[i].startX,
          y: foundations1[i].startY,
          z: foundations1[i].z,
        });
      }
      //save entry point as vertex
      for (let i in foundations2) {
        await Vertex.create({
          x: foundations2[i].startX,
          y: foundations2[i].startY,
          z: foundations2[i].z,
        });
      }

      console.log('save vertex');
      resolve();
    })
  );
};
const saveGuidePath = catchAsync(async () => {
  let vertexs = [];
  let entryVertexs = [];
  let edges = [];

  //get oiginal vertex
  let vs = getFoundation('v'); //{}
  for (let i in vs) {
    vertexs.push(vs[i]);
  }
  //get every entry point as verte
  let vs2 = getFoundation('e'); //{}
  for (let i in vs2) {
    entryVertexs.push(vs2[i]);
    vertexs.push(vs2[i]);
  }

  // get edges
  for (let i = 0; i < cells.length; i++) {
    let cellValue = cells[i]['_attributes']['value'];
    if (cellValue === '') {
      let CellMxGeometry = cells[i]['mxGeometry']['mxPoint'];

      let sourceX = (CellMxGeometry[0]['_attributes']['x'] - 20) / 40;
      let sourceY = (CellMxGeometry[0]['_attributes']['y'] - 20) / 40;
      let targetX = (CellMxGeometry[1]['_attributes']['x'] - 20) / 40;
      let targetY = (CellMxGeometry[1]['_attributes']['y'] - 20) / 40;
      edges.push({
        sourceX: sourceX,
        sourceY: sourceY,
        targetX: targetX,
        targetY: targetY,
      });
    }
  }

  // 把所有點跟點有連線的連起來
  let pair = [];
  let pairs = [];
  let weight = 0;

  for (let i = 0; i < edges.length; i++) {
    let sourceX = edges[i]['sourceX'];
    let sourceY = edges[i]['sourceY'];
    let targetX = edges[i]['targetX'];
    let targetY = edges[i]['targetY'];

    let currentV = {};
    let lastV = {};

    if (sourceX === targetX) {
      lastV = { x: sourceX, y: sourceY };

      if (sourceY < targetY) {
        for (let j = sourceY + 1; j <= targetY; j++) {
          weight++;
          currentV = { x: sourceX, y: j };
          if (
            vertexs.some(
              (vertex) =>
                vertex.startX === currentV.x && vertex.startY === currentV.y
            )
          ) {
            pair.push(lastV, currentV, weight);
            lastV = currentV;
            pairs.push(pair);
            weight = 0;
            pair = [];
          }
        }
      }
      if (sourceY > targetY) {
        lastV = { x: sourceX, y: targetY };

        for (let j = targetY + 1; j <= sourceY; j++) {
          weight++;
          currentV = { x: sourceX, y: j };
          if (
            vertexs.some(
              (vertex) =>
                vertex.startX === currentV.x && vertex.startY === currentV.y
            )
          ) {
            pair.push(currentV, lastV, weight);
            lastV = currentV;
            pairs.push(pair);
            weight = 0;
            pair = [];
          }
        }
      }
    }
    if (sourceY === targetY) {
      lastV = { x: sourceX, y: sourceY };
      if (sourceX < targetX) {
        for (let j = sourceX + 1; j <= targetX; j++) {
          weight++;
          currentV = { x: j, y: sourceY };
          if (
            vertexs.some(
              (vertex) =>
                vertex.startX === currentV.x && vertex.startY === currentV.y
            )
          ) {
            pair.push(lastV, currentV, weight);
            lastV = currentV;
            pairs.push(pair);
            weight = 0;
            pair = [];
          }
        }
      }

      if (sourceX > targetX) {
        lastV = { x: targetX, y: sourceY };
        for (let j = targetX + 1; j <= sourceX; j++) {
          weight++;
          currentV = { x: j, y: sourceY };
          if (
            vertexs.some(
              (vertex) =>
                vertex.startX === currentV.x && vertex.startY === currentV.y
            )
          ) {
            pair.push(currentV, lastV, weight);
            lastV = currentV;
            pairs.push(pair);
            weight = 0;
            pair = [];
          }
        }
      }
    }
  }
  //找出entry point出去到其他點的線
  for (let i = 0; i < entryVertexs.length; i++) {
    for (let j = 0; j < pairs.length; j++) {
      if (
        entryVertexs[i].startX === pairs[j][1]['x'] &&
        entryVertexs[i].startY === pairs[j][1]['y']
      ) {
        pair.push(
          { x: entryVertexs[i].startX, y: entryVertexs[i].startY },
          { x: pairs[j][0]['x'], y: pairs[j][0]['y'] },
          pairs[j][2]
        );
        pairs.push(pair);
        pair = [];
      }
    }
  }

  //save data
  const nodes = await Vertex.find({});
  for (let j in nodes) {
    let adjacents = [];
    for (let i = 0; i < pairs.length; i++) {
      if (
        nodes[j]['x'] === pairs[i][0]['x'] &&
        nodes[j]['y'] === pairs[i][0]['y']
      ) {
        let adjacent = await Vertex.find({
          x: pairs[i][1]['x'],
          y: pairs[i][1]['y'],
        });
        adjacents.push({
          adjacentId: adjacent[0]['id'],
          adjacentX: adjacent[0]['x'],
          adjacentY: adjacent[0]['y'],
          adjacentZ: adjacent[0]['z'],
          weight: pairs[i][2],
        });
      }
    }
    await GuidePath.create({
      vertex: nodes[j]['id'],
      vertexX: nodes[j]['x'],
      vertexY: nodes[j]['y'],
      vertexZ: nodes[j]['z'],
      adjacents: adjacents,
    });
    adjacents = [];
  }

  console.log('save guidePath');
});

exports.clearFounds = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      await Block.deleteMany({});
      await Section.deleteMany({});
      await Vertex.deleteMany({});
      await GuidePath.deleteMany({});
      await Wall.deleteMany({});
      await Sensor.deleteMany({});
      await Charge.deleteMany({});
      await Park.deleteMany({});
      console.log('clear Found data');
      resolve();
    })
  );
};

exports.setFounds = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      saveWall();
      saveElevator();
      saveCharge();
      savePark();

      await saveSection();
      saveBlock();

      await saveVertex();
      saveGuidePath();
      resolve();
    })
  );
};
