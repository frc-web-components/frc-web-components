


<encoder>
    <div class="encoder-container">
        <form>
  
            <div class="form-group row">
                <label for="distance" class="col-sm-4 col-form-label text-right">Distance</label>
                <div class="col-sm-8">
                    <input 
                    type="number" 
                    readonly
                    class="form-control" 
                    id="distance" 
                    value={opts.table.Distance} />
                </div>
            </div>

            <div class="form-group row">
                <label for="speed" class="col-sm-4 col-form-label text-right">Speed</label>
                <div class="col-sm-8">
                    <input 
                    type="number" 
                    readonly
                    class="form-control" 
                    id="speed" 
                    value={opts.table.Speed} />
                </div>
            </div>

  </form>
    </div>

    <style>

        .encoder-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            height: 100%;
        }

        form, .row:last-child {
            margin-bottom: 0;
        }

    </style>

    <script>

    </script>
</encoder>