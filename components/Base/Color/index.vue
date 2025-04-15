<template>
  <div class="color-pickr relative">
    <div class="color-picker" />
  </div>
</template>

<script>
import '@simonwep/pickr/dist/themes/monolith.min.css';
import Pickr from '@simonwep/pickr';

export default {
  props: {
    color: String,
  },
  data() {
    return {
      pickr: null,
      swatches: [
        '#b74b46',
        '#e87b35',
        '#f3ce49',
        '#77db89',
        '#68d1bf',
        '#4e80ee',
        '#6567ea',
        '#da5597',
        '#e14f62',
        '#c951e7',
        '#845eee',
        '#4ba2e3',
        '#55b685',
        '#94ca42',
      ],
    };
  },
  computed: {
    defaultColor() {
      if (this.color) {
        return this.color.startsWith('#') ? this.color : `#${this.color}`;
      } else {
        return '#707070';
      }
    },
  },
  mounted() {
    this.pickr = Pickr.create({
      el: '.color-picker',
      theme: 'monolith',
      container: this.$el,
      useAsButton: true,
      showAlways: true,
      autoReposition: false,
      appClass: 'pickr-dark',
      default: this.defaultColor,
      swatches: this.swatches,
      defaultRepresentation: 'HEXA',
      components: {
        preview: false,
        opacity: true,
        hue: true,
        interaction: {
          hex: false,
          rgba: false,
          hsva: false,
          input: true,
          clear: false,
          save: true,
        },
      },
      i18n: {
        'btn:save': 'Add',
      },
    });

    this.pickr.show();
    this.pickr
      .on('save', (color) => {
        const Color = color.toHEXA().toString();
        if (!this.swatches.includes(Color)) {
          this.swatches.push(Color);
          this.pickr.addSwatch(Color);
        }
      })
      .on('change', (color) => {
        this.$emit('change', color.toHEXA().toString());
      })
      .on('changestop', () => {
        this.$emit('confirm');
      })
      .on('swatchselect', () => {
        this.$emit('confirm');
      });

    const swatches = this.$el.querySelector('.pcr-swatches');
    swatches.parentElement.appendChild(swatches);
  },
  beforeUnmount() {
    this.pickr.destroy();
  },
};
</script>

<style lang="scss" scope>
.color-pickr {
  .pcr-app {
    width: 100% !important;
    position: static !important;
    background-color: transparent !important;
  }
  .pcr-app[data-theme='monolith'] .pcr-selection .pcr-color-palette {
    height: 5.5em;
    border-radius: 4px;
    overflow: hidden;
  }
  .pcr-app .pcr-selection .pcr-picker {
    width: 10px;
    height: 10px;
  }
  .pcr-app .pcr-swatches > button {
    border-radius: 50%;
    margin: 3px;
    width: 24px;
    height: 24px;
  }
  .pcr-app .pcr-swatches {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .pcr-app .pcr-interaction .pcr-result {
    background-color: #1b1b1b;
    border-radius: 4px;
    height: 30px;
    padding: 0 10px;
    font-size: 13px;
  }
  .pcr-app .pcr-interaction .pcr-save {
    background-color: black;
    color: white;
    border: 1px solid #525252;
    border-radius: 4px;
    height: 30px;
    padding: 0 10px;
    font-size: 13px;

    &:hover {
      background-color: #3c3c3c;
    }
  }
}
</style>
