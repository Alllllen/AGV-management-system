const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

//dataBase
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => {
    console.log(err.message);
  });

//server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
});

//mqtt
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const Agv = require('./models/agvModel');
const Door = require('./models/foundations/doorModel');
const Task = require('./models/taskModel');
const Assignment = require('./models/assignmentModel');
const assignmentController = require('./controllers/assignmentController');

//find all agvs set subscribe && publish to agvs client(let it set subscribe)
setTimeout(async () => {
  const agvs = await Agv.find({});
  const doors = await Door.find({});

  client.publish('allAgvs', JSON.stringify(agvs));
  client.publish('allDoors', JSON.stringify(doors));

  for (let agv of agvs) {
    client.subscribe(`agv:${agv['_id']}:route`); //return route, startToEnd, agvID
    client.subscribe(`agv:${agv['_id']}:complete`);
  }
  for (let door of doors) client.subscribe(`door:${door['_id']}:status`);
}, 3000);

//發出一個assinment(測試用)

// Generate
// setTimeout(async () => {
//   await Agv.updateMany({ status: 'transport' }, { status: 'park' });
//   const tasks = await Task.aggregate([{ $limit: 5 }]);
//   const axios = require('axios');

//   for (let i = 0; i < tasks.length; i++) {
//     const taskId = tasks[i]['_id'].toString();
//     console.log(taskId);

//     const config = {
//       method: 'post',
//       url: `http://127.0.0.1:8080/api/v1/task/${taskId}/assignment`,
//     };

//     let res = await axios(config);
//     console.log(res.status);
//   }
// }, 3000);

// Get
setTimeout(async () => {
  console.log('GOGOGO');
  const assignments = await Assignment.aggregate([
    { $group: { _id: '$task', datas: { $push: '$$ROOT' } } },
  ]);

  for (let i = 0; i < assignments.length; i++) {
    setTimeout(function () {
      client.publish(
        `agv:${assignments[i]['datas'][0]['agv']}:assignment`,
        JSON.stringify(assignments[i]['datas'])
      );
    }, i * 950);
  }
}, 5000);

//如果車子抵達一個assingment的目的地   (接收 assingment complete via MQTT)
client.on('message', async (topic, message) => {
  if (topic.includes('complete')) {
    message = JSON.parse(message);

    const task = message['task'];
    const startToEnd = message['startToEnd'];
    const agv = 'agv:' + topic.split(':')[1];
    const agvId = topic.split(':')[1];

    console.log(
      `Complete-> task:${task}, startToEnd:${startToEnd}, agv:${agv}`
    );

    //如果該assignment結束便要讓車子去停車 -> 生成去聽車的assignment
    if (startToEnd.split('To')[1] === 'sectionEnd') {
      const assignment = await assignmentController.createToParkAssignment(
        task,
        agvId
      );
      client.publish(agv + ':assignment', JSON.stringify([assignment]));
    }
  }
});

//sock.io && 接收 assignmentPosition 回傳
const io = require('socket.io')(server, { cookie: true });
io.on('connection', (socket) => {
  client.on('message', async (topic, message) => {
    if (topic.includes('route'))
      socket.emit('agvRoute', topic, message.toString());
    if (topic.includes('status')) {
      // console.log(message.toString());
      socket.emit('doorStatus', topic, message.toString());
    }
    // console.log(`sent route via ws`);
  });
});
