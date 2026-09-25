import { Box } from '@mui/material'

function SectionBox({ children, sx }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default SectionBox
