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
