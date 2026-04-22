"use client"

import { useState, useEffect, useCallback } from "react"
import type { Unit } from "@/config/brand"

export function useUnidades() {
  const [unidades, setUnidades] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnidades = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/unidades")
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Error al cargar unidades")
      }
      const data = (await res.json()) as { unidades: Unit[] }
      const sorted = [...data.unidades].sort((a, b) => {
        if (a.floor !== b.floor) return a.floor.localeCompare(b.floor, "es", { numeric: true })
        return a.unit.localeCompare(b.unit, "es", { numeric: true })
      })
      setUnidades(sorted)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUnidades()
  }, [fetchUnidades])

  return { unidades, loading, error, reintentar: fetchUnidades }
}
