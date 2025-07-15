export function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
