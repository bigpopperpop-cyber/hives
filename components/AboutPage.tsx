import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">How it Works</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
          I Am Itchy is a specialized tool designed to help you track chronic urticaria (hives) with clinical precision and absolute privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Log Entry Instructions */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-100 dark:shadow-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">The Log Entry System</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Recording your breakouts consistently is the key to finding your triggers.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">1</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Rate Severity</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Use the slider (1-10) to record how intense the itch or swelling is.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">2</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Map the Area</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Select body areas. You can customize this list if you have unique spots.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Sync & Privacy Instructions */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200 dark:shadow-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">The Sync System</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            We prioritize your privacy above all else. This system is "Local-First".
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">1</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">No Cloud, No Risk</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your data never leaves your device unless you choose to export it.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">2</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Backup Regularly</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Download a .json file regularly to ensure you never lose your history.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Environmental Fetch Instructions */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-cyan-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-100 dark:shadow-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Fetch Environment</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Automatically capture external triggers from the world around you.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">1</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Real-time Data</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">We pull local temperature, humidity, and pollen levels using Open-Meteo APIs.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] mt-1 shrink-0">2</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Privacy Focused</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your GPS coordinates are used only for the query and are <strong>never</strong> stored in your logs.</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div className="bg-indigo-600 dark:bg-indigo-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 tracking-tight">Pro Tip: Local Intelligence</h3>
          <p className="text-indigo-100 dark:text-indigo-200 text-base leading-relaxed font-medium">
            Once you have more than 3 entries, go to the <span className="text-white font-bold">'History'</span> tab. Our built-in pattern engine will automatically look for correlations between your selected triggers and the severity of your hives.
          </p>
          <div className="mt-8 flex items-center space-x-4">
             <div className="bg-white/10 dark:bg-indigo-500/30 px-4 py-2 rounded-xl text-xs font-bold border border-white/20 dark:border-indigo-400/30">100% Privacy</div>
             <div className="bg-white/10 dark:bg-indigo-500/30 px-4 py-2 rounded-xl text-xs font-bold border border-white/20 dark:border-indigo-400/30">Offline Analysis</div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Medical Disclaimer</h3>
        </div>
        <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          <p>
            <strong>I Am Itchy</strong> is an informational tool provided for personal tracking and record-keeping purposes only. It is <strong>not</strong> a medical device and does not provide medical advice, professional diagnosis, opinion, or treatment.
          </p>
          <p>
            The pattern analysis and insights generated by this application are based on statistical correlations within your personal data and should not be interpreted as clinical findings.
          </p>
          <p>
            <strong>Always seek the advice of your physician</strong> or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or recorded within this application. <strong>In the event of a medical emergency, call your local emergency services immediately.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;