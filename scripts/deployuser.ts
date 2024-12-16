import { ethers } from "hardhat";
import fs from 'fs'

async function main() {
    const Contract = await ethers.getContractFactory("UserContract");
    const contract = await Contract.deploy();
    const address = await contract.getAddress();


    const data : any = {
        USER_ADDRESS: address
    }
    const Data = JSON.stringify(data, null, 2);
    fs.writeFileSync('./exfrontend/User.json', Data)
    console.log("Contract deployed to address:", address);

} 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
