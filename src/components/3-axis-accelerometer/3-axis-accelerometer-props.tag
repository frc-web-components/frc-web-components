


<three-axis-accelerometer-props>
  <form>

    <div class="form-group row">
      <label for="range" class="col-sm-4 col-form-label text-right">Range</label>
      <div class="col-sm-8">
        <select class="form-control" id="range">
          <option value="2">k2G</option>
          <option value="4">k4G</option>
          <option value="8">k8G</option>
          <option value="16">k16G</option>
        </select>
      </div>
    </div>

    <div class="form-group row">
      <label for="showText" class="col-sm-4 col-form-label text-right">Show text</label>
      <div class="col-sm-1">
        <div class="form-check">
          <input class="form-check-input position-static" 
                 type="checkbox" 
                 id="showText" 
                 checked={opts.properties.showText}
                 onchange={onShowTextChange}>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="numDecimals" class="col-sm-4 col-form-label text-right">Num decimals</label>
      <div class="col-sm-8">
        <input type="number" 
               class="form-control" 
               id="numDecimals" 
               value={opts.properties.numDecimals}
               onchange={onNumDecimalsChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="showTickMarks" class="col-sm-4 col-form-label text-right">Show tick marks</label>
      <div class="col-sm-1">
        <div class="form-check">
          <input 
            class="form-check-input position-static" 
            type="checkbox" 
            id="showTickMarks" 
            checked={opts.properties.showTickMarks}
            onchange={onShowTickMarksChange}>
        </div>
      </div>
    </div>

  </form>



  <style>
    .form-check {
      padding-top: 6px;
    }

  </style>


  <script>

    this.onShowTextChange = (ev) => {
      this.opts.properties.showText = ev.target.checked;
    };

    this.onNumDecimalsChange = (ev) => {
      const value = ev.target.value;

      if (value >= 0) {
        this.opts.properties.numDecimals = value;
      }
    };

    this.onShowTickMarksChange = (ev) => {
      this.opts.properties.showTickMarks = ev.target.checked;
    };

  </script>
  
    
</three-axis-accelerometer-props>