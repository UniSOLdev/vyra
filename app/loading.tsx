import { PageContainer } from "@/components/PageContainer"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-[50vh] py-16">
      <PageContainer className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </PageContainer>
    </div>
  )
}
