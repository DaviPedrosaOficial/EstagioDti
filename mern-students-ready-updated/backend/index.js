require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✔️ Conectado ao MongoDB Atlas'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB Atlas:', err.message));

app.post('/api/students', async (req, res) => {
  console.log('📥 BODY RECEBIDO:', JSON.stringify(req.body, null, 2));
  try {
    const students = req.body.students;
    await Student.deleteMany({});
    await Student.insertMany(students);
    res.status(201).json({ message: 'Dados salvos' });
  } catch (err) {
    console.error('❌ ERRO NO INSERT:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
