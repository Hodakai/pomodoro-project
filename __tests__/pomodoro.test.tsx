// src/__tests__/Pomodoro.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Pomodoro from "@/components/pomodoro";
import '@testing-library/jest-dom'

jest.mock('../src/__mocks__/page');

beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'clearInterval');
});

afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
});

test('renders the pomodoro timer correctly', () => {
    render(<Pomodoro history={[]} callback={() => {}} />);

    const timerDisplay = screen.getByText(/Working/i);
    const timeRemainingDisplay = screen.getByText(/10:00|15:00|25:00|45:00/i);
    const startButton = screen.getByRole('button', { name: /Start/i });

    expect(timerDisplay).toBeInTheDocument();
    expect(timeRemainingDisplay).toBeInTheDocument();
    expect(startButton).toBeInTheDocument();
});

test('starts the timer on button click', () => {
    render(<Pomodoro history={[]} callback={() => {}} />);

    const startButton = screen.getByRole('button', { name: /Start/i });
    fireEvent.click(startButton);

    expect(clearInterval).not.toHaveBeenCalled();

    act(() => {
        jest.advanceTimersByTime(1000);
    });

    expect(clearInterval).toHaveBeenCalledTimes(1);
});