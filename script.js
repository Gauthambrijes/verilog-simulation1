function setupInputs() {
    const selectedQuestion = document.getElementById("questionSelect").value;
    const inputsDiv = document.getElementById("inputs");

    inputsDiv.innerHTML = ""; // Clear previous inputs

    switch (selectedQuestion) {
        case "q1":
            inputsDiv.innerHTML = `<label>Input Sequence:</label><input type="text" id="inputSeq" placeholder="e.g., 001101">`;
            break;
        case "q2":
            inputsDiv.innerHTML = `<label>Enter Timers (t1, t2):</label><input type="text" id="timers" placeholder="e.g., 5,3">`;
            break;
        case "q3":
            inputsDiv.innerHTML = `<label>Votes:</label><input type="text" id="votes" placeholder="e.g., 1,2,3,3,2">`;
            break;
        case "q4":
            inputsDiv.innerHTML = `<label>Start Time (HH:MM:SS):</label><input type="text" id="startTime" placeholder="e.g., 12:30:45">`;
            break;
        case "q5":
            inputsDiv.innerHTML = `<label>Calculator Inputs (a,b,op):</label><input type="text" id="calcInput" placeholder="e.g., 5,3,+">`;
            break;
        case "q6":
            inputsDiv.innerHTML = `<label>Binary Data:</label><input type="text" id="parityInput" placeholder="e.g., 110101">`;
            break;
        case "q7":
            inputsDiv.innerHTML = `<label>Binary Numbers (a,b):</label><input type="text" id="binaryInput" placeholder="e.g., 1011,1100">`;
            break;
        case "q8":
            inputsDiv.innerHTML = `<label>Comparator Inputs (a,b):</label><input type="text" id="compInput" placeholder="e.g., 8,5">`;
            break;
        default:
            inputsDiv.innerHTML = "Please select a valid question.";
    }
}

function runQuestion() {
    const selectedQuestion = document.getElementById("questionSelect").value;
    const outputBox = document.getElementById("output");
    const verilogBox = document.getElementById("verilogCode");

    switch (selectedQuestion) {
        case "q1":
            const inputSeq = document.getElementById("inputSeq").value;
            outputBox.value = fsmSequenceDetector(inputSeq);
            verilogBox.value = verilogFSMSequenceDetector();
            break;
        case "q2":
            const timers = document.getElementById("timers").value.split(",");
            outputBox.value = trafficLightController(parseInt(timers[0]), parseInt(timers[1]));
            verilogBox.value = verilogTrafficLightController();
            break;
        case "q3":
            const votes = document.getElementById("votes").value.split(",");
            outputBox.value = simulateVoting(votes);
            verilogBox.value = verilogVotingMachine();
            break;
        case "q4":
            const startTime = document.getElementById("startTime").value;
            outputBox.value = simulateClock(startTime);
            verilogBox.value = verilogDigitalClock();
            break;
        case "q5":
            const calcInput = document.getElementById("calcInput").value.split(",");
            outputBox.value = calculator(parseInt(calcInput[0]), parseInt(calcInput[1]), calcInput[2]);
            verilogBox.value = verilogCalculator();
            break;
        case "q6":
            const parityInput = document.getElementById("parityInput").value;
            outputBox.value = parityGenerator(parityInput);
            verilogBox.value = verilogParityGenerator();
            break;
        case "q7":
            const binaryInput = document.getElementById("binaryInput").value.split(",");
            outputBox.value = serialAdder(binaryInput[0], binaryInput[1]);
            verilogBox.value = verilogSerialAdder();
            break;
        case "q8":
            const compInput = document.getElementById("compInput").value.split(",");
            outputBox.value = comparator(parseInt(compInput[0]), parseInt(compInput[1]));
            verilogBox.value = verilogComparator();
            break;
        default:
            outputBox.value = "Please select a valid question and provide inputs.";
            verilogBox.value = "";
    }
}

// Solution Functions
function fsmSequenceDetector(seq) {
    let state = "S0", z = 0, output = "Output Sequence: ";
    for (let w of seq) {
        switch (state) {
            case "S0": state = w === "0" ? "S1" : "S2"; break;
            case "S1": state = w === "0" ? "S0" : "S3"; break;
            case "S2": state = w === "0" ? "S3" : "S0"; break;
            case "S3": state = w === "0" ? "S2" : "S1"; break;
        }
        z = (state === "S0" || state === "S3") ? 1 : 0;
        output += z;
    }
    return output;
}

function trafficLightController(t1, t2) {
    return `Traffic Light Sequence:\nRoad 1: Green (${t1}s) -> Yellow (3s) -> Red (${t2}s)\nRoad 2: Red (${t1}s) -> Green (${t2}s) -> Yellow (3s)`;
}

function simulateVoting(votes) {
    const counts = {};
    votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
    return Object.entries(counts).map(([c, n]) => `Candidate ${c}: ${n} votes`).join("\n");
}

function simulateClock(startTime) {
    const [h, m, s] = startTime.split(":").map(Number);
    if (h >= 24 || m >= 60 || s >= 60) return "Invalid time format";
    let time = new Date(1970, 0, 1, h, m, s), result = "Clock Simulation:\n";
    for (let i = 0; i < 10; i++) {
        time.setSeconds(time.getSeconds() + 1);
        result += time.toTimeString().split(" ")[0] + "\n";
    }
    return result;
}

function calculator(a, b, op) {
    return { "+": a + b, "-": a - b, "*": a * b }[op] || "Invalid operation";
}

