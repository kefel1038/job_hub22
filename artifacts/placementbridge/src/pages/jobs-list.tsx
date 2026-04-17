import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useListJobs } from "@workspace/api-client-react";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Filter, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export default function JobsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [verificationStatus, setVerificationStatus] = useState<string>("all");
  
  const { data: jobs, isLoading } = useListJobs({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    verificationStatus: verificationStatus !== "all" ? verificationStatus : undefined,
  });

  return (
    <Layout>
      <div className="bg-muted/30 border-b pb-8 pt-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Verified Jobs</h1>
          <p className="text-muted-foreground mb-8">Browse opportunities curated for quality and trust.</p>

          <div className="bg-background border rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Job title, company, or keywords..." 
                  className="pl-9 bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="verified">
                      <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-600" /> Verified</div>
                    </SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-muted-foreground" /> Pending</div>
                    </SelectItem>
                    <SelectItem value="risky">
                      <div className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-yellow-600" /> Risky</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Button className="w-full" variant="secondary">
                  <Filter className="w-4 h-4" />
                  <span className="sr-only md:not-sr-only md:hidden ml-2">Filters</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${jobs?.length || 0} jobs`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
            ))}
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 border rounded-xl border-dashed">
            <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            <Button variant="outline" onClick={() => {
              setSearch("");
              setCategory("all");
              setVerificationStatus("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
