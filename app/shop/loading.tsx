import { PageContainer } from "@/components/PageContainer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShopLoading() {
  return (
    <div className="py-10">
      <PageContainer className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[22rem] rounded-2xl" />
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
