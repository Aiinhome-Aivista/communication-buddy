export default function NewHeader() {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">
      {/* Left side - User info */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
         
        </div>
        <p className="font-medium text-gray-800">John Doe</p>
      </div>

      {/* Center - Logo */}
      <div className="items-start">
        <img
          src="public/assets/icons/Aiinhome _ CB.svg"
          alt="Aiinhome Logo"
          className="h-5"
        />
      </div>

    </header>
  );
}