import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <motion.div
            className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
