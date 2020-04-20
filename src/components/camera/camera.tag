


<camera>
    <img src={url} /> 

    <style>
        img {
            width: 100%;
        }

    </style>
    <script>

        this.url = '';

        this.on('update', () => {
            
            let streams = this.opts.table.streams;
            let loaded = false;

            if (streams && streams.length > 0) {
                streams.forEach((stream) => {
                    let img = new Image();
                    // remove mjpg:
                    img.src = stream.replace('mjpg:', ''); 
                    img.onload = () => {
                        img.onload = () => {}
                        if (!loaded) {
                            this.url = img.src;
                        }
                        loaded = true;
                    }
                });
            }
            else {
                this.url = '';
            }      
        });        
    </script>
</camera>