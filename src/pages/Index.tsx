import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect root to login to avoid showing the placeholder page
  return <Navigate to="/login" replace />;
};

export default Index;
