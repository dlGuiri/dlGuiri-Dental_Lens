type Props = {
  month: string;
  daysCount: number;
  monthIndex: number;
  onNext: () => void;
  onPrev: () => void;
  selectedDateId: string | null;
  onDateClick: (id: string) => void;
};

export default function CalendarLeft({
  month,
  daysCount,
  monthIndex,
  onNext,
  onPrev,
  selectedDateId,
  onDateClick,
}: Props) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(new Date().getFullYear(), monthIndex, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const adjustedFirstDay = new Date(new Date().getFullYear(), monthIndex, 1).getDay();

  return (
    <div className="bg-[#7bbcf7] w-[750px] p-6 text-white h-[730px] rounded-tr-lg rounded-br-lg">
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
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;         

          const id = `${day}${monthIndex}`;
          return (
            <div
              key={id}
              onClick={() => onDateClick(id)}
              className="aspect-square flex items-center justify-center"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                  selectedDateId === id
                    ? "bg-white text-blue-500"
                    : "text-white"
                }`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
