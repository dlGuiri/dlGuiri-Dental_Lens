import { useState, useEffect } from "react";
import CalendarLeft from "@/components/CalendarPage/CalendarLeft";
import CalendarRight from "@/components/CalendarPage/CalendarRight";

export default function Calendar() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const now = new Date();
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [events, setEvents] = useState<{ id: string, description: string, type: string }[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Social");

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const handleAddEvent = () => {
    if (selectedDateId) {
      setEvents([...events, { id: selectedDateId, description, type }]);
      setDescription("");
    }
  };

  const handleDateClick = (id: string) => {
    setSelectedDateId(id);
  };

  const handleNext = () => {
    if (monthIndex < 11) setMonthIndex(monthIndex + 1);
  };

  const handlePrev = () => {
    if (monthIndex > 0) setMonthIndex(monthIndex - 1);
  };

  const daysCount = daysInMonth(monthIndex, now.getFullYear());

  return (
    <div className="flex items-center justify-center">
      <div className="flex rounded-lg overflow-hidden">
        <CalendarLeft
          month={months[monthIndex]}
          daysCount={daysCount}
          monthIndex={monthIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          selectedDateId={selectedDateId}
          onDateClick={handleDateClick}
        />
        <CalendarRight
          events={events}
          selectedDateId={selectedDateId}
          description={description}
          setDescription={setDescription}
          type={type}
          setType={setType}
          onAddEvent={handleAddEvent}
        />
      </div>
    </div>
  );
}
