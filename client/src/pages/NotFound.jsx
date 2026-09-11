import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-sm">
        <Compass size={48} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">
          This page doesn't exist. Double-check the link and try again.
        </p>
        <Link
          to="/"
          className="inline-block bg-teal-green text-white font-medium rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
