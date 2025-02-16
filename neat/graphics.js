class Renderer {
    constructor(gene, xSensor=0.1, xOutput=0.9) {
        // store genes
        this.gene = gene;

        // count sensors and outputs
        let sensors = 0.0;
        let outputs = 0.0;

        for (let i in this.gene.nodes) {
            if (this.gene.nodes[i].type == SENSOR) {
                sensors++;
            }
            else if (this.gene.nodes[i].type == OUTPUT) {
                outputs++;
            }
        }

        // place nodes
        let sInd = 0.0;
        let oInd = 0.0;
        
        for (let i in gene.nodes) {
            if (this.gene.nodes[i].type == SENSOR) {
                // store location
                this.gene.nodes[i].x = xSensor;
                this.gene.nodes[i].y = (sInd + 0.5) / sensors;
                sInd++;
            }
            else if (this.gene.nodes[i].type == OUTPUT) {
                // store location
                this.gene.nodes[i].x = xOutput;
                this.gene.nodes[i].y = (oInd + 0.5) / outputs;
                oInd++;
            }
            else {
                this.gene.nodes[i].x = 0.5;
                this.gene.nodes[i].y = 0.5;
            }
        }
    }

    update(length=0.15) {
        // pull on each connections
        for (let i in this.gene.connections) {
            // unpack nodes
            let connect = this.gene.connections[i];
            let node1 = this.gene.nodes[connect.input];
            let node2 = this.gene.nodes[connect.output];

            // skip disabled
            if (connect.enabled) {
                // compute pull
                let force = (Math.atan(Math.abs(connect.weight)) / Math.PI + 0.5) * 0.1
                let xPull = (node2.x - node1.x - length) * force;
                let yPull = (node2.y - node1.y - length) * force;

                // pull node 1
                if (node1.type == HIDDEN) {
                    node1.x += xPull;
                    node1.y += yPull;
                }

                // pull node 2
                if (node2.type == HIDDEN) {
                    node2.x -= xPull;
                    node2.y -= yPull;
                }
            }
        }
    }

    draw(w, h, ctx) {
        // radius
        let radius = Math.min(w, h) * 0.02;

        // draw connections
        ctx.lineWidth = 2;
        for (let i in this.gene.connections) {
            // unpack nodes
            let connect = this.gene.connections[i];
            let node1 = this.gene.nodes[connect.input];
            let node2 = this.gene.nodes[connect.output];

            // coloring
            if (connect.enabled) {
                let shade = Math.round(255 * (Math.atan(connect.weight) / Math.PI * 2));
                let value = Math.round(shade / 2)

                // positive
                if (shade > 0) {
                    ctx.strokeStyle = "rgb(" +  shade + "," +  value + "," +  shade + ")";
                }
                else {
                    ctx.strokeStyle = "rgb(" + -value + "," + -shade + "," + -shade + ")";
                }
            }
            else {
                ctx.strokeStyle = "#333333";
            }

            // draw circle
            ctx.beginPath();
            ctx.moveTo(node1.x * w, node1.y * h);
            ctx.lineTo(node2.x * w, node2.y * h);
            ctx.stroke();
            ctx.closePath();
        }

        // draw nodes
        for (let i in this.gene.nodes) {
            // unpack node
            let node = this.gene.nodes[i];

            // coloring
            if (node.type == SENSOR) {
                ctx.fillStyle = "#4c9949";
            }
            else if (node.type == OUTPUT) {
                ctx.fillStyle = "#9e1b1b";
            }
            else {
                ctx.fillStyle = "#eeeeee";
            }

            // draw circle
            ctx.beginPath();
            ctx.arc(node.x * w, node.y * h, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}