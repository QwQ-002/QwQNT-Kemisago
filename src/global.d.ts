/// <reference types="vite/client" />

declare namespace RendererEvents {
  const onSettingsWindowCreated: (callback: () => void) => void;
}

interface IQwQNTPlugin {
  name: string;
  qwqnt: {
    name: string;
    icon?: string;
    inject?: {
      renderer?: string;
      preload?: string;
    };
    settings?: string;
  };
}

declare namespace PluginSettings {
  interface ICommon {
    readConfig: <T>(id: string, defaultConfig?: T) => Promise<T>;
    writeConfig: <T>(id: string, newConfig: T) => Promise<void>;
  }
  interface IRenderer extends ICommon {
    registerPluginSettings: (packageJson: IQwQNTPlugin) => Promise<HTMLDivElement>;
  }

  const main: ICommon;
  const renderer: IRenderer;
}
