import { Box, Typography } from '@mui/material'
import DescriptionOutlined from '@mui/icons-material/Description'
import SectionBox from './SectionBox'

function ModelExplanationPanel({ explanation, isLoading, hasResult }) {
  const placeholder = 'Explanation will appear here after analysis.'
  const body =
    isLoading && !hasResult ? 'Analyzing…' : hasResult && explanation ? explanation : placeholder

  return (
    <SectionBox sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionOutlined sx={{ fontSize: 18, color: 'text.primary' }} />
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>Model Explanation</Typography>
      </Box>

      <Typography
        sx={{
          mt: 1.75,
          fontSize: '0.875rem',
          color: hasResult && explanation ? 'text.primary' : 'text.secondary',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}
      >
        {body}
      </Typography>
    </SectionBox>
  )
}

export default ModelExplanationPanel
