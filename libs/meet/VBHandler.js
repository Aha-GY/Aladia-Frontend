import { HMSEffectsPlugin } from '@100mslive/hms-virtual-background';

export class VBPlugin {
  constructor() {
    this.effectsPlugin = null;
  }

  initialisePlugin = (effectsSDKKey) => {
    if (this.getVBObject()) {
      return;
    }
    if (effectsSDKKey) {
      this.effectsPlugin = new HMSEffectsPlugin(effectsSDKKey);
    }
  };

  getBackground = () => this.effectsPlugin?.getBackground();

  getBlurAmount = () => this.effectsPlugin?.getBlurAmount();

  getVBObject = () => this.effectsPlugin;

  getName = () => this.effectsPlugin?.getName();

  setBlur = async (blurPower) => {
    this.effectsPlugin?.setBlur(blurPower);
  };

  setBackground = async (mediaURL) => {
    this.effectsPlugin?.setBackground(mediaURL);
  };

  setPreset = (preset) => {
    this.effectsPlugin.setPreset(preset);
  };

  getPreset = () => this.effectsPlugin?.getPreset() || '';

  removeEffects = async () => {
    this.effectsPlugin?.removeEffects();
  };

  reset = () => {
    this.effectsPlugin = undefined;
  };
}

export const VBHandler = new VBPlugin();
