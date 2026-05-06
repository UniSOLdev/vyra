/** Opaque device owner id for gym/squad rows until Supabase Auth ships. */
export const VYRA_OWNER_HEADER = "x-vyra-owner"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidOwnerId(id: string): boolean {
  return UUID_RE.test(id.trim())
}

export function getOwnerIdFromHeader(req: Request): string | null {
  const raw = req.headers.get(VYRA_OWNER_HEADER)?.trim() ?? ""
  return isValidOwnerId(raw) ? raw : null
}
