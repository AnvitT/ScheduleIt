import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isEventOverlapping } from '@/lib/calendarHelpers'

export const useEventManager = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const getEvents = useCallback(() => {
        return JSON.parse(localStorage.getItem('events') || '[]')
    }, [])

    const getSortedEvents = useCallback(() => {
        const sorted = [...getEvents()].sort((a, b) => {
            const dateA = new Date(a.year + " " + a.month + " " + a.date + " " + a.startTime)
            const dateB = new Date(b.year + " " + b.month + " " + b.date + " " + b.startTime)
            return dateA - dateB
        })
        return sorted
    }, [getEvents])

    const filteredEvents = useCallback(() => {
      return getSortedEvents().filter(event =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.date && event.date.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.startTime && event.startTime.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.endTime && event.endTime.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [getSortedEvents, searchQuery]);

    const saveEvent = useCallback((eventData, editingEvent = null) => {
        const events = getEvents()

        // Validation checks
        if (!eventData.name || !eventData.startTime || !eventData.endTime) {
            return { success: false, message: 'Name, Start Time and End Time are required' }
        }

        // Check for overlapping events
        if (isEventOverlapping(events, eventData, editingEvent)) {
            return { success: false, message: 'Event overlaps with another existing event.' }
        }

        // If editing an existing event
        if (editingEvent) {
            const updatedEvents = events.map(event =>
                event.id === editingEvent.id
                    ? { ...event, ...eventData }
                    : event
            )
            localStorage.setItem('events', JSON.stringify(updatedEvents))
        } else {
            // Adding a new event
            const newEvent = {
                ...eventData,
                id: uuidv4()
            }
            events.push(newEvent)
            localStorage.setItem('events', JSON.stringify(events))
        }

        return { success: true }
    }, [getEvents])

    const deleteEvent = useCallback((eventId) => {
        const events = getEvents()
        const updatedEvents = events.filter(event => event.id !== eventId)
        localStorage.setItem('events', JSON.stringify(updatedEvents))
    }, [getEvents])

    return {
        getEvents,
        getSortedEvents,
        filteredEvents,
        saveEvent,
        deleteEvent,
        searchQuery,
        setSearchQuery
    }
}