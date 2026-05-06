const OWNER_KEY = "vyra_owner_id"

export function getOrCreateOwnerId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(OWNER_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(OWNER_KEY, id)
  }
  return id
}
