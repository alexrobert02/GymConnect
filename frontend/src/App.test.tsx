import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './services/router';

test('renders learn react link', () => {
  //render(<rou />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
