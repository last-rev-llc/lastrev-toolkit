export type AdapterConfig = {
  urlMap?: Record<
    string,
    {
      url: string;
      key: string;
    }
  >;
  linkContentType?: string;
  sameWindowActionText?: string;
  newWindowActionText?: string;
  modalActionText?: string;
  downloadActionText?: string;
  manualEntryTypeText?: string;
  contentRefTypeText?: string;
  assetRefTypeText?: string;
};

declare function transform(data: any): Record<string, unknown>;

export default function Adapter(adapterConfig: AdapterConfig): typeof transform;
