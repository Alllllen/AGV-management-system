const Agv = require('./models/agvModel');
const agvController = require('./controllers/agvController');
const park = require('./models/foundations/parkModel');
const Door = require('./models/foundations/doorModel');
const Task = require('./models/taskModel');
const Assignment = require('./models/assignmentModel');
const assignmentController = require('./controllers/assignmentController');
const Park = require('./models/foundations/parkModel');
const AgvStream = require('./models/logs/agvStreamModel');

//redis keys -> park:num:field(name), park:enetryPosistion:field({x;1,y:2,z:4}), agv:stream, door:stream, agv:status:name
const redis = require('./utils/redis');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

exports.mqttClient = (server) => {
  const io = require('socket.io')(server, { cookie: true });
  // let socketEmit = () => {};
  //when new client connet, sent current status to client and display
  io.on('connection', async (socket) => {
    //park number on map
    const parkNum = await redis.hgetall('park:num');
    socket.emit('parkNum', JSON.stringify(parkNum));
    // fleet status
    const agvPark = await redis.get('agv:status:park');
    const agvTransport = await redis.get('agv:status:transport');
    const agvCharge = await redis.get('agv:status:charge');
    socket.emit(
      'agv:status',
      JSON.stringify([agvPark, agvTransport, agvCharge])
    );
    //sent agv and door id to let client subscribe (that mqtt broker to make connection)
    let doorInfo = await redis.get('doorInfo');
    let agvInfo = await redis.get('agvInfo');
    doorInfo = JSON.parse(doorInfo);
    agvInfo = JSON.parse(agvInfo);
    for (let agv of agvInfo)
      socket.emit('subscribeMqtt', `agv:${agv['_id']}:route`);
    for (let door of doorInfo)
      socket.emit('subscribeMqtt', `door:${door['_id']}:status`);
    //when browser closed
    socket.on('disconnect', () => socket.disconnect(0));

    // socketEmit = async (...args) => socket.emit(...args);
  });

  preload(io);
  testEmitAssingment(io);
  // testGenData();
  // testDbSpeed();
  // testFromMqtt();

  client.on('message', async (topic, message) => {
    // 如果車子抵達一個assingment的目的地   (接收 assingment complete via MQTT)
    if (topic.includes('complete')) {
      message = JSON.parse(message);
      const task = message['task'];
      const startToEnd = message['startToEnd'];
      const agv = 'agv:' + topic.split(':')[1];
      const agvId = topic.split(':')[1];
      const endRoute = message['fullRoute'][message['currentStep']];
      const entryPosition = JSON.stringify({
        x: endRoute[0],
        y: endRoute[1],
        z: message['z'],
      });
      console.log(`Complete-> task:${task},${startToEnd},${agv}`);

      if (startToEnd.split('To')[1] === 'park') {
        // agvPositin change
        // const updateAgv = await Agv.updateById(agvId, {
        //   entryX: endPosition[0],
        //   entryY: endPosition[1],
        //   z: message['z'],
        //   status: 'idle',
        // });
        // park:name:number in redis change
        const parkName = await redis.hget('park:entryPosition', entryPosition);
        await redis.hincrby('park:num', parkName, 1);
        await redis.incr('agv:status:park');
        await redis.decr('agv:status:transport');

        const agvPark = await redis.get('agv:status:park');
        const agvTransport = await redis.get('agv:status:transport');
        const agvCharge = await redis.get('agv:status:charge');
        io.emit(
          'agv:status',
          JSON.stringify([agvPark, agvTransport, agvCharge])
        );

        // socketio park
        const parkNum = await redis.hgetall('park:num');
        io.emit('parkNum', JSON.stringify(parkNum));
        io.emit('complete', topic);
      }
      // 如果該assignment結束便要讓車子去停車 -> 生成去聽車的assignment
      if (startToEnd.split('To')[1] === 'sectionEnd') {
        const assignment = await assignmentController.createToParkAssignment(
          task,
          agvId
        );
        client.publish(agv + ':assignment', JSON.stringify([assignment]));
      }
    }
    // redis record agv stream (this function move to mqtt broker)
    // if (topic.includes('route')) {
    //   if (!redis.exists('agvNum')) redis.set('agvNum', 0);
    //   const agvNum = await redis.incr('agvNum');
    //   // batch moving redis data to mongodb
    //   // if (agvNum % 100 === 0) {
    //   //   let toMongo = await redis.zrangebyscore('agv:stream', 0, 99);
    //   //   await redis.zremrangebyrank('agv:stream', 0, 99);
    //   // }

    //   const agvStream = JSON.stringify({
    //     id: topic.split(':')[1],
    //     data: message,
    //     num: agvNum,
    //   });
    //   await redis.zadd('agv:stream', agvNum, agvStream);
    //   // socketEmit('agvRoute', topic, message.toString());
    // }

    // redis record sensor(door) stream (this function move to mqtt broker)
    // if (topic.includes('status')) {
    //   if (!redis.exists('doorNum')) redis.set('doorNum', 0);
    //   await redis.incr('doorNum');
    //   const doorNum = await redis.get('doorNum');

    //   const doorStream = JSON.stringify({
    //     id: topic.split(':')[1],
    //     data: message,
    //     num: doorNum,
    //   });
    //   await redis.zadd('door:stream', doorNum, doorStream);
    //   // socketEmit('doorStatus', topic, message.toString());
    // }
  });

  // pub/sub from redis, and bypass by websocket to client
  redis.sub.subscribe('agv:route');
  redis.sub.subscribe('door:status');
  redis.sub.on('message', async (channel, message) => {
    console.log(channel, message);
    io.emit(channel, message);
  });
};

