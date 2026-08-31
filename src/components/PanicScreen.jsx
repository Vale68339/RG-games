import { ArrowLeft, Check, Share, Lock } from 'lucide-react';

export function PanicScreen({ onExitPanic, panicKey }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#202124] font-sans flex flex-col overflow-hidden select-text">
      {/* Google Docs Toolbar */}
      <header className="bg-white border-b border-[#dadce0] px-4 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#4285f4]">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-base text-[#202124]">
                Biology Chapter 7 - Cellular Respiration Notes
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a73e8]">
                Saved to Drive
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#5f6368] mt-0.5">
              <span className="hover:text-black cursor-pointer">File</span>
              <span className="hover:text-black cursor-pointer">Edit</span>
              <span className="hover:text-black cursor-pointer">View</span>
              <span className="hover:text-black cursor-pointer">Insert</span>
              <span className="hover:text-black cursor-pointer">Format</span>
              <span className="hover:text-black cursor-pointer">Tools</span>
              <span className="hover:text-black cursor-pointer">Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-medium text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Private to only me</span>
          </div>

          <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#1a73e8] text-white text-xs font-medium shadow-xs">
            <Share className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Stealth exit trigger */}
          <button
            onClick={onExitPanic}
            title={`Exit Stealth Screen (or press '${panicKey}')`}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Ribbon Formatting Bar */}
      <div className="bg-[#edf2fa] border-b border-[#dadce0] px-4 py-1 flex items-center gap-4 text-xs text-[#444746] overflow-x-auto">
        <span className="font-semibold px-2 py-1 rounded hover:bg-white cursor-pointer">Arial</span>
        <span className="px-2 py-1 rounded hover:bg-white cursor-pointer">11</span>
        <div className="h-4 w-[1px] bg-[#c4c7c5]" />
        <span className="font-bold px-2 py-1 rounded hover:bg-white cursor-pointer">B</span>
        <span className="italic px-2 py-1 rounded hover:bg-white cursor-pointer">I</span>
        <span className="underline px-2 py-1 rounded hover:bg-white cursor-pointer">U</span>
        <div className="h-4 w-[1px] bg-[#c4c7c5]" />
        <span className="px-2 py-1 rounded hover:bg-white cursor-pointer">Align Left</span>
        <span className="px-2 py-1 rounded hover:bg-white cursor-pointer">Line Spacing: 1.15</span>
      </div>

      {/* Document Page Canvas */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-[816px] min-h-[1056px] bg-white border border-[#dadce0] shadow-md rounded-xs p-12 space-y-6 text-[#202124] text-sm leading-relaxed">
          <h1 className="text-2xl font-bold text-[#1a73e8] border-b pb-2 border-slate-200">
            Chapter 7: Cellular Respiration & ATP Synthesis
          </h1>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-[#202124]">1. Overview of Glycolysis</h2>
            <p>
              Glycolysis is the initial metabolic pathway of cellular respiration that converts glucose
              (C₆H₁₂O₆) into pyruvate (CH₃COCOO⁻). The free energy released in this process is used to form the
              high-energy molecules adenosine triphosphate (ATP) and reduced nicotinamide adenine dinucleotide
              (NADH).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              <li>Occurs in the cytoplasm of virtually all biological organisms</li>
              <li>Net gain: 2 ATP molecules and 2 NADH per glucose molecule</li>
              <li>Anaerobic process requiring no direct elemental oxygen</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-[#202124]">2. The Citric Acid (Krebs) Cycle</h2>
            <p>
              Under aerobic conditions, pyruvate enters the mitochondrial matrix via active transport. After
              decarboxylation to Acetyl-CoA, it enters a cyclic series of eight enzymatic reactions that release
              stored energy through the oxidation of acetyl-derived groups.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-800">
              Pyruvate + NAD⁺ + CoA-SH → Acetyl-CoA + NADH + CO₂ + H⁺
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-[#202124]">3. Oxidative Phosphorylation & Electron Transport</h2>
            <p>
              High-energy electrons donated by NADH and FADH₂ travel through protein complexes I, II, III, and IV
              embedded in the inner mitochondrial membrane, pumping protons into the intermembrane space to create
              an electrochemical proton gradient.
            </p>
          </section>
        </div>
      </div>

      {/* Stealth Return Button floating at bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onExitPanic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/80 text-slate-600 hover:text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer border border-slate-300 hover:border-slate-800 shadow-sm"
        >
          <span>Return (Press {panicKey})</span>
        </button>
      </div>
    </div>
  );
}
