import { Layout } from "@/components/layout";
import { useListCompanies } from "@workspace/api-client-react";
import { CompanyCard } from "@/components/company-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Building2 } from "lucide-react";

export default function Companies() {
  const { data: companies, isLoading } = useListCompanies();

  return (
    <Layout>
      <div className="bg-muted/30 border-b py-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Verified Employers</h1>
          <p className="text-lg text-muted-foreground">
            Discover organizations in Qatar committed to transparent, fair hiring practices. 
            Verified employers have passed our stringent business registration checks.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : companies?.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 border rounded-xl border-dashed">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">We are currently verifying our network of employers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies?.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
