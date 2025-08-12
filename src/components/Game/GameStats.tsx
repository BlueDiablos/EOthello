import type { Player } from "../Types/Player";
import SvgCircle from "../App/SvgCircle";

interface Stats {
  players: [Player, Player];
}

function GameStats(stats: Stats) {
  return (
    <div
      style={{
        background: "#303030",
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        marginBottom: "10px",
        color: "#fff",
      }}
    >
      {stats.players.map((player, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {SvgCircle(player.colorPiece)}
            <div style={{ marginTop: "5px", fontWeight: "bold" }}>
              {player.pieceCount}
            </div>
          </div>

          {player.hasTurn && (
            <div
              style={{
                marginTop: "10px",
                background: "#3498db",
                padding: "4px 8px",
                borderRadius: "4px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "0.9em",
              }}
            >
              {player.colorPiece}'s turn
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GameStats;
