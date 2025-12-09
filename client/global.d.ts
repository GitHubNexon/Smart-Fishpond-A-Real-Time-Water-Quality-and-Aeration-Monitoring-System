/// <reference types="react" />

// Fallback in case JSX namespace is missing
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}
