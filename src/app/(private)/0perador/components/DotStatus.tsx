interface DotStatusProps {
  type?: "green" | "yellow" | "gray" | "red" | "blue";
  animate?: boolean;
}

export function DotStatus({ type = "green", animate }: DotStatusProps) {
  const colorSelect = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
  };

  return (
    <div className="relative w-3 h-3 inline-block mr-2">
      <div
        className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-1/2 rounded-full ${colorSelect[type]}`}
      ></div>
      {animate && (
        <div
          className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-1/2 rounded-full ${colorSelect[type]} 
        animate-ping
        `}
        ></div>
      )}
    </div>
  );
}
