export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center p-8 border rounded-lg shadow-lg">
        <h1 className="text-7xl font-extrabold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 border rounded hover:bg-gray-100"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
