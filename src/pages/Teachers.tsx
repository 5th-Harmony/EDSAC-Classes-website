const Teachers = () => {
  const teachers = [
    { name: 'Dr. A. Sharma', subject: 'Mathematics', qualification: 'PhD, IIT Delhi' },
    { name: 'Prof. R. Mehta', subject: 'Physics', qualification: 'MSc, IISc Bangalore' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Faculty</h1>
      <ul className="space-y-4">
        {teachers.map((t, i) => (
          <li key={i} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p>Subject: {t.subject}</p>
            <p>Qualification: {t.qualification}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teachers;
