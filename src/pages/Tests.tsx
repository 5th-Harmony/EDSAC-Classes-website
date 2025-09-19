const Tests = () => {
  const tests = [
    { name: 'Math Midterm', date: '2025-10-01', status: 'Available' },
    { name: 'Physics Quiz', date: '2025-10-05', status: 'Upcoming' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Test Portal</h1>
      <ul className="space-y-4">
        {tests.map((t, i) => (
          <li key={i} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p>Date: {t.date}</p>
            <p>Status: {t.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tests;
