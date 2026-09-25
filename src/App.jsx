import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './theme/theme'
import AnalyzerPage from './pages/AnalyzerPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AnalyzerPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
