const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  discipline: String,
  grade: Number,
});

const studentSchema = new mongoose.Schema({
  name: String,
  grades: [gradeSchema],
  attendance: Number,
});

module.exports = mongoose.model('Student', studentSchema);