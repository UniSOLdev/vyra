import Link from "next/link"
import { Logo } from "@/components/Logo"
import { PageContainer } from "@/components/PageContainer"

const disclaimer =
  "VYRA provides general fitness and wellness information. It is not medical advice. Always consult a qualified professional before starting a new diet, supplement, or exercise program."

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <PageContainer className="py-16 md:py-20 lg:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-zinc-500">
              The performance operating system.
            </p>
            <p className="pt-2 text-xs leading-relaxed text-zinc-600">{disclaimer}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            <div className="space-y-3 text-sm">
              <p className="text-caption text-zinc-600">Product</p>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/signup"
              >
                Create account
              </Link>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/shop"
              >
                Shop
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-caption text-zinc-600">Company</p>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/about"
              >
                About
              </Link>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/terms"
              >
                Terms
              </Link>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/privacy"
              >
                Privacy
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-caption text-zinc-600">Contact</p>
              <Link
                className="block min-h-11 py-2 text-zinc-400 transition-colors duration-200 hover:text-white"
                href="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
