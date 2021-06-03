import * as React from 'react';
import parsePropTypes from 'parse-prop-types';
import { ValidationContext } from './ContextValidationProvider';
import { ContentValidationProps, fillRequiredProps, checkPropTypes } from './getContent';
import { uniqueId } from 'lodash';
import * as yup from 'yup';

interface Args {
  logLevel?: 'ERROR' | 'DEBUG';
  schema: yup.ObjectSchema;
}
const getErrors = ({ schema, props }) => {
  try {
    schema.validateSync(props, { abortEarly: false });
  } catch (error) {
    const errors = {};
    if (error.inner && error.inner.length) {
      error.inner.forEach((e: yup.ValidationError) => {
        const prop = e.path.split('.')[e.path.split('.').length - 1];
        errors[prop] = e;
      });
      return errors;
    }
  }
};
export const withContentValidation = ({ logLevel, schema }: Args) => <P extends ContentValidationProps>(
  WrappedComponent: React.FunctionComponent<P>
): React.FC<P & ContentValidationProps> => (props: P & ContentValidationProps) => {
  // TODO Only run in the client if it's development
  const [id] = React.useState(uniqueId());
  const { handleError = () => {} } = React.useContext(ValidationContext);
  const propTypes = React.useMemo(() => parsePropTypes(WrappedComponent), []);
  const errors = React.useMemo(() => getErrors({ props, schema }), []);
  React.useEffect(() => {
    if (errors) {
      handleError({
        contentId: props._id,
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
      console.log('ErrorRenderingPlaceholder', error);
    }

    return (
      <React.Fragment>
        <span data-csk-error="true" data-csk-error-id={id} />
        {cmp}
      </React.Fragment>
    );
  }

  return <WrappedComponent {...props} />;
};

export default withContentValidation;
