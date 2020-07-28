import { ContentfulClientApi, Entry } from 'contentful';
import { GetGlobalSettingsConfig } from '../types';
declare const getGlobalSettings: (client: ContentfulClientApi) => <T>({ locale, include, contentTypeId }: GetGlobalSettingsConfig) => Promise<Entry<T>>;
export default getGlobalSettings;
//# sourceMappingURL=getGlobalSettings.d.ts.map