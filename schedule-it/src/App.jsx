import { DndProvider } from 'react-dnd'
import './App.css'
import Calendar from './components/calendar/Calendar'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Calendar />
      </DndProvider>
    </div>
  )
}

export default App