const preload = (io) => {
  // find all agvs set subscribe && publish to agvs client(let it set subscribe)
  setTimeout(async () => {
    // clear redis
    await redis.client.flushall();
    await redis.set('agv:status:park', 0);
    await redis.set('agv:status:transport', 0);
    await redis.set('agv:status:charge', 0);

    const agvs = await Agv.find({});
    const doors = await Door.find({});
    const parks = await Park.find({});

    client.publish('allAgvs', JSON.stringify(agvs));
    client.publish('allDoors', JSON.stringify(doors));

    const agvInfo = [];
    const doorInfo = [];
    for (let door of doors) doorInfo.push(door);
    for (let agv of agvs) {
      await redis.incr('agv:status:' + agv['status']);
      agvInfo.push(agv);

      //return route, startToEnd, agvID, complete
      client.subscribe(`agv:${agv['_id']}:route`);
      client.subscribe(`agv:${agv['_id']}:complete`);

      const park = await Park.findOne({
        entryX: agv['x'],
        entryY: agv['y'],
        z: agv['z'],
      });
      if (!park) continue;

      if (redis.exists(`park:${park['name']}:num`))
        await redis.hincrby('park:num', park['name'], 1);
      else redis.hset('park:num', park['name'], 0);
    }

    await redis.set('doorInfo', JSON.stringify(doorInfo));
    await redis.set('agvInfo', JSON.stringify(agvInfo));
    for (let park of parks) {
      await redis.hset(
        `park:entryPosition`,
        JSON.stringify({
          x: park['entryX'],
          y: park['entryY'],
          z: park['z'],
        }),
        park['name']
      );
    }
  }, 1000);
};
const testEmitAssingment = (io) => {
  // Get;
  setTimeout(async () => {
    console.log('sent assignment');
    const assignments = await Assignment.aggregate([
      { $group: { _id: '$task', datas: { $push: '$$ROOT' } } },
    ]);
    for (let i = 0; i < assignments.length; i++) {
      setTimeout(async () => {
        client.publish(
          `agv:${assignments[i]['datas'][0]['agv']}:assignment`,
          JSON.stringify(assignments[i]['datas'])
        );

        // agvPositin change
        // const updateAgv = await Agv.updateById(agvId, {
        //   entryX: endPosition[0],
        //   entryY: endPosition[1],
        //   z: message['z'],
        // });

        // park:name:number in redis change
        const parkName = await redis.hget(
          'park:entryPosition',
          JSON.stringify({
            x: Number(assignments[i]['datas'][0]['route'][0].split(',')[0]),
            y: Number(assignments[i]['datas'][0]['route'][0].split(',')[1]),
            z: Number(assignments[i]['datas'][0]['z']),
          })
        );
        await redis.hincrby('park:num', parkName, -1);
        await redis.decr('agv:status:park');
        await redis.incr('agv:status:transport');

        const agvPark = await redis.get('agv:status:park');
        const agvTransport = await redis.get('agv:status:transport');
        const agvCharge = await redis.get('agv:status:charge');
        io.emit(
          'agv:status',
          JSON.stringify([agvPark, agvTransport, agvCharge])
        );

        // socketio park
        const parkNum = await redis.hgetall('park:num');
        io.emit('parkNum', JSON.stringify(parkNum));
      }, i * 950);
    }
  }, 4000);
};

const testFromMqtt = () => {
  client.subscribe('test');
  let testNum = 0;
  client.on('message', (topic, message) => {
    if (topic === 'test') {
      if (testNum === 0) {
        console.time('fromMqtt');
        console.log('Start');
      }
      testNum++;
      // console.log(testNum);
      if (testNum === 500000) {
        console.timeEnd('fromMqtt');
      }
    }
  });
};
const testDbSpeed = () => {
  // test mongodb && redis write speed
  setTimeout(async () => {
    console.time('dbsave');
    let num = 0;
    let streams = [];
    for (let i = 0; i < 100000; i++) {
      num++;
      let obj = {
        agv: '635f9887c3b6fd337c62d77d',
        status: 'active',
        battery: 100,
        x: 0,
        y: 1,
        z: 8,
      };
      // redis.set(`${num}`, JSON.stringify(obj));
      // streams.push(obj);
      AgvStream.create(obj);
    }
    console.log(streams.length);
    // AgvStream.insertMany(streams);

    console.timeEnd('dbsave');
  }, 3000);
};
const testGenData = () => {
  // Generate
  setTimeout(async () => {
    await Agv.updateMany({ status: 'transport' }, { status: 'park' });
    const tasks = await Task.aggregate([{ $limit: 5 }]);
    const axios = require('axios');

    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i]['_id'].toString();
      console.log(taskId);

      const config = {
        method: 'post',
        url: `http://127.0.0.1:8080/api/v1/task/${taskId}/assignment`,
      };

      let res = await axios(config);
      console.log(res.status);
    }
  }, 3000);
};
