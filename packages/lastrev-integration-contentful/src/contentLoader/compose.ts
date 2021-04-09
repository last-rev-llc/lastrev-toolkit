const compose = ({ composers = {}, loader }) => async ({
  entry,
  locale = 'en-US'
}: {
  entry: any;
  locale?: string;
}) => {
  const contentTypeId = entry?.displayType ?? entry?._contentTypeId ?? entry?.contentTypeId;
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
