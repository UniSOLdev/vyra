const PRO_KEY = "vyra_pro"

export function isProSubscriber(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(PRO_KEY) === "1"
}
