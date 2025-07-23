import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-500 text-sm">Authenticated as:</span>
          <span className="font-bold text-lg text-blue-700">
            {auth.user?.username}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Files</h2>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {files.length === 0 ? (
              <span className="text-gray-400 text-center">No files found.</span>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="truncate text-gray-700">{file.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <button
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 text-lg"
          onClick={handleDelete}
        >
          Wipe App Data
        </button>
      </div>
    </main>
  );
};

export default WipeApp;
