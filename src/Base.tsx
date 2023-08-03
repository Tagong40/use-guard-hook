import React, { ReactNode } from "react";

type ComponentProp = React.FC;

interface PermProps {
  guard: string;
  permissions: (string | number)[] | undefined | null;
  redirect?: React.FC;
}

interface WrapperProps {
  children: ReactNode;
  permit: string | number;
}

const useGuard = ({ guard, permissions, redirect }: PermProps) => {
  const WrapperComponent: React.FC<WrapperProps> = ({ children, permit }) => {
    // Check if the provided permission exists in the perms array
    const hasPermission = permissions.includes(permit);

    // ChildComponent receives a component as a prop and renders it
    const ReturnComponent: React.FC<{ component: ComponentProp }> = ({
      component: Component,
    }) => {
      window.history.pushState({}, "", "/");

      return <Component />;
    };

    if (guard === "Administrator") {
      window.history.pushState({}, "", "/");

      return children;
    } else {
      if (hasPermission) {
        window.history.pushState({}, "", "/");

        return <>{children}</>;
      } else {
        window.history.pushState({}, "", "/#/denied");
        return redirect ? <ReturnComponent component={redirect} /> : <>{""}</>;
      }
    }
  };
  return WrapperComponent;
};

export default useGuard;
