export default function MemoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Chat Flow</h1>
          <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
            Configure message limits, upgrade prompts, and user experience flow
          </p>
        </div>
        <div className="flex items-center gap-6">
          <button className="h-10 rounded-[18px] px-4 bg-[#e5e5e5] text-foreground font-semibold cursor-pointer">Reset to Default</button>
          <span className="text-[14px] text-[#9a7d84]">No Changes</span>
        </div>
      </div>
    </div>
  );
}


