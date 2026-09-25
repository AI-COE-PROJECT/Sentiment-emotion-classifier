import { Alert, Box, Card, CircularProgress, LinearProgress, Typography } from '@mui/material'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesome'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircle'
import SectionBox from './SectionBox'
import ModelExplanationPanel from './ModelExplanationPanel'
import VaderComparisonPanel from './VaderComparisonPanel'
import { tokens } from '../theme/theme'

function ResultField({ label, children }) {
  return (
    <Box sx={{ p: 2, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.75 }}>{children}</Box>
    </Box>
  )
}

function ResultValue({ value }) {
  return (
    <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
      {value}
    </Typography>
  )
}

function StateMessage({ isLoading, errorMessage, hasResult, lastAnalyzedText }) {
  const messageBoxSx = { p: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }

  if (isLoading) {
    return (
      <SectionBox
        sx={{ ...messageBoxSx, backgroundColor: tokens.infoBackground, borderColor: tokens.infoBorder }}
      >
        <CircularProgress size={18} thickness={5} />
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Analyzing text…
        </Typography>
      </SectionBox>
    )
  }

  if (errorMessage) {
    return (
      <Alert severity="error" variant="outlined">
        {errorMessage}
      </Alert>
    )
  }

  if (hasResult) {
    const preview =
      lastAnalyzedText.length > 64 ? `${lastAnalyzedText.slice(0, 64).trimEnd()}…` : lastAnalyzedText
    return (
      <SectionBox sx={{ ...messageBoxSx, backgroundColor: tokens.tintGreen, borderColor: '#cbeeda' }}>
        <CheckCircleOutlined sx={{ fontSize: 20, color: 'success.main' }} />
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Analyzed &ldquo;{preview}&rdquo; &middot; {lastAnalyzedText.length} characters
        </Typography>
      </SectionBox>
    )
  }

  return (
    <SectionBox
      sx={{ ...messageBoxSx, backgroundColor: tokens.infoBackground, borderColor: tokens.infoBorder }}
    >
      <InfoOutlined sx={{ fontSize: 20, color: 'primary.main' }} />
      <Typography sx={{ fontSize: '0.875rem' }}>
        Enter text and click <Box component="strong" sx={{ fontWeight: 600 }}>Analyze</Box> to see
        the results here.
      </Typography>
    </SectionBox>
  )
}

function ClassificationResultsPanel({ result, isLoading, errorMessage, lastAnalyzedText }) {
  const llm = result?.llm ?? null
  const vader = result?.vader ?? null
  const hasResult = Boolean(result)
  const confidence = typeof llm?.confidence === 'number' ? llm.confidence : null
  const confidencePercent = confidence === null ? 0 : Math.round(confidence * 100)

  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <AutoAwesomeOutlined sx={{ color: 'primary.main', fontSize: 22 }} />
        <Typography variant="h2" component="h2">
          Classification Results
        </Typography>
      </Box>

      <SectionBox
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          '& > * + *': {
            borderTop: { xs: '1px solid', sm: 'none' },
            borderLeft: { xs: 'none', sm: '1px solid' },
            borderColor: 'divider',
          },
        }}
      >
        <ResultField label="Sentiment">
          <ResultValue value={llm?.sentiment ?? '--'} />
        </ResultField>

        <ResultField label="Emotion">
          <ResultValue value={llm?.emotion ?? '--'} />
        </ResultField>

        <ResultField label="Confidence Level">
          <ResultValue value={confidence === null ? '--' : `${confidencePercent}%`} />
          <LinearProgress
            variant="determinate"
            value={confidencePercent}
            aria-label="Confidence level"
            sx={{ mt: 1 }}
          />
        </ResultField>
      </SectionBox>

      <StateMessage
        isLoading={isLoading}
        errorMessage={errorMessage}
        hasResult={hasResult}
        lastAnalyzedText={lastAnalyzedText}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <ModelExplanationPanel
          explanation={llm?.reasoning}
          isLoading={isLoading}
          hasResult={hasResult}
        />
        <VaderComparisonPanel vader={vader} llm={llm} hasResult={hasResult} />
      </Box>
    </Card>
  )
}

export default ClassificationResultsPanel
