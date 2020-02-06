
<three-axis-accelerometer>

  <div class="accelerometers">

    <div class="accelerometer-container">
      <p>X</p>
      <div class="accelerometer">
        <div ref="bar" class="bar">
          <div class="foreground" style={getXForegroundStyle()}></div>
          <p class="text" if={opts.properties.showText}>
            {x.toFixed(opts.properties.numDecimals)} g
          </p>
        </div>
        <axis ticks="3" vertical={false} if={opts.properties.showTickMarks} />
      </div>
    </div>

    <div class="accelerometer-container">
      <p>Y</p>
      <div class="accelerometer">
        <div ref="bar" class="bar">
          <div class="foreground" style={getYForegroundStyle()}></div>
          <p class="text" if={opts.properties.showText}>
            {y.toFixed(opts.properties.numDecimals)} g
          </p>
        </div>
        <axis ticks="3" vertical={false} if={opts.properties.showTickMarks} />
      </div>
    </div>

    <div class="accelerometer-container">
      <p>Z</p>
      <div class="accelerometer">
        <div ref="bar" class="bar">
          <div class="foreground" style={getZForegroundStyle()}></div>
          <p class="text" if={opts.properties.showText}>
            {z.toFixed(opts.properties.numDecimals)} g
          </p>
        </div>
        <axis ticks="3" vertical={false} if={opts.properties.showTickMarks} />
      </div>
    </div>

  </div>

  <style>

    .accelerometers {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding: 10px;
    }

    .accelerometer-container {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
    }

    .accelerometer-container > p {
      width: 30px;
      margin-bottom: 0;
    }

    .accelerometer {
      width: 100%;
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
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.getXForegroundStyle = () => {
      return this.getForegroundStyle(this.x);
    };

    this.getYForegroundStyle = () => {
      return this.getForegroundStyle(this.y);
    };

    this.getZForegroundStyle = () => {
      return this.getForegroundStyle(this.z);
    };

    this.getForegroundStyle = (value) => {
      const min = this.opts.properties.min;
      const max = this.opts.properties.max;
      const val = Math.clamp(value, min, max);

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
      if ('X' in this.opts.table) {
        this.x = this.opts.table.X;
      }

      if ('Y' in this.opts.table) {
        this.y = this.opts.table.Y;
      }

      if ('Z' in this.opts.table) {
        this.z = this.opts.table.Z;
      }
    });

    this.on('mount', () => {
      setTimeout(() => {
        this.trigger('resize');
      }, 1000);
    });
  </script>

    
</three-axis-accelerometer>