const Assignments = () => {
  const pending = ['Linear Algebra HW', 'Thermodynamics Essay'];
  const completed = ['Calculus Worksheet', 'Optics Lab Report'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Pending</h2>
          <ul className="space-y-2">
            {pending.map((a, i) => (
              <li key={i} className="p-2 border rounded">{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <ul className="space-y-2">
            {completed.map((a, i) => (
              <li key={i} className="p-2 border rounded bg-green-100">{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
