import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Shield, Search, Briefcase, Building, ShieldCheck, ArrowRight, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { useGetDashboardStats, useGetFeaturedJobs, useListCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: featuredJobs, isLoading: jobsLoading } = useGetFeaturedJobs();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-20 pb-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-6 mx-auto inline-flex items-center px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Qatar's Verified Hiring Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto mb-6 leading-tight">
            Trust the process. <br/>
            <span className="text-primary">Find real opportunities.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            PlacementBridge surfaces only AI-screened, verified jobs in the GCC region. No fake listings, no ghosting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-16">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Job title, keywords, or company..." 
                className="w-full pl-10 h-14 text-base shadow-sm border-border/50 bg-background/50 backdrop-blur-sm"
              />
            </div>
            <Button size="lg" className="h-14 px-8 text-base shadow-md font-semibold" asChild>
              <Link href="/jobs">Search Jobs</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-border/50 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.totalJobs}
              </div>
              <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.verifiedJobs}
              </div>
              <div className="text-sm font-medium text-primary flex justify-center items-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.activeCompanies}
              </div>
              <div className="text-sm font-medium text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : '100%'}
              </div>
              <div className="text-sm font-medium text-muted-foreground">AI Screened</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Opportunities</h2>
              <p className="text-muted-foreground">Top verified roles curated for you.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/jobs" className="group">
                View all <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {jobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs?.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
          
          <Button variant="outline" asChild className="w-full mt-8 sm:hidden">
            <Link href="/jobs">View all jobs</Link>
          </Button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-border/50 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold tracking-tight mb-4">How Verification Works</h2>
            <p className="text-lg text-muted-foreground">
              We use advanced AI to scan every job posting and employer against regional databases, historical data, and known scam patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 text-center hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Employer Auth</h3>
              <p className="text-muted-foreground">We verify company registration, domain authenticity, and contact information.</p>
            </div>
            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 text-center hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Screening</h3>
              <p className="text-muted-foreground">Our models analyze job descriptions for unrealistic requirements and scam indicators.</p>
            </div>
            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 text-center hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trust Badges</h3>
              <p className="text-muted-foreground">Listings earn badges (✅ Verified, ⚠️ Risky, ❌ Fake) to help you apply safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Browse by Industry</h2>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/jobs?category=${cat.slug}`}>
                  <div className="bg-background border border-border/50 p-6 rounded-xl text-center hover:border-primary/50 hover:shadow-sm transition-all group cursor-pointer h-full flex flex-col items-center justify-center">
                    <Briefcase className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.jobCount} Jobs</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5 dark:opacity-10" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to find your next role?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Join thousands of professionals in Qatar using PlacementBridge for a transparent hiring experience.</p>
          <Button size="lg" className="h-14 px-8 text-base shadow-md font-semibold" asChild>
            <Link href="/jobs">Browse Verified Jobs</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}