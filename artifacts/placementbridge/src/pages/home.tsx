import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MapPin, Briefcase, Star, Loader2, DollarSign } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type Job } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api
      .listJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Find your next opportunity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Browse open positions from employers around the world. Sign up as an employer to post a job for $20.
          </p>
          {!user && (
            <div className="flex justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {loading ? "Loading jobs..." : `${jobs.length} open ${jobs.length === 1 ? "position" : "positions"}`}
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-4">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No jobs posted yet. Be the first to post one.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-semibold truncate">{job.title}</h3>
                        {job.isFeatured && (
                          <Badge className="gap-1 bg-amber-500 hover:bg-amber-500 text-white">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
