const Recordings = () => {
  const recordings = [
    { title: 'Calculus Lecture 1', date: '2025-09-10', url: '#' },
    { title: 'Mechanics Lecture 2', date: '2025-09-12', url: '#' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recorded Lectures</h1>
      <ul className="space-y-4">
        {recordings.map((r, i) => (
          <li key={i} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{r.title}</h2>
            <p>Date: {r.date}</p>
            <a href={r.url} className="text-blue-600 underline">Watch</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recordings;
