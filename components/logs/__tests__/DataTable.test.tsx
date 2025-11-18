import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTable } from '@/components/logs/DataTable';
import { Log } from '@/lib/logs';

const mockLogs: Log[] = [
  {
    id: 1,
    timestamp: '2024-01-01T10:00:00Z',
    action: 'CREATE_USER',
    userId: 1,
    username: 'admin',
    userEmail: 'admin@example.com',
    details: 'Created new user',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    resourceType: 'USER',
    resourceId: 123,
    status: 'SUCCESS',
    errorMessage: '',
    executionTimeMs: 150
  },
  {
    id: 2,
    timestamp: '2024-01-01T11:00:00Z',
    action: 'DELETE_USER',
    userId: 1,
    username: 'admin',
    userEmail: 'admin@example.com',
    details: 'Deleted user',
    ipAddress: '192.168.1.2',
    userAgent: 'Chrome/91.0',
    resourceType: 'USER',
    resourceId: 456,
    status: 'FAILURE',
    errorMessage: 'User not found',
    executionTimeMs: 200
  }
];

describe('DataTable', () => {
  const mockOnLogClick = jest.fn();

  beforeEach(() => {
    mockOnLogClick.mockClear();
  });

  it('renders loading state', () => {
    render(<DataTable logs={[]} loading={true} onLogClick={mockOnLogClick} />);
    
    expect(screen.getByText('No se encontraron registros de actividad')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<DataTable logs={[]} loading={false} onLogClick={mockOnLogClick} />);
    
    expect(screen.getByText('No se encontraron registros de actividad')).toBeInTheDocument();
  });

  it('renders logs correctly', () => {
    render(<DataTable logs={mockLogs} loading={false} onLogClick={mockOnLogClick} />);
    
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('CREATE_USER')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  });

  it('calls onLogClick when view button is clicked', () => {
    render(<DataTable logs={mockLogs} loading={false} onLogClick={mockOnLogClick} />);
    
    const viewButtons = screen.getAllByRole('button', { name: /eye/i });
    fireEvent.click(viewButtons[0]);
    
    expect(mockOnLogClick).toHaveBeenCalledWith(mockLogs[0]);
  });

  it('displays correct status badges', () => {
    render(<DataTable logs={mockLogs} loading={false} onLogClick={mockOnLogClick} />);
    
    const badges = screen.getAllByRole('status');
    expect(badges).toHaveLength(2);
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByText('failure')).toBeInTheDocument();
  });
});