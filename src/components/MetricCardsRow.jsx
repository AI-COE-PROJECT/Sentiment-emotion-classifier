import { Box } from '@mui/material'
import GpsFixedOutlined from '@mui/icons-material/GpsFixed'
import TrendingUpOutlined from '@mui/icons-material/TrendingUp'
import AutorenewOutlined from '@mui/icons-material/Autorenew'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import MetricCard from './MetricCard'

function formatPercent(value) {
  return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '--'
}

function formatDecimal(value) {
  return typeof value === 'number' ? value.toFixed(2) : '--'
}

function MetricCardsRow({ metrics }) {
  const cards = [
    {
      key: 'accuracy',
      label: 'Accuracy',
      value: formatPercent(metrics?.accuracy),
      caption: 'Model performance (evaluation dataset)',
      accent: 'primary',
      icon: <GpsFixedOutlined fontSize="small" />,
    },
    {
      key: 'macroPrecision',
      label: 'Macro Precision',
      value: formatPercent(metrics?.macroPrecision),
      caption: 'Model performance (evaluation dataset)',
      accent: 'secondary',
      icon: <TrendingUpOutlined fontSize="small" />,
    },
    {
      key: 'confidence',
      label: 'Confidence Score',
      value: formatPercent(metrics?.confidence),
      caption: 'Model-reported (per prediction)',
      accent: 'success',
      icon: <AutorenewOutlined fontSize="small" />,
    },
    {
      key: 'compound',
      label: 'VADER Compound Score',
      value: formatDecimal(metrics?.compound),
      caption: 'Compound score (per prediction)',
      accent: 'warning',
      icon: <ShieldOutlined fontSize="small" />,
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {cards.map((card) => (
        <MetricCard
          key={card.key}
          icon={card.icon}
          accent={card.accent}
          label={card.label}
          value={card.value}
          caption={card.caption}
        />
      ))}
    </Box>
  )
}

export default MetricCardsRow
