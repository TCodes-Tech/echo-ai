import "./Orb.css";

function Orb({ state, onClick }) {
  return (
    <div 
      className={`orb-container ${state}`}
      onClick={onClick}
      title="Click to speak to Echo"
    >
      <div className="orb">
        <div className="orb-inner"></div>
        <div className="orb-glow"></div>
      </div>
    </div>
  );
}

export default Orb;