import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadResume = async () => {
      setLoading(true);
      const blob = await fs.read(imagePath);
      if (!blob) {
        setLoading(false);
        return;
      }
      let url = URL.createObjectURL(blob);
      if (isMounted) {
        setResumeUrl(url);
        setLoading(false);
      }
    };
    loadResume();
    return () => {
      isMounted = false;
    };
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {imagePath && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full flex items-center justify-center">
            {loading || !resumeUrl ? (
              <img
                src="/images/load.gif"
                alt="Loading resume preview"
                className="w-[60px] h-[350px] max-sm:h-[200px] object-contain"
              />
            ) : (
              <img
                src={resumeUrl}
                alt="resume"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
