import { Box, Card, Typography } from '@mui/material'
import { tokens } from '../theme/theme'

const ACCENTS = {
  primary: { main: tokens.accentPrimary, tint: tokens.tintPrimary },
  secondary: { main: tokens.accentPurple, tint: tokens.tintPurple },
  success: { main: tokens.accentGreen, tint: tokens.tintGreen },
  warning: { main: tokens.accentAmber, tint: tokens.tintAmber },
}

function MetricCard({ icon, accent = 'primary', label, value, caption }) {
  const colors = ACCENTS[accent] ?? ACCENTS.primary

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, p: 2.25 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: colors.tint,
            color: colors.main,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</Typography>
          <Typography
            sx={{ fontSize: '1.625rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}
          >
            {value}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{caption}</Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default MetricCard
