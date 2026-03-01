interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div>
      <p style={{ color: "red" }}>{message}</p>
      <button className="button primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}