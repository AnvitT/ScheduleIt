export const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            times.push(time);
        }
    }
    return times;
}

export const isEventOverlapping = (events, newEvent, editingEvent = null) => {
    return events.some(event =>
        event.date === newEvent.date &&
        event.month === newEvent.month &&
        event.year === newEvent.year &&
        !(newEvent.endTime < event.startTime || newEvent.startTime > event.endTime) &&
        (!editingEvent || event.id !== editingEvent.id)
    )
}