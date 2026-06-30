export function Toast({ message, variant = "success" }: { message: string; variant?: "success" | "danger" | "info" }) {
  if (!message) return null;
  return <div className={`feedback-popup feedback-popup--${variant} feedback-popup--visible`}>{message}</div>;
}
