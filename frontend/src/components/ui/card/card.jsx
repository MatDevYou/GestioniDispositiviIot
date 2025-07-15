export function Card({ children }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={className} style={{ padding: '10px' }}>
      {children}
    </div>
  );
}
