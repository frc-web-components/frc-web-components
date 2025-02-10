import './KeyValueTable.css';

export function KeyValueTable({
  keyValuePairs,
}: {
  keyValuePairs: Record<string, unknown>;
}) {
  return (
    <table className="key-value-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(keyValuePairs).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              <div>{JSON.stringify(value, null, 2)}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default KeyValueTable;
