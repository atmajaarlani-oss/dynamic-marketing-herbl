type BadgeBpomProps = {
  nomorBpom?: string | null
  halalTersertifikasi?: boolean
}

export default function BadgeBpom({ nomorBpom, halalTersertifikasi = false }: BadgeBpomProps) {
  const normalizedBpom = nomorBpom?.trim()

  if (!normalizedBpom && !halalTersertifikasi) return null

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Informasi legalitas produk">
      {normalizedBpom ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#b8d6bd] bg-[#edf8ef] px-3 py-1.5 text-sm text-[#245f32]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#2f7d3e] text-xs font-bold text-[#fffaf1]" aria-hidden="true">
            ✓
          </span>
          <span className="font-semibold">Terdaftar BPOM</span>
          <span className="text-[#397247]">POM {normalizedBpom}</span>
        </div>
      ) : null}
      {halalTersertifikasi ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d9c98c] bg-[#fff9df] px-3 py-1.5 text-sm text-[#6c5714]">
          <span className="flex size-5 items-center justify-center rounded-full border border-[#b89c3f] text-[10px] font-bold" aria-hidden="true">
            H
          </span>
          <span className="font-semibold">Halal</span>
        </div>
      ) : null}
    </div>
  )
}
