import { render, screen } from '@testing-library/react';
import Dashboard from './index';

describe('Dashboard component', () => {
  it('renders correct heading', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading').textContent).toMatch(/Dashboard/i);
  });
});
