import React from 'react';
import { useDrag } from 'react-dnd';


const Event = ({ event, isWeekend, handleEditEvent }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'event',
        item: { id: event.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`text-xs flex flex-col justify-between items-start p-1 mb-1 rounded-lg shadow-md
          ${isWeekend ? 'bg-gray-600 text-white' : ''}
          ${!isWeekend && event.type === "Personal" ? 'bg-yellow-200 text-black' : ''}
          ${!isWeekend && event.type === "Work" ? 'bg-blue-400 text-black' : ''}
          ${!isWeekend && event.type === "Other" ? 'bg-orange-300 text-black' : ''}
          ${!isWeekend && event.type === "" ? 'bg-emerald-300 text-black' : ''}
          ${isDragging ? 'opacity-50' : ''}
        `}
            onClick={(e) => {
                e.stopPropagation();
                handleEditEvent(event);
            }}
        >
            <span className="font-bold">{event.name}</span>
            <span className="text-xs">{event.startTime} - {event.endTime}</span>
        </div>
    );
};

export default Event;