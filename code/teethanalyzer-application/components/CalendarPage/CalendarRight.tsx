type Event = { id: string, description: string, type: string };

type Props = {
  events: Event[];
  selectedDateId: string | null;
  description: string;
  setDescription: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  onAddEvent: () => void;
};

export default function CalendarRight({
  events, selectedDateId, description, setDescription, type, setType, onAddEvent
}: Props) {
  return (
    <div className="bg-[#5da8eb] w-[520px] h-[680px] p-4 pb-8 relative text-white flex flex-col justify-between rounded-tr-lg rounded-br-lg translate-y-6">
      <div className="overflow-y-auto mb-4">
        <ul>
          {events
            .filter((e) => e.id === selectedDateId)
            .map((e, idx) => (
              <li key={idx} className="mb-2 animate-bounce">
                <span className="font-bold">{e.type}:</span> {e.description}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 p-2 rounded bg-[#60acf4] text-white outline-none"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded bg-[#48a4f4] text-white"
        >
          <option value="Social">Social</option>
          <option value="Work">Work</option>
        </select>
        
      </div>
    </div>
  );
}
