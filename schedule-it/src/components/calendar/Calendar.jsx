import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DAYS } from '@/lib/constants'
import { getDaysInMonth, getFirstDayOfMonth } from '@/lib/calendarHelpers'
import { useEventManager } from '@/hooks/useEventManager'
import CalendarHeader from './CalendarHeader'
import EventDialog from './EventDialog'

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)

    const {
        getEvents,
        filteredEvents,
        saveEvent,
        deleteEvent,
        searchQuery,
        setSearchQuery
    } = useEventManager()

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const handleAddEvent = (day) => {
        setSelectedDay(day)
        setIsAddDialogOpen(true)
    }

    const handleEditEvent = (event) => {
        setSelectedDay(event.date)
        setEditingEvent(event)
        setIsEditDialogOpen(true)
    }

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDayOfMonth = getFirstDayOfMonth(currentDate)
        const days = []
        const events = getEvents()

        // Render empty days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
        }

        // Render days of the month
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
                <div
                    key={i}
                    className={`h-24 p-2 flex flex-col items-start justify-start border rounded shadow hover:bg-opacity-90 transition-colors cursor-pointer
                        ${isWeekend ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}
                        ${isToday ? 'bg-blue-200 border-blue-600  border-2' : ''}`}
                    onClick={() => handleAddEvent(i)}
                >
                    <span className={`text-sm font-semibold mb-1 ${isWeekend ? 'text-gray-600' : 'text-blue-800'}`}>
                        {i}
                    </span>
                    <div className="flex-grow overflow-auto w-full">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                className={`text-xs flex flex-col justify-between items-start p-1 mb-1 rounded-lg shadow-md
                                    ${isWeekend ? 'bg-gray-600 text-white' : ''}
                                    ${(!isWeekend && event.type === "Personal") ? 'bg-yellow-200 text-black' : ''}
                                    ${(!isWeekend && event.type === "Work") ? 'bg-blue-400 text-black' : ''}
                                    ${(!isWeekend && event.type === "Other") ? 'bg-orange-300 text-black' : ''}  
                                    `
                                }
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditEvent(event)
                                }}
                            >
                                <span className="font-bold">{event.name}</span>
                                <span className="text-xs">{event.startTime} - {event.endTime}</span>
                            </div>
                        ))}
                    </div>
                </div>
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

            {/* Add Event Dialog */}
            <EventDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                currentDate={currentDate}
                selectedDay={selectedDay}
                onSave={saveEvent}
            />

            {/* Edit Event Dialog */}
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