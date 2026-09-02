export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '0.9375rem',
        letterSpacing: '0.16em',
      }}
    >
      SOLBAUTEC
    </span>
  );
}
