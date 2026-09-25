import { Box, Divider, Typography } from '@mui/material'
import BalanceOutlined from '@mui/icons-material/Balance'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import SectionBox from './SectionBox'

function ComparisonField({ label, value, valueColor }) {
  return (
    <Box sx={{ px: 0.5, py: 0.25 }}>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: '1rem', fontWeight: 700, color: valueColor ?? 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}

function VaderComparisonPanel({ vader, llm, hasResult }) {
  const vaderSentiment = vader?.sentiment ?? '--'
  const compound =
    hasResult && typeof vader?.compound === 'number' ? vader.compound.toFixed(2) : '--'

  const agrees =
    hasResult && llm?.sentiment && vader?.sentiment ? llm.sentiment === vader.sentiment : null
  const agreementLabel = agrees === null ? '--' : agrees ? 'Agreement' : 'Disagreement'
  const agreementColor = agrees === null ? 'text.primary' : agrees ? 'success.main' : 'warning.main'

  return (
    <SectionBox sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BalanceOutlined sx={{ fontSize: 18, color: 'text.primary' }} />
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>VADER Comparison</Typography>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          '& > * + *': { borderLeft: '1px solid', borderColor: 'divider', pl: 2 },
        }}
      >
        <ComparisonField label="VADER Sentiment" value={vaderSentiment} />
        <ComparisonField label="Compound Score" value={compound} />
      </Box>

      <Divider sx={{ my: 1.75 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.secondary' }}>
          Agreement
        </Typography>
      </Box>
      <Typography sx={{ mt: 0.5, fontSize: '0.9375rem', fontWeight: 700, color: agreementColor }}>
        {agreementLabel}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        LLM and VADER agreement status
      </Typography>
    </SectionBox>
  )
}

export default VaderComparisonPanel
