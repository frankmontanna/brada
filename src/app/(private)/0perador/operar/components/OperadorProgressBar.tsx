interface OperadorProgressBarProps {
  active?: boolean;
}
export function OperadorProgressBar({
  active = false,
}: OperadorProgressBarProps) {
  return (
    <div
      className={`w-1 self-stretch ${
        active === true ? "bg-green-400" : "bg-neutral-500"
      } `}
    ></div>
  );
}
