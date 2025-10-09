export default function NewHeader() {
  return (
    <header className="flex justify-between items-center bg-white px-6 h-[calc(9%)] border-b border-[#BCC7D2] shadow-sm">
      {/* Left side - User info */}

      {/* Center - Logo */}
      <div className="items-center flex">
        <img
          src="public/assets/icons/Aiinhome _ CB.svg"
          alt="Aiinhome Logo"
          className="h-5"
        />
      </div>

    </header>
  );
}