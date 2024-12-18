import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { DAYS } from '@/lib/constants'
import { getDaysInMonth, getFirstDayOfMonth, isEventOverlapping } from '@/lib/calendarHelpers'
import { useEventManager } from '@/hooks/useEventManager'
import CalendarHeader from './CalendarHeader'
import EventDialog from './EventDialog'
import DayCell from './DayCell'

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [events, setEvents] = useState([]);

    const {
        getEvents,
        filteredEvents,
        saveEvent,
        deleteEvent,
        searchQuery,
        setSearchQuery
    } = useEventManager()

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        setCurrentDate(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        setCurrentDate(newDate)
    }

    const handleAddEvent = (day) => {
        setSelectedDay(day)
        setIsAddDialogOpen(true)
    }

    const handleEditEvent = (event) => {
        setSelectedDay(event.date)
        setEditingEvent({...event})
        setIsEditDialogOpen(true)
    }

    const handleDropEvent = (item, day) => {
        const events = getEvents();
        const event = events.find(event => event.id === item.id);
        if (event) {
            // Update the event's date
            const updatedEvent = {
                ...event,
                date: day,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear()
            };
    
            // Check for overlapping with the updated event
            if (isEventOverlapping(events, updatedEvent)) {
                alert('Event overlaps with another existing event.');
            } else {
                deleteEvent(event.id);
                saveEvent(updatedEvent);
                setEvents(getEvents());
            }
        }
    };

    useEffect(() => {
        setEvents(getEvents());
    }, [getEvents]);

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDayOfMonth = getFirstDayOfMonth(currentDate)
        const days = []
        const events = getEvents()
    
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
        }
    
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).getDay()
            const isWeekend = currentDay === 0 || currentDay === 6
            const isToday = i === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
    
            const dayEvents = events.filter(event =>
                event.date === i &&
                event.month === currentDate.getMonth() &&
                event.year === currentDate.getFullYear()
            )
    
            days.push(
                <DayCell
                    key={i}
                    day={i}
                    isWeekend={isWeekend}
                    isToday={isToday}
                    dayEvents={dayEvents}
                    handleAddEvent={handleAddEvent}
                    handleEditEvent={handleEditEvent}
                    handleDropEvent={handleDropEvent}
                />
            )
        }
        return days
    }
    
    return (
        <Card className="w-full h-full flex flex-col p-4">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                filteredEvents={filteredEvents()}
            />

            <div className="grid-cols-7 gap-2 mb-2 hidden lg:grid">
                {DAYS.map(day => (
                    <div key={day} className="text-center font-semibold">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 flex-grow xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                {renderCalendarDays()}
            </div>

            <EventDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                currentDate={currentDate}
                selectedDay={selectedDay}
                onSave={saveEvent}
            />

            {editingEvent && (
                <EventDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    currentDate={currentDate}
                    selectedDay={selectedDay}
                    initialData={editingEvent}
                    onSave={saveEvent}
                    onDelete={deleteEvent}
                    isEditMode={true}
                />
            )}
        </Card>
    )
}

export default Calendar
