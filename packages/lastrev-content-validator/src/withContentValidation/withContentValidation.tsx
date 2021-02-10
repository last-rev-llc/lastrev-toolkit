import * as React from 'react';
import checkPropTypes from 'check-prop-types';
import parsePropTypes from 'parse-prop-types';
import noop from 'lodash/noop';
import { ValidationContext } from './ContextValidationProvider';
import { ContentValidationProps, fillRequiredProps } from './getContent';

export const withContentValidation = ({ logLevel }) => <P extends ContentValidationProps>(
  WrappedComponent: React.FunctionComponent<P>
): React.FC<P & ContentValidationProps> => (props: P & ContentValidationProps) => {
  const { handleError = noop } = React.useContext(ValidationContext);
  const propTypes = React.useMemo(() => (WrappedComponent ? parsePropTypes(WrappedComponent) : null), [
    WrappedComponent.name
  ]);
  const result = React.useMemo(
    () => (WrappedComponent ? checkPropTypes(WrappedComponent.propTypes, props, 'prop', WrappedComponent.name) : null),
    [props]
  );
  React.useEffect(() => {
    if (result) {
      handleError({
        error: result,
        componentName: WrappedComponent.name,
        contentId: props._id,
        logLevel
      });
    }
  }, [result, WrappedComponent]);
  if (result) {
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
        <span data-csk-error="true" data-csk-error-id={props._id} />
        {cmp}
      </React.Fragment>
    );
  }
  return <WrappedComponent {...props} />;
};

export default withContentValidation;
