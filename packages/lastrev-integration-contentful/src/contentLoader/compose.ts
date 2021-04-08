const compose = (composers = {}) => async ({
  entry,
  displayType,
  locale = 'en-US'
}: {
  entry: any;
  displayType?: string;
  locale?: string;
}) => {
  const contentTypeId = entry?._contentTypeId || displayType;
  try {
    if (!entry) throw Error(`Compose:${contentTypeId}: Need to provide entry`);

    if (composers[contentTypeId]) {
      const composed = await composers[contentTypeId]({
        entry,
        locale
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
