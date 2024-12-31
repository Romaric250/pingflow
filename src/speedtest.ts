import speedTest from "speedtest-net"

import chalk from "chalk"



export const runSpeedtest = async() => {
    console.log(chalk.green("Running netork speed test..."));
    try {
        const test = speedTest({acceptanceLicenc:true})
        const result = await test 
        const downloadspeed = (result.upload.bandwidth/125000).toFixed(2);
        const uploadspeed = await (result.upload.bandwidth/)
        
    } catch (error:any) {
        console.log(error.message)

        
    }
}

