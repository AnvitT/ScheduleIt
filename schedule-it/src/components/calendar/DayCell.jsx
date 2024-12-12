import { useDrop } from 'react-dnd'
import Event from './Event'

function DayCell({ day, isWeekend, isToday, dayEvents, handleAddEvent, handleEditEvent, handleDropEvent }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'event',
        drop: (item) => handleDropEvent(item, day),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    return (
        <div
            ref={drop}
            className={`h-24 p-2 flex flex-col items-start justify-start border rounded shadow hover:bg-opacity-90 transition-colors cursor-pointer
                ${isWeekend ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}
                ${isToday ? 'bg-blue-200 border-blue-600 border-2' : ''}
                ${isOver ? 'bg-green-200' : ''}`}
            onClick={() => handleAddEvent(day)}
        >
            <span className={`text-sm font-semibold mb-1 ${isWeekend ? 'text-gray-600' : 'text-blue-800'}`}>
                {day}
            </span>
            <div className="flex-grow overflow-auto w-full">
                {dayEvents.map(event => (
                    <Event
                        key={event.id}
                        event={event}
                        isWeekend={isWeekend}
                        handleEditEvent={handleEditEvent}
                    />
                ))}
            </div>
        </div>
    )
}

export default DayCell
