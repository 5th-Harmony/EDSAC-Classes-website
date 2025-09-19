const GradeReport = () => {
  const grades = [
    { subject: 'Math', score: 92 },
    { subject: 'Physics', score: 85 },
    { subject: 'Chemistry', score: 88 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Grade Report</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => (
            <tr key={i}>
              <td className="p-2 border">{g.subject}</td>
              <td className="p-2 border">{g.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeReport;
