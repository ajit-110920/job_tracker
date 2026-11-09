export function SkeletonRow() {
  return (
    <tr>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="skeleton" style={{ width: "38px", height: "38px", borderRadius: "10px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="skeleton" style={{ width: "160px", height: "14px" }} />
            <div className="skeleton" style={{ width: "100px", height: "12px" }} />
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton" style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
      </td>
      <td>
        <div className="skeleton" style={{ width: "90px", height: "14px" }} />
      </td>
      <td>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
          <div className="skeleton" style={{ width: "30px", height: "30px", borderRadius: "6px" }} />
          <div className="skeleton" style={{ width: "30px", height: "30px", borderRadius: "6px" }} />
        </div>
      </td>
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="skeleton" style={{ width: "80px", height: "12px" }} />
        <div className="skeleton" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
      </div>
      <div className="skeleton" style={{ width: "50px", height: "32px", margin: "8px 0" }} />
      <div className="skeleton" style={{ width: "110px", height: "10px" }} />
    </div>
  );
}

