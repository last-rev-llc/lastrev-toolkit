import * as React from 'react';
import debounce from 'lodash/debounce';
interface ErrorInstance {
  contentId: string;
  errors: {
    [key: string]: string;
  };
  componentName: string;
  id: string;
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
  const errorsById = React.useMemo(() => errors.reduce((accum, error) => ({ accum, [error.id]: error }), {}), [
    errors.join('')
  ]);
  const handleErrors = React.useCallback(
    debounce((errorsById) => {
      const errorMarkers = document.querySelectorAll('[data-csk-error=true]');
      errorMarkers.forEach((marker: HTMLElement) => {
        const el = marker.nextElementSibling as HTMLElement;
        const id = marker.dataset.cskErrorId;
        const error = errorsById[id];
        if (error) {
          el.dataset.cskErrorId = id;
          el.dataset.cskError = JSON.stringify(error);
        }
      });
      switch (logLevel) {
        case 'DEBUG':
          console.log('ContentErrors', errors);
          break;
        default:
          throw new Error(JSON.stringify(errors));
      }
    }, 300),
    []
  );
  React.useEffect(() => {
    handleErrors(errorsById);
  }, [errorsById]);

  const handleError = ({ contentId, errors, componentName, id, logLevel: instanceLogLevel }: ErrorInstance) => {
    setErrors((state) => [...state, { contentId, errors, componentName, id, instanceLogLevel }]);
  };

  return <ValidationContext.Provider value={{ handleError }}>{children}</ValidationContext.Provider>;
};
