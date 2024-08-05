import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditTransaction from '../EditTransaction';
import { GET_TRANSACTION_BY_ID } from '../../graphql';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mockUserId'),
  },
  writable: true,
});

const mocks = [
  {
    request: {
      query: GET_TRANSACTION_BY_ID,
      variables: { id: '1' },
    },
    result: {
      data: {
        transaction: {
          id: '1',
          description: 'Test Transaction',
          amount: 100,
          type: 'income',
          date: '2024-08-04',
        },
      },
    },
  },
];

describe('EditTransaction Component', () => {
  const renderComponent = () =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/edit/1']}>
          <Routes>
            <Route path="/edit/:id" element={<EditTransaction />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

  it('renders the component and loads transaction data', async () => {
    renderComponent();
    
    // Wait for the header to be rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Transaction', level: 1 })).toBeInTheDocument();
    });

    // Wait for the form to be populated with data
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Transaction')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    // Check for the form heading
    expect(screen.getByRole('heading', { name: 'Edit Transaction', level: 2 })).toBeInTheDocument();

    // Check for the update button
    expect(screen.getByRole('button', { name: 'Update Transaction' })).toBeInTheDocument();
  });
});