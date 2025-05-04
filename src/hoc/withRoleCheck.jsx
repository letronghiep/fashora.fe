import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMe } from "../services/user";

const withRoleCheck = (WrappedComponent, allowedRoles) => {
  const WithRoleCheck = (props) => {
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
      const fetchRole = async () => {
        try {
          const response = await getMe();
          if (response.status === 200) {
            const userRole = response.metadata.user.usr_role.rol_name;
            setCurrentRole(userRole);
          } else {
            setCurrentRole(""); // Nếu lỗi, đặt role là ""
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setCurrentRole(""); // Nếu có lỗi, đặt role là ""
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    }, []);

    useEffect(() => {
      if (!loading) {
        if (!currentRole) {
          navigate(
            `/login?redirectTo=${encodeURIComponent(location.pathname)}`
          );
        } else if (!allowedRoles.includes(currentRole)) {
          navigate("/unauthorized");
        }
      }
    }, [currentRole, loading, navigate, allowedRoles]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return null; // Tránh render component không hợp lệ
    }

    return <WrappedComponent {...props} />;
  };

  WithRoleCheck.displayName = `WithRoleCheck(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithRoleCheck;
};

export default withRoleCheck;
