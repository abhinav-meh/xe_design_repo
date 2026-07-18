"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloudArrowUp, FileText, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

/*
  Simulated document upload. Files aren't parsed (demo); they read as
  "supporting docs" alongside the typed brief. Shows drag state, file chips,
  and an error state for oversized/odd files.
*/

export interface DocFile {
  id: string;
  name: string;
  size: number;
}

const MAX_MB = 5;

export function DocDropzone({
  files,
  onChange,
}: {
  files: DocFile[];
  onChange: (f: DocFile[]) => void;
}) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  function add(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next: DocFile[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`${f.name} is over ${MAX_MB}MB.`);
        continue;
      }
      next.push({ id: `${f.name}-${f.size}`, name: f.name, size: f.size });
    }
    if (next.length) {
      setError(null);
      onChange([...files, ...next]);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40",
        )}
      >
        <motion.span animate={{ y: drag ? -2 : 0 }} transition={spring.snappy}>
          <CloudArrowUp
            className={cn("h-6 w-6", drag ? "text-primary" : "text-muted-foreground")}
          />
        </motion.span>
        <span className="text-sm font-medium">
          Drop an SOW, brief, or thread — or click to add
        </span>
        <span className="text-xs text-muted-foreground">
          We read them to draft the agreement. PDF, DOCX, TXT · up to {MAX_MB}MB
        </span>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          onChange={(e) => add(e.target.files)}
        />
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring.smooth}
            className="mt-3 flex flex-wrap gap-2 overflow-hidden"
          >
            {files.map((f) => (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={spring.snappy}
                className="flex items-center gap-2 rounded-lg bg-secondary px-2.5 py-1.5 text-xs"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="max-w-[10rem] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
