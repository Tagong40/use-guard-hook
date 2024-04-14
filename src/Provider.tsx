import React, { ReactNode, createContext, useContext, useMemo } from "react";

// Define types and interfaces
type ComponentProp = React.FC;
interface PermProps {
  guard: string;
  permissions: (string | number)[] | undefined | null;
  redirect?: React.FC;
  children?: React.ReactNode;
}
interface WrapperProps {
  permit: string | number;
}
interface WrapperProp {
  children: ReactNode;
}

// Create a context for the permissions and guard
const PermissionsContext = createContext<PermProps | undefined>(undefined);

// Custom hook to access the permissions and guard from context
const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// PermissionsProvider component to provide permissions and guard
const PermissionsProvider: React.FC<PermProps> = ({
  guard,
  permissions,
  redirect,
  children,
}) => {
  return (
    <PermissionsContext.Provider value={{ guard, permissions, redirect }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Wrapper component to control access based on permissions and guard
const useWrapper = ({ permit }: WrapperProps) => {
  const { guard, permissions, redirect } = usePermissions(); // Access permissions and guard from context

  // Memoize the WrapperComponent to prevent unnecessary re-renders
  const WrapperComponent = useMemo(() => {
    const Wrapper: React.FC<WrapperProp> = ({ children }) => {
      const hasPermission = permissions.includes(permit);
      const previousURL = window.location.href;

      const ReturnComponent: React.FC<{ component: ComponentProp }> = ({
        component: Component,
      }) => {
        window.history.pushState({}, "", previousURL);
        return <Component />;
      };

      if (guard === "Administrator") {
        window.history.pushState({}, "", previousURL);
        return children;
      } else {
        if (hasPermission) {
          window.history.pushState({}, "", previousURL);
          return <>{children}</>;
        } else {
          window.history.pushState({}, "", "/#/denied");
          return redirect ? (
            <ReturnComponent component={redirect} />
          ) : (
            <>{""}</>
          );
        }
      }
    };

    // Memoize the Wrapper component
    return React.memo(Wrapper);
  }, [permit, guard, permissions, redirect]);

  return WrapperComponent;
};

export { PermissionsProvider, useWrapper, usePermissions };
