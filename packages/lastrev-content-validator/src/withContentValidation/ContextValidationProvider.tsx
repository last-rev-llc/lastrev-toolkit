import * as React from 'react';

interface ErrorInstance {
  error: string;
  componentName: string;
  contentId: string;
  logLevel?: 'ERROR' | 'DEBUG';
}

interface ValidationContextInterface {
  state: Record<string, string>;
  logLevel: 'DEBUG';
  handleError: (error: ErrorInstance) => void;
}

export const ValidationContext = React.createContext<Partial<ValidationContextInterface>>({
  state: {}
});

export const ContentValidationProvider = ({ children, logLevel = 'DEBUG' }) => {
  const [errors, setErrors] = React.useState<ErrorInstance[]>([]);
  React.useEffect(() => {
    const errorMarkers = document.querySelectorAll('[data-csk-error=true]');

    errorMarkers.forEach((marker: HTMLElement) => {
      const el = marker.nextElementSibling as HTMLElement;
      const contentId = marker.dataset.cskErrorId;
      const error = errors.find((x) => x.contentId == contentId);
      el.dataset.cskEntryId = contentId;
      el.dataset.cskDisplayName = error.componentName;
      el.dataset.cskError = JSON.stringify(error);
    });
    switch (logLevel) {
      case 'DEBUG':
        console.log('ContentErrors', errors);
        break;
      default:
        throw new Error(JSON.stringify(errors));
    }
  }, [errors]);

  const handleError = ({ error, componentName, contentId, logLevel: instanceLogLevel }: ErrorInstance) => {
    setErrors((state) => [...state, { error, componentName, contentId, instanceLogLevel }]);
  };

  return <ValidationContext.Provider value={{ handleError }}>{children}</ValidationContext.Provider>;
};
