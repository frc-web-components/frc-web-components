


<gyro>

    <svg ref="svg"></svg>


    <script>

        this.line = null;
        this.text = null;
        this.angle = 0;

        var svgWidth = 300, svgHeight = 300;

        var center = svgWidth/2;
        var radius = svgWidth/3;

        var lines = [];

        var guide_line_text_distance = 45
        var guide_line_distance = 5;

        for(var i = 0; i < 360; i = i + guide_line_distance) {
        lines.push(i);
        }

        this.on('update', () => {

            let rect = this.root.getBoundingClientRect();
            svgWidth = rect.width;
            svgHeight = rect.height;

            this.angle = this.opts.table.Value || 0;

            this.line
                .attr("x1", center)
                .attr("x2", center + radius*Math.cos((this.angle - 90) * Math.PI/180))
                .attr("y1", center)
                .attr("y2", center + radius*Math.sin((this.angle - 90) * Math.PI/180))
                .attr("stroke", "red")
                .attr("stroke-width", 3);
            
            this.text
                .attr('x', center)
                .attr('y', center + 7)
                .attr('fill', 'red')
                .attr('font-size', 20)
                .attr('text-anchor', 'middle')
                .text(this.angle.toFixed(0));
        });

        this.on('resize', () => {
            
        });

        this.trigger('resize');



        this.on('mount', () => {

            svg = d3.select(this.refs.svg)
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .attr("class", "svg-container");
                
                
            var circle = svg.append("circle")
                .attr("cx", center)
                .attr("cy", center)
                .attr("r", radius)
                .attr("fill", "white")
                .attr("stroke", 'blue')
                .attr("stroke-width", 2);

            var guide_lines = svg.selectAll('line')
            .data(lines)
            .enter()
            .append('line')
            .attr("x1", function(d) {
            if(d % 90 == 0){
                return center;
            }
            return (center + (radius-10)*Math.cos((d - 90) * Math.PI/180));
            })
            .attr("x2", function(d){ 
            return (center + radius*Math.cos((d - 90) * Math.PI/180));
            })
            .attr("y1", function(d){
            if(d % 90 == 0){
                return center;
            } 
            return (center + (radius-10)*Math.sin((d - 90) * Math.PI/180));
            })
            .attr("y2", function(d){ 
            return (center + radius*Math.sin((d - 90) * Math.PI/180));
            })
            .attr("stroke", "black")
            .attr("stroke-width", function(d){
            if(d % 15 == 0){
                return 2;
            } 
            return 1;
            });

        var guideline_text = svg.selectAll('text')
            .data(lines)
            .enter()
            .append('text')
            .attr('x', function(d){ 
            return (center + (radius+20)*Math.cos((d - 90) * Math.PI/180));
            })
            .attr('y', function(d){ 
            return (center + (radius+17)*Math.sin((d - 90) * Math.PI/180));
            })
            .attr('fill', 'black')
            .attr('font-size', 15)
            .attr('text-anchor', 'middle')
            .text(function(d){
            if (d%guide_line_text_distance == 0){
            return d;
            }
            return '';
            });

            this.line = svg.append("line")
                .attr("x1", center)
                .attr("x2", center + radius*Math.cos((this.angle - 90) * Math.PI/180))
                .attr("y1", center)
                .attr("y2", center + radius*Math.sin((this.angle - 90) * Math.PI/180))
                .attr("stroke", "red")
                .attr("stroke-width", 3);

            var number_circle =  svg.append('circle')
                .attr('cx', center)
                .attr('cy', center)
                .attr('r', 25)
                .attr('fill', 'White')
                .attr('')

            this.text = svg.append('text')
                .attr('x', center)
                .attr('y', center + 7)
                .attr('fill', 'red')
                .attr('font-size', 20)
                .attr('text-anchor', 'middle')
                .text(this.angle.toFixed(0));
        });
        
    </script>
</gyro>