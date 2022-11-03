const Block = require('./../models/foundations/blockModel');
const Section = require('./../models/foundations/sectionModel');
const Park = require('./../models/foundations/blockModel');

const crud = require('./crudAction');

exports.getAllBlock = crud.getAll(Block);
exports.getBlock = crud.getOne(Block);

exports.getSection = crud.getOne(Section);
