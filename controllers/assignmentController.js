const Assignment = require('./../models/assignmentModel');

const Task = require('./../models/taskModel');
const Section = require('./../models/foundations/sectionModel');
const Agv = require('./../models/agvModel');
const guidePath = require('./../models/foundations/guidePathModel');
const Park = require('./../models/foundations/parkModel');

const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const findShortestPath = require('./../utils/shortestPath');

const getGraph = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      //get map info from mongoDB
      let graph = {};
      const guidePathes = await guidePath.find({});
      for (let i in guidePathes) {
        let adjacents = {};
        let adjacent = guidePathes[i]['adjacents'];
        // console.log(guidePathes[i]['adjacents'].length);
        for (let j = 0; j < adjacent.length; j++) {
          adjacents[`${adjacent[j]['adjacentX']},${adjacent[j]['adjacentY']}`] =
            adjacent[j]['weight'];
        }
        graph[`${guidePathes[i]['vertexX']},${guidePathes[i]['vertexY']}`] =
          adjacents;
      }
      resolve(graph);
    })
  );
};

// if arrived, back to park. If this task is need to go to bufferSection then goto buffer wait for section is

const chooseAgv = (graph, sectionStart, taskId) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      // find which agv(park) to sectionStart is shortest & its shortest path
      const agvs = await Agv.find({ status: 'park' });

      let first = findShortestPath(
        graph,
        `${agvs[0]['x']},${agvs[0]['y']}`,
        `${sectionStart['entryX']},${sectionStart['entryY']}`
      );
      let minDistance = first['distance'];
      let minPath = first['path'];
      let agvId = agvs[0]['id'];

      agvs.map((agv) => {
        let distanceAndPath = findShortestPath(
          graph,
          `${agv['x']},${agv['y']}`,
          `${sectionStart['entryX']},${sectionStart['entryY']}`
        );
        if (distanceAndPath['distance'] < minDistance) {
          minDistance = distanceAndPath['distance'];
          minPath = distanceAndPath['path'];
          agvId = agv['id'];
        }
      });
      await Agv.findByIdAndUpdate(agvId, { status: 'transport' });

      // create park(agv) -> section assignment
      const assignment = await Assignment.create({
        task: taskId,
        routeStart: 'park',
        routeEnd: 'sectionStart',
        z: sectionStart['z'],
        agv: agvId,
        route: minPath,
      });

      resolve([assignment, agvId]);
    })
  );
};

const sectionToSection = (graph, sectionFrom, sectionTo, taskId, agvId) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      // find shortest path from sectionStart to sectionEnd
      let sectionToSection = findShortestPath(
        graph,
        `${sectionFrom['entryX']},${sectionFrom['entryY']}`,
        `${sectionTo['entryX']},${sectionTo['entryY']}`
      );
      minDistance = sectionToSection['distance'];
      minPath = sectionToSection['path'];

      // create sectionFrom -> sectionTo assignment
      const assignment = await Assignment.create({
        task: taskId,
        routeStart: 'sectionStart',
        routeEnd: 'sectionEnd',
        z: sectionFrom['z'],
        status: 'waitForExecute',
        agv: agvId,
        route: minPath,
      });

      resolve(assignment);
    })
  );
};

// const choosePark = (graph, section, taskId, agvId) => {
//   return new Promise(
//     catchAsync(async (resolve, reject) => {
//       const parks = await Park.find({});

//       let first = findShortestPath(
//         graph,
//         `${section['entryX']},${section['entryY']}`,
//         `${parks[0]['entryX']},${parks[0]['entryY']}`
//       );
//       let minDistance = first['distance'];
//       let minPath = first['path'];

//       parks.map((park) => {
//         let distanceAndPath = findShortestPath(
//           graph,
//           `${section['entryX']},${section['entryY']}`,
//           `${park['entryX']},${park['entryY']}`
//         );
//         if (distanceAndPath['distance'] < minDistance) {
//           minDistance = distanceAndPath['distance'];
//           minPath = distanceAndPath['path'];
//         }
//       });

//       // create sectionEnd -> park
//       const assignment = await Assignment.create({
//         task: taskId,
//         routeStart: 'sectionEnd',
//         routeEnd: 'park',
//         status: 'waitForExecute',
//         agv: agvId,
//         route: minPath,
//       });

//       resolve(assignment);
//     })
//   );
// };

exports.createToParkAssignment = (taskId, agvId) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const graph = await getGraph();

      //find task, sectionStart and SectionEnd
      const task = await Task.findById(taskId);
      if (!task) {
        throw new AppError('Task not found', 404);
      }
      const sectionEnd = await Section.findById(task['sectionEnd']);

      const parks = await Park.find({});

      let first = findShortestPath(
        graph,
        `${sectionEnd['entryX']},${sectionEnd['entryY']}`,
        `${parks[0]['entryX']},${parks[0]['entryY']}`
      );
      let minDistance = first['distance'];
      let minPath = first['path'];
      parks.map((park) => {
        let distanceAndPath = findShortestPath(
          graph,
          `${sectionEnd['entryX']},${sectionEnd['entryY']}`,
          `${park['entryX']},${park['entryY']}`
        );
        if (distanceAndPath['distance'] < minDistance) {
          minDistance = distanceAndPath['distance'];
          minPath = distanceAndPath['path'];
        }
      });

      // create sectionEnd -> park
      const assignment = await Assignment.create({
        task: taskId,
        routeStart: 'sectionEnd',
        routeEnd: 'park',
        z: sectionEnd['z'],
        status: 'transport',
        agv: agvId,
        route: minPath,
      });

      resolve(assignment);
    })
  );
};

exports.createAssignment = catchAsync(async (req, res, next) => {
  //get map info from mongoDB
  const graph = await getGraph();

  //find task, sectionStart and SectionEnd
  const taskId = req.params.taskId;
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const sectionStart = await Section.findById(task['sectionStart']);
  const sectionEnd = await Section.findById(task['sectionEnd']);

  //chooseAgv agv to sectionStart
  const assignment = await chooseAgv(graph, sectionStart, taskId);
  // console.log(assignment);
  const assignment1 = assignment[0];
  const agvId = assignment[1];

  //find shortest path from start to end
  const assignment2 = await sectionToSection(
    graph,
    sectionStart,
    sectionEnd,
    taskId,
    agvId
  );

  //choose shortest park to the agv that finished task
  // const assignment3 = await choosePark(graph, sectionEnd, taskId, agvId);

  //response
  res.status(200).json({
    status: 'success',
    data: {
      assignment1,
      assignment2,
      // assignment3,
    },
  });
});

exports.getAllAssignment = crud.getAll(Assignment);
exports.deleteAssignment = crud.deleteOne(Assignment);
exports.getAssignment = crud.getOne(Assignment);
exports.updateAssignment = crud.updateOne(Assignment);
