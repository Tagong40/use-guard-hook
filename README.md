# useGuard Hook

useGuard is designed to be used with React applications where you need to restrict access to specific components based on user permissions. It takes a guard and perms as input and returns a custom React component that acts as a wrapper around its children. The hook checks for specific permissions and renders the wrapped children based on those permissions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Permissions](#permissions)
- [PermissionsProvider](#PermissionsProvider)
- [Example](#example)
- [License](#license)

## Installation

<h5>To use `useGuard` in your React application, follow these steps:</h5>

```bash
  npm install use-guard-hook
  # or
  yarn add use-guard-hook
```

## Description

`useGuard` is designed to be used with React applications where you need to restrict access to specific components based on user permissions. It takes a `guard` , `permissions`, `redirect` as input and returns a custom React component that acts as a wrapper around its children. The hook checks for specific `permit` and renders the wrapped children based on those permissions. `redirect` (optional): renders a React component if access is denied. This allows for seamless redirection to an appropriate UI element when a user lacks the required permissions.

```jsx
import useGuard from "use-guard-hook";

const permissions = ["read", "write", "delete"];
const guard = "Administrator"; // The Administrator guard name grants all permissions
const redirect = { YourLockComponent }; // redirect(Optional) components if access not granted(null  by default)

const WrappedComponent = useGuard(guard, permissions, redirect);
```

## Usage

The useGuard hook returns a wrapper component that can be used to control access to certain parts of your application. The wrapped component takes a `permit` prop, which should be a string or a number representing the required permission level to access the content.

```jsx
<WrappedComponent permit="write">
  {/* Content that requires "write" permission */}
</WrappedComponent>
```

## Permissions

The permissions prop passed to the useGuard hook should be an array of strings or numbers representing the allowed permissions. When checking for permission, the hook converts all elements of the perms array to strings and compares them with the provided permit prop.

## Example

Here's a simple example of using the useGuard hook:

```jsx
import React from "react";
import useGuard from "use-guard-hook";

const permissions = ["read", "write", "delete"]; // Example permissions array
const guard = "Administrator"; // Example guard value (The Administrator guard name grants all permissions)

const App = () => {
  const WrappedComponent = useGuard({ guard, permissions });

  return (
    <div>
      {/* Pass the permissions prop to WrappedComponent */}
      <WrappedComponent permit="write">
        <div>Content that requires "write" permission</div>
      </WrappedComponent>
      <WrappedComponent permit="read">
        <div>Content that requires "read" permission</div>
      </WrappedComponent>
    </div>
  );
};

export default App;
```

## PermissionsProvider

The PermissionsProvider component is used to wrap your app and provide permissions and a guard through the context. It takes the following props:
`guard`: A string representing the user's role (e.g., "Administrator").
`permissions`: An array of strings or numbers representing the allowed permissions.
`redirect` (optional): A React component to redirect unauthorized users.

```jsx
import { PermissionsProvider } from "use-guard-hook";
import App from "./App";

const AppWithPermissions = () => (
  <PermissionsProvider
    guard="User"
    permissions={[1, 2, 3]}
    redirect={YourLockComponent}
  >
    <App />
  </PermissionsProvider>
);
```

## useWrapper Hook

The `useWrapper hook` is used to create a wrapper component that guards access to its children based on permissions and the guard provided by the PermissionsProvider. It takes a permit prop and returns a wrapper component.

```jsx
import { useWrapper } from "use-guard-hook";

const GuardedComponent = () => {
  const WrappedComponent = useWrapper({ permit: 1 });
  return <WrappedComponent>This content is guarded.</WrappedComponent>;
};
```

# Note

This standalone `PermissionsProvider` is not intended to work directly with the useGuard hook.

<h1 style='margin-top:50px'>License</h1>
This project is licensed under the terms of the MIT license.
