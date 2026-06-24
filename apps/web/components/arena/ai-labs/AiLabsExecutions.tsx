// 'use client';
//
// import React from 'react';
//
// interface ExecutionItem {
//   id: string;
//   title: string;
//   status: 'running' | 'completed' | 'failed';
//   time: string;
// }
//
// interface AiLabsExecutionsProps {
//   items: ExecutionItem[];
// }
//
// const STATUS_COLORS: Record<string, string> = {
//   running: 'text-amber-400',
//   completed: 'text-emerald-400',
//   failed: 'text-red-400',
// };
//
// const STATUS_ICONS: Record<string, string> = {
//   running: 'ti-loader',
//   completed: 'ti-check',
//   failed: 'ti-x',
// };
//
// const STATUS_SYMBOLS: Record<string, string> = {
//   running: '⏳',
//   completed: '✓',
//   failed: '✗',
// };
//
// export function AiLabsExecutions({ items }: AiLabsExecutionsProps) {
//   return (
//     <section>
//       <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Executions</h3>
//       <div className="space-y-1.5">
//         {items.map((exec) => (
//           <div
//             key={exec.id}
//             className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/30 border border-zinc-900/40"
//           >
//             <div className="flex items-center gap-2.5">
//               <i className={`ti ${STATUS_ICONS[exec.status]} ${STATUS_COLORS[exec.status]} text-sm`} />
//               <span className="text-[11px] text-zinc-300">{exec.title}</span>
//             </div>
//             <span className={`text-[10px] font-medium ${STATUS_COLORS[exec.status]}`}>
//               {STATUS_SYMBOLS[exec.status]}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
