export const VYRA_PRO_HEADER = "x-vyra-pro"

export function isProFromHeader(req: Request): boolean {
  return req.headers.get(VYRA_PRO_HEADER)?.trim() === "1"
}

