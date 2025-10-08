"use client";

export default function SaveChanges() {
  const handleSaveChanges = () => {
    console.log("Saving all tone and prompt modifications...");
    // Handle save functionality here
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Save Changes</h2>
          <p className="text-[12px] sm:text-[14px] text-gray-600 font-normal mt-1">
            Apply all tone and prompt modifications.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-[#757575] text-white rounded-lg text-[12px] sm:text-[14px] font-bold hover:brightness-95 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
