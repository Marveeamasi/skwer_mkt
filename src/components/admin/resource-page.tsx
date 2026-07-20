export function ResourcePage({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      <section className="panel">
        {rows.length ? <div className="table-wrap" data-horizontal-scroll>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((v, j) => (
                    <td key={j}>{j === 0 ? <strong>{v}</strong> : v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <div className="empty-state"><h2>No records yet</h2><p>Verified records will appear here when available.</p></div>}
      </section>
    </>
  );
}
