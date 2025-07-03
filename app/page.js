'use client'
import SeedGenerator from './includes/SeedGenerator';
import ImportWallet from './includes/ImportWallet';
import ProtectedPage from './includes/ProtectedPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SeedGenerator />
       <ProtectedPage>
      <ImportWallet />
    </ProtectedPage>
    </div>
  );
}

export default App;
