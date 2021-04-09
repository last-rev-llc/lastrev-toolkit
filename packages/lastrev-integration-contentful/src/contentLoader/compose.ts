const compose = ({ composers = {}, loader }) => async ({
  entry,
  locale = 'en-US',
  displayType
}: {
  entry: any;
  locale?: string;
  displayType?: string;
}) => {
  const contentTypeId = displayType ?? entry?._contentTypeId ?? entry?.contentTypeId;
  try {
    if (!entry) return entry;

    if (composers[contentTypeId]) {
      const composed = await composers[contentTypeId]({
        entry,
        locale,
        loader
      });

      return {
        ...composed,
        displayType
      };
    }
    return entry;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return entry;
  }
};

export default compose;
