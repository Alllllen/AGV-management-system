const Assignment = require('./../models/AssignmentModel');

const Task = require('./../models/taskModel');
const Section = require('./../models/foundations/sectionModel');
const Agv = require('./../models/agvModel');
const guidePath = require('./../models/foundations/guidePathModel');

const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const findShortestPath = require('./../utils/shortestPath');

exports.createAssignment = catchAsync(async (req, res, next) => {
  //get map info
  const guidePathes = await guidePath.find({});
  let graph = {};
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

  //find task  want to address
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const sectionStart = await Section.findById(task['sectionStart']);
  const sectionEnd = await Section.findById(task['sectionEnd']);

  // find agv shortest path to sectionStart
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

  // create assignment
  const assignment = await Assignment.create({
    task: req.params.taskId,
    sectionStart: sectionStart['id'],
    sectionEnd: sectionEnd['id'],
    agv: agvId,
    route: minPath,
  });
  console.log(assignment, minDistance);

  res.status(200).json({
    status: 'success',
    data: {
      assignment,
    },
  });
});

exports.getAllAssignment = crud.getAll(Assignment);
exports.deleteAssignment = crud.deleteOne(Assignment);
exports.getAssignment = crud.getOne(Assignment);
exports.updateAssignment = crud.updateOne(Assignment);
