import type { GameSettings } from "../Types/GameSettings";

function Settings(settings: GameSettings) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "300px",
      }}
    >
      <h3>Settings</h3>
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Rows:
          <input
            type="number"
            min="1"
            value={settings.rows}
            style={{ marginLeft: "0.5rem", width: "60px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Columns:
          <input
            type="number"
            min="1"
            value={settings.columns}
            style={{ marginLeft: "0.5rem", width: "60px" }}
          />
        </label>
      </div>
    </div>
  );
}

export default Settings;
