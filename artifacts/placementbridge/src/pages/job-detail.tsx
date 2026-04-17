import { Layout } from "@/components/layout";
import { Link, useParams } from "wouter";
import { useGetJob, getGetJobQueryKey } from "@workspace/api-client-react";
import { ShieldCheck, ShieldAlert, ShieldX, MapPin, Building, Clock, DollarSign, ArrowLeft, ExternalLink, Mail, MessageCircle, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function JobDetail() {
  const { id } = useParams();
  const jobId = parseInt(id || "0", 10);
  
  const { data: job, isLoading } = useGetJob(jobId, {
    query: {
      enabled: !!jobId,
      queryKey: getGetJobQueryKey(jobId)
    }
  });

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-base py-1 px-3"><ShieldCheck className="w-4 h-4 mr-2" /> Verified Role ✅</Badge>;
      case "risky":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-base py-1 px-3"><ShieldAlert className="w-4 h-4 mr-2" /> High Risk ⚠️</Badge>;
      case "fake":
        return <Badge variant="destructive" className="text-base py-1 px-3"><ShieldX className="w-4 h-4 mr-2" /> Identified Fake ❌</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground text-base py-1 px-3"><ShieldAlert className="w-4 h-4 mr-2" /> Pending Verification</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button asChild>
            <Link href="/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                {getVerificationBadge(job.verificationStatus)}
                {job.isFeatured && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{job.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground items-center">
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary/70" />
                  <span className="font-medium text-foreground">{job.companyName}</span>
                  {job.isVerifiedEmployer && (
                    <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[10px] bg-blue-100 text-blue-700 border-transparent">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary/70" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary/70" />
                  {job.jobType}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary/70" />
                  Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {job.applyUrl && (
                <Button size="lg" className="w-full md:w-auto text-base" asChild>
                  <a href={job.applyUrl} target="_blank" rel="noreferrer">
                    Apply via Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
              {job.applyWhatsapp && (
                <Button size="lg" variant="outline" className="w-full md:w-auto border-green-500 text-green-700 hover:bg-green-50 text-base" asChild>
                  <a href={`https://wa.me/${job.applyWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" /> Apply via WhatsApp
                  </a>
                </Button>
              )}
              {job.applyEmail && (
                <Button size="lg" variant="secondary" className="w-full md:w-auto text-base" asChild>
                  <a href={`mailto:${job.applyEmail}?subject=Application for ${job.title}`}>
                    <Mail className="w-4 h-4 mr-2" /> Apply via Email
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {job.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {job.requirements.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
            
            {(job.verificationStatus === "verified" && job.verificationNotes) && (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 p-6 rounded-xl">
                <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center mb-2">
                  <ShieldCheck className="w-5 h-5 mr-2" /> Verification Notes
                </h3>
                <p className="text-green-700 dark:text-green-500">{job.verificationNotes}</p>
              </div>
            )}
            
            {(job.verificationStatus === "risky" && job.verificationNotes) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 p-6 rounded-xl">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-400 flex items-center mb-2">
                  <ShieldAlert className="w-5 h-5 mr-2" /> AI Risk Assessment
                </h3>
                <p className="text-yellow-700 dark:text-yellow-500">{job.verificationNotes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <h3 className="font-bold text-lg">Job Overview</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {(job.salaryDisplay || (job.salaryMin && job.salaryMax)) && (
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center mb-1"><DollarSign className="w-4 h-4 mr-1"/> Salary</div>
                    <div className="font-medium text-lg">
                      {job.salaryDisplay || `${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} QAR`}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground flex items-center mb-1"><MapPin className="w-4 h-4 mr-1"/> Location</div>
                  <div className="font-medium">{job.location}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center mb-1"><Clock className="w-4 h-4 mr-1"/> Job Type</div>
                  <div className="font-medium">{job.jobType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center mb-1"><Eye className="w-4 h-4 mr-1"/> Views</div>
                  <div className="font-medium">{job.viewCount} applicants viewed</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <h3 className="font-bold text-lg">About the Company</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border font-bold text-muted-foreground text-xl">
                      {job.companyName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg">{job.companyName}</div>
                    {job.isVerifiedEmployer && (
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-blue-100 text-blue-700 border-transparent mt-1">
                        Verified Employer
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/companies`}>View Company Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
