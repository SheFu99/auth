import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NavSearch } from '../searchBar/SerchBar_server';

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

test('renders NavSearch', () => {
  const { getByPlaceholderText } = renderWithQueryClient(<NavSearch />);
  expect(getByPlaceholderText('Search users...')).toBeInTheDocument();
});
