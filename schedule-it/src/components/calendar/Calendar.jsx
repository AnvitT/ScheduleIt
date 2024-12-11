import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('10:00')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [editingEvent, setEditingEvent] = useState(null)
    const [EventId, setEventId] = useState(null)
    const [searchQuery, setSearchQuery] = useState('');

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const getEvents = () => {
        return JSON.parse(localStorage.getItem('events') || '[]')
    }

    const getSortedEvents = () => {
        return getEvents().sort((a, b) => {
            if (a.date === b.date) {
                return a.startTime.localeCompare(b.startTime)
            }
            return a.date - b.date
        })
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEvents = getSortedEvents().filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddEvent = (day) => {
        setSelectedDay(day)
        setStartTime('09:00')
        setEndTime('10:00')
        setIsSaveDialogOpen(true)
        setErrorMessage('')
        setName('')
        setDescription('')
        setEditingEvent(null)
    }

    const handleEditEvent = (event) => {
        setEditingEvent(event)
        setSelectedDay(event.date)
        setName(event.name)
        setStartTime(event.startTime)
        setEndTime(event.endTime)
        setDescription(event.description || '')
        setIsEditDialogOpen(true)
        setErrorMessage('')
        setEventId(event.id)
    }

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                times.push(<SelectItem key={time} value={time}>{time}</SelectItem>);
            }
        }
        return times;
    };

    const handleStartTimeChange = (time) => {
        setStartTime(time)
        if (time >= endTime) {
            setEndTime(time)
        }
    }

    const handleEndTimeChange = (time) => {
        if (time > startTime) {
            setEndTime(time)
        }
    }

    const saveEvent = () => {
        const events = getEvents()

        // Validation
        if (!name || !startTime || !endTime) {
            setErrorMessage('Name, Start Time and End Time are required')
            return
        }

        // Check for duplicate events
        const eventExists = events.some(event =>
            event.date === selectedDay &&
            event.startTime === startTime &&
            event.endTime === endTime &&
            event.name === name &&
            event.description === description
        )

        // Check for overlapping events
        const checkOverlapping = events.some(event =>
            event.date === selectedDay &&
            ((startTime >= event.startTime && startTime < event.endTime) ||
                (endTime > event.startTime && endTime <= event.endTime))
        )


        // If editing an existing event
        if (editingEvent) {
            const updatedEvents = events.map(event =>
                event.id === editingEvent.id
                    ? { ...event, name, startTime, endTime, description }
                    : event
            )
            localStorage.setItem('events', JSON.stringify(updatedEvents))
            setIsEditDialogOpen(false)
        } else {
            // Adding a new event
            if (eventExists) {
                setErrorMessage('Event already exists.')
                return
            }

            if (checkOverlapping) {
                setErrorMessage('Event overlaps with another event.')
                return
            }
            const newEvent = {
                id: uuidv4(),
                name,
                startTime,
                endTime,
                description,
                date: selectedDay,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear()
            }
            events.push(newEvent)
            localStorage.setItem('events', JSON.stringify(events))
            setIsSaveDialogOpen(false)
        }

        // Reset form
        setErrorMessage('')
        setName('')
        setDescription('')
        setStartTime('09:00')
        setEndTime('10:00')
    }

    const deleteEvent = (eventId) => {
        const events = getEvents()
        const updatedEvents = events.filter(event => event.id !== eventId)
        localStorage.setItem('events', JSON.stringify(updatedEvents))
        setIsEditDialogOpen(false)
    }

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDayOfMonth = getFirstDayOfMonth(currentDate)
        const days = []
        const events = getEvents()

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
        }

        for (let i = 1; i <= daysInMonth; i++) {
            // Determine the day of the week for this date
            const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).getDay()
            const isWeekend = currentDay === 0 || currentDay === 6
            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

            const dayEvents = events.filter(event =>
                event.date === i &&
                event.month === currentDate.getMonth() &&
                event.year === currentDate.getFullYear()
            )

            days.push(
                <div
                    key={i}
                    className={`h-24 p-2 flex flex-col items-start justify-start border rounded shadow hover:bg-opacity-90 transition-colors cursor-pointer 
                        ${isWeekend
                            ? 'bg-gray-100 border-gray-300'
                            : 'bg-blue-50 border-blue-200'}
                        ${isToday
                            ? 'bg-blue-200 border-blue-300' : ''}
                        `}
                    onClick={() => handleAddEvent(i)}
                >
                    <span className={`text-sm font-semibold mb-1 ${isWeekend
                        ? 'text-gray-600'
                        : 'text-blue-800'}`}
                    >
                        {i}
                    </span>
                    <div className="flex-grow overflow-auto w-full">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                className={`text-xs flex flex-col justify-between items-start p-1 mb-1 rounded-lg shadow-md
                                    ${isWeekend
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-blue-900 text-white'}`
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEvent(event);
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <div className="flex space-x-2">
                <Sheet>
                        <SheetTrigger asChild>
                            <Button>
                                Events
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="h-full flex flex-col [&>button]:bg-inherit">
                            <SheetHeader>
                                <SheetTitle>All Events</SheetTitle>
                                <Input
                                    type="text"
                                    placeholder="Search events"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                />
                            </SheetHeader>
                            <div className="overflow-y-auto flex-grow">
                                {filteredEvents.map(event => (
                                    <div key={event.id} className="p-2 border-b border-gray-200">
                                        <div className="font-semibold">{event.name}</div>
                                        <div>{event.date} {MONTHS[event.month]} {event.year}</div>
                                        <div>{event.startTime} - {event.endTime}</div>
                                        <div>{event.description}</div>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
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

            {/* Save Event Dialog */}
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                        <DialogDescription>
                            {`${selectedDay} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-time" className="text-right">
                                Start Time
                            </Label>
                            <Select value={startTime} onValueChange={handleStartTimeChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a start time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {generateTimeOptions()}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end-time" className="text-right">
                                End Time
                            </Label>
                            <Select value={endTime} onValueChange={handleEndTimeChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an end time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {generateTimeOptions()}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
                        <Button onClick={saveEvent}>
                            Add
                        </Button>
                        <Button onClick={() => setIsSaveDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            {`${selectedDay} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-time" className="text-right">
                                Start Time
                            </Label>
                            <Select value={startTime} onValueChange={handleStartTimeChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a start time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {generateTimeOptions()}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end-time" className="text-right">
                                End Time
                            </Label>
                            <Select value={endTime} onValueChange={handleEndTimeChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an end time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {generateTimeOptions()}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
                        <Button className="bg-red-600" onClick={() => deleteEvent(EventId)}>
                            Delete
                        </Button>
                        <Button onClick={saveEvent}>
                            Save
                        </Button>
                        <Button onClick={() => setIsEditDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default Calendar