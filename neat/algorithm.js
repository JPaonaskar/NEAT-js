const SENSOR = "sensor";
const OUTPUT = "output";
const HIDDEN = "hidden";

var innovation = 0;

class NEAT {
    constructor() {
        
    }
}

class Network {
    constructor() {
        // initialize gene
        this.gene = {
            "nodes"       : [],
            "connections" : []
        };

        // track network state
        this.activations = [];

        // track network inputs and outputs
        this.sensors = [];
        this.outputs = [];
    }

    addNode(connection=-1, type=HIDDEN) {
        // get number
        let i = this.gene.nodes.length;

        // create node
        let node = {
            "name" : "Node " + i,
            "type" : type
        };

        // track inputs and outputs
        if (type == SENSOR) {
            this.sensors.push(i);
        }
        else if (type == OUTPUT) {
            this.outputs.push(i);
        }

        // add node and activation
        this.gene.nodes.push(node);
        this.activations.push(0.0);

        // split connection
        if ((connection >= 0) && (type == HIDDEN)) {
            // pull connection
            let connect = this.gene.connections[connection];

            // deactivate connection
            connect.enabled = false;

            // get inputs and outputs
            let input  = connect.input;
            let output = connect.output;
            let weight = connect.weight;

            // add connections
            this.addConnection(input, i, weight);
            this.addConnection(i, output, weight);
        }
    }

    addConnection(input, output, weight, enabled=true, number=-1) {
        // create connection
        let connect = {
            "input"   : input,
            "output"  : output,
            "weight"  : weight,
            "enabled" : enabled
        };

        // innovation numbering
        if (number < 0) {
            // pull and increment
            connect.innov = innovation;
            innovation++;
        } else {
            connect.innov = number;
        }

        // add node
        this.gene.connections.push(connect);
    }

    activate(sensors) {
        // copy
        let activations = new Array(this.activations.length).fill(0);

        // assign inputs
        for (let i in this.sensors) {
            let idx = this.sensors[i];
            this.activations[idx] = sensors[i];
        }

        // activate neurons
        for (let i in this.gene.connections) {
            // unpack connection
            let connect = this.gene.connections[i];
            
            // feed
            activations[connect.output] += connect.weight * this.activations[connect.input];
        }

        // store activations
        this.activations = activations;
        
        // read outputs
        let output = [];
        for (let i in this.outputs) {
            let idx = this.outputs[i];
            output.push(this.activations[idx]);
        }

        // output
        return output
    }

    perturbConnection(connection, dw) {
        // change weight of connection
        this.gene.connections[connection].weight += dw;
    }

    crossover() {

    }
}