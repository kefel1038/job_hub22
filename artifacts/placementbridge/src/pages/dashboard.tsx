import { Layout } from "@/components/layout";
import { useGetDashboardStats, useGetCategoryStats, useListJobs, getListJobsQueryKey, useVerifyJob } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, ShieldX, Briefcase, Building, Users, Activity, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: categoryStats, isLoading: categoryLoading } = useGetCategoryStats();
  const { data: recentJobs, isLoading: jobsLoading } = useListJobs();
  
  const verifyJob = useVerifyJob();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleVerify = async (jobId: number) => {
    try {
      await verifyJob.mutateAsync({ id: jobId });
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
      toast({
        title: "Job Verified",
        description: "AI verification complete.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to run verification.",
        variant: "destructive"
      });
    }
  };

  const pendingJobs = recentJobs?.filter(j => j.verificationStatus === "pending") || [];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor trust metrics and platform activity.</p>
          </div>
          <Button asChild>
            <Link href="/post-job">Post New Job</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Active</CardTitle>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.verifiedJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Companies</CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.activeCompanies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Activity className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.pendingVerifications}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Jobs by Category</CardTitle>
                <CardDescription>Distribution of active roles across industries</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest jobs added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs?.slice(0, 5).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-xl bg-background">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="font-semibold hover:text-primary transition-colors">
                            {job.title}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <span>{job.companyName}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div>
                          {job.verificationStatus === 'verified' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>}
                          {job.verificationStatus === 'pending' && <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>}
                          {job.verificationStatus === 'risky' && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Risky</Badge>}
                          {job.verificationStatus === 'fake' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Fake</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-orange-200 shadow-sm">
              <CardHeader className="bg-orange-50/50 pb-4 border-b border-orange-100">
                <CardTitle className="text-orange-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" /> Action Required
                </CardTitle>
                <CardDescription className="text-orange-600/80">Jobs pending AI verification</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {jobsLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : pendingJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                    All jobs verified
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingJobs.slice(0, 5).map(job => (
                      <div key={job.id} className="p-3 border border-orange-100 rounded-lg bg-orange-50/30">
                        <div className="font-medium text-sm line-clamp-1 mb-1">{job.title}</div>
                        <div className="text-xs text-muted-foreground mb-3">{job.companyName}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => handleVerify(job.id)} disabled={verifyJob.isPending}>
                            Run AI Scan
                          </Button>
                          <Button size="sm" variant="ghost" className="px-2 h-8" asChild>
                            <Link href={`/jobs/${job.id}`}><ExternalLink className="w-4 h-4" /></Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
