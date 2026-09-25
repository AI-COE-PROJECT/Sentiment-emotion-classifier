import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Header from '../components/Header'
import MetricCardsRow from '../components/MetricCardsRow'
import AnalyzeTextPanel from '../components/AnalyzeTextPanel'
import ClassificationResultsPanel from '../components/ClassificationResultsPanel'
import AppFooter from '../components/AppFooter'
import { ApiError, classifyText, getHealth } from '../services/api'

const DEFAULT_MAX_INPUT_LENGTH = 2000
const HEALTH_POLL_INTERVAL_MS = 15000

function AnalyzerPage() {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastAnalyzedText, setLastAnalyzedText] = useState('')
  const [serviceInfo, setServiceInfo] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    let isActive = true

    const checkBackend = async () => {
      try {
        const health = await getHealth()
        if (!isActive) return
        setServiceInfo(health)
        setBackendStatus('connected')
      } catch {
        if (!isActive) return
        setBackendStatus('offline')
      }
    }

    checkBackend()
    const intervalId = setInterval(checkBackend, HEALTH_POLL_INTERVAL_MS)

    return () => {
      isActive = false
      clearInterval(intervalId)
    }
  }, [])

  const handleAnalyze = async () => {
    const trimmedText = text.trim()

    if (!trimmedText) {
      setErrorMessage('Input is empty. Enter some text before analyzing.')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage('')

    try {
      const classification = await classifyText(trimmedText)

      setResult(classification)
      setLastAnalyzedText(trimmedText)
      setText('')
      setBackendStatus('connected')
    } catch (error) {
      const isApiError = error instanceof ApiError
      setErrorMessage(
        isApiError ? error.message : 'Something went wrong while classifying the text.',
      )
      if (isApiError && error.status === 0) {
        setBackendStatus('offline')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => setText('')

  const maximumLength = serviceInfo?.max_input_length ?? DEFAULT_MAX_INPUT_LENGTH

  const metrics = {
    accuracy: result?.metrics?.accuracy ?? null,
    macroPrecision: result?.metrics?.macro_precision ?? null,
    confidence: result?.llm?.confidence ?? null,
    compound: result?.vader?.compound ?? null,
  }

  return (
    <>
      <Header backendStatus={backendStatus} serviceInfo={serviceInfo} />

      <Box
        component="main"
        sx={{ maxWidth: 1560, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}
      >
        <MetricCardsRow metrics={metrics} />

        <Box
          sx={{
            mt: 2.5,
            display: 'grid',
            gap: 2.5,
            alignItems: 'stretch',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 0.87fr) minmax(0, 1fr)' },
          }}
        >
          <AnalyzeTextPanel
            text={text}
            onTextChange={setText}
            onClear={handleClear}
            onAnalyze={handleAnalyze}
            isLoading={isAnalyzing}
            maxLength={maximumLength}
          />

          <ClassificationResultsPanel
            result={result}
            isLoading={isAnalyzing}
            errorMessage={errorMessage}
            lastAnalyzedText={lastAnalyzedText}
          />
        </Box>

        <AppFooter serviceInfo={serviceInfo} />
      </Box>
    </>
  )
}

export default AnalyzerPage
