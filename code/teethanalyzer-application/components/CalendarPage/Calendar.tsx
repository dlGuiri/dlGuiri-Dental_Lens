import { useEffect, useState } from "react";
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
  const [events, setEvents] = useState<{ id: string, description: string, type: string, completed: boolean }[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Social");

  useEffect(() => {
    const today = new Date();
    const todayId = `${today.getDate()}${today.getMonth()}`;

    // Add default tasks for today if none exist
    setEvents((prevEvents) => {
      const existingEvents = prevEvents.filter((event) => event.id === todayId);
      if (existingEvents.length === 0) {
        return [
          ...prevEvents,
          { id: todayId, description: "Brush Teeth", type: "default", completed: false },
          { id: todayId, description: "Floss Teeth", type: "default", completed: false },
        ];
      }
      return prevEvents;
    });

    setSelectedDateId(todayId);
  }, []);


  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const handleAddEvent = () => {
    if (selectedDateId && description.trim()) {
      setEvents([
        ...events,
        {
          id: selectedDateId,
          description,
          type,
          completed: false,
        }
      ]);
      setDescription("");
    }
  };

  const handleToggleComplete = (index: number) => {
    const updated = [...events];
    updated[index].completed = !updated[index].completed;
    setEvents(updated);
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

  const handleDeleteTask = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1); // Remove task by index
    setEvents(updatedEvents);
  };

  const handleEditTask = (index: number, newDescription: string) => {
    const updatedEvents = [...events];
    updatedEvents[index].description = newDescription;
    setEvents(updatedEvents);
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
          events={events}
        />
        <CalendarRight
          events={events}
          selectedDateId={selectedDateId}
          description={description}
          setDescription={setDescription}
          type={type}
          setType={setType}
          onAddEvent={handleAddEvent}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </div>
    </div>
  );
}
