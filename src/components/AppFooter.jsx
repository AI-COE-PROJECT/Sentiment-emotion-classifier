import { Box, Card, Divider, Typography } from '@mui/material'
import BoltOutlined from '@mui/icons-material/Bolt'

function FooterItem({ label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{label}:</Typography>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{value}</Typography>
    </Box>
  )
}

function AppFooter({ serviceInfo }) {
  return (
    <Card
      sx={{
        mt: 2.5,
        px: { xs: 2, md: 2.5 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <BoltOutlined sx={{ fontSize: 18, color: 'text.primary' }} />
        <FooterItem label="Model" value={serviceInfo?.model ?? 'Gemini'} />
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <FooterItem label="Mode" value={serviceInfo?.mode ?? 'Zero-shot'} />
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <FooterItem label="Baseline" value={serviceInfo?.baseline ?? 'VADER'} />
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <FooterItem label="Input" value={serviceInfo?.input_language ?? 'English'} />
      </Box>

      <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
        * Accuracy and other metrics are from the evaluation dataset, not individual predictions.
      </Typography>
    </Card>
  )
}

export default AppFooter
