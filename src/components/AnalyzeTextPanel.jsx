import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import DescriptionOutlined from '@mui/icons-material/Description'
import SendOutlined from '@mui/icons-material/Send'

function AnalyzeTextPanel({ text, onTextChange, onClear, onAnalyze, isLoading, maxLength }) {
  const usedCharacters = text.length
  const isAtLimit = usedCharacters >= maxLength

  return (
    <Card sx={{ p: { xs: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <DescriptionOutlined sx={{ color: 'primary.main', fontSize: 22 }} />
        <Typography variant="h2" component="h2">
          Analyze Text
        </Typography>
      </Box>
      <Typography sx={{ mt: 0.75, mb: 2.5, fontSize: '0.8125rem', color: 'text.secondary' }}>
        Classify sentiment and emotion using a zero-shot LLM and compare the result with VADER.
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <TextField
          multiline
          fullWidth
          minRows={9}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Enter a review, message, feedback, or any text to analyze…"
          slotProps={{ htmlInput: { maxLength, 'aria-label': 'Text to analyze' } }}
          sx={{
            '& textarea': { resize: 'none', paddingBottom: '28px', lineHeight: 1.6 },
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 8,
            fontSize: '0.75rem',
            color: isAtLimit ? 'warning.main' : 'text.secondary',
            pointerEvents: 'none',
          }}
        >
          {usedCharacters} / {maxLength}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Button variant="outlined" color="inherit" onClick={onClear} sx={{ color: 'text.primary' }}>
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={onAnalyze}
          disabled={isLoading}
          sx={{ minWidth: 158 }}
          startIcon={
            isLoading ? <CircularProgress size={16} color="inherit" /> : <SendOutlined fontSize="small" />
          }
        >
          {isLoading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </Box>
    </Card>
  )
}

export default AnalyzeTextPanel
