 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import AddTransaction from '../AddTransaction';
import { ADD_TRANSACTION } from '../../graphql';
 
 
 
// Mock the useNavigate hook
 
jest.mock('react-router-dom', () => ({
 
  ...jest.requireActual('react-router-dom'),
 
  useNavigate: () => jest.fn(),
 
}));
 
// Mock localStorage
 
const mockLocalStorage = {
 
  getItem: jest.fn(() => 'mockUserId'),
 
};
 
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
 
const mocks = [
 
  {
 
    request: {
 
      query: ADD_TRANSACTION,
 
      variables: {
 
        userId: 'mockUserId',
 
        description: 'Test Transaction',
 
        amount: 100,
 
        type: 'income',
 
        date: expect.any(String),
 
      },
 
    },
 
    result: {
 
      data: {
 
        addTransaction: {
 
          id: '1',
 
          description: 'Test Transaction',
 
          amount: 100,
 
          type: 'income',
 
          date: '2024-08-05',
 
        },
 
      },
 
    },
 
  },
 
];
 
describe('AddTransaction', () => {
 
  it('renders and submits the form successfully', async () => {
 
    render(
 
      <MockedProvider mocks={mocks} addTypename={false}>
 
        <BrowserRouter>
 
          <AddTransaction />
 
        </BrowserRouter>
 
      </MockedProvider>
 
    );
 
    // Check if the component renders correctly
 
 
    // Fill out the form
 
    fireEvent.change(screen.getByPlaceholderText('Description'), {
 
      target: { value: 'Test Transaction' },
 
    });
 
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
 
      target: { value: '100' },
 
    });
 
    // Mock the confirm dialog
 
    window.confirm = jest.fn(() => true);
 
    // Submit the form
 
    fireEvent.click(screen.getByRole('button', { name: 'Add Transaction' }));
 
    // Wait for the success message
 
 
     
 
    ;
 
  });
 
});
 
 