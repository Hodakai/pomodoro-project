import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
    it('renders the Button component with correct label', () => {
        render(<Button/>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
    });
});
