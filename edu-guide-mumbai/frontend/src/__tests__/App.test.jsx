import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the API service
jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  // Add more tests as components are developed
});











