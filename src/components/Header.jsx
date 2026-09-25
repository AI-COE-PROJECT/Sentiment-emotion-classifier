import { useState } from 'react'
import { Box, Divider, IconButton, Menu, Tooltip, Typography } from '@mui/material'
import ForumOutlined from '@mui/icons-material/Forum'
import SettingsOutlined from '@mui/icons-material/Settings'
import WbSunnyOutlined from '@mui/icons-material/WbSunny'
import { API_BASE_URL } from '../services/api'

const STATUS_STYLES = {
  connected: { dot: '#16a34a', label: 'Backend Connected', color: '#15803d', background: '#e9f9f0', border: '#cbeeda' },
  offline: { dot: '#dc2626', label: 'Backend Offline', color: '#b91c1c', background: '#fdecec', border: '#f7d2d2' },
  checking: { dot: '#94a3b8', label: 'Checking backend…', color: '#475569', background: '#f1f5f9', border: '#e2e8f0' },
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, py: 0.5 }}>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Box>
  )
}

function Header({ backendStatus = 'checking', serviceInfo }) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const status = STATUS_STYLES[backendStatus] ?? STATUS_STYLES.checking
  const isMenuOpen = Boolean(menuAnchor)

  return (
    <Box
      component="header"
      sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Box
        sx={{
          maxWidth: 1560,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              border: '1px solid #dbe6ff',
              backgroundColor: '#eef4ff',
              color: 'primary.main',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <ForumOutlined fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h1" component="h1" sx={{ lineHeight: 1.2 }}>
              SentimentLab
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              Zero-Shot Sentiment &amp; Emotion Classifier
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.6,
              borderRadius: 999,
              backgroundColor: status.background,
              border: `1px solid ${status.border}`,
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: status.dot }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: status.color }}>
              {status.label}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              backgroundColor: '#eef4ff',
              border: '1px solid #dbe6ff',
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'primary.main' }}>
              FastAPI
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

          <Tooltip title="Service details">
            <IconButton
              aria-label="Service details"
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              <SettingsOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Light theme (default)">
            <Box component="span">
              <IconButton
                aria-label="Theme: light"
                disabled
                sx={{ '&.Mui-disabled': { color: 'text.secondary' } }}
              >
                <WbSunnyOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={isMenuOpen}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1, minWidth: 288 }}>
              <Typography
                sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}
              >
                SERVICE DETAILS
              </Typography>
              <InfoRow label="API base URL" value={API_BASE_URL} />
              <InfoRow label="Model" value={serviceInfo?.model ?? 'Gemini'} />
              <InfoRow label="Mode" value={serviceInfo?.mode ?? 'Zero-shot'} />
              <InfoRow label="Baseline" value={serviceInfo?.baseline ?? 'VADER'} />
              <InfoRow label="Input language" value={serviceInfo?.input_language ?? 'English'} />
              <InfoRow
                label="Max input length"
                value={`${serviceInfo?.max_input_length ?? 2000} characters`}
              />
              <InfoRow
                label="Pipeline"
                value={
                  serviceInfo?.pipeline === 'live'
                    ? 'Live processing layer'
                    : 'Temporary mock classifications'
                }
              />
            </Box>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
