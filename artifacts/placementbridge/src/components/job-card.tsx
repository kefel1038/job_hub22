import { Link } from "wouter";
import { MapPin, Building, Clock, DollarSign, ShieldAlert, ShieldCheck, ShieldX, Eye, Star } from "lucide-react";
import { Job } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function JobCard({ job }: { job: Job }) {
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white border-transparent"><ShieldCheck className="w-3 h-3 mr-1" /> Verified ✅</Badge>;
      case "risky":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-500"><ShieldAlert className="w-3 h-3 mr-1" /> Risky ⚠️</Badge>;
      case "fake":
        return <Badge variant="destructive"><ShieldX className="w-3 h-3 mr-1" /> Fake ❌</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground"><ShieldAlert className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-border/50 relative overflow-hidden">
      {job.isFeatured && (
        <div className="absolute top-0 right-0 p-1 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-bl-lg shadow-sm flex items-center">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Featured
        </div>
      )}
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <Link href={`/jobs/${job.id}`} className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </Link>
          <div className="flex items-center text-muted-foreground text-sm space-x-2">
            <span className="flex items-center font-medium text-foreground/80">
              <Building className="w-4 h-4 mr-1" />
              {job.companyName}
            </span>
            {job.isVerifiedEmployer && (
              <Badge variant="secondary" className="px-1 py-0.5 text-[10px] h-4 leading-none bg-blue-100 text-blue-700 border-transparent">
                Verified Employer
              </Badge>
            )}
          </div>
        </div>
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={job.companyName} className="w-12 h-12 rounded-md object-cover border" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center border font-bold text-muted-foreground">
            {job.companyName.charAt(0)}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center bg-accent/50 px-2 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
            {job.location}
          </div>
          <div className="flex items-center bg-accent/50 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
            {job.jobType}
          </div>
          {(job.salaryDisplay || (job.salaryMin && job.salaryMax)) && (
            <div className="flex items-center bg-accent/50 px-2 py-1 rounded-md font-medium text-foreground/80">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-primary/70" />
              {job.salaryDisplay || `${job.salaryMin} - ${job.salaryMax}`}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          {getVerificationBadge(job.verificationStatus)}
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {job.viewCount}
          </span>
          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
