import React, { ReactNode, createContext, useContext } from "react";

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

// Create a custom hook to access the permissions and guard from context
const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// PermissionsProvider component to wrap your app and provide permissions and guard
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

const useWrapper = ({ permit }: WrapperProps) => {
  const { guard, permissions, redirect } = usePermissions(); // Access permissions and guard from context

  const WrapperComponent: React.FC<WrapperProp> = ({ children }) => {
    const hasPermission = permissions.includes(permit);
    const previousURL = window.location.href;

    // ChildComponent receives a component as a prop and renders it
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
        return redirect ? <ReturnComponent component={redirect} /> : <>{""}</>;
      }
    }
  };

  return WrapperComponent;
};

export { PermissionsProvider, useWrapper, usePermissions };
