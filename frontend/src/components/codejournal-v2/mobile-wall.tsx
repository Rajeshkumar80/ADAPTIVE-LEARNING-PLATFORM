"use client"

export function MobileWall() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background px-8 text-center md:hidden" style={{ paddingBottom: "15vh" }}>
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
          codejournal
        </span>
      </div>

      {/* Message */}
      <p className="mb-3 max-w-xs text-base font-medium text-foreground">
        Spatial thinking needs space.
      </p>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        codejournal is built for large screens. Open it on a desktop or laptop browser to get the full experience.
      </p>
    </div>
  )
}


