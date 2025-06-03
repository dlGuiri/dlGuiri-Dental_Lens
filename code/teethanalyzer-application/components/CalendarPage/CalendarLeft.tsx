type Event = { id: string };

type Props = {
  month: string;
  daysCount: number;
  monthIndex: number;
  onNext: () => void;
  onPrev: () => void;
  selectedDateId: string | null;
  onDateClick: (id: string) => void;
  events: Event[];
};

export default function CalendarLeft({
  month,
  daysCount,
  monthIndex,
  onNext,
  onPrev,
  selectedDateId,
  onDateClick,
  events,
}: Props) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(new Date().getFullYear(), monthIndex, 1).getDay();

  return (
    <div className="bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#66acf4] 
      backdrop-blur-md bg-opacity-30 w-[750px] p-6 text-white h-[730px] rounded-tr-lg rounded-br-lg">
      <div className="flex justify-around mb-6">
        <button onClick={onPrev}>&lt;</button>
        <h1 className="text-lg">{month}</h1>
        <button onClick={onNext}>&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 mb-6">
        {days.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;
          const id = `${day}${monthIndex}`;
          const isSelected = selectedDateId === id;
          const hasEvent = events.some((e) => e.id === id);

          return (
            <div
              key={id}
              onClick={() => onDateClick(id)}
              className="aspect-square flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                    isSelected ? "bg-white text-blue-500" : "text-white"
                  }`}
                >
                  {day}
                </div>
                {hasEvent && <div className="w-3 h-1 rounded-full bg-white -mt-1"/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
