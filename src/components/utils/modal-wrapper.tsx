// "use client";
// import React, { useEffect } from "react";

// type Props = {
//   title: React.ReactNode;
//   onClose: () => void;
//   size?: "md" | "lg";
//   headerClass?: string; // e.g. "bg-primary"
//   children: React.ReactNode;
// };

// export default function ModalWrapper({
//   title,
//   onClose,
//   size = "md",
//   headerClass = "bg-primary",
//   children,
// }: Props) {
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     document.addEventListener("keydown", onKey);
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.body.style.overflow = "";
//     };
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4"
//       role="dialog"
//       aria-modal="true"
//       onMouseDown={(e) => {
//         // click outside to close
//         if (e.target === e.currentTarget) onClose();
//       }}>
//       <div className="absolute inset-0 bg-black/40" aria-hidden />
//       <div
//         className={`relative w-full mx-auto ${
//           size === "lg" ? "max-w-3xl" : "max-w-md"
//         }`}
//         style={{
//           fontFamily:
//             "var(--font-geist-sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial)",
//         }}>
//         <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
//           <div
//             className={`flex items-center justify-between px-4 py-3 border-b ${headerClass} text-white`}>
//             <h5 className="text-lg font-semibold flex items-center gap-2">
//               {title}
//             </h5>
//             <button
//               aria-label="Close"
//               onClick={onClose}
//               className="text-white hover:opacity-90 p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/30">
//               <svg
//                 className="w-5 h-5"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="p-6 bg-card-foreground/0 text-foreground modal-body">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
  headerClass?: string;
  children: ReactNode;
};

export default function ModalWrapper({
  title,
  onClose,
  size = "md",
  headerClass = "bg-primary",
  children,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}>
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`relative w-full mx-auto ${
            size === "lg" ? "max-w-3xl" : "max-w-md"
          }`}
          style={{
            fontFamily:
              "var(--font-geist-sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial)",
          }}>
          <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${headerClass} text-white`}>
              <h5 className="text-lg font-semibold flex items-center gap-2">
                {title}
              </h5>
              <button
                aria-label="Close"
                onClick={onClose}
                className="text-white hover:opacity-90 p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/30">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-card-foreground/0 text-foreground">
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
