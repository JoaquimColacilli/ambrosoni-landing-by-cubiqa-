import { NextResponse } from "next/server"
import type { Unit, UnitStatus } from "@/config/brand"

interface AirtableRecord {
  id: string
  fields: Record<string, unknown>
}

const estadoMap: Record<string, UnitStatus> = {
  Disponible: "available",
  Reservado: "reserved",
  Consultar: "consultar",
  Vendido: "sold",
  Sold: "sold",
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const n = parseInt(value.replace(/[^0-9]/g, ""), 10)
    return Number.isNaN(n) ? fallback : n
  }
  return fallback
}

// Parsea decimales tolerando formato es-AR ("7,5m²") y en-US ("7.5m²").
function parseDecimal(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9,.\-]/g, "").replace(",", ".")
    const n = parseFloat(cleaned)
    return Number.isNaN(n) ? fallback : n
  }
  return fallback
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  if (!token || !baseId || !tableId) {
    return NextResponse.json(
      { error: "Faltan variables de entorno de Airtable" },
      { status: 500 },
    )
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error("Airtable error:", res.status, errorBody)
      return NextResponse.json({ error: "Error al consultar Airtable" }, { status: res.status })
    }

    const data = (await res.json()) as { records: AirtableRecord[] }

    const unidades: Unit[] = data.records
      .map((record) => {
        const estadoRaw = (record.fields["Estado"] as string | undefined) ?? "Disponible"
        const status: UnitStatus = estadoMap[estadoRaw] ?? "available"

        return {
          floor: String(record.fields["Piso"] ?? "").trim(),
          unit: String(record.fields["Unidad"] ?? "").trim(),
          rooms: parseNumber(record.fields["Ambientes"]),
          coveredSqm: parseDecimal(record.fields["Superficie Cubierta"] ?? record.fields["m²"]),
          uncoveredSqm: parseDecimal(record.fields["Superficie Descubierta"]),
          status,
          price: String(record.fields["Precio"] ?? "Consultar"),
        }
      })
      // Descartar registros incompletos (Airtable deja rows vacíos como placeholder)
      .filter((u) => u.unit !== "" && u.floor !== "")

    return NextResponse.json({ unidades })
  } catch (err) {
    console.error("Error fetching unidades:", err)
    return NextResponse.json({ error: "Error de conexión con Airtable" }, { status: 500 })
  }
}
