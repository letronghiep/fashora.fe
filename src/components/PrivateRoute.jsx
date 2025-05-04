/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, allowRoutes }) {
  const user = useSelector((state) => state.user);
  const role = user.user?.usr_role?.rol_name;
  const loading = useSelector((state) => state.user)?.loading;
  const hasPermission = allowRoutes.includes(role);
  return hasPermission || loading ? (
    element
  ) : (
    <Navigate
      to="/unauthorized"
      replace
      state={{ from: window.location.pathname }}
    />
  );
}

export default PrivateRoute;
