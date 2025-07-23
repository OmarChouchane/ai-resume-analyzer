import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router"
import { usePuterStore } from "~/lib/puter";


export const meta = () => ([
  { title: "Resumind | Review" },
  { name: "Description", content: "Detailed overview of your resume" },
]);

const Resume = () => { 

    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Resume | null>(null);
    const navigate = useNavigate();

     useEffect(() => {
       if (!isLoading && !auth.isAuthenticated) {
         navigate(`/auth?next=/resume/${id}`);
       }
     }, [isLoading]);


    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);
            
            const resumeBlob = await fs.read(data.resumePath);

            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);

            console.log({ imageUrl, resumeUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="Back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center"> 
            {imageUrl && resumeUrl && (
              <div className="animate-in fade-in duration-500 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <img src={imageUrl} alt="" className="w-full h-full object-contain rounded-2xl" />
                </a>
              </div>
            )}
        </section>

        <section className="feedback-section">
            <h2 className="text-4xl !text-black font-bold">
                {feedback ? (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                        <h3 className="text-2xl !text-black font-bold">Summary ATS Details</h3>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                        <h3 className="text-2xl !text-black font-bold">Summary ATS Details</h3>
                    </div>
                )}
            </h2>
        </section>
      </div>
    </main>
  );
}

export default Resume;
