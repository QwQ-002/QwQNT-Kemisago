import { convert } from '@adpro/text-elementalizer-core';
import observeElement from '../utils/observeElement';
import { log } from '../utils/log';
import { config, type IConfig } from '../config/config';
import packageJson from '../../package.json';

const pluginId = 'Kemisago';

const barIconClick = async () => {
  const text = (document.querySelector('.ck.ck-content.ck-editor__editable p') as HTMLParagraphElement).textContent;

  if(text){
    const userConfig = await PluginSettings.renderer.readConfig<IConfig>(pluginId, config);

    const result = convert(text, userConfig.ignoreTones);
    navigator.clipboard.writeText(result).then(async () => {
      new Notification('Kemisago', {
        icon: qwqnt.framework.protocol.pathToStorageUrl(`${qwqnt.framework.plugins[packageJson.name].path}\\assets\\barIcon.svg`),
        body: '转换结果已复制到剪贴版',
        requireInteraction: false,
      });
    });
  }
};

const onMessageLoad = async () => {
  const iconSvg = await (await fetch(qwqnt.framework.protocol.pathToStorageUrl(`${qwqnt.framework.plugins[packageJson.name].path}\\assets\\barIcon.svg`))).text();
  const qTooltips = document.createElement('div');
  const qTooltipsContent = document.createElement('div');
  const icon = document.createElement('i');
  const barIcon = document.createElement('div');

  barIcon.classList.add('Kemisago-bar');
  barIcon.appendChild(qTooltips);

  qTooltips.classList.add('Kemisago-q-tooltips');
  qTooltips.addEventListener('click', barIconClick);
  qTooltips.appendChild(icon);
  qTooltips.appendChild(qTooltipsContent);

  qTooltipsContent.classList.add('Kemisago-q-tooltips__content');
  qTooltipsContent.innerText = 'Kemisago转换';

  icon.classList.add('Kemisago-q-icon');
  icon.innerHTML = iconSvg;

  document.querySelector('.chat-func-bar')!.firstElementChild!.append(barIcon);
  log('创建工具栏图标完成');
};

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = qwqnt.framework.protocol.pathToStorageUrl(`${qwqnt.framework.plugins[packageJson.name].path}\\style\\global.css`);
document.head.append(style);
log('加载样式文件完成');

observeElement('.chat-func-bar', async () => {
  if(document.getElementsByClassName('Kemisago-bar').length == 0) await onMessageLoad();
}, true);

RendererEvents.onSettingsWindowCreated(async () => {
  const view = PluginSettings.renderer.registerPluginSettings(packageJson);
  const page = await (await fetch(qwqnt.framework.protocol.pathToStorageUrl(`${qwqnt.framework.plugins[packageJson.name].path}\\pages\\settings.html`))).text();

  view.innerHTML = page;

  let userConfig = await PluginSettings.renderer.readConfig<IConfig>(pluginId, config);

  (view.querySelector('#pluginVersion') as HTMLParagraphElement).innerHTML = packageJson.version;
  if(userConfig.ignoreTones) (view.querySelector('#ignoreTones') as HTMLButtonElement).setAttribute('is-active', '');

  (view.querySelector('#ignoreTones') as HTMLButtonElement).addEventListener('click', async () => {
    let userConfig = await PluginSettings.renderer.readConfig<IConfig>(pluginId, config);
    if(userConfig.ignoreTones){
      userConfig.ignoreTones = false;
      (view.querySelector('#ignoreTones') as HTMLButtonElement).removeAttribute('is-active');
    }
    else{
      userConfig.ignoreTones = true;
      (view.querySelector('#ignoreTones') as HTMLButtonElement).setAttribute('is-active', '');
    }
    await PluginSettings.renderer.writeConfig(pluginId, userConfig);
  });

  (view.querySelector('#github') as HTMLButtonElement).addEventListener('click', () => {
    window.open('https://github.com/QwQ-002/QwQNT-Kemisago');
  });
});