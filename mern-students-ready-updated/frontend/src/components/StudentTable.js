import React, { useState } from 'react';
import { saveStudents } from '../services/api';

const initialStudent = () => ({
  name: '',
  grades: [0,0,0,0,0],
  attendance: 0,
});

export default function StudentTable() {
  const [students, setStudents] = useState([ initialStudent() ]);

  const updateField = (idx, field, value, gradeIdx) => {
    const list = [...students];
    if (field === 'grade') {
      list[idx].grades[gradeIdx] = Number(value);
    } else if (field === 'attendance') {
      list[idx].attendance = Number(value);
    } else {
      list[idx].name = value;
    }
    setStudents(list);
  };

  const addStudent = () => setStudents([...students, initialStudent()]);

  const averages = {
    byStudent: students.map(s =>
      (s.grades.reduce((a,b)=>a+b, 0)/s.grades.length).toFixed(2)
    ),
    byDiscipline: Array(5).fill(0).map((_, i) => {
      const sum = students.reduce((acc, s) => acc + s.grades[i], 0);
      return (sum / students.length).toFixed(2);
    }),
    attendance: students.map(s => s.attendance.toFixed(2)),
  };

  const classAverageOverall =
    (averages.byStudent.reduce((a,b)=>a+parseFloat(b), 0)/students.length).toFixed(2);

  const aboveClass = students.filter((_,i) => parseFloat(averages.byStudent[i]) > classAverageOverall);
  const lowAttendance = students.filter(s => s.attendance < 75);

  const handleSave = async () => {
    // Transforma grades simples em objetos {discipline, grade}
    const payload = students.map(s => ({
      name: s.name,
      grades: s.grades.map((g, idx) => ({
        discipline: `Disc ${idx + 1}`,
        grade: g,
      })),
      attendance: s.attendance,
    }));

    try {
      await saveStudents(payload);
      alert('Dados salvos com sucesso!');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Gestão de Notas e Frequência</h1>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th>Nome</th>
            {[...Array(5)].map((_,i)=><th key={i}>Disc {i+1}</th>)}
            <th>Frequência %</th>
            <th>Média</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s,i) => (
            <tr key={i}>
              <td>
                <input
                  value={s.name}
                  onChange={e=>updateField(i,'name',e.target.value)}
                  placeholder="Nome"
                />
              </td>
              {s.grades.map((g,j)=>(<td key={j}>
                <input
                  type="number" min="0" max="10"
                  value={g}
                  onChange={e=>updateField(i,'grade',e.target.value,j)}
                />
              </td>))}
              <td>
                <input
                  type="number" min="0" max="100"
                  value={s.attendance}
                  onChange={e=>updateField(i,'attendance',e.target.value)}
                />
              </td>
              <td>{averages.byStudent[i]}</td>
            </tr>
          ))}
          <tr>
            <td>
              <button onClick={addStudent}>+ Aluno</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Média por Disciplina</td>
            {averages.byDiscipline.map((m,i)=><td key={i}>{m}</td>)}
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-4">
        <p>Média geral da turma: {classAverageOverall}</p>
        <p>Acima da média: {aboveClass.map(s=>s.name).join(', ') || '—'}</p>
        <p>Frequência abaixo de 75%: {lowAttendance.map(s=>s.name).join(', ') || '—'}</p>
      </div>
      <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={handleSave}>
        Salvar
      </button>
    </div>
  );
}