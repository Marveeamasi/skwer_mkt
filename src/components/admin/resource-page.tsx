export function ResourcePage({
  title,
  description,
  columns,
  rows,
  action,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  action?: string;
}) {
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action && <button className="button button-small">{action}</button>}
      </header>
      <section className="panel">
        <div className="form-between">
          <input
            className="app-input"
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title}`}
          />
          <button className="button button-small button-secondary">
            Export
          </button>
        </div>
        <div className="table-wrap">
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
        </div>
      </section>
    </>
  );
}
