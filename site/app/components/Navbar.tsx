import LogoutButton from './LogoutButton';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800">
      <div className="flex justify-between items-center">
        <div>
          {/* Your other nav items */}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
} 