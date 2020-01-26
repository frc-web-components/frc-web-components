
<accelerometer>

  <div class="accelerometers">
    <div class="accelerometer">
      <div ref="bar" class="bar">
        <div class="foreground" style={getForegroundStyle()}></div>
        <p class="text" if={opts.properties.showText}>
          {value.toFixed(opts.properties.numDecimals)} g
        </p>
      </div>
      <axis ticks="3" vertical={false} if={opts.properties.showTickMarks} />
    </div>
  </div>

  <style>

    .accelerometers {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .bar {
      position: relative;
      width: calc(100% - 20px);
      height: 20px;
      border-radius: 3px;
      margin: 0 10px;
      background: #DDD;
    }

    .foreground {
      position: absolute;
      top: 0;
      height: 20px;
      background: lightblue;
      border-radius: 3px;
    }

    .text {
      font-size: 15px;
      line-height: 18px;
      position: relative;
    }

    axis {
      width: calc(100% - 20px);
      margin: 2px auto 0;
    }


  </style>


  <script>
    this.value = 0;

    this.getForegroundStyle = () => {
      const min = this.opts.properties.min;
      const max = this.opts.properties.max;
      const val = Math.clamp(this.value, min, max);

      if (max < 0) {
        return {
          width: Math.abs(val - max) / (max - min) * 100 + '%',
          left: 'auto',
          right: 0
        };
      }
      else if (min > 0) {
        return {
          width: Math.abs(val - min) / (max - min) * 100 + '%',
          left: 0,
          right: 'auto'
        };
      }
      else if (val > 0) {
        return {
          width: Math.abs(val) / (max - min) * 100 + '%',
          left: Math.abs(min) / (max - min) * 100 + '%',
          right: 'auto'
        };
      }
      else {
        return {
          width: Math.abs(val) / (max - min) * 100 + '%',
          left: 'auto',
          right: Math.abs(max) / (max - min) * 100 + '%'
        }
      }
    };

    this.on('update', () => {
      if ('Value' in this.opts.table) {
        this.value = this.opts.table.Value;
      }
    });
  </script>

    
</accelerometer>