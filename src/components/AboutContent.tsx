export default function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto px-8 md:px-16 py-20">
      <div className="text-[11px] font-mono tracking-widest text-[#B2F2BB]">ABOUT</div>

      <h1 className="mt-6 font-bold leading-tight whitespace-nowrap"
        style={{ fontSize: 'clamp(18px, 3.6vw, 48px)' }}>
        <span className="block">Break the clouds, see the real needs.</span>
        <span className="block text-[#777]">Break the clouds, let design light in.</span>
      </h1>
      <p className="mt-5 text-sm text-[#777]">让设计照亮真实的需求。</p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-base font-semibold text-[#B2F2BB] mb-4">教育 / EDUCATION</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-[#222] pb-2">
              <span>大连理工大学 · 工业设计</span><span className="text-[#777]">2023 — 至今</span>
            </div>
            <div className="flex justify-between border-b border-[#222] pb-2">
              <span>西北工业大学 · 软件工程</span><span className="text-[#777]">2020 — 2022</span>
            </div>
            <p className="text-[#777]">GPA 3.75/4.0 · 综合排名 8/44 · CET6 482</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#B2F2BB] mb-4">荣誉 / AWARDS</h2>
          <ul className="space-y-2 text-sm text-[#ccc]">
            <li>东北三省适老化设计竞赛 · 一等奖（2025）</li>
            <li>中国好创意全国数字艺术大赛 · 二等奖（2025）</li>
            <li>立达设计奖 · 优秀奖 ×2</li>
            <li>辽宁省乡村生态设计大赛 · 三等奖（2025）</li>
            <li>米兰设计周中国高校作品展 · 入围（2026）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#B2F2BB] mb-4">技能 / SKILLS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><div className="text-[#777] text-xs mb-1">2D</div>Figma · Ps · Ai · CAD</div>
            <div><div className="text-[#777] text-xs mb-1">3D</div>Rhino · Keyshot · Blender · Grasshopper</div>
            <div><div className="text-[#777] text-xs mb-1">AI</div>Codex · ClaudeCode · ComfyUI</div>
            <div><div className="text-[#777] text-xs mb-1">其他</div>Processing · VibeCoding</div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#B2F2BB] mb-4">联系 / CONTACT</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-[#222] pb-3 max-w-lg">
              <span className="text-[#777]">Email</span>
              <a href="mailto:brecloud@163.com" className="hover:text-[#B2F2BB]">brecloud@163.com</a>
            </div>
            <div className="flex justify-between border-b border-[#222] pb-3 max-w-lg">
              <span className="text-[#777]">RedBook 小红书</span>
              <a href="https://xhslink.cn/o/At6W9qqeDHc" target="_blank" rel="noopener noreferrer" className="hover:text-[#B2F2BB] transition-colors">@brecloud3806</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
