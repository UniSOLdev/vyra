export type AppNavItem = { href: string; label: string }

export type AppNavGroup = { title: string; items: AppNavItem[] }

export const APP_NAV_GROUPS: AppNavGroup[] = [
  {
    title: "Routine",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/workouts", label: "Workouts" },
      { href: "/nutrition", label: "Nutrition" },
      { href: "/habits", label: "Habits" },
    ],
  },
  {
    title: "Measure",
    items: [
      { href: "/progress", label: "Progress" },
      { href: "/friends", label: "Friends" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/coach", label: "Coach" },
      { href: "/gym", label: "Gym" },
      { href: "/squad", label: "Squad" },
      { href: "/shop", label: "Shop" },
    ],
  },
]

export function isAppNavActive(pathname: string, href: string): boolean {
  if (href === "/shop") {
    return pathname === "/shop" || pathname.startsWith("/shop/")
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
