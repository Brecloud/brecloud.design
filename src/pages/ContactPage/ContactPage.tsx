export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] px-8 md:px-24 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-mono tracking-widest text-[#B2F2BB]">CONTACT</div>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold">Let's talk.</h1>
        <div className="mt-12 space-y-6 text-sm">
          <div className="flex justify-between border-b border-[#222] pb-3">
            <span className="text-[#777]">Email</span>
            <a href="mailto:brecloud@163.com" className="hover:text-[#B2F2BB]">brecloud@163.com</a>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-3">
            <span className="text-[#777]">Phone</span>
            <span>17640303806</span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-3">
            <span className="text-[#777]">RedBook 小红书</span>
            <a href="https://xhslink.cn/o/At6W9qqeDHc" target="_blank" rel="noopener noreferrer" className="hover:text-[#B2F2BB] transition-colors">@brecloud3806</a>
          </div>
        </div>
      </div>
    </main>
  );
}