function parityGenerator(data) {
    const ones = [...data].filter(b => b === "1").length;
    return `Parity: ${ones % 2 === 0 ? "Even (0)" : "Odd (1)"}`;
}

function serialAdder(a, b) {
    let carry = 0, result = "";
    for (let i = a.length - 1; i >= 0; i--) {
        const sum = +a[i] + +b[i] + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }
    return carry ? carry + result : result;
}

function comparator(a, b) {
    return a === b ? "Equal" : a > b ? "A > B" : "A < B";
}

// Verilog Code Functions
function verilogFSMSequenceDetector() {
    return `
module FSM_Detector(input clk, reset, w, output reg z);
reg [1:0] state;
    parameter S0 = 2'b00, S1 = 2'b01, S2 = 2'b10, S3 = 2'b11;

    always @(posedge clk or posedge reset) begin
        if (reset) 
            state <= S0;
        else 
            case (state)
                S0: state <= (w == 0) ? S1 : S2;
                S1: state <= (w == 0) ? S0 : S3;
                S2: state <= (w == 0) ? S3 : S0;
                S3: state <= (w == 0) ? S2 : S1;
            endcase
    end

    always @(state) begin
        z = (state == S0 || state == S3) ? 1 : 0;
    end
endmodule
    `;
}

function verilogTrafficLightController() {
    return `
module TrafficLightController(input clk, reset, output reg G1, Y1, R1, G2, Y2, R2);
input clk, reset,
    output reg [2:0] Road1, Road2
);
    reg [1:0] state;
    parameter G1 = 2'b00, Y1 = 2'b01, G2 = 2'b10, Y2 = 2'b11;

    always @(posedge clk or posedge reset) begin
        if (reset)
            state <= G1;
        else
            case (state)
                G1: state <= Y1;
                Y1: state <= G2;
                G2: state <= Y2;
                Y2: state <= G1;
            endcase
    end

    always @(state) begin
        case (state)
            G1: {Road1, Road2} = {3'b100, 3'b001}; // Road1: Green, Road2: Red
            Y1: {Road1, Road2} = {3'b010, 3'b001}; // Road1: Yellow, Road2: Red
            G2: {Road1, Road2} = {3'b001, 3'b100}; // Road1: Red, Road2: Green
            Y2: {Road1, Road2} = {3'b001, 3'b010}; // Road1: Red, Road2: Yellow
        endcase
    end
endmodule
    `;
}

function verilogVotingMachine() {
    return `
module VotingMachine(input clk, reset, [3:0] candidate, output [3:0] result);
input clk, reset, vote, [3:0] candidate, passcode,
    output reg [7:0] count[0:9],
    output reg authorized
);
    reg [7:0] voters_remaining;
    reg [3:0] entered_passcode;

    always @(posedge clk or posedge reset) begin
        if (reset) begin
            voters_remaining <= 100; // Example initial voters count
            authorized <= 0;
        end
        else if (entered_passcode == passcode)
            authorized <= 1;
        else if (authorized && vote && voters_remaining > 0) begin
            count[candidate] <= count[candidate] + 1;
            voters_remaining <= voters_remaining - 1;
        end
    end
endmodule
    `;
}

function verilogDigitalClock() {
    return `
module DigitalClock(input clk, reset, output [7:0] HH, MM, SS);
input clk, reset,
    output reg [4:0] hour, [5:0] minute, [5:0] second
);
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            hour <= 0;
            minute <= 0;
            second <= 0;
        end else begin
            if (second == 59) begin
                second <= 0;
                if (minute == 59) begin
                    minute <= 0;
                    if (hour == 23)
                        hour <= 0;
                    else
                        hour <= hour + 1;
                end else
                    minute <= minute + 1;
            end else
                second <= second + 1;
        end
    end
endmodule
    `;
}

function verilogCalculator() {
    return `
module Calculator(input [7:0] a, b, input op, output reg [15:0] result);
input [7:0] a, b,
    input [1:0] op, // 00: Add, 01: Subtract, 10: Multiply
    output reg [15:0] result
);
    always @(*) begin
        case (op)
            2'b00: result = a + b;
            2'b01: result = a - b;
            2'b10: result = a * b;
            default: result = 0;
        endcase
    end
endmodule
    `;
}

function verilogParityGenerator() {
    return `
module ParityGenerator(input [7:0] data, output parity);
    always @(*) begin
        parity = ^data; // XOR for odd parity
    end
endmodule

module ParityChecker(input [7:0] data, input parity, output reg error);
    always @(*) begin
        error = (parity != ^data); // Mismatch in parity
    end
endmodule
    `;
}

function verilogSerialAdder() {
    return `
module SerialAdder(input clk, reset, [7:0] a, b, output [8:0] sum);
    input clk, reset,
    input a, b,
    output reg sum, carry_out
);
    reg carry;
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            sum <= 0;
            carry <= 0;
        end else begin
            {carry, sum} <= a + b + carry;
        end
    end
    assign carry_out = carry;
endmodule
    `;
}

function verilogComparator() {
    return `
module Comparator(input [3:0] a, b, output greater, equal, less);
    input [3:0] a, b,
    output reg greater, equal, less
);
    always @(*) begin
        if (a > b) {greater, equal, less} = 3'b100;
        else if (a == b) {greater, equal, less} = 3'b010;
        else {greater, equal, less} = 3'b001;
    end
endmodule
    `;
}
