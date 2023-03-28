const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()
const prompt = require("prompt-sync")()

async function main() {
    //Provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    //Wallet
    const key = fs.readFileSync("./encryptedKey.json", "utf-8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        key,
        process.env.PASSWORD
    )
    wallet = await wallet.connect(provider)

    //Contract Factory
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const bin = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet)

    //Contract Deploy
    const contract = await contractFactory.deploy()
    let transactionReceipt = await contract.deployTransaction.wait(1)

    console.log("Contract Successfully Deployed!.....")

    //Transaction Receipts
    //const transactionResponse = console.log(contract)

    //Test Run
    const prompt1 = parseInt(prompt("Which Number Do You Want to Store: "))
    const store = await contract.store(prompt1)
    let wait = await store.wait()
    const retrieve = await contract.retrieve()
    console.log(`Updated Favourite Number: ${retrieve}`)

    // let currentFavoriteNumber = await contract.retrieve()
    // console.log(`Current Favorite Number: ${currentFavoriteNumber}`)
    // console.log("Updating favorite number...")
    // let transactionResponse = await contract.store(7)
    // transactionReceipt = await transactionResponse.wait()
    // currentFavoriteNumber = await contract.retrieve()
    // console.log(`New Favorite Number: ${currentFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
