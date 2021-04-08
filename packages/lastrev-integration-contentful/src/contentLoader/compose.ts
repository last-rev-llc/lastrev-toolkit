const compose = ({ composers = {}, loader }) => async ({
  entry,
  displayType,
  locale = 'en-US'
}: {
  entry: any;
  displayType?: string;
  locale?: string;
}) => {
  const contentTypeId = entry?._contentTypeId ?? entry?.contentTypeId ?? displayType;
  try {
    if (!entry) return entry;

    if (composers[contentTypeId]) {
      const composed = await composers[contentTypeId]({
        entry,
        locale,
        loader
      });
      return composed;
    }
    return entry;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return entry;
  }
};

export default compose;
