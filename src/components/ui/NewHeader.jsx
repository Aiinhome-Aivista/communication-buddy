export default function NewHeader() {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">
        <div className="px-6 py-2">
        <img
          src="public/assets/icons/Aiinhome.svg"
          alt="Aiinhome Logo"
          className="h-10 w-30"
        />
      </div>
      <div>
        <p className="text-sm text-gray-500">John Doe</p>
      </div>

      <div className="text-sm text-gray-600 text-right">
        <p>September 24, Wednesday</p>
        <p>16:36 PM</p>
      </div>
    </header>
  );
}
