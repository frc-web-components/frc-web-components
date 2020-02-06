<script>
    /** 
    * Copyright (c) 2017-2018 FIRST
    * All rights reserved.
    *
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *     * Redistributions of source code must retain the above copyright
    *       notice, this list of conditions and the following disclaimer.
    *     * Redistributions in binary form must reproduce the above copyright
    *       notice, this list of conditions and the following disclaimer in the
    *       documentation and/or other materials provided with the distribution.
    *     * Neither the name of FIRST nor the
    *       names of its contributors may be used to endorse or promote products
    *       derived from this software without specific prior written permission.
    *
    * THIS SOFTWARE IS PROVIDED BY FIRST AND CONTRIBUTORS "AS IS" AND ANY
    * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    * WARRANTIES OF MERCHANTABILITY NONINFRINGEMENT AND FITNESS FOR A PARTICULAR 
    * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL FIRST OR CONTRIBUTORS BE LIABLE FOR 
    * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
</script>

<mecanum-drivebase>
    <div class="diff-drive-container">

        <div class="speed-pair">
            <div class="speed">
                <axis ticks="5" vertical={true} range={[-1, 1]} />
                <div ref="bar" class="bar">
                    <div class="foreground" style={getFlForegroundStyle()}></div>
                </div>
            </div>
            <div class="speed">
                <axis ticks="5" vertical={true} range={[-1, 1]} />
                <div ref="bar" class="bar">
                    <div class="foreground" style={getRlForegroundStyle()}></div>
                </div>
            </div>
        </div>
        <svg ref="svg" width="250" height="250">
            <g ref="forceVector"></g>
            <g ref="drivetrain" class="drivetrain"></g>
        </svg>

        <div class="speed-pair">
            <div class="speed">
                <axis ticks="5" vertical={true} range={[-1, 1]} />
                <div ref="bar" class="bar">
                    <div class="foreground" style={getFrForegroundStyle()}></div>
                </div>
            </div>
            <div class="speed">
                <axis ticks="5" vertical={true} range={[-1, 1]} />
                <div ref="bar" class="bar">
                    <div class="foreground" style={getRrForegroundStyle()}></div>
                </div>
            </div>
        </div>
    </div>

    <style>

        .diff-drive-container {
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        svg .x {
            stroke: rgb(50,50,255);
            stroke-width: 2;
        }

        svg .arrow line, svg .arrow path {
            stroke: rgb(50,50,255);
            stroke-width: 2;
            fill: none;
            /*transform: rotate(-90deg);*/
        }

        svg .arrow polygon {
            stroke: rgb(50,50,255);
            fill: rgb(50,50,255);
        }

        svg .drivetrain {
            fill: none;
            stroke: black;
        }

        .bar {
            position: relative;
            height: calc(100% - 25px);
            width: 20px;
            border-radius: 3px;
            margin: 15px 0;
            background: #DDD;
        }

        .speed {
            display: flex;
            height: 45%;
            flex-direction: row;
            align-items: center;
            margin-left: 30px;
        }

        axis {
            width: 10px;
            height: calc(100% - 30px);
        }

        .foreground {
            position: absolute;
            top: 0;
            width: 20px;
            background: lightblue;
            border-radius: 3px;
        }
       
    </style>
    <script>

        this.fl = 0;
        this.fr = 0;
        this.rl = 0;
        this.rr = 0;

        this.drawMotionVector = (fl, fr, rl, rr) => {

            const vectorRadius = 60;
            const direction = {
                x: (fl - fr - rl + rr) / 4,
                y: (fl + fr + rl + rr) / 4
            };
            const moment = (-fl + fr - rl + rr) / 4;
            const directionMagnitude = Math.hypot(direction.x, direction.y);
            const directionAngle = Math.atan2(direction.y, direction.x);

            // Barely moving, draw an X
            if (Math.abs(moment) <= 0.01 && directionMagnitude <= 0.01) {
                return generateX(25);
            }

            let rightMomentArrow = '';
            let leftMomentArrow = '';
            let directionArrow = '';

            if (Math.abs(moment) > 0.01) {
                // Only draw the moment vectors if the moment is significant enough
                rightMomentArrow = window.dashboard.CurvedArrow.createPolar(0, vectorRadius, -moment * Math.PI, 0, 8);
                leftMomentArrow = window.dashboard.CurvedArrow.createPolar(Math.PI, vectorRadius, -moment * Math.PI, 0, 8);
            }
            if (directionMagnitude > 0.01) {
                // Only draw the direction vector if it'd be long enough
                directionArrow = window.dashboard.CurvedArrow.createStraight(directionMagnitude * vectorRadius, -directionAngle, 0, 8);
            }

           
            return `<g class="arrow" transform="translate(125, 125)">${rightMomentArrow} ${leftMomentArrow} ${directionArrow}</g>`;
            
        }

        function generateX(width) {
            const halfW = width / 2;
            const lineA = `<line 
                                x1="${-halfW}"
                                y1="${-halfW}"
                                x2="${halfW}"
                                y2="${halfW}"/>`

            const lineB = `<line 
                                x1="${-halfW}"
                                y1="${halfW}"
                                x2="${halfW}"
                                y2="${-halfW}"/>`

            return `<g class="x" transform="translate(125, 125)">${lineA} ${lineB}</g>`;
        }

        this.drawDrivetrain = (width, height, wheelRadius) => {

            const left = (250 - width) / 2;
            const top = (250 - height) / 2;
            const right = left + width;
            const bottom = top + height;
            
            const base = `<rect 
                            width="${width}" 
                            height="${height}" 
                            x="${left}" 
                            y="${top}" />`;

            const tlWheel = `<rect 
                                width="${30}" 
                                height="${wheelRadius * 2}" 
                                x="${left - 30}" 
                                y="${top}" />`;

            const trWheel = `<rect 
                                width="${30}" 
                                height="${wheelRadius * 2}" 
                                x="${right}" 
                                y="${top}" />`;

            const blWheel = `<rect 
                                width="${30}" 
                                height="${wheelRadius * 2}" 
                                x="${left - 30}" 
                                y="${bottom - wheelRadius * 2}" />`;

            const brWheel = `<rect 
                                width="${30}" 
                                height="${wheelRadius * 2}" 
                                x="${right}" 
                                y="${bottom - wheelRadius * 2}" />`;

            return base + tlWheel + trWheel + blWheel + brWheel;
        };


        this.getFlForegroundStyle = () => {
            return this.getForegroundStyle(this.fl);
        };

        this.getFrForegroundStyle = () => {
            return this.getForegroundStyle(this.fr);
        };

        this.getRlForegroundStyle = () => {
            return this.getForegroundStyle(this.rl);
        };

        this.getRrForegroundStyle = () => {
            return this.getForegroundStyle(this.rr);
        };

        this.getForegroundStyle = (value) => {
            const min = -1;
            const max = 1;
            const val = Math.clamp(value, min, max);

            if (max < 0) {
                return {
                    height: Math.abs(val - max) / (max - min) * 100 + '%',
                    top: 'auto',
                    bottom: 0
                };
            }
            else if (min > 0) {
                return {
                    height: Math.abs(val - min) / (max - min) * 100 + '%',
                    top: 0,
                    bottom: 'auto'
                };
            }
            else if (val > 0) {
                return {
                    height: Math.abs(val) / (max - min) * 100 + '%',
                    top: Math.abs(min) / (max - min) * 100 + '%',
                    bottom: 'auto'
                };
            }
            else {
                return {
                    height: Math.abs(val) / (max - min) * 100 + '%',
                    top: 'auto',
                    bottom: Math.abs(max) / (max - min) * 100 + '%'
                }
            }
        };

        this.on('mount', () => {
            let drawing = this.drawMotionVector(0, 0, 0, 0);
            $(this.refs.drivetrain).html(this.drawDrivetrain(150, 200, 35));
            $(this.refs.forceVector).html(drawing);
        });

        this.on('update', () => {
            this.fl = this.opts.table['Front Left Motor Speed'] || 0;
            this.fr = this.opts.table['Front Right Motor Speed'] || 0;
            this.rl = this.opts.table['Rear Left Motor Speed'] || 0;
            this.rr = this.opts.table['Rear Right Motor Speed'] || 0;
            let drawing = this.drawMotionVector(this.fl, this.fr, this.rl, this.rr);
            $(this.refs.forceVector).html(drawing);
        });

        

    </script>
</mecanum-drivebase>