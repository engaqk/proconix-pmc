import { ReactNode } from "react";

export default function LeadsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="leads-sandbox">
      {children}
    </div>
  );
}
