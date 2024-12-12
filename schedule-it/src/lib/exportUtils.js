export const exportToJson = (events, fileName, month, year) => {
    const filteredEvents = events.filter(event => event.month === month && event.year === year);
    filteredEvents.forEach(event => event.month += 1);
    const json = JSON.stringify(filteredEvents, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const exportToCsv = (events, fileName, month, year) => {
    const filteredEvents = events.filter(event => event.month === month && event.year === year);
    filteredEvents.forEach(event => event.month += 1);
    const csvRows = [
        ['ID', 'Name', 'Type', 'Start Time', 'End Time', 'Description', 'Date', 'Month', 'Year'],
        ...filteredEvents.map(event => [
            event.id,
            event.name,
            event.type,
            event.startTime,
            event.endTime,
            event.description,
            event.date,
            event.month,
            event.year,
        ])
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};