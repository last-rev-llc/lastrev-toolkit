import * as React from 'react';
import parsePropTypes from 'parse-prop-types';
import { ValidationContext } from './ContextValidationProvider';
import { ContentValidationProps, fillRequiredProps, checkPropTypes } from './getContent';
import { uniqueId } from 'lodash';

export const withContentValidation = ({ logLevel }: { logLevel?: 'ERROR' | 'DEBUG' } = {}) => <
  P extends ContentValidationProps
>(
  WrappedComponent: React.FunctionComponent<P>
): React.FC<P & ContentValidationProps> => (props: P & ContentValidationProps) => {
  const [id] = React.useState(uniqueId());
  const { handleError = () => {} } = React.useContext(ValidationContext);
  const propTypes = React.useMemo(() => parsePropTypes(WrappedComponent), []);
  const errors = React.useMemo(() => checkPropTypes({ propTypes, props }), [props]);
  React.useEffect(() => {
    if (errors) {
      handleError({
        id,
        errors,
        componentName: WrappedComponent.name,
        logLevel
      });
    }
  }, [errors]);
  if (errors) {
    let cmp: React.ReactElement;
    try {
      cmp = WrappedComponent(
        fillRequiredProps<P & ContentValidationProps>({ props, propTypes })
      );
    } catch (error) {
      console.log(error);
    }

    return (
      <React.Fragment>
        <script data-csk-error="true" data-csk-error-id={id} />
        {cmp}
      </React.Fragment>
    );
  }
  return <WrappedComponent {...props} />;
};

export default withContentValidation;
