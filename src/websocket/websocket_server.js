const { createServer } = require('http');
const { Server } = require('socket.io');
const { ethers } = require("ethers");
const abi = require('./abi.json');
const csabi = require('./abiCs.json');
const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

const evcAddress = '0x965b9ca7dD9ec22FF615a156b731E97b7baF9DA1';
const CharginStationAddress = '0xe6c270575a0fC542376220843B1bb317f2Ddc93c';
let fee;
const evcContract = new ethers.Contract(evcAddress, abi, provider);
const CharginStationContract = new ethers.Contract(CharginStationAddress,csabi,provider);
evcContract.name().then((e)=>{
  console.log(e)
})

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

let chargingPercentage = 0;
let InitchargingPercentage = 0;
let interval;
let fromAdrress;
let toAdrress;
let evctokenContractWithSigner;
let CharginStationContractWithSigner;
let perclimit;
let slot;
let chargeRate;
let timestampInSeconds;

io.on("connection", async (socket) => {
  console.log(socket.id)
  socket.on('message', async function incoming(message) {
    console.log('Received message:', message);
    const { message: receivedMessage, data } = JSON.parse(message);
    if (receivedMessage === 'START_CHARGING') {
      console.log("in")
      const wallet = new ethers.Wallet(data["privcs"],provider);
      evctokenContractWithSigner = evcContract.connect(wallet);
      CharginStationContractWithSigner = CharginStationContract.connect(wallet);
      slot = data["slot"]
      chargeRate = data["chargeRate"]
      timestampInSeconds = Math.floor(Date.now() / 1000);
      const startChargingApp = await CharginStationContractWithSigner.startChargingApp(slot,timestampInSeconds);
      console.log(await startChargingApp.wait());
      timestampInSeconds = (timestampInSeconds - Math.floor(Date.now() / 1000));
      io.emit("initialized", "done");
      fee = data["costEst"]
      console.log(data["privcs"])
      fromAdrress = data["from"]
      toAdrress = data["to"]
      chargingPercentage = Number(data["curPerc"])
      InitchargingPercentage = chargingPercentage
      perclimit = Number(data["percLimit"])
      startChargingSimulation(io);
      // startChargingSimulation(socket);
    } else if (receivedMessage === 'STOP_CHARGING') {
      console.log("out")
      stopChargingSimulation(io);
      //   stopChargingSimulation();
      // Trigger blockchain transaction here
    }
  });

})

function startChargingSimulation(ws) {
  interval = setInterval(() => {
    chargingPercentage += 1;
    if (chargingPercentage <= perclimit) {
      console.log(chargingPercentage)
      // ws.send("percentage",chargingPercentage.toString());
      ws.emit("percentage", chargingPercentage.toString());
    } else {
      stopChargingSimulation(ws)
    }
  }, 1000);
}

async function stopChargingSimulation(ws){
  // chargingPercentage = 0;
  clearInterval(interval);
  ws.emit("stop", chargingPercentage.toString());
  cost = (Math.ceil(fee/(100-InitchargingPercentage)*(chargingPercentage- InitchargingPercentage)))
  timestampInSeconds = (Math.floor(Date.now() / 1000) - timestampInSeconds)
  const endCharging = await CharginStationContractWithSigner.endCharging(fromAdrress,ethers.BigNumber.from(slot),ethers.BigNumber.from(chargeRate),ethers.BigNumber.from(cost),timestampInSeconds);
  const end = await endCharging.wait()
  console.log(end);
  ws.emit("transaction", end["transactionHash"]);
  const transferFromTx = await evctokenContractWithSigner.transferFrom(fromAdrress, toAdrress, cost);
  console.log(await transferFromTx.wait());
}


httpServer.listen(5002, () => {
  console.log("server is listening")
})