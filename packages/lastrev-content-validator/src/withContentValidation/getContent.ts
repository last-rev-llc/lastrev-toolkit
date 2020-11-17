export interface ContentValidationProps {
  _id: string;
}
export const getContent = (type: string) => {
  switch (type) {
    case 'string':
      return 'MISSING TEXT';
    case 'boolean':
      return 'MISSING TEXT';
    default:
      return 'MISSING VALUE';
  }
};
interface ParsedPropTypes {
  required: boolean;
  type: {
    name: string;
  };
}
export const fillRequiredProps = <P extends ContentValidationProps>({
  props,
  propTypes
}: {
  props: P;
  propTypes: ParsedPropTypes;
}) => {
  console.log('Component', { props, propTypes });
  const newProps = { ...props };
  Object.keys(propTypes).forEach((key) => {
    if (!propTypes[key]) return;
    const {
      required,
      type: { name }
    } = propTypes[key];
    if (required) {
      newProps[key] = newProps[key] ?? getContent(name);
    }
  });
  console.log('Component', { props, propTypes, newProps });
  return newProps;
};

export const checkPropTypes = <P extends ContentValidationProps>({
  props,
  propTypes
}: {
  props: P;
  propTypes: ParsedPropTypes;
}) => {
  console.log('Errors', { props, propTypes });
  const errors = {};
  Object.keys(propTypes).forEach((key) => {
    if (!propTypes[key]) return;
    const {
      required,
      type: { name }
    } = propTypes[key];
    if (required && props[key] == null) {
      errors[key] = `The prop ${key} is marked as required but its missing`;
    }
  });
  console.log('Errors', { props, propTypes, errors });
  if (Object.keys(errors).length) return errors;
};
