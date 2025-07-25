import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SKILLON" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {

      const { auth, kv } = usePuterStore();
      const navigate = useNavigate();
      const [resumes, setResumes] = useState<Resume[]>([]);
      const [loadingResumes, setLoadingResumes] = useState(true);

      useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
      }, [auth.isAuthenticated]);


      useEffect(() => {
        const loadResumes = async () => {
          setLoadingResumes(true);
          
          const resumes = (await kv.list("resume:*", true)) as KVItem[];

          const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);

          console.log("Parsed Resumes:", parsedResumes);

          setResumes(parsedResumes || []);
          setLoadingResumes(false);
        };

        loadResumes();
      }, [auth.isAuthenticated]);



  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading pt-16 pb-5">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="text-gray-500">Upload your first resume to get started!</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col justify-center items-center">
            <img src="/images/resume-scan-2.gif" alt="Loading..." className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
            </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
          </div>
        )}

       
      </section>
    </main>
  );
}
