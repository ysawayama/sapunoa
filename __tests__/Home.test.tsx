import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByText('Sapunoa')
    expect(heading).toBeInTheDocument()
  })
  
  it('renders the subtitle', () => {
    render(<HomePage />)
    
    const subtitle = screen.getByText(/あなたの健康データに基づいた/)
    expect(subtitle).toBeInTheDocument()
  })
  
  it('renders the CTA buttons', () => {
    render(<HomePage />)
    
    const startButton = screen.getByText('今すぐ始める')
    const learnMoreButton = screen.getByText('詳しく見る')
    
    expect(startButton).toBeInTheDocument()
    expect(learnMoreButton).toBeInTheDocument()
  })
})