import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from "@/components/ui/header";

describe('Header', () => {
  it('check render of Header component', () => {
    render(<Header/>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})